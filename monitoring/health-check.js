const axios = require('axios');

class HealthChecker {
  constructor(baseURL) {
    this.baseURL = baseURL;
    this.axios = axios.create({
      baseURL,
      timeout: 10000,
    });
  }

  async checkHealth() {
    try {
      const response = await this.axios.get('/api/health');
      return {
        status: 'healthy',
        response: response.data,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async checkDatabase() {
    try {
      const response = await this.axios.get('/api/posts?limit=1');
      return {
        status: 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'disconnected',
        error: error.message,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async runFullCheck() {
    const healthCheck = await this.checkHealth();
    const dbCheck = await this.checkDatabase();

    return {
      service: 'MERN Backend API',
      url: this.baseURL,
      checks: {
        health: healthCheck,
        database: dbCheck,
      },
      overall: healthCheck.status === 'healthy' && dbCheck.status === 'connected' ? 'healthy' : 'unhealthy',
    };
  }
}

// Usage example
if (require.main === module) {
  const checker = new HealthChecker(process.env.API_URL || 'http://localhost:5000');
  
  checker.runFullCheck().then(result => {
    console.log(JSON.stringify(result, null, 2));
    process.exit(result.overall === 'healthy' ? 0 : 1);
  }).catch(error => {
    console.error('Health check failed:', error);
    process.exit(1);
  });
}

module.exports = HealthChecker; 
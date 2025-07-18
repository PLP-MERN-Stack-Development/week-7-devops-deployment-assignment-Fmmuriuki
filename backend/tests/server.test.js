const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Post = require('../models/Post');

describe('Server Tests', () => {
  let testUser;
  let testPost;
  let authToken;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_URI_TEST || 'mongodb://localhost:27017/mern-app-test');
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear test data
    await User.deleteMany({});
    await Post.deleteMany({});

    // Create test user
    testUser = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123'
    });
    await testUser.save();

    // Create test post
    testPost = new Post({
      title: 'Test Post',
      content: 'This is a test post content',
      author: testUser._id,
      tags: ['test', 'example']
    });
    await testPost.save();
  });

  describe('Health Check', () => {
    test('GET /api/health should return server status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body).toHaveProperty('status', 'OK');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('environment');
    });
  });

  describe('Authentication', () => {
    test('POST /api/auth/register should create new user', async () => {
      const userData = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);
    });

    test('POST /api/auth/login should authenticate user', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('user');
      expect(response.body.user.email).toBe(loginData.email);
    });

    test('POST /api/auth/login should reject invalid credentials', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      await request(app)
        .post('/api/auth/login')
        .send(loginData)
        .expect(401);
    });
  });

  describe('Posts', () => {
    beforeEach(async () => {
      // Login to get auth token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });
      authToken = loginResponse.body.token;
    });

    test('GET /api/posts should return all posts', async () => {
      const response = await request(app)
        .get('/api/posts')
        .expect(200);

      expect(response.body).toHaveProperty('posts');
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('currentPage');
      expect(response.body).toHaveProperty('total');
      expect(response.body.posts).toHaveLength(1);
    });

    test('GET /api/posts/:id should return single post', async () => {
      const response = await request(app)
        .get(`/api/posts/${testPost._id}`)
        .expect(200);

      expect(response.body).toHaveProperty('post');
      expect(response.body.post.title).toBe('Test Post');
    });

    test('POST /api/posts should create new post', async () => {
      const postData = {
        title: 'New Post',
        content: 'This is a new post',
        tags: ['new', 'post']
      };

      const response = await request(app)
        .post('/api/posts')
        .set('Authorization', `Bearer ${authToken}`)
        .send(postData)
        .expect(201);

      expect(response.body).toHaveProperty('post');
      expect(response.body.post.title).toBe(postData.title);
    });

    test('PUT /api/posts/:id should update post', async () => {
      const updateData = {
        title: 'Updated Post',
        content: 'This is an updated post'
      };

      const response = await request(app)
        .put(`/api/posts/${testPost._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.post.title).toBe(updateData.title);
    });

    test('DELETE /api/posts/:id should delete post', async () => {
      await request(app)
        .delete(`/api/posts/${testPost._id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      // Verify post is deleted
      const response = await request(app)
        .get(`/api/posts/${testPost._id}`)
        .expect(404);
    });
  });

  describe('Users', () => {
    let adminUser;
    let adminToken;

    beforeEach(async () => {
      // Create admin user
      adminUser = new User({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin'
      });
      await adminUser.save();

      // Login as admin
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'password123'
        });
      adminToken = loginResponse.body.token;
    });

    test('GET /api/users should return all users (admin only)', async () => {
      const response = await request(app)
        .get('/api/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('users');
      expect(response.body).toHaveProperty('totalPages');
      expect(response.body).toHaveProperty('currentPage');
      expect(response.body).toHaveProperty('total');
    });

    test('GET /api/users/:id should return user profile', async () => {
      const response = await request(app)
        .get(`/api/users/${testUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('user');
      expect(response.body.user.name).toBe('Test User');
    });
  });

  describe('Error Handling', () => {
    test('Should return 404 for non-existent routes', async () => {
      await request(app)
        .get('/api/nonexistent')
        .expect(404);
    });

    test('Should return 401 for protected routes without token', async () => {
      await request(app)
        .get('/api/users')
        .expect(401);
    });
  });
}); 
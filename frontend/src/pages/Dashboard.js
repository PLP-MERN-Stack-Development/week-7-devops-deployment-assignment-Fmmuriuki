import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Welcome to your Dashboard
        </h1>
        <p className="text-xl text-gray-600">
          Hello, {user?.name}! Manage your posts and profile here.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Total Posts:</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span>Total Views:</span>
              <span className="font-semibold">0</span>
            </div>
            <div className="flex justify-between">
              <span>Total Likes:</span>
              <span className="font-semibold">0</span>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
          <p className="text-gray-500">No recent activity</p>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full btn btn-primary">
              Create New Post
            </button>
            <button className="w-full btn btn-secondary">
              Edit Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
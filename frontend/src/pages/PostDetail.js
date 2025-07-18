import React from 'react';
import { useParams } from 'react-router-dom';

const PostDetail = () => {
  const { id } = useParams();

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Post Details
        </h1>
        <p className="text-xl text-gray-600">
          Post ID: {id}
        </p>
      </div>

      <div className="card">
        <p className="text-gray-500">Post detail functionality will be implemented here.</p>
      </div>
    </div>
  );
};

export default PostDetail; 
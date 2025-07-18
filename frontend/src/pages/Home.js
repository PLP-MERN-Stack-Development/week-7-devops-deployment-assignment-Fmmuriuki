import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import { postsAPI } from '../services/api';
import { Search, Calendar, User, Tag, Eye, Heart, MessageCircle } from 'lucide-react';

const Home = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: postsData, isLoading, error } = useQuery(
    ['posts', currentPage, searchTerm, selectedTag],
    () => postsAPI.getAll({
      page: currentPage,
      limit: 10,
      search: searchTerm,
      tag: selectedTag
    }),
    {
      keepPreviousData: true,
    }
  );

  const { data: tagsData } = useQuery(
    ['popularTags'],
    () => postsAPI.getPopularTags(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  );

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(selectedTag === tag ? '' : tag);
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 text-lg mb-4">Error loading posts</div>
        <button
          onClick={() => window.location.reload()}
          className="btn btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  const { posts, totalPages, currentPage: page, total } = postsData || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to MERN Blog
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover amazing stories, share your thoughts, and connect with writers from around the world.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        {/* Popular Tags */}
        {tagsData?.tags && tagsData.tags.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Popular Tags</h3>
            <div className="flex flex-wrap gap-2">
              {tagsData.tags.map((tag) => (
                <button
                  key={tag._id}
                  onClick={() => handleTagClick(tag._id)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTag === tag._id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {tag._id} ({tag.count})
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Posts Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts?.map((post) => (
          <article key={post._id} className="card hover:shadow-md transition-shadow">
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
            )}
            
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                <Link to={`/posts/${post._id}`} className="hover:text-blue-600">
                  {post.title}
                </Link>
              </h2>
              
              <p className="text-gray-600 line-clamp-3">
                {post.content.substring(0, 150)}...
              </p>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1" />
                    {post.author?.name}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {post.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {post.viewCount || 0}
                  </div>
                  <div className="flex items-center">
                    <Heart className="h-4 w-4 mr-1" />
                    {post.likeCount || 0}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    {post.commentCount || 0}
                  </div>
                </div>
                
                <Link
                  to={`/posts/${post._id}`}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                >
                  Read More →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setCurrentPage(page - 1)}
            disabled={page <= 1}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          
          <span className="text-gray-600">
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => setCurrentPage(page + 1)}
            disabled={page >= totalPages}
            className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {posts?.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No posts found</div>
          <p className="text-gray-400">Try adjusting your search terms or browse all posts.</p>
        </div>
      )}
    </div>
  );
};

export default Home; 
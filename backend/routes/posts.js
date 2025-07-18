const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const { auth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/posts
// @desc    Get all posts with pagination and search
// @access  Public
router.get('/', optionalAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', tag = '', author = '' } = req.query;
    
    const query = { isPublished: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (tag) {
      query.tags = { $in: [tag] };
    }
    
    if (author) {
      query.author = author;
    }

    const posts = await Post.find(query)
      .populate('author', 'name avatar')
      .populate('likes', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get single post by ID
// @access  Public
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name avatar')
      .populate('likes', 'name')
      .populate('comments.user', 'name avatar');

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Increment view count if user is authenticated
    if (req.user) {
      post.viewCount += 1;
      await post.save();
    }

    res.json({ post });
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', [
  auth,
  body('title').trim().isLength({ min: 1, max: 100 }).withMessage('Title is required and must be less than 100 characters'),
  body('content').trim().isLength({ min: 1, max: 5000 }).withMessage('Content is required and must be less than 5000 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('image').optional().isURL().withMessage('Image must be a valid URL')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, tags, image } = req.body;

    const post = new Post({
      title,
      content,
      author: req.user._id,
      tags: tags || [],
      image: image || ''
    });

    await post.save();
    await post.populate('author', 'name avatar');

    res.status(201).json({
      message: 'Post created successfully',
      post
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', [
  auth,
  body('title').optional().trim().isLength({ min: 1, max: 100 }).withMessage('Title must be less than 100 characters'),
  body('content').optional().trim().isLength({ min: 1, max: 5000 }).withMessage('Content must be less than 5000 characters'),
  body('tags').optional().isArray().withMessage('Tags must be an array'),
  body('image').optional().isURL().withMessage('Image must be a valid URL'),
  body('isPublished').optional().isBoolean().withMessage('isPublished must be a boolean')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this post' });
    }

    const { title, content, tags, image, isPublished } = req.body;
    const updateFields = {};

    if (title) updateFields.title = title;
    if (content) updateFields.content = content;
    if (tags) updateFields.tags = tags;
    if (image !== undefined) updateFields.image = image;
    if (isPublished !== undefined) updateFields.isPublished = isPublished;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    ).populate('author', 'name avatar');

    res.json({
      message: 'Post updated successfully',
      post: updatedPost
    });
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    // Check if user is the author or admin
    if (post.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this post' });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/posts/:id/like
// @desc    Like/unlike a post
// @access  Private
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const likeIndex = post.likes.indexOf(req.user._id);
    
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user._id);
    }

    await post.save();
    await post.populate('likes', 'name');

    res.json({
      message: likeIndex > -1 ? 'Post unliked' : 'Post liked',
      post
    });
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/posts/:id/comments
// @desc    Add a comment to a post
// @access  Private
router.post('/:id/comments', [
  auth,
  body('content').trim().isLength({ min: 1, max: 500 }).withMessage('Comment must be between 1 and 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    const { content } = req.body;

    post.comments.push({
      user: req.user._id,
      content
    });

    await post.save();
    await post.populate('comments.user', 'name avatar');

    res.json({
      message: 'Comment added successfully',
      post
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/posts/tags/popular
// @desc    Get popular tags
// @access  Public
router.get('/tags/popular', async (req, res) => {
  try {
    const tags = await Post.aggregate([
      { $match: { isPublished: true } },
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({ tags });
  } catch (error) {
    console.error('Get popular tags error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 
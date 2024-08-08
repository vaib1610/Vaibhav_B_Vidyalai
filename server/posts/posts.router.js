const express = require('express');
const { fetchPosts } = require('./posts.service');
const { fetchUserById } = require('../users/users.service');
const axios = require('axios');

const router = express.Router();

router.get('/', async (req, res) => {
  const { start, limit } = req.query;
  
  try {
    const posts = await fetchPosts({ start,limit });
    

    const postsWithImages = await Promise.all(posts.map(async (post) => {
      try {
        const response = await axios.get(`https://jsonplaceholder.typicode.com/albums/${post.id}/photos`);
        const images = response.data.map(photo => ({
          url: photo.url
        }));
        return {
          ...post,
          images
        };
      } catch (error) {
        console.error(`Error fetching images for post ${post.id}:`, error);
        return {
          ...post,
          images: []
        };
      }
    }));

    res.json(postsWithImages);
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

module.exports = router;

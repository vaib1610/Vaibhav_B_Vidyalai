import axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import Post from './Post';
import Container from '../common/Container';
// import useWindowWidth from '../hooks/useWindowWidth';
import {useWindowWidth} from '../../context/WindowWidthContext';

const PostListContainer = styled.div(() => ({
  display: 'flex',
  flexWrap: 'wrap',
  justifyContent: 'center',
}));

const LoadMoreButton = styled.button(() => ({
  padding: '10px 20px',
  backgroundColor: '#007bff',
  color: '#fff',
  border: 'none',
  borderRadius: 5,
  cursor: 'pointer',
  fontSize: 16,
  marginTop: 20,
  transition: 'background-color 0.3s ease',
  fontWeight: 600,

  '&:hover': {
    backgroundColor: '#0056b3',
  },
  '&:disabled': {
    backgroundColor: '#808080',
    cursor: 'default',
  },
}));

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [start, setStart] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);

  const { isSmallerDevice } = useWindowWidth();
  const limit = isSmallerDevice ? 5 : 10;

  const fetchPosts = async (startPosition) => {
    setIsLoading(true);
    try {
      const { data: newPosts } = await axios.get('/api/v1/posts', {
        params: { start: startPosition, limit },
      });

      if (newPosts.length < limit) {
        setHasMorePosts(false); 
      }
      

      setPosts(prevPosts => [...prevPosts, ...newPosts]);
      setStart(startPosition + limit);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(start);
  }, [isSmallerDevice]);

  const handleClick = () => {
    fetchPosts(start);
  };

  return (
    <Container>
      <PostListContainer>
        {posts.map(post => (
          <Post key={post.id} post={post} />
        ))}
      </PostListContainer>

      {hasMorePosts && (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <LoadMoreButton onClick={handleClick} disabled={isLoading}>
            {!isLoading ? 'Load More' : 'Loading...'}
          </LoadMoreButton>
        </div>
      )}
    </Container>
  );
}







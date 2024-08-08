import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import PropTypes from 'prop-types';
import { useUserData } from '../hooks/useUserData';

const PostContainer = styled.div(() => ({
  width: '300px',
  margin: '10px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  overflow: 'hidden',
}));

const CarouselContainer = styled.div(() => ({
  position: 'relative',
}));

const Carousel = styled.div(() => ({
  display: 'flex',
  overflowX: 'scroll',
  scrollbarWidth: 'none',
  msOverflowStyle: 'none',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  position: 'relative',
  scrollSnapType: 'x mandatory',
}));

const CarouselItem = styled.div(() => ({
  flex: '0 0 auto',
  scrollSnapAlign: 'start',
}));

const Image = styled.img(() => ({
  width: '280px',
  height: 'auto',
  maxHeight: '300px',
  padding: '10px',
}));

const Content = styled.div(() => ({
  padding: '10px',
  '& > h2': {
    marginBottom: '16px',
  },
}));

const Button = styled.button(() => ({
  position: 'absolute',
  bottom: 0,
  top: '50%',
  transform: 'translateY(-50%)',
  backgroundColor: 'rgba(255, 255, 255, 0.5)',
  border: 'none',
  color: '#000',
  fontSize: '20px',
  cursor: 'pointer',
  height: '50px',
}));

const PrevButton = styled(Button)`
  left: 10px;
`;

const NextButton = styled(Button)`
  right: 10px;
`;

const UserCircle = styled.div(({ initials }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40px',
  height: '40px',
  borderRadius: '50%',
  backgroundColor: '#808080',
  color: '#fff',
  fontWeight: 'bold',
  margin: '10px',
  fontSize: '18px',
}));

const Post = ({ post }) => {
  const { users } = useUserData();
  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const user = users.find(user => user.id === post.userId) || {};

  const handleNextClick = () => {
    if (carouselRef.current && currentIndex < post.images.length - 1) {
      setCurrentIndex(currentIndex + 1);
      const itemWidth = carouselRef.current.children[0].offsetWidth;
      carouselRef.current.scrollBy({
        left: itemWidth,
        behavior: 'smooth',
      });
    }
  };

  const handlePrevClick = () => {
    if (carouselRef.current && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      const itemWidth = carouselRef.current.children[0].offsetWidth;
      carouselRef.current.scrollBy({
        left: -1 * itemWidth,
        behavior: 'smooth',
      });
    }
  };

  const getInitials = (name) => {
    const names = name.split(' ');
    return names.map(n => n.charAt(0)).join('');
  };

  return (
    <PostContainer>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {user.name && (
          <UserCircle initials={getInitials(user.name)}>
            {getInitials(user.name)}
          </UserCircle>
        )}
        <div>
          <strong>{user.name}</strong>
          <p style={{ fontSize: '12px', fontWeight:'500',color:'#808080' }}>{user.email}</p>
        </div>
      </div>
      <CarouselContainer>
        <Carousel ref={carouselRef}>
          {post.images.map((image, index) => (
            <CarouselItem key={index}>
              <Image src={image.url} alt={post.title} />
            </CarouselItem>
          ))}
        </Carousel>
        {currentIndex > 0 && <PrevButton onClick={handlePrevClick}>&#10094;</PrevButton>}
        {currentIndex < post.images.length - 1 && <NextButton onClick={handleNextClick}>&#10095;</NextButton>}
      </CarouselContainer>
      <Content>
        <h2>{post.title}</h2>
        <p>{post.body}</p>
      </Content>
    </PostContainer>
  );
};

Post.propTypes = {
  post: PropTypes.shape({
    userId: PropTypes.number.isRequired,
    images: PropTypes.arrayOf(
      PropTypes.shape({
        url: PropTypes.string.isRequired,
      })
    ).isRequired,
    title: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired,
  }).isRequired,
};

export default Post;


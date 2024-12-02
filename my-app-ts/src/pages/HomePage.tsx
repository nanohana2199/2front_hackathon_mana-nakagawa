// src/pages/HomePage.tsx
import React from 'react';
import PostList from '../components/PostList';
import NewPostForm from '../components/NewPostForm';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to the SNS!</h1>
      <NewPostForm />
      <PostList />
    </div>
  );
};

export default HomePage;


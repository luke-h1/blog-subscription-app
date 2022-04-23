import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import PostPage from './pages/PostPage';
import PostPlanPage from './pages/PostPlanPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/posts" element={<ProtectedRoute />}>
          <Route path="/posts" element={<PostPage />} />
        </Route>

        <Route path="/posts/plans" element={<ProtectedRoute />}>
          <Route path="/posts/plans" element={<PostPlanPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

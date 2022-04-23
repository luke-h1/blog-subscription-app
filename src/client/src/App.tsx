import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Nav from './components/Nav';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import PostPage from './pages/PostPage';
import PostPlanPage from './pages/PostPlanPage';
import Register from './pages/Register';

const App = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
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

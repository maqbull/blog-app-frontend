import { FC } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import './App.css';

import Login from './components/Login';
import Dashboard from './components/Dashboard';
import CreatePost from './components/CreatePost';
import PostDetails from './components/PostDetails';
import PrivateRoute from './components/PrivateRoute';

const App: FC = () => {
  const { user, signOut } = useAuth();

  return (
    <Router>
      <div className="App">
        <nav className="nav-header">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/create-post">Create Post</Link>
                </li>
                <li>
                  <button onClick={signOut}>Sign Out</button>
                </li>
              </>
            ) : (
              <li>
                <Link to="/login">Login</Link>
              </li>
            )}
          </ul>
        </nav>

        <Routes>
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" replace /> : <Login />
          } />
          
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          } />
          
          <Route path="/create-post" element={
            <PrivateRoute>
              <CreatePost />
            </PrivateRoute>
          } />
          
          <Route path="/post/:id" element={<PostDetails />} />
          
          <Route path="/" element={
            <div className="home">
              <h1>Welcome to Blog App</h1>
              {/* Add your home page content here */}
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App; 
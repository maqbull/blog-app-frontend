import { FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { postsService } from '../services/postsService';
import './Dashboard.css';

interface Post {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    email: string;
  };
}

const Dashboard: FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userPosts = await postsService.getUserPosts();
      setPosts(userPosts);
    } catch (err) {
      setError('Failed to fetch posts. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = () => {
    navigate('/create-post');
  };

  const handleEditPost = (postId: string) => {
    navigate(`/edit-post/${postId}`);
  };

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsService.deletePost(postId);
        setPosts(posts.filter(post => post.id !== postId));
      } catch (err) {
        setError('Failed to delete post. Please try again.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div className="dashboard-loading">Loading posts...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>My Posts</h1>
        <button 
          className="create-post-button"
          onClick={handleCreatePost}
        >
          Create New Post
        </button>
      </div>

      {error && (
        <div className="dashboard-error">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="no-posts">
          <p>You haven't created any posts yet.</p>
          <button 
            className="create-first-post-button"
            onClick={handleCreatePost}
          >
            Create Your First Post
          </button>
        </div>
      ) : (
        <div className="posts-grid">
          {posts.map(post => (
            <div key={post.id} className="post-card">
              <h2 className="post-title">{post.title}</h2>
              <p className="post-excerpt">
                {post.content.substring(0, 150)}
                {post.content.length > 150 ? '...' : ''}
              </p>
              <div className="post-meta">
                <span className="post-date">
                  {formatDate(post.createdAt)}
                </span>
              </div>
              <div className="post-actions">
                <button 
                  onClick={() => handleEditPost(post.id)}
                  className="edit-button"
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDeletePost(post.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard; 
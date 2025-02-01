import { FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postsService } from '../services/postsService';
import './PostDetails.css';

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

const PostDetails: FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        setError(null);
        const fetchedPost = await postsService.getPost(id);
        setPost(fetchedPost);
      } catch (err) {
        setError('Failed to load post. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleEdit = () => {
    navigate(`/edit-post/${id}`);
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      await postsService.deletePost(id);
      navigate('/dashboard', { 
        state: { message: 'Post deleted successfully!' }
      });
    } catch (err) {
      setError('Failed to delete post. Please try again.');
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <div className="post-details-container">
        <div className="loading-spinner">Loading post...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-details-container">
        <div className="error-message">{error}</div>
        <button onClick={handleBack} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-details-container">
        <div className="error-message">Post not found</div>
        <button onClick={handleBack} className="back-button">
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="post-details-container">
      <button onClick={handleBack} className="back-button">
        ← Back
      </button>

      <article className="post-content">
        <header className="post-header">
          <h1>{post.title}</h1>
          <div className="post-meta">
            <span className="author">By {post.author.name || post.author.email}</span>
            <span className="date">Published on {formatDate(post.createdAt)}</span>
            {post.updatedAt !== post.createdAt && (
              <span className="updated">
                Updated on {formatDate(post.updatedAt)}
              </span>
            )}
          </div>
        </header>

        <div className="post-body">
          {post.content.split('\n').map((paragraph, index) => (
            paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />
          ))}
        </div>

        <footer className="post-actions">
          <button onClick={handleEdit} className="edit-button">
            Edit Post
          </button>
          <button onClick={handleDelete} className="delete-button">
            Delete Post
          </button>
        </footer>
      </article>
    </div>
  );
};

export default PostDetails; 
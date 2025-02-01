import { apiClient } from './apiClient';

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

export const postsService = {
  async getUserPosts(): Promise<Post[]> {
    return apiClient.get<Post[]>('/posts/user');
  },

  async getPost(postId: string): Promise<Post> {
    return apiClient.get<Post>(`/posts/${postId}`);
  },

  async createPost(data: { title: string; content: string }): Promise<Post> {
    return apiClient.post<Post>('/posts', data);
  },

  async updatePost(postId: string, data: { title: string; content: string }): Promise<Post> {
    return apiClient.put<Post>(`/posts/${postId}`, data);
  },

  async deletePost(postId: string): Promise<void> {
    return apiClient.delete(`/posts/${postId}`);
  }
}; 
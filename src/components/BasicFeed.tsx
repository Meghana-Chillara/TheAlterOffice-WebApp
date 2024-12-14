import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Heart, 
  MoreHorizontal 
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video';
}

interface Comment {
  id: string;
  user: string;
  avatar: string;
  content: string;
  timestamp: Date;
}

interface Post {
  id: string;
  username: string;
  profilePicture: string;
  content: string;
  media: MediaFile[];
  timestamp: Date;
  likes: number;
  comments: Comment[];
}

interface FeedProps {
  initialPosts?: Post[];
}

const Feed: React.FC<FeedProps> = ({ initialPosts = [] }) => {
  const [posts, setPosts] = useState<Post[]>(() => {
    // Retrieve posts from localStorage on initial load
    const savedPosts = localStorage.getItem('socialMediaPosts');
    if (savedPosts) {
      // Parse saved posts and convert timestamp strings back to Date objects
      const parsedPosts = JSON.parse(savedPosts).map((post: Post) => ({
        ...post,
        timestamp: new Date(post.timestamp),
        comments: post.comments.map(comment => ({
          ...comment,
          timestamp: new Date(comment.timestamp)
        }))
      }));
      return parsedPosts.length > 0 ? parsedPosts : initialPosts;
    }
    return initialPosts;
  });

  const [commentInputs, setCommentInputs] = useState<{[postId: string]: string}>({});

  // Update localStorage whenever posts change
  useEffect(() => {
    localStorage.setItem('socialMediaPosts', JSON.stringify(posts));
  }, [posts]);

  const handleLike = (postId: string) => {
    const updatedPosts = posts.map(post => 
      post.id === postId 
        ? { ...post, likes: post.likes + 1 } 
        : post
    );
    
    setPosts(updatedPosts);
  };

  const handleCommentSubmit = (postId: string) => {
    const commentContent = commentInputs[postId];
    if (!commentContent?.trim()) return;

    const newComment: Comment = {
      id: uuidv4(),
      user: 'Current User',
      avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      content: commentContent,
      timestamp: new Date()
    };

    const updatedPosts = posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            comments: [newComment, ...post.comments] 
          } 
        : post
    );

    setPosts(updatedPosts);
    
    // Clear the comment input for this post
    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const updateCommentInput = (postId: string, content: string) => {
    setCommentInputs(prev => ({ ...prev, [postId]: content }));
  };

  // Optional: Add method to clear all posts
  const clearAllPosts = () => {
    setPosts([]);
    localStorage.removeItem('socialMediaPosts');
  };

  return (
    <div className="p-4 space-y-4">
      {/* Optional: Clear Posts Button (for demonstration) */}
      {posts.length > 0 && (
        <div className="text-right mb-4">
          <button 
            onClick={clearAllPosts}
            className="text-red-500 hover:text-red-700 text-sm"
          >
            Clear All Posts
          </button>
        </div>
      )}

      {posts.map((post) => (
        <div
          key={post.id}
          className="bg-white rounded-lg shadow-md p-4 hover:shadow-xl transition-shadow duration-300"
        >
          {/* Post Header */}
          <div className="flex items-center mb-3">
            <img
              src={post.profilePicture}
              alt={`${post.username}'s profile`}
              className="w-10 h-10 rounded-full mr-3 object-cover"
            />
            <div>
              <h3 className="font-semibold text-gray-800">{post.username}</h3>
              <p className="text-xs text-gray-500">
                {post.timestamp.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Post Content */}
          {post.content && <p className="text-gray-700 mb-3">{post.content}</p>}

          {/* Post Media */}
          {post.media.map((file) => (
            <div key={file.id} className="mb-3">
              {file.type === 'image' ? (
                <img 
                  src={file.url} 
                  alt="Post" 
                  className="w-full h-64 object-cover rounded-md" 
                />
              ) : (
                <video 
                  src={file.url} 
                  controls 
                  className="w-full rounded-md" 
                />
              )}
            </div>
          ))}

          {/* Post Interactions */}
          <div className="flex justify-between text-gray-600 mb-3">
            <button 
              onClick={() => handleLike(post.id)}
              className="flex items-center hover:text-red-500"
            >
              <Heart className="mr-2" /> {post.likes}
            </button>
            <span className="text-gray-500">
              {post.comments.length} comments
            </span>
          </div>

          {/* Comment Input */}
          <div className="flex items-center space-x-2 mb-4">
            <img 
              src="https://randomuser.me/api/portraits/women/68.jpg"
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-grow relative">
              <input 
                type="text"
                value={commentInputs[post.id] || ''}
                onChange={(e) => updateCommentInput(post.id, e.target.value)}
                placeholder="Write a comment..."
                className="w-full bg-neutral-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={() => handleCommentSubmit(post.id)}
                className="absolute right-1 top-1/2 -translate-y-1/2 text-blue-600 hover:text-blue-700"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Comments List */}
          {post.comments.map((comment) => (
            <div key={comment.id} className="flex space-x-2 mb-3">
              <img 
                src={comment.avatar}
                alt={comment.user}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="bg-neutral-100 rounded-xl px-3 py-2 flex-grow">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-semibold text-sm">{comment.user}</h4>
                  <button className="text-neutral-500 hover:text-neutral-700">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-800">{comment.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {comment.timestamp.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Feed;
import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AuthComponent from './components/Authentication';
import Feed from './components/BasicFeed';
import Profile from './components/BasicProfile';
import CreatePost from './components/BasicCreatePost';
import Navigation from './components/BasicNavigation';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<any[]>([]);
    const auth = getAuth();

  const handleAddPost = (newPost: any) => {
    setPosts([newPost, ...posts]); // Add new post to the top
  };
  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      {user ? (
        <Router>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navigation />
            <div className="flex-grow container mx-auto px-4 pb-20">
              <Routes>
                <Route path="/feed" element={<Feed initialPosts={posts} />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/create-post" element={<CreatePost onAddPost={handleAddPost} />} />
                <Route path="*" element={<Navigate to="/feed" replace />} />
              </Routes>
            </div>
          </div>
        </Router>
      ) : (
        <AuthComponent />
      )}
    </>
  );
};

export default App;
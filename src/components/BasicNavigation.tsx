import React from 'react';
import { Link } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';
import { Home, PlusSquare, User, LogOut } from 'lucide-react';

const Navigation: React.FC = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSignOut = () => {
    signOut(auth);
  };

  return (
    <nav className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/feed" 
              className="text-3xl font-bold text-white hover:text-gray-200 transition duration-300"
            >
              VibeCircle
            </Link>
          </div>
          <div className="flex items-center space-x-6">
            <div className="group relative">
              <Link to="/feed">
                <Home 
                  className="text-white hover:text-gray-200 transition duration-300 cursor-pointer" 
                  size={24}
                />
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-2 
                  bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Feed
                </span>
              </Link>
            </div>

            <div className="group relative">
              <Link to="/create-post">
                <PlusSquare 
                  className="text-white hover:text-gray-200 transition duration-300 cursor-pointer" 
                  size={24}
                />
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-2 
                  bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300 white-space: nowrap">
                  Post
                </span>
              </Link>
            </div>

            <div className="group relative">
              <Link to="/profile">
                {user?.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-white hover:scale-110 transition duration-300"
                  />
                ) : (
                  <>
                    <User 
                      className="text-white hover:text-gray-200 transition duration-300 cursor-pointer" 
                      size={24}
                    />
                    <span className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-2 
                      bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      Profile
                    </span>
                  </>
                )}
              </Link>
            </div>

            <div className="group relative">
              <button 
                onClick={handleSignOut}
                className="text-white hover:text-red-200 transition duration-300"
              >
                <LogOut 
                  className="text-white hover:text-red-200 transition duration-300" 
                  size={24}
                />
                <span className="absolute top-full left-1/2 transform -translate-x-1/2 translate-y-2 
                  bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded 
                  opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Logout
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

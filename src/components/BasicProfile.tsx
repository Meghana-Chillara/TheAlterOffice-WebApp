import React, { useState, useEffect } from 'react';
import { getAuth, updateProfile } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import { Camera, Edit, MapPin, Briefcase, Link, Calendar } from 'lucide-react';
import { initializeApp } from 'firebase/app';

// Firebase Configuration (Replace with your own)
const firebaseConfig = {
  apiKey: "AIzaSyAUWuYJ2-vqNXwFh1l8amiV5JuqjCT1SCE",
  authDomain: "web-application-b9e99.firebaseapp.com",
  projectId: "web-application-b9e99",
  storageBucket: "web-application-b9e99.firebasestorage.app",
  messagingSenderId: "830504262562",
  appId: "1:830504262562:web:1deaef38ba5ad3c5beb0fb",
  measurementId: "G-G965VVXK8D"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const Profile: React.FC = () => {
  const auth = getAuth();
  const firestore = getFirestore();
  
  const [user, setUser] = useState(auth.currentUser);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [location, setLocation] = useState('');
  const [occupation, setOccupation] = useState('');
  const [website, setWebsite] = useState('');
  const [joinDate, setJoinDate] = useState('');
  const [bio, setBio] = useState('');
  const [, setUserPosts] = useState<any[]>([]);
  const [, setProfileImage] = useState<File | null>(null);

  // Fetch user's posts and additional information
  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        try {
          // Fetch posts
          const postsRef = collection(firestore, 'posts');
          const q = query(postsRef, where('userId', '==', user.uid));
          const querySnapshot = await getDocs(q);
          
          const posts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          
          setUserPosts(posts);

          // Fetch additional user details
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setBio(userData.bio || '');
            setLocation(userData.location || '');
            setOccupation(userData.occupation || '');
            setWebsite(userData.website || '');
            setJoinDate(userData.joinDate || user.metadata.creationTime);
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };

    fetchUserDetails();
  }, [user, firestore]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (user) {
        console.log('Current User:', user);
        console.log('User UID:', user.uid);
  
        try {
          const userDocRef = doc(firestore, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          console.log('User Document Exists:', userDoc.exists());
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User Data from Firestore:', userData);
            
            // Your existing setState calls
            setBio(userData.bio || '');
            setLocation(userData.location || '');
            // ... other setters
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      }
    };
  
    fetchUserDetails();
  }, [user, firestore]);

  // Handle profile image upload to Cloudinary
  const handleProfileImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Upload to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'WebApp'); // Replace with your Cloudinary preset
        formData.append('cloud_name', 'dbmqgcmgz'); // Replace with your Cloudinary cloud name

        const response = await fetch('https://api.cloudinary.com/v1_1/dbmqgcmgz/image/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        
        const downloadURL = data.secure_url;

        // Update auth profile
        await updateProfile(user!, {
          photoURL: downloadURL
        });

        // Update local state
        setUser(auth.currentUser);
        setProfileImage(null);
      } catch (error) {
        console.error("Error uploading profile image:", error);
      }
    }
  };

  // Save profile changes
  const handleSaveProfile = async () => {
    if (user) {
      try {
        // Update display name in Firebase Auth
        await updateProfile(user, {
          displayName: displayName
        });

        // Update additional details in Firestore
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, {
          bio,
          location,
          occupation,
          website,
          joinDate: joinDate || user.metadata.creationTime
        });

        // Update local state
        setUser(auth.currentUser);
        setIsEditing(false);
      } catch (error) {
        console.error("Error updating profile:", error);
      }
    }
  };

  // Render component
  return (
    <div className="max-w-2xl mx-auto py-6 px-4">
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Profile Header */}
        <div className="relative">
          {/* Profile Picture */}
          <div className="relative w-32 h-32 mx-auto mt-6 mb-4">
            <img
              src={user?.photoURL || '/default-avatar.png'}
              
              className="w-full h-full rounded-full object-cover border-4 border-gray-200"
            />
            {/* Profile Picture Upload */}
            <label 
              htmlFor="profileImageUpload" 
              className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer hover:bg-blue-600 transition-colors"
            >
              <Camera size={20} />
              <input
                type="file"
                id="profileImageUpload"
                className="hidden"
                accept="image/*"
                onChange={handleProfileImageUpload}
              />
            </label>
          </div>

          {/* Edit Profile Button */}
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition-colors"
          >
            <Edit size={20} />
          </button>
        </div>

        {/* Profile Information */}
        <div className="p-6">
          {isEditing ? (
            // Edit Mode
            <div className="space-y-4">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Display Name"
                className="w-full border rounded p-2"
              />
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself"
                className="w-full border rounded p-2 h-24"
              />
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Location"
                  className="w-full border rounded p-2"
                />
                <input
                  type="text"
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  placeholder="Occupation"
                  className="w-full border rounded p-2"
                />
                <input
                  type="text"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="Website or Portfolio"
                  className="w-full border rounded p-2"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button 
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveProfile}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div>
              <h2 className="text-2xl font-bold text-center">
                {user?.displayName || 'User'}
              </h2>
              <p className="text-gray-600 text-center mb-4">{user?.email}</p>
              
              {/* Enhanced Bio Section */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <p className="text-gray-700 text-center italic">
                  {bio || 'No bio available'}
                </p>
              </div>

              {/* Additional Profile Details */}
              <div className="grid md:grid-cols-2 gap-4 text-center">
                {location && (
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <MapPin size={20} className="text-blue-500" />
                    <span>{location}</span>
                  </div>
                )}
                {occupation && (
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Briefcase size={20} className="text-green-500" />
                    <span>{occupation}</span>
                  </div>
                )}
                {website && (
                  <div className="flex items-center justify-center space-x-2 text-gray-600">
                    <Link size={20} className="text-purple-500" />
                    <a 
                      href={website.startsWith('http') ? website : `https://${website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>
              <div className="text-center text-gray-500">
                <Calendar size={20} className="inline text-blue-500" />
                <span>Joined on {joinDate}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
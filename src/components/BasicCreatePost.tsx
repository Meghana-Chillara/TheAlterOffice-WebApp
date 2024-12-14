import React, { useState, useRef } from 'react';
import { 
  Image, 
  Smile, 
  X
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';

// Cloudinary configuration
const CLOUDINARY_CLOUD_NAME = 'dbmqgcmgz';

interface MediaFile {
  id: string;
  url: string;
  type: 'image' | 'video';
}

interface SocialMediaPostCreatorProps {
  onAddPost: (post: any) => void;
  maxMediaFiles?: number; // Optional prop to customize max files
}

const SocialMediaPostCreator: React.FC<SocialMediaPostCreatorProps> = ({ 
  onAddPost, 
  maxMediaFiles = 5 // Default to 5 files, but allow customization
}) => {
  const [postContent, setPostContent] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File): Promise<MediaFile> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset','WebApp');
    formData.append('cloud_name', 'dbmqgcmgz');

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`, 
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );
      
      return {
        id: uuidv4(),
        url: response.data.secure_url,
        type: file.type.startsWith('image') ? 'image' : 'video'
      };
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      throw error;
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + mediaFiles.length > maxMediaFiles) {
      alert(`Maximum ${maxMediaFiles} media files allowed`);
      return;
    }

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      const isValidType = file.type.startsWith('image/') || file.type.startsWith('video/');
      const isValidSize = file.size <= 10 * 1024 * 1024; // 10MB max
      
      if (!isValidType) {
        alert(`Unsupported file type: ${file.name}`);
      }
      if (!isValidSize) {
        alert(`File too large: ${file.name}. Max 10MB allowed.`);
      }
      
      return isValidType && isValidSize;
    });

    if (validFiles.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises: Promise<MediaFile>[] = validFiles.map(async (file): Promise<MediaFile> => {
        const uploadedFile = await uploadToCloudinary(file);
        return uploadedFile;
      });

      const uploadedFiles: MediaFile[] = await Promise.all(uploadPromises);
      
      setMediaFiles((prevFiles: MediaFile[]) => [...prevFiles, ...uploadedFiles]);
    } catch (error) {
      alert('Failed to upload media. Please try again.');
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeMediaPreview = (idToRemove: string) => {
    setMediaFiles(prev => prev.filter(file => file.id !== idToRemove));
  };

  const handlePostSubmit = async () => {
    if (!postContent.trim() && mediaFiles.length === 0) return;

    try {
      const postData = {
        id: uuidv4(),
        username: 'Current User',
        profilePicture: 'https://randomuser.me/api/portraits/women/68.jpg',
        content: postContent,
        media: mediaFiles,
        timestamp: new Date(),
        likes: 0,
        comments: []
      };

      onAddPost(postData);

      setPostContent('');
      setMediaFiles([]);
      
      console.log('Post submitted:', postData);
    } catch (error) {
      console.error('Post submission failed:', error);
      alert('Failed to submit post. Please try again.');
    }
  };

  return (
    <div className="bg-neutral-50 min-h-[100px] flex justify-center py-5">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-2xl overflow-hidden">
        {/* Post Creation Header */}
        <div className="flex justify-between items-center p-4 border-b border-neutral-200">
          <button className="text-neutral-500 hover:text-black">
            <X className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-neutral-800">Create Post</h2>
          <button 
            onClick={handlePostSubmit}
            className="text-blue-600 font-semibold hover:text-blue-700"
            disabled={(!postContent && mediaFiles.length === 0) || isUploading}
          >
            {isUploading ? 'Uploading...' : 'Post'}
          </button>
        </div>

        {/* Media Upload Area */}
        <div className="p-4">
          <div className="flex items-start space-x-4 mb-4">
            <img 
              src="https://randomuser.me/api/portraits/women/68.jpg" 
              alt="User Avatar" 
              className="w-10 h-10 rounded-full object-cover"
            />
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What's on your mind?"
              className="w-full resize-none text-lg text-neutral-800 placeholder-neutral-500 border-none focus:outline-none"
              rows={3}
            />
          </div>

          {/* Media Previews */}
          {mediaFiles.length > 0 && (
            <div className={`grid gap-2 mb-4 ${
              mediaFiles.length === 1 ? 'grid-cols-1' : 
              mediaFiles.length === 2 ? 'grid-cols-2' : 'grid-cols-3'
            }`}>
              {mediaFiles.map((file) => (
                <div key={file.id} className="relative group">
                  {file.type === 'image' ? (
                    <img 
                      src={file.url} 
                      alt="Preview" 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  ) : (
                    <video 
                      src={file.url} 
                      className="w-full h-32 object-cover rounded-lg"
                    />
                  )}
                  <button 
                    onClick={() => removeMediaPreview(file.id)}
                    className="absolute top-2 right-2 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Post Interaction Buttons */}
          <div className="flex justify-between items-center border-t border-neutral-200 pt-4">
            <div className="flex space-x-4">
              <button 
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading || mediaFiles.length >= maxMediaFiles}
                className={`
                  text-neutral-600 
                  ${mediaFiles.length >= maxMediaFiles ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600'}
                  flex items-center space-x-2
                `}
              >
                <Image className="w-6 h-6" />
                <span className="text-sm">
                  {mediaFiles.length >= maxMediaFiles 
                    ? `Max ${maxMediaFiles} files` 
                    : 'Photo/Video'
                  }
                </span>
              </button>
              <button className="text-neutral-600 hover:text-blue-600 flex items-center space-x-2">
                <Smile className="w-6 h-6" />
                <span className="text-sm">Feeling</span>
              </button>
            </div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileUpload}
              multiple 
              accept="image/*,video/*" 
              className="hidden" 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialMediaPostCreator;
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface AddSongFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (songData: {
    title: string;
    artist: string;
    url: string;
    moodTag: string;
    thumbnail: string;
    duration: number;
  }) => void;
}

const AddSongForm: React.FC<AddSongFormProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    url: '',
    moodTag: '',
    thumbnail: '',
    duration: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      artist: '',
      url: '',
      moodTag: '',
      thumbnail: '',
      duration: 0
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>

        <h2 className="text-2xl font-bold text-black mb-6 text-center">Add New Song</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-6 py-3 bg-gray-100 border border-gray-300 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-500"
              required
              placeholder="Title"
            />
          </div>

          <div>
            <input
              type="text"
              id="artist"
              value={formData.artist}
              onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
              className="w-full px-6 py-3 bg-gray-100 border border-gray-300 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-500"
              required
              placeholder="Artist"
            />
          </div>

          <div>
            <input
              type="url"
              id="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              className="w-full px-6 py-3 bg-gray-100 border border-gray-300 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-500"
              required
              placeholder="URL"
            />
          </div>

          <div>
            <input
              type="text"
              id="moodTag"
              value={formData.moodTag}
              onChange={(e) => setFormData({ ...formData, moodTag: e.target.value })}
              className="w-full px-6 py-3 bg-gray-100 border border-gray-300 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-500"
              required
              placeholder="Mood Tag"
            />
          </div>

          <div>
            <input
              type="url"
              id="thumbnail"
              value={formData.thumbnail}
              onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
              className="w-full px-6 py-3 bg-gray-100 border border-gray-300 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-500"
              required
              placeholder="Thumbnail URL"
            />
          </div>

          <div>
            <input
              type="number"
              id="duration"
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
              className="w-full px-6 py-3 bg-gray-100 border border-gray-300 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-500"
              required
              min="0"
              placeholder="Duration (seconds)"
            />
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-100 text-black font-semibold py-3 px-8 rounded-full transition-colors duration-200 hover:bg-gray-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-black text-white font-semibold py-3 px-8 rounded-full transition-colors duration-200 hover:bg-gray-900"
            >
              Add Song
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSongForm; 
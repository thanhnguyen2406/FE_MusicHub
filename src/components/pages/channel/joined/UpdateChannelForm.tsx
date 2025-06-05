import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface UpdateChannelFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    url: string;
    tagList: string[];
    description: string;
    maxUsers: number;
    allowOthersToManageSongs: boolean;
    allowOthersToControlPlayback: boolean;
    password?: string;
  }) => void;
  initialData: {
    name: string;
    url: string;
    tagList: string[];
    description: string;
    maxUsers: number;
    allowOthersToManageSongs: boolean;
    allowOthersToControlPlayback: boolean;
    isPrivate: boolean;
  };
}

const UpdateChannelForm: React.FC<UpdateChannelFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [name, setName] = useState(initialData.name);
  const [url, setUrl] = useState(initialData.url);
  const [tags, setTags] = useState(initialData.tagList.join(', '));
  const [description, setDescription] = useState(initialData.description);
  const [maxUsers, setMaxUsers] = useState(initialData.maxUsers);
  const [allowManageSongs, setAllowManageSongs] = useState(initialData.allowOthersToManageSongs);
  const [allowPlayback, setAllowPlayback] = useState(initialData.allowOthersToControlPlayback);
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      url,
      tagList: tags.split(',').map(tag => tag.trim()).filter(Boolean),
      description,
      maxUsers,
      allowOthersToManageSongs: allowManageSongs,
      allowOthersToControlPlayback: allowPlayback,
      password: password || undefined
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

        <h2 className="text-2xl font-bold text-black mb-6 text-center">Update Channel</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Channel Name"
              required
            />
          </div>

          <div>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Channel URL"
              required
            />
          </div>

          <div>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Tags (comma-separated)"
            />
          </div>

          <div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Description"
              rows={3}
            />
          </div>

          <div>
            <input
              type="number"
              value={maxUsers}
              onChange={(e) => setMaxUsers(Number(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Max Users"
              min={1}
              required
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Password (optional)"
            />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allowManageSongs}
                onChange={(e) => setAllowManageSongs(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Allow others to manage songs</span>
            </label>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={allowPlayback}
                onChange={(e) => setAllowPlayback(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Allow others to control playback</span>
            </label>
          </div>

          <div className="flex flex-col gap-3 mt-6">
            <button
              type="submit"
              className="w-full py-3 px-8 rounded-full bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200 font-semibold"
            >
              Update Channel
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-black py-3 px-8 rounded-full transition-colors duration-200 font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateChannelForm; 
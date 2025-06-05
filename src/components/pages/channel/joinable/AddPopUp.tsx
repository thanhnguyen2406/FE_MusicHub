import React, { useState } from 'react';

interface AddChannelPopUpProps {
  open: boolean;
  onClose: () => void;
  onAdd: (data: {
    name: string;
    url: string;
    tagList: string[];
    description: string;
    maxUsers: number;
    allowOthersToManageSongs: boolean;
    allowOthersToControlPlayback: boolean;
  }) => void;
}

const AddChannelPopUp: React.FC<AddChannelPopUpProps> = ({ open, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [tagList, setTagList] = useState('');
  const [description, setDescription] = useState('');
  const [maxUsers, setMaxUsers] = useState<number>(1);
  const [allowOthersToManageSongs, setAllowOthersToManageSongs] = useState(false);
  const [allowOthersToControlPlayback, setAllowOthersToControlPlayback] = useState(false);
  const [maxUsersError, setMaxUsersError] = useState('');

  if (!open) return null;

  const handleMaxUsersChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    if (!e.target.value || value < 1) {
      setMaxUsersError('Max users must be at least 1');
      setMaxUsers(1);
    } else {
      setMaxUsersError('');
      setMaxUsers(value);
    }
  };

  const handleAdd = () => {
    if (!name || !url || !maxUsers || maxUsers < 1) return;
    onAdd({
      name,
      url,
      tagList: tagList.split(',').map(tag => tag.trim()).filter(Boolean),
      description,
      maxUsers: Number(maxUsers),
      allowOthersToManageSongs,
      allowOthersToControlPlayback,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-transparent">
      <div className="bg-white rounded-3xl p-6 w-full max-w-xs shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-black">Add Channel</h2>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-3xl mb-3 bg-gray-100 text-black"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Name"
        />
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-3xl mb-3 bg-gray-100 text-black"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="URL"
        />
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-3xl mb-3 bg-gray-100 text-black"
          value={tagList}
          onChange={e => setTagList(e.target.value)}
          placeholder="Tags (comma separated)"
        />
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-3xl mb-3 bg-gray-100 text-black"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Description"
        />
        <input
          type="number"
          className="w-full px-3 py-2 border rounded-3xl mb-1 bg-gray-100 text-black"
          value={maxUsers}
          onChange={handleMaxUsersChange}
          placeholder="Max Users"
          min={1}
        />
        {maxUsersError && <div className="text-red-500 text-xs mb-2">{maxUsersError}</div>}
        <div className="flex items-center mb-2">
          <input
            type="checkbox"
            checked={allowOthersToManageSongs}
            onChange={e => setAllowOthersToManageSongs(e.target.checked)}
            className="mr-2"
          />
          <span className="text-black">Allow others to manage songs</span>
        </div>
        <div className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={allowOthersToControlPlayback}
            onChange={e => setAllowOthersToControlPlayback(e.target.checked)}
            className="mr-2"
          />
          <span className="text-black">Allow others to control playback</span>
        </div>
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-3xl bg-gray-200 text-black w-24"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-3xl bg-black text-white w-24"
            onClick={handleAdd}
            disabled={!name || !url || !maxUsers || maxUsers < 1}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddChannelPopUp; 
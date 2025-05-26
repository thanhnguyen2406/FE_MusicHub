import React, { useState } from 'react';

interface JoinPopUpProps {
  open: boolean;
  onClose: () => void;
  onJoin: (url: string, password: string) => void;
}

const JoinPopUp: React.FC<JoinPopUpProps> = ({ open, onClose, onJoin }) => {
  const [url, setUrl] = useState('');
  const [password, setPassword] = useState('');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-transparent">
      <div className="bg-white rounded-2xl p-6 w-full max-w-xs shadow-lg">
        <h2 className="text-6x1 font-bold mb-4 text-black">Join by URL</h2>
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-3xl mb-4 bg-gray-100 text-black"
          value={url}
          onChange={e => setUrl(e.target.value)}
          placeholder="URL"
        />
        <input
          type="password"
          className="w-full px-3 py-2 border rounded-3xl mb-4 bg-gray-100 text-black"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Password"
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 rounded-2xl bg-gray-200 text-black w-24"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded-2xl bg-black text-white w-24"
            onClick={() => { onJoin(url, password); onClose(); }}
            disabled={!url}
          >
            Join
          </button>
        </div>
      </div>
    </div>
  );
};

export default JoinPopUp; 
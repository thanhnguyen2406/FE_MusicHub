import React from 'react';
import { ArrowUpCircleIcon as ArrowUpCircleSolid, ArrowDownCircleIcon as ArrowDownCircleSolid } from '@heroicons/react/24/solid';
import { ArrowUpCircleIcon as ArrowUpCircleOutline, ArrowDownCircleIcon as ArrowDownCircleOutline } from '@heroicons/react/24/outline';

interface SongProps {
  index: number;
  image: string;
  title: string;
  artist: string;
  duration: string;
  moodTags: string[];
  likes: number;
  dislikes: number;
  liked?: boolean;
  disliked?: boolean;
  onLike?: () => void;
  onDislike?: () => void;
}

const Song: React.FC<SongProps> = ({
  index,
  image,
  title,
  artist,
  duration,
  moodTags,
  likes,
  dislikes,
  liked = false,
  disliked = false,
  onLike,
  onDislike
}) => {
  return (
    <li className="flex items-center bg-[#111] rounded-2xl px-5 py-5 mb-6 min-h-[96px] relative
      transition-all duration-300 ease-in-out hover:bg-gray-700 hover:rounded-3xl animate-fadeIn">
      {/* Index number */}
      <div className="absolute -left-8 text-white text-xl font-bold opacity-70 transition-opacity duration-300 group-hover:opacity-100">
        {index}
      </div>
      {/* Song image */}
      <img src={image} alt={title} className="w-16 h-16 rounded-full object-cover bg-[#222] mr-4 
        transition-transform duration-300 hover:scale-110" />
      {/* Song info and mood tags */}
      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="text-white text-lg font-bold truncate text-left transition-colors duration-300 hover:text-blue-400">{title}</div>
        <div className="text-gray-300 text-base truncate text-left transition-colors duration-300 hover:text-gray-100">{artist}</div>
        <div className="flex gap-2 mt-2">
          {moodTags.map((tag, idx) => (
            <span key={idx} className="bg-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap
              transition-all duration-300 hover:bg-blue-600 hover:scale-105">{tag}</span>
          ))}
        </div>
      </div>
      {/* Duration (static position, large) */}
      <div className="w-24 flex-shrink-0 flex items-center justify-end mr-6">
        <span className="text-white text-xl font-bold transition-opacity duration-300 hover:opacity-80">{duration}</span>
      </div>
      {/* Like/Dislike */}
      <div className="flex items-center gap-2 mx-2">
        {liked ? (
          // Filled up arrow
          <ArrowUpCircleSolid
            className="w-10 h-10 text-white cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-90"
            onClick={onLike}
            role="button"
            tabIndex={0}
            aria-label="Like"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onLike && onLike(); }}
          />
        ) : (
          // Outlined up arrow
          <ArrowUpCircleOutline
            className="w-10 h-10 text-white cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-90"
            onClick={onLike}
            role="button"
            tabIndex={0}
            aria-label="Like"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onLike && onLike(); }}
          />
        )}
        <span className="text-white text-sm transition-opacity duration-300 hover:opacity-80">{likes}</span>
        {disliked ? (
          // Filled down arrow
          <ArrowDownCircleSolid
            className="w-10 h-10 text-white cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-90"
            onClick={onDislike}
            role="button"
            tabIndex={0}
            aria-label="Dislike"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onDislike && onDislike(); }}
          />
        ) : (
          // Outlined down arrow
          <ArrowDownCircleOutline
            className="w-10 h-10 text-white cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-90"
            onClick={onDislike}
            role="button"
            tabIndex={0}
            aria-label="Dislike"
            onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onDislike && onDislike(); }}
          />
        )}
        <span className="text-white text-sm transition-opacity duration-300 hover:opacity-80">{dislikes}</span>
      </div>
    </li>
  );
};

export default Song;

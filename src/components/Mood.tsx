import React from 'react';

interface MoodProps {
  image: string;
  title: string;
  description: string;
}

const Mood: React.FC<MoodProps> = ({ image, title, description }) => {
  return (
    <div className="bg-gray-400 rounded-2xl w-full max-w-[370px] min-w-[220px] mx-auto p-3 transition-transform hover:-translate-y-1 hover:scale-105 flex flex-col">
      <img src={image} alt={title} className="w-full h-[150px] object-cover rounded-xl mb-3" />
      <div className="px-1 pb-1">
        <div className="text-white text-lg font-semibold mb-1">{title}</div>
        <div className="text-gray-100 text-base">{description}</div>
      </div>
    </div>
  );
};

export default Mood; 
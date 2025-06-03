import React from 'react';

interface MemberProps {
  name: string;
  avatar: string;
  role?: 'MEMBER' | 'OWNER';
}

const Member: React.FC<MemberProps> = ({ name, avatar }) => (
  <div className="flex items-center gap-3">
    <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover bg-[#222]" />
    <span className="text-white text-base font-medium">{name}</span>
  </div>
);

export default Member; 
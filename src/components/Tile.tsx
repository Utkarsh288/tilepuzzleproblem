import React from 'react';

interface TileProps {
  value: number;
  index: number;
  isHighlighted: boolean;
  onClick: () => void;
}

const Tile: React.FC<TileProps> = ({ value, isHighlighted, onClick }) => {
  if (value === 0) return (
    <div 
      className="w-24 h-24 m-1 bg-gray-200 rounded-lg"
      onClick={onClick}
    />
  );

  return (
    <div
      className={`w-24 h-24 m-1 flex items-center justify-center rounded-lg cursor-pointer
        transition-all duration-300 transform hover:scale-105
        ${isHighlighted 
          ? 'bg-blue-500 text-white shadow-lg' 
          : 'bg-white text-gray-800 shadow-md hover:shadow-lg'
        }`}
      onClick={onClick}
    >
      <span className="text-3xl font-bold">{value}</span>
    </div>
  );
};

export default Tile;
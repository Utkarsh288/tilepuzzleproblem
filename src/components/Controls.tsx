import React from 'react';
import { Play, RotateCcw, Lightbulb, HandMetal, GitGraph } from 'lucide-react';

interface ControlsProps {
  onNewGame: () => void;
  onAutoSolve: () => void;
  onShowHint: () => void;
  onToggleManual: () => void;
  onShowGraph: () => void;
  isManualMode: boolean;
}

const Controls: React.FC<ControlsProps> = ({
  onNewGame,
  onAutoSolve,
  onShowHint,
  onToggleManual,
  onShowGraph,
  isManualMode
}) => {
  return (
    <div className="flex gap-4 mt-6 flex-wrap justify-center">
      <button
        onClick={onNewGame}
        className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
      >
        <RotateCcw size={20} />
        New Game
      </button>
      
      <button
        onClick={onAutoSolve}
        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        <Play size={20} />
        Auto Solve
      </button>
      
      <button
        onClick={onShowHint}
        className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
      >
        <Lightbulb size={20} />
        Hint
      </button>
      
      <button
        onClick={onShowGraph}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
      >
        <GitGraph size={20} />
        Show Graph
      </button>
      
      <button
        onClick={onToggleManual}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
          ${isManualMode 
            ? 'bg-purple-500 hover:bg-purple-600' 
            : 'bg-gray-500 hover:bg-gray-600'
          } text-white`}
      >
        <HandMetal size={20} />
        {isManualMode ? 'Manual Mode' : 'Auto Mode'}
      </button>
    </div>
  );
};

export default Controls;
import React from 'react';
import { GraphNode } from '../types/puzzle';

interface GraphProps {
  data: GraphNode;
  isVisible: boolean;
  onClose: () => void;
}

const NodeComponent: React.FC<{ 
  node: GraphNode; 
  isRoot?: boolean 
}> = ({ node, isRoot = false }) => {
  return (
    <div className="flex flex-col items-center">
      <div 
        className={`p-3 rounded-lg mb-2 text-sm ${
          isRoot 
            ? 'bg-purple-500 text-white' 
            : 'bg-white shadow-md'
        }`}
      >
        <div className="font-bold">{node.label}</div>
        <div className="text-xs opacity-75">h={node.heuristic}</div>
      </div>
      
      {node.children.length > 0 && (
        <div className="flex gap-4 items-start">
          {node.children.map((child, index) => (
            <div key={child.id} className="flex flex-col items-center">
              <div className="w-px h-8 bg-gray-300"></div>
              <NodeComponent node={child} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Graph: React.FC<GraphProps> = ({ data, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-100 p-8 rounded-xl max-w-[90vw] max-h-[90vh] overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Search Graph</h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>
        
        <div className="p-4 overflow-auto">
          <NodeComponent node={data} isRoot={true} />
        </div>
        
        <div className="mt-4 text-sm text-gray-600">
          <p>h = Manhattan distance heuristic</p>
          <p>Lower values indicate states closer to the solution</p>
        </div>
      </div>
    </div>
  );
};

export default Graph;
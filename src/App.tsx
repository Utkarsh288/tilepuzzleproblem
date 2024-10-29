import React, { useState, useEffect, useCallback } from 'react';
import { Brain } from 'lucide-react';
import Tile from './components/Tile';
import Controls from './components/Controls';
import Graph from './components/Graph';
import { 
  PuzzleState, 
  Node,
  generatePuzzle, 
  getValidMoves, 
  makeMove, 
  isGoalState,
  solvePuzzle,
  generateSearchGraph
} from './utils/puzzleLogic';

function App() {
  const [puzzle, setPuzzle] = useState<PuzzleState>(generatePuzzle());
  const [isManualMode, setIsManualMode] = useState(true);
  const [solution, setSolution] = useState<Node[]>([]);
  const [currentStep, setCurrentStep] = useState(-1);
  const [isAutoSolving, setIsAutoSolving] = useState(false);
  const [showGraph, setShowGraph] = useState(false);
  const [graphData, setGraphData] = useState(generateSearchGraph(puzzle));

  const startNewGame = () => {
    const newPuzzle = generatePuzzle();
    setPuzzle(newPuzzle);
    setSolution([]);
    setCurrentStep(-1);
    setIsAutoSolving(false);
    setGraphData(generateSearchGraph(newPuzzle));
  };

  const handleTileClick = (index: number) => {
    if (!isManualMode || isAutoSolving) return;

    const validMoves = getValidMoves(puzzle);
    const move = validMoves.find(m => m.index === index);
    
    if (move) {
      const newPuzzle = makeMove(puzzle, move);
      setPuzzle(newPuzzle);
      setGraphData(generateSearchGraph(newPuzzle));
      
      if (isGoalState(newPuzzle)) {
        setTimeout(() => {
          alert('Congratulations! You solved the puzzle!');
          startNewGame();
        }, 500);
      }
    }
  };

  const autoSolve = useCallback(async () => {
    if (isAutoSolving) return;
    setIsAutoSolving(true);
    
    const solutionPath = solvePuzzle(puzzle);
    setSolution(solutionPath);
    
    for (let i = 0; i < solutionPath.length; i++) {
      setCurrentStep(i);
      setPuzzle(solutionPath[i].state);
      setGraphData(generateSearchGraph(solutionPath[i].state));
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsAutoSolving(false);
    setTimeout(() => {
      alert('Puzzle solved automatically!');
      startNewGame();
    }, 500);
  }, [puzzle, isAutoSolving]);

  const showHint = () => {
    if (isAutoSolving) return;
    const solutionPath = solvePuzzle(puzzle);
    if (solutionPath.length > 1) {
      setSolution(solutionPath);
      setCurrentStep(1);
      setGraphData(generateSearchGraph(puzzle));
      setShowGraph(true);
    }
  };

  const isHighlighted = (index: number): boolean => {
    if (currentStep === -1 || !solution[currentStep]) return false;
    const nextMove = solution[currentStep].move;
    return nextMove?.index === index;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Brain size={40} className="text-purple-600" />
          <h1 className="text-4xl font-bold text-gray-800">9-Puzzle Solver</h1>
        </div>
        <p className="text-gray-600">
          {isManualMode 
            ? 'Click tiles adjacent to the empty space to move them' 
            : 'Watch the automatic solution unfold'}
        </p>
      </div>

      <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-xl">
        <div className="grid grid-cols-3 gap-1 mb-6">
          {puzzle.map((value, index) => (
            <Tile
              key={index}
              value={value}
              index={index}
              isHighlighted={isHighlighted(index)}
              onClick={() => handleTileClick(index)}
            />
          ))}
        </div>

        <Controls
          onNewGame={startNewGame}
          onAutoSolve={autoSolve}
          onShowHint={showHint}
          onToggleManual={() => setIsManualMode(!isManualMode)}
          onShowGraph={() => setShowGraph(true)}
          isManualMode={isManualMode}
        />
      </div>

      <Graph 
        data={graphData}
        isVisible={showGraph}
        onClose={() => setShowGraph(false)}
      />
    </div>
  );
}

export default App;
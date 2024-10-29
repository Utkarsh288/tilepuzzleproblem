import { PuzzleState, Node, Move, GraphNode } from '../types/puzzle';

export const isSolvable = (puzzle: PuzzleState): boolean => {
  let inversions = 0;
  const puzzleWithoutZero = puzzle.filter(num => num !== 0);
  
  for (let i = 0; i < puzzleWithoutZero.length - 1; i++) {
    for (let j = i + 1; j < puzzleWithoutZero.length; j++) {
      if (puzzleWithoutZero[i] > puzzleWithoutZero[j]) {
        inversions++;
      }
    }
  }
  
  return inversions % 2 === 0;
};

export const generatePuzzle = (): PuzzleState => {
  const numbers = Array.from({ length: 9 }, (_, i) => i);
  let puzzle: PuzzleState;
  
  do {
    puzzle = [...numbers].sort(() => Math.random() - 0.5);
  } while (!isSolvable(puzzle));
  
  return puzzle;
};

export const getValidMoves = (puzzle: PuzzleState): Move[] => {
  const moves: Move[] = [];
  const emptyIndex = puzzle.indexOf(0);
  const row = Math.floor(emptyIndex / 3);
  const col = emptyIndex % 3;

  if (row > 0) moves.push({ index: emptyIndex - 3, direction: 'down' });
  if (row < 2) moves.push({ index: emptyIndex + 3, direction: 'up' });
  if (col > 0) moves.push({ index: emptyIndex - 1, direction: 'right' });
  if (col < 2) moves.push({ index: emptyIndex + 1, direction: 'left' });

  return moves;
};

export const makeMove = (puzzle: PuzzleState, move: Move): PuzzleState => {
  const newPuzzle = [...puzzle];
  const emptyIndex = puzzle.indexOf(0);
  [newPuzzle[emptyIndex], newPuzzle[move.index]] = [newPuzzle[move.index], newPuzzle[emptyIndex]];
  return newPuzzle;
};

export const isGoalState = (puzzle: PuzzleState): boolean => {
  return puzzle.every((num, index) => num === (index + 1) % 9);
};

const calculateManhattanDistance = (state: PuzzleState): number => {
  let distance = 0;
  for (let i = 0; i < state.length; i++) {
    if (state[i] !== 0) {
      const currentRow = Math.floor(i / 3);
      const currentCol = i % 3;
      const targetPos = state[i] - 1;
      const targetRow = Math.floor(targetPos / 3);
      const targetCol = targetPos % 3;
      distance += Math.abs(currentRow - targetRow) + Math.abs(currentCol - targetCol);
    }
  }
  return distance;
};

export const generateSearchGraph = (
  currentState: PuzzleState, 
  depth: number = 2
): GraphNode => {
  const visited = new Set<string>();
  
  const generateNode = (
    state: PuzzleState, 
    level: number, 
    moveDirection?: string
  ): GraphNode => {
    const stateStr = state.toString();
    const heuristic = calculateManhattanDistance(state);
    const node: GraphNode = {
      id: stateStr,
      label: moveDirection ? `Move ${moveDirection}` : 'Current',
      level,
      heuristic,
      children: []
    };

    if (level < depth && !visited.has(stateStr)) {
      visited.add(stateStr);
      const moves = getValidMoves(state);
      
      for (const move of moves) {
        const newState = makeMove(state, move);
        if (!visited.has(newState.toString())) {
          node.children.push(
            generateNode(newState, level + 1, move.direction)
          );
        }
      }
    }
    
    return node;
  };

  return generateNode(currentState, 0);
};

export const solvePuzzle = (initialState: PuzzleState): Node[] => {
  const visited = new Set<string>();
  const queue: Node[] = [];
  const initialNode: Node = {
    state: initialState,
    parent: null,
    move: null,
    depth: 0,
    heuristic: calculateManhattanDistance(initialState)
  };
  
  queue.push(initialNode);
  visited.add(initialState.toString());
  
  while (queue.length > 0) {
    const current = queue.shift()!;
    
    if (isGoalState(current.state)) {
      const path: Node[] = [];
      let node: Node | null = current;
      while (node) {
        path.unshift(node);
        node = node.parent;
      }
      return path;
    }
    
    const moves = getValidMoves(current.state);
    for (const move of moves) {
      const newState = makeMove(current.state, move);
      const stateStr = newState.toString();
      
      if (!visited.has(stateStr)) {
        visited.add(stateStr);
        queue.push({
          state: newState,
          parent: current,
          move,
          depth: current.depth + 1,
          heuristic: calculateManhattanDistance(newState)
        });
      }
    }
  }
  
  return [];
};
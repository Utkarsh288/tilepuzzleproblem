export type PuzzleState = number[];

export interface Move {
  index: number;
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface Node {
  state: PuzzleState;
  parent: Node | null;
  move: Move | null;
  depth: number;
  heuristic?: number;
  children?: Node[];
}

export interface GraphNode {
  id: string;
  label: string;
  level: number;
  heuristic: number;
  children: GraphNode[];
}
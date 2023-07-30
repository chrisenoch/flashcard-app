import { Details } from '../types/details';

//change this later
export interface ExerciseItem {
  id: string;
  type: 'EXERCISE';
  questions: { question: string; answer: string }[];
  isVisited: boolean;
  // question: string;
  // answer: string;
}

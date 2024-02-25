import { Details } from '../types/details';

//change this later
export interface ExerciseEntity {
  id: string;
  kind: 'EXERCISE';
  questions: { question: string; answer: string }[];
  isVisited: boolean;
  // question: string;
  // answer: string;
}

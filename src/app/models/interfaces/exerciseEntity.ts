import { Details } from '../types/details';

//change this later
export interface ExerciseEntity {
  id: string;
  kind: 'EXERCISE';
  questions: { questionId: string; question: string; answer: string }[];
  isVisited: boolean;
  // question: string;
  // answer: string;
}

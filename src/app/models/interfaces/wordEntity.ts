import { Details } from '../types/details';

export interface WordEntity {
  id: string;
  kind: 'WORD';
  english: string;
  spanish: string;
  explanation: string;
  examples?: string[];
  isVisited: boolean;
}

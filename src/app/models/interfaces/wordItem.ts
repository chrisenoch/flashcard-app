import { Details } from '../types/details';

export interface WordItem {
  id: string;
  type: 'WORD';
  english: string;
  spanish: string;
  explanation: string;
  examples?: string[];
}

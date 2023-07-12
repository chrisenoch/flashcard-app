import { Details } from '../types/details';

export interface WordDetails {
  id: string;
  type: 'WORD';
  english: string;
  spanish: string;
  explanation: string;
  examples?: string[];
}

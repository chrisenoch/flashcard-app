import { Details } from '../types/details';
import { WordItem } from './wordItem';

//change this later
export interface SummaryItem {
  id: string;
  type: 'SUMMARY';
  wordItems: WordItem[];
  isVisited: boolean;
}

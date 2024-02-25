import { Details } from '../types/details';
import { WordEntity } from './wordEntity';

//change this later
export interface SummaryEntity {
  id: string;
  kind: 'SUMMARY';
  wordItems: WordEntity[];
  isVisited: boolean;
}

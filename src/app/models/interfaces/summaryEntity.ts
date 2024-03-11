import { Details } from '../types/details';
import { WordEntity } from './wordEntity';

//To do: change this
export interface SummaryEntity {
  id: string;
  kind: 'SUMMARY';
  wordEntities: WordEntity[];
  isVisited: boolean;
}

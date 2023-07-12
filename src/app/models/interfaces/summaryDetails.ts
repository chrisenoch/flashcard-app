import { Details } from '../types/details';
import { WordDetails } from './wordDetails';

//change this later
export interface SummaryDetails {
  id: string;
  type: 'SUMMARY';
  wordDetails: WordDetails[];
}

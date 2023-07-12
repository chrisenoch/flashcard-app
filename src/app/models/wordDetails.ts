import { Details } from './details';

export interface WordDetails {
  id: string;
  type: Details;
  english: string;
  spanish: string;
  explanation: string;
  examples?: string[];
}

import { Schema } from 'mongoose';

export const DeckSchema = new Schema({
  title: { type: String, required: true },
  cards: { type: [String], required: true }, 
});

export interface Deck {
  title: string;
  cards: string[];
}

import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deck, DeckDocument } from './deck.schema';

@Injectable()
export class DeckService {
   constructor(@InjectModel(Deck.name) private deckModel: Model<DeckDocument>) {}

   async fetchCommander(commanderName: string) {
      try {
         const response = await axios.get(`https://api.scryfall.com/cards/search?q=${commanderName}`);
         return response.data.data[0];
      } catch (error) {
         throw new Error(`Error fetching commander: ${error.message}`);
      }
   }

   async fetchCardsByColor(colors: string[]) {
      const colorQuery = colors.map(color => `color:${color}`).join('OR');
      const response = await axios.get(`https://api.scryfall.com/cards/search?q=${colorQuery}`);
      return response.data.data;
   }

   async createDeck(commanderName: string) {
      try {
         const commander = await this.fetchCommander(commanderName);
         const color = commander.colors;

         const cards = await this.fetchCardsByColor(color);
         const deck = new this.deckModel({
            commander: commander.name,
            cards: cards.map(card => card.name).slice(0, 99),
         });

         return await deck.save();
      } catch (error) {
         throw new Error(`Error creating deck: ${error.message}`);
      }
   }
}

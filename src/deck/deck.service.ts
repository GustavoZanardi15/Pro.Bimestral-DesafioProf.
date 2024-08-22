import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Deck, DeckDocument } from './deck.schema';
import * as fs from 'fs';

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

         await deck.save();
         await this.saveDeckToFile(deck);
         return deck;
      } catch (error) {
         throw new Error(`Error creating deck: ${error.message}`);
      }
   }

   async saveDeckToFile(deck: Deck) {
      const jsonData = JSON.stringify(deck, null, 2);
      fs.writeFileSync('deck.json', jsonData);
   }

   async findOne(id: string): Promise<DeckDocument> {
      return this.deckModel.findById(id).exec();
   }

   async findAll(): Promise<DeckDocument[]> {
      return this.deckModel.find().exec();
   }
}

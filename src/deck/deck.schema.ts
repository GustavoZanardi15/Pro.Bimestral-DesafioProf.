import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Deck {
   @Prop({ required: true })
   commander: string;

   @Prop({ type: [String], required: true })
   cards: string[];
}

export type DeckDocument = Deck & Document;

export const DeckSchema = SchemaFactory.createForClass(Deck);

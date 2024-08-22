import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DeckService } from './deck.service';
import { Deck } from './deck.schema';

@Controller('decks')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @Post()
  async create(@Body('commanderName') commanderName: string) {
    return this.deckService.createDeck(commanderName); 
  }

  @Get()
  async findAll() {
    return this.deckService.findAll();
  }

  @Get(':id') 
  async findOne(@Param('id') id: string) {
    return this.deckService.findOne(id);
  }
}

import { Controller, Get, Post, Body } from '@nestjs/common';
import { DeckService } from './deck.service';
import { Deck } from './deck.schema';

@Controller('decks')
export class DeckController {
  constructor(private readonly deckService: DeckService) {}

  @Post()
  create(@Body() deck: Deck) {
    return this.deckService.create(deck);
  }

  @Get()
  findAll() {
    return this.deckService.findAll();
  }
}

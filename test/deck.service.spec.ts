import { Test, TestingModule } from '@nestjs/testing';
import { DeckService } from './deck.service.spec'; 
import { getModelToken } from '@nestjs/mongoose';
import { Deck } from './deck.schema'; 

describe('DeckService', () => {
    let service: DeckService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                DeckService,
                {
                    provide: getModelToken(Deck.name),
                    useValue: {}, 
                },
            ],
        }).compile();

        service = module.get<DeckService>(DeckService);
    });

    it('should fetch commander and cards', async () => {
        const commander = await service.fetchCommander('Gisa');
        expect(commander).toBeDefined();
        const cards = await service.fetchCardsByColor(commander.colors);
        expect(cards.length).toBeGreaterThan(0);
    });
});

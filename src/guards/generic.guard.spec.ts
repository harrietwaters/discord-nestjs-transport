import { GenericGuard } from './generic.guard';

describe('GenericGuard', () => {
    it('should be defined', () => {
        expect(new GenericGuard(() => true)).toBeDefined();
    });
});

import { IgnoreAuthorGuard } from './ignore-author.guard';

describe('IgnoreAuthorGuard', () => {
    it('should be defined', () => {
        expect(new IgnoreAuthorGuard('fooId')).toBeDefined();
    });
});

import { ContainsText } from './contains-text.guard';

describe('ContainsTextGuard', () => {
    it('should be defined', () => {
        expect(new ContainsText(/$foo/)).toBeDefined();
    });
});

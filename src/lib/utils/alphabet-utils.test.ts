import { AlphabetUtils } from './alphabet-utils';

describe('Alphabet utils', () => {
  it('should have 35 characters', () => {
    expect(AlphabetUtils.alphabet.length).toEqual(35);
  });
});

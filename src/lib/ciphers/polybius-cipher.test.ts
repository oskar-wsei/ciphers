import { PolybiusCheckerboard, PolybiusCipher } from './polybius-cipher';

describe('PolybiusCipher', () => {
  const checkerboard = new PolybiusCheckerboard(7, 5);

  checkerboard.characters = [
    'b',
    'e',
    'r',
    'q',
    'ą',
    'ł',
    'p',
    'o',
    'i',
    'ć',
    'l',
    's',
    'ś',
    'ż',
    'c',
    'k',
    'a',
    'h',
    'ę',
    'v',
    'w',
    'd',
    'ń',
    'n',
    'u',
    'm',
    'f',
    'ź',
    'ó',
    'g',
    'j',
    't',
    'z',
    'y',
    'x',
  ];

  describe('Encryption', () => {
    it('should return empty string on empty message', () => {
      expect(PolybiusCipher.encrypt('', checkerboard)).toEqual('');
    });

    it('should encrypt example message', () => {
      expect(PolybiusCipher.encrypt('TAJNE', checkerboard)).toEqual('54 33 35 43 21');
      expect(PolybiusCipher.encrypt('123__TAJNE__123', checkerboard)).toEqual('54 33 35 43 21');
    });
  });

  describe('Decryption', () => {
    it('should return empty string on empty message', () => {
      expect(PolybiusCipher.decrypt('', checkerboard)).toEqual('');
    });

    it('should decrypt example message', () => {
      expect(PolybiusCipher.decrypt('54 33 35 43 21', checkerboard)).toEqual('tajne');
      expect(PolybiusCipher.decrypt('5433354321', checkerboard)).toEqual('tajne');
    });

    it('should throw on invalid message length', () => {
      expect(() => PolybiusCipher.decrypt('1', checkerboard)).toThrow();
    });

    it('should throw on invalid message character', () => {
      expect(() => PolybiusCipher.decrypt('4a 33', checkerboard)).toThrow();
    });
  });
});

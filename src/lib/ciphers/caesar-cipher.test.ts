import { CaesarCipher } from './caesar-cipher';

describe('CaesarCipher', () => {
  describe('Encryption', () => {
    it('should return empty string on empty message', () => {
      expect(CaesarCipher.encrypt('', 3)).toEqual('');
    });

    it('should not alter the message when shift is 0 or 35', () => {
      expect(CaesarCipher.encrypt('message', 0)).toEqual('message');
      expect(CaesarCipher.encrypt('message', 35)).toEqual('message');
    });

    it('should transform to lower case', () => {
      expect(CaesarCipher.encrypt('Test', 0)).toEqual('test');
      expect(CaesarCipher.encrypt('HELLO', 0)).toEqual('hello');
      expect(CaesarCipher.encrypt('AĄBCĆ', 0)).toEqual('aąbcć');
    });

    it('should remove non-alpha characters', () => {
      expect(CaesarCipher.encrypt('12345!', 0)).toEqual('');
      expect(CaesarCipher.encrypt('hello *world', 0)).toEqual('helloworld');
      expect(CaesarCipher.encrypt('__t3st__', 0)).toEqual('tst');
    });

    it('should shift all characters by 1', () => {
      expect(CaesarCipher.encrypt('aąbcćdeę', 1)).toEqual('ąbcćdeęf');
      expect(CaesarCipher.encrypt('yzźżaą', 1)).toEqual('zźżaąb');
    });
  });

  describe('Decryption', () => {
    it('should return empty string on empty message', () => {
      expect(CaesarCipher.decrypt('', 3)).toEqual('');
    });

    it('should not alter the message when shift is 0 or 35', () => {
      expect(CaesarCipher.decrypt('message', 0)).toEqual('message');
      expect(CaesarCipher.decrypt('message', 35)).toEqual('message');
    });

    it('should transform to lower case', () => {
      expect(CaesarCipher.decrypt('Test', 0)).toEqual('test');
      expect(CaesarCipher.decrypt('HELLO', 0)).toEqual('hello');
      expect(CaesarCipher.decrypt('AĄBCĆ', 0)).toEqual('aąbcć');
    });

    it('should remove non-alpha characters', () => {
      expect(CaesarCipher.decrypt('12345!', 0)).toEqual('');
      expect(CaesarCipher.decrypt('hello *world', 0)).toEqual('helloworld');
      expect(CaesarCipher.decrypt('__t3st__', 0)).toEqual('tst');
    });

    it('should shift all characters by 1', () => {
      expect(CaesarCipher.decrypt('ąbcćdeęf', 1)).toEqual('aąbcćdeę');
      expect(CaesarCipher.decrypt('zźżaąb', 1)).toEqual('yzźżaą');
    });
  });
});

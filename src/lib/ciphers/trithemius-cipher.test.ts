import { TrithemiusCipher } from './trithemius-cipher';

describe('TrithemiusCipher', () => {
  describe('Encryption', () => {
    it('should return empty string on empty message', () => {
      expect(TrithemiusCipher.encrypt('', 'a')).toEqual('');
    });

    it('should not alter one letter message when key is a', () => {
      expect(TrithemiusCipher.encrypt('a', 'a')).toEqual('a');
    });

    it('should transform to lower case', () => {
      expect(TrithemiusCipher.encrypt('A', 'A')).toEqual('a');
    });

    it('should remove non-alpha characters', () => {
      expect(TrithemiusCipher.encrypt('12345!', 'A')).toEqual('');
      expect(TrithemiusCipher.encrypt('12345!A', 'A')).toEqual('a');
    });

    it('should encrypt example message', () => {
      expect(TrithemiusCipher.encrypt('aaa', 'a')).toEqual('aąb');
      expect(TrithemiusCipher.encrypt('aaa', 'ą')).toEqual('ąbc');
      expect(TrithemiusCipher.encrypt('DOM', 'N')).toEqual('qba');
      expect(TrithemiusCipher.encrypt('123__DOM__123', 'N')).toEqual('qba');
    });

    it('should throw on invalid key', () => {
      expect(() => TrithemiusCipher.encrypt('abc', '')).toThrow();
      expect(() => TrithemiusCipher.encrypt('abc', '&')).toThrow();
      expect(() => TrithemiusCipher.encrypt('abc', 'aa')).toThrow();
    });
  });

  describe('Decryption', () => {
    it('should return empty string on empty message', () => {
      expect(TrithemiusCipher.decrypt('', 'a')).toEqual('');
    });

    it('should not alter one letter message when key is a', () => {
      expect(TrithemiusCipher.decrypt('a', 'a')).toEqual('a');
    });

    it('should transform to lower case', () => {
      expect(TrithemiusCipher.decrypt('A', 'A')).toEqual('a');
    });

    it('should remove non-alpha characters', () => {
      expect(TrithemiusCipher.decrypt('12345!', 'A')).toEqual('');
      expect(TrithemiusCipher.decrypt('12345!A', 'A')).toEqual('a');
    });

    it('should decrypt example message', () => {
      expect(TrithemiusCipher.decrypt('aąb', 'a')).toEqual('aaa');
      expect(TrithemiusCipher.decrypt('ąbc', 'ą')).toEqual('aaa');
      expect(TrithemiusCipher.decrypt('qba', 'N')).toEqual('dom');
      expect(TrithemiusCipher.decrypt('123__QBA__123', 'N')).toEqual('dom');
    });

    it('should throw on invalid key', () => {
      expect(() => TrithemiusCipher.decrypt('abc', '')).toThrow();
      expect(() => TrithemiusCipher.decrypt('abc', '&')).toThrow();
      expect(() => TrithemiusCipher.decrypt('abc', 'aa')).toThrow();
    });
  });
});

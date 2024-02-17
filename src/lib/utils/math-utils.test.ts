import { MathUtils } from './math-utils';

describe('Math utils', () => {
  describe('Modulo', () => {
    it('should return proper remainders', () => {
      expect(MathUtils.mod(0, 0)).toBeNaN();
      expect(MathUtils.mod(5, 2)).toEqual(1);
      expect(MathUtils.mod(9, 10)).toEqual(9);
      expect(MathUtils.mod(10, 10)).toEqual(0);
      expect(MathUtils.mod(11, 10)).toEqual(1);
      expect(MathUtils.mod(0, 10)).toEqual(0);
      expect(MathUtils.mod(-1, 10)).toEqual(9);
    });
  });

  describe('Prime check', () => {
    it('should check if number is prime', () => {
      expect(MathUtils.isPrime(0)).toBeFalsy();
      expect(MathUtils.isPrime(1)).toBeFalsy();
      expect(MathUtils.isPrime(2)).toBeTruthy();
      expect(MathUtils.isPrime(3)).toBeTruthy();
      expect(MathUtils.isPrime(4)).toBeFalsy();
      expect(MathUtils.isPrime(5)).toBeTruthy();
      expect(MathUtils.isPrime(6)).toBeFalsy();
    });
  });
});

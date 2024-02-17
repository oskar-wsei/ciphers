import { ArrayUtils } from './array-utils';

describe('Array utils', () => {
  describe('Count map', () => {
    it('should return array of 0 elements', () => {
      expect(ArrayUtils.countMap(0, (i) => i)).toHaveLength(0);
    });

    it('should return array of 3 kittens', () => {
      expect(ArrayUtils.countMap(3, () => 'kitten')).toEqual(['kitten', 'kitten', 'kitten']);
    });

    it('should return array of 5 multiples of 2', () => {
      expect(ArrayUtils.countMap(5, (i) => 2 * i)).toEqual([0, 2, 4, 6, 8]);
    });
  });
});

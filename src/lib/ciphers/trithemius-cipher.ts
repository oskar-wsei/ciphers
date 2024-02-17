import { AlphabetUtils, MathUtils } from '../utils';

export class TrithemiusCipher {
  public static encrypt(message: string, key: string): string {
    return this.rotate(message, key, 1);
  }

  public static decrypt(message: string, key: string): string {
    return this.rotate(message, key, -1);
  }

  private static rotate(message: string, key: string, direction: number): string {
    key = key.toLowerCase();

    let shift = AlphabetUtils.alphabet.findIndex((character) => character === key);
    if (shift === -1) throw new Error(`Invalid key: ${key}`);

    shift *= direction;

    let result = '';

    for (const character of message.toLowerCase()) {
      const index = AlphabetUtils.alphabet.indexOf(character);
      if (index === -1) continue;

      const newIndex = MathUtils.mod(index + shift, AlphabetUtils.alphabet.length);
      result += AlphabetUtils.alphabet[newIndex];

      shift += direction;
    }

    return result;
  }
}

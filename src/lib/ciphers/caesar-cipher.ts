import { AlphabetUtils, MathUtils } from '../utils';

export class CaesarCipher {
  public static encrypt(message: string, shift: number): string {
    return this.rotate(message, shift);
  }

  public static decrypt(message: string, shift: number): string {
    return this.rotate(message, -shift);
  }

  private static rotate(message: string, shift: number): string {
    let result = '';

    for (const character of message.toLowerCase()) {
      const index = AlphabetUtils.alphabet.indexOf(character);
      if (index === -1) continue;

      const newIndex = MathUtils.mod(index + shift, AlphabetUtils.alphabet.length);
      result += AlphabetUtils.alphabet[newIndex];
    }

    return result;
  }
}

import { MathUtils } from '../utils';

export class PolybiusCipher {
  public static encrypt(message: string, checkerboard: PolybiusCheckerboard): string {
    let result = [];
    let position = 1;

    for (const character of message.toLowerCase()) {
      const index = checkerboard.characters.indexOf(character);
      if (index === -1) continue;

      const row = Math.floor(index / checkerboard.width) + 1;
      const column = (index % checkerboard.width) + 1;

      if (MathUtils.isPrime(position)) {
        result.push(`${column}${row}`);
      } else {
        result.push(`${row}${column}`);
      }

      position++;
    }

    return result.join(' ');
  }

  public static decrypt(message: string, checkerboard: PolybiusCheckerboard): string {
    message = this.removeSpaces(message);

    if (message.length % 2 !== 0) throw new Error('Invalid input length');

    let result = '';
    let position = 1;

    for (let i = 0; i < message.length; i += 2) {
      const first = parseInt(message[i], 10);
      const second = parseInt(message[i + 1], 10);

      if (isNaN(first)) throw new Error(`Invalid input character: ${message[i]}`);
      if (isNaN(second)) throw new Error(`Invalid input character: ${message[i + 1]}`);

      const isPositionPrime = MathUtils.isPrime(position);

      const column = (isPositionPrime ? first : second) - 1;
      const row = (isPositionPrime ? second : first) - 1;
      const index = row * checkerboard.width + column;

      result += checkerboard.characters[index];
      position++;
    }

    return result;
  }

  private static removeSpaces(message: string): string {
    return message.replace(/\s/g, '');
  }
}

export class PolybiusCheckerboard {
  public characters: string[] = [];

  public constructor(public width: number, public height: number) {
    this.characters = new Array(width * height).map((_element) => '');
  }
}

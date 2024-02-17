export class MathUtils {
  public static mod = (n: number, m: number): number => ((n % m) + m) % m;

  public static isPrime(number: number): boolean {
    if (number <= 1) return false;

    for (let i = 2; i <= Math.sqrt(number); i++) {
      if (number % i === 0) return false;
    }

    return true;
  }
}

export class Random {
  public static number(min: number, max: number) {
    const number =
      Math.round(Math.random() * (max + 1 - min) + (min - 0.5)) * 1;
    return number + 0;
  }

  public static id(ciphers = 8) {
    return Random.number(10 ** (ciphers - 1), 10 ** ciphers);
  }
}

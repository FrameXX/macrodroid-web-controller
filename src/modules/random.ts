export class Random {
  /**
   * Generates a random number between the specified minimum and maximum values (inclusive).
   *
   * @param {number} min - The minimum value of the range.
   * @param {number} max - The maximum value of the range.
   * @return {number} The randomly generated number.
   */
  public static number(min: number, max: number) {
    const number =
      Math.round(Math.random() * (max + 1 - min) + (min - 0.5)) * 1;
    return number + 0;
  }

  /**
   * Generates a random ID using the specified number of ciphers.
   *
   * @param {number} [ciphers=8] - The number of ciphers to use. Defaults to 8.
   * @return {number} The randomly generated ID.
   */
  public static id(ciphers = 8) {
    return Random.number(10 ** (ciphers - 1), 10 ** ciphers);
  }

  /**
   * Generates a random readable ID consisting of alternating consonants and vowels.
   *
   * @param {number} [chars=8] - The number of characters in the ID.
   * @return {string} The randomly generated readable ID.
   */
  public static readableId(chars: number = 8) {
    const consonants = [
      "b",
      "c",
      "d",
      "f",
      "g",
      "h",
      "j",
      "k",
      "l",
      "m",
      "n",
      "p",
      "q",
      "r",
      "s",
      "t",
      "v",
      "w",
      "x",
      "z",
    ];
    const vowels = ["a", "e", "i", "o", "u", "y"];
    let firstConsonant = Boolean(Random.number(0, 1));
    let id = "";
    for (let i = 0; i < chars; i++) {
      if (firstConsonant) {
        id = id + consonants[Random.number(0, consonants.length - 1)];
      } else {
        id = id + vowels[Random.number(0, vowels.length - 1)];
      }
      firstConsonant = !firstConsonant;
    }
    return id;
  }
}

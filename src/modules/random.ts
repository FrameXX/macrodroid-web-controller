export class Random {
  public static number(min: number, max: number) {
    const number =
      Math.round(Math.random() * (max + 1 - min) + (min - 0.5)) * 1;
    return number + 0;
  }

  public static id(ciphers = 8) {
    return Random.number(10 ** (ciphers - 1), 10 ** ciphers);
  }

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
    let useConsonant = Boolean(Random.number(0, 1));
    let id = "";
    for (let i = 0; i < chars; i++) {
      if (useConsonant) {
        id = id + consonants[Random.number(0, consonants.length - 1)];
      } else {
        id = id + vowels[Random.number(0, vowels.length - 1)];
      }
      useConsonant = !useConsonant;
    }
    return id;
  }
}

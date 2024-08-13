export function useRandomNumber(generator: () => number) {
  const id = generator();
  return id;
}

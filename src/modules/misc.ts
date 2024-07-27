export function moveElement(arr: Array<any>, a: number, b: number) {
  if (a < 0 || a >= arr.length || b < 0 || b > arr.length) {
    throw new RangeError("Invalid indices");
  }

  const value = arr[a];

  arr.splice(a, 1);
  arr.splice(b, 0, value);

  return arr;
}

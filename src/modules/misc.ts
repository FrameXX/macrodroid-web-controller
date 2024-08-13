export function moveElement(
  arr: Array<unknown>,
  originIndex: number,
  targetIndex: number,
) {
  if (originIndex === targetIndex)
    throw TypeError("Origin index cannot be the same as target index.");

  originIndex =
    originIndex >= 0
      ? originIndex % arr.length
      : Math.abs(arr.length + originIndex);
  targetIndex =
    targetIndex >= 0
      ? targetIndex % arr.length
      : Math.abs(arr.length + targetIndex);

  const value = arr[originIndex];

  arr.splice(originIndex, 1);
  arr.splice(targetIndex, 0, value);

  return arr;
}

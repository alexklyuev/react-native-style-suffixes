export const difference = <T>(variant: Set<T>, base: Set<T>): Set<T> => {
  const result = new Set<T>();
  variant.forEach((item) => {
    if (!base.has(item)) {
      result.add(item);
    }
  });
  return result;
};

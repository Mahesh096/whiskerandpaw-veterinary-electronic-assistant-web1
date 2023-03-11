const uniqByProp = (prop) => (arr) => {
  const result =
    arr &&
    Array.from(
      arr
        ?.reduce(
          (acc, item) => (item && item[prop] && acc.set(item[prop], item), acc), // using map (preserves ordering)
          new Map(),
        )
        ?.values(),
    );

  return Array?.isArray(result) && result.length ? result : arr;
};

export default uniqByProp;

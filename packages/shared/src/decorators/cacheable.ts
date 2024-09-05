const cacheStorage = new Map<string, any>();

export function CacheableAsync() {
  return function (
    target: object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<any>>,
  ) {
    const { value: originalValue } = descriptor;

    if (!originalValue) {
      throw new Error('Descriptor value must be set');
    }

    descriptor.value = async function (this: typeof target, ...args: any[]) {
      const cacheKey = getCacheKey(target, methodName, args);

      if (cacheStorage.has(cacheKey)) {
        return cacheStorage.get(cacheKey);
      }

      const value = await originalValue.apply(this, args);

      if (value) {
        cacheStorage.set(cacheKey, value);
      }

      return value;
    };
  };
}

const getCacheKey = (target: object, methodName: string, args: any[]) => {
  return `${target.constructor.name}:${methodName}:${serializeArguments(args)}`;
};

const serializeArguments = (args: any[]) => {
  return args.map((arg: any) => arg.toString()).join(':');
};

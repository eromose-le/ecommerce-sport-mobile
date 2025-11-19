export function isObject(item: any) {
  // return Object.prototype.toString.call(o) === '[object Object]';
  return item && typeof item === "object" && !Array.isArray(item);
}

export const isEmpty = (obj: any) => Object.keys(obj).length === 0;

export function isPlainObject(o: any) {
  if (isObject(o) === false) return false;

  // If has modified constructor
  const ctor = o.constructor;
  if (ctor === undefined) return true;

  // If has modified prototype
  const prot = ctor.prototype;
  if (isObject(prot) === false) return false;

  // If constructor does not have an Object-specific method
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }

  // Most likely a plain Object
  return true;
}

export function deepMerge(target: any, source: any) {
  if (Array.isArray(target) && Array.isArray(source)) {
    const newTarget = [...target];
    for (const key in source) {
      if (typeof source[key] === "object") {
        newTarget[key] = deepMerge(newTarget[key] || {}, source[key]);
      } else {
        newTarget[key] = source[key] || newTarget[key];
      }
    }
  } else if (isObject(target) && isObject(source)) {
    const newTarget = { ...target };
    for (const key in source) {
      if (isObject(source[key])) {
        newTarget[key] = deepMerge(newTarget[key] || {}, source[key]);
      } else {
        newTarget[key] = source[key] || newTarget[key];
      }
    }
    return newTarget;
  }
  return undefined;
}

/**
 * Deep merge two objects.
 * @template {object} T
 * @param {T} target
 * @param {any[]} ...sources
 */
export function mergeDeep(target: any, ...sources: any) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (
    (isObject(target) && isObject(source)) ||
    (Array.isArray(target) && Array.isArray(source))
  ) {
    for (const key in source) {
      if (isObject(target[key]) && isObject(source[key])) {
        // if (!target[key]) {
        //   target[key] = {};
        // }
        target[key] = mergeDeep(target[key], source[key]);
      } else if (Array.isArray(target[key]) && Array.isArray(source[key])) {
        // if (!target[key]) {
        //   target[key] = [];
        // }
        target[key] = mergeDeep(target[key], source[key]);
      } else {
        target[key] = source[key];
      }
    }
  }

  return mergeDeep(target, ...sources);
}

function is(x: any, y: any) {
  if (x === y) {
    return x !== 0 || y !== 0 || 1 / x === 1 / y;
  } else {
    return x !== x && y !== y;
  }
}

export function shallowEqual(objA: any, objB: any) {
  if (is(objA, objB)) return true;

  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  ) {
    return false;
  }

  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) return false;

  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !is(objA[keysA[i]], objB[keysA[i]])
    ) {
      return false;
    }
  }

  return true;
}

/**
 * @template {{}} T
 * @param {T} obj
 * @param {string} desc
 */
export function objectAccessor(obj: any, desc: any) {
  const arr = desc ? desc.split(".") : [];
  let result = obj;
  while (arr.length && (result = result?.[arr.shift()]));
  return result;
}

/**
 * @template {{}} T
 * @param {T} values
 * @param {{allowEmptyArray: boolean}} options
 * @returns
 */
export function removeEmptyProperties(
  values: any,
  options = {} as { allowEmptyArray: boolean }
) {
  const { allowEmptyArray } = options;
  const newTarget = Array.isArray(values) ? [] : isObject(values) ? {} : values;

  if (typeof newTarget === "object") {
    for (const key in values) {
      const value = values[key];
      if (
        (Array.isArray(value) && (allowEmptyArray || value.length)) ||
        (isObject(value) && Object.entries(value).length !== 0)
      ) {
        newTarget[key] =
          value instanceof File ? value : removeEmptyProperties(value);
      } else if (
        value !== undefined &&
        value !== null &&
        value !== "" &&
        !Array.isArray(value) &&
        !isObject(value)
      ) {
        newTarget[key] = removeEmptyProperties(value);
      }
    }
  }
  return newTarget;
}

/**
 *
 * @param {*} data
 * @returns
 */
export function objectToFormData(data: any) {
  const fd = new FormData();
  for (const key in data) {
    if (Array.isArray(data[key])) {
      for (const arrData of data[key]) {
        fd.append(key, arrData);
      }
    } else {
      fd.set(key, data[key]);
    }
  }
  return fd;
}

/**
 * @template T
 * @param {T[]} array
 * @param {{getKey: (item: T) => string; getValue: <R>(item: T) => R}} options
 * @returns {{[x: string]: any}}
 */
export function normalizeArray<T, R = T>( // R defaults to T if not explicitly provided
  array: T[],
  options?: {
    // Use '?' to make options optional
    getKey?: (item: T) => string;
    getValue?: (item: T) => R;
  }
): Record<string, R> {
  // Specify the return type as a Record (string keys, R values)
  // Destructure options with explicit type annotations for default functions
  const getKey: (item: T) => string =
    options?.getKey || ((item: T) => (item as any).id as string); // Added 'as string' for safety
  const getValue: (item: T) => R =
    options?.getValue || ((item: T) => item as unknown as R); // Cast 'item' to 'R' for the default

  // Handle cases where array might be null or undefined defensively
  if (!array) {
    return {};
  }

  // Explicitly type the accumulator 'acc' and the initial value '{}'
  return array.reduce(
    (acc: Record<string, R>, curr: T) => {
      acc[getKey(curr)] = getValue(curr);
      return acc;
    },
    {} as Record<string, R>
  ); // Assert the initial empty object as Record<string, R>
}

/**
 * Remove items from objects
 * @param {Object} obj
 * @param {string[]} keys
 * @returns
 */
export function removeKeys(obj: any, keys: any) {
  keys.forEach((key: any) => {
    if (obj.hasOwnProperty(key)) {
      delete obj[key];
    }
  });
  return obj;
}

/**
 *
 * @param {any} obj
 * @returns
 */
export function stripUndefined(obj: any) {
  if (!isPlainObject(obj)) {
    return obj;
  }
  const copy = { ...obj };
  for (const [k, v] of Object.entries(copy)) {
    if (v === undefined) delete copy[k];
  }
  return copy;
}

/**
 *
 * @param {any} obj
 */
export function isJsonifiable(obj: any) {
  return (
    typeof obj === "object" &&
    (isPlainObject(obj) ||
      Array.isArray(obj) ||
      typeof obj.toJSON === "function")
  );
}

export function shuffle<T>(array: T[]) {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export function objectToArray(obj: object | null | undefined): any[] {
  return obj ? Object.entries(obj) : [];
}

export function getKeyValue(obj: { [key: string]: string }) {
  const entries = Object.entries(obj);

  if (entries.length === 0) return null;

  const [key, value] = entries[0];
  return { key, value };
}

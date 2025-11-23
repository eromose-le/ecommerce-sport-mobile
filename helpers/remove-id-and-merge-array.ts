export const removeIdAndMergeArraysOld = (...arrays: Array<any[]>): Array<any> => {
  // Flatten all arrays, remove the 'id' property from each object, and return a new array
  return arrays
    .flat() // Flatten the arrays into a single array
    .map(({ id, ...rest }) => rest); // Remove the 'id' and keep the rest of the properties
};

export const removeIdAndMergeArrays = (...arrays: Array<any[]>): Array<any> => {
  // Flatten all arrays, remove the 'id' property from each object, and return a new array
  return arrays
    .flat() // Flatten the arrays into a single array
    .map((obj) => {
      // Check if the 'id' exists before destructuring
      if (obj && obj.id !== undefined) {
        const { id, ...rest } = obj; // Destructure only if 'id' exists
        return rest; // Return the object without the 'id' property
      }
      return obj; // If 'id' doesn't exist, return the object as it is
    });
};

export const mergeArrays = (...arrays: Array<any[]>): Array<any> => {
  // Flatten all arrays, remove the 'id' property from each object, and return a new array
  return arrays
    .flat() // Flatten the arrays into a single array
    .map((obj) => {
      // Check if the 'id' exists before destructuring
      if (obj && obj.id !== undefined) {
        const { ...rest } = obj; // Destructure only if 'id' exists
        return rest; // Return the object without the 'id' property
      }
      return obj; // If 'id' doesn't exist, return the object as it is
    });
};

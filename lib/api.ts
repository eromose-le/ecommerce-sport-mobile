export async function fetchProducts() {
  return new Promise((resolve) => {
    setTimeout(() => resolve(require("./dummy-data").default), 600);
  });
}

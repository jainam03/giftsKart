const ORDERS_KEY = 'giftskart_orders';
const SAVED_KEY = 'giftskart_saved_products';

export function getOrders() {
  try {
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

export function saveOrder(order) {
  const orders = getOrders();
  orders.unshift(order);
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getSavedProducts() {
  try {
    const stored = localStorage.getItem(SAVED_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch { return []; }
}

export function toggleSavedProduct(productId) {
  const saved = getSavedProducts();
  const idx = saved.indexOf(productId);
  if (idx > -1) {
    saved.splice(idx, 1);
  } else {
    saved.push(productId);
  }
  localStorage.setItem(SAVED_KEY, JSON.stringify(saved));
  return saved;
}

export function isProductSaved(productId) {
  return getSavedProducts().includes(productId);
}

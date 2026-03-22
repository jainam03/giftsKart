/**
 * Calculate the discounted price per unit based on quantity tiers.
 * 25–49 units: listed price
 * 50–99 units: 10% off
 * 100+ units: 20% off
 */
export function calculateUnitPrice(basePricePerUnit, quantity) {
  if (quantity >= 100) return basePricePerUnit * 0.8;
  if (quantity >= 50) return basePricePerUnit * 0.9;
  return basePricePerUnit;
}

export function getDiscount(quantity) {
  if (quantity >= 100) return 20;
  if (quantity >= 50) return 10;
  return 0;
}

export function calculateTotalPrice(basePricePerUnit, quantity) {
  return calculateUnitPrice(basePricePerUnit, quantity) * quantity;
}

export function formatPrice(amount) {
  return '₹' + Math.round(amount).toLocaleString('en-IN');
}

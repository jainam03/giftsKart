/**
 * Generate an order ID in format GK-YYYYMMDD-XXXX
 */
export function generateOrderId() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  const rand = String(Math.floor(1000 + Math.random() * 9000));
  return `GK-${y}${m}${d}-${rand}`;
}

/**
 * Get the minimum allowed delivery date (7 days from today)
 */
export function getMinDeliveryDate() {
  const date = new Date();
  date.setDate(date.getDate() + 7);
  return date.toISOString().split('T')[0];
}

/**
 * Validate that a delivery date is at least 7 days from now
 */
export function isValidDeliveryDate(dateStr) {
  if (!dateStr) return false;
  const min = new Date();
  min.setDate(min.getDate() + 7);
  min.setHours(0, 0, 0, 0);
  const selected = new Date(dateStr);
  return selected >= min;
}

/**
 * Format a date string to readable format
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export const ORDER_STATUSES = ['Received', 'Processing', 'Dispatched', 'Delivered'];

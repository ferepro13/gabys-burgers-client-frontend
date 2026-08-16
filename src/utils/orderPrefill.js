export const PREFILL_STORAGE_KEY = 'gabys-prefill-order'
export const PREFILL_EVENT = 'gabys:prefill-order'

/**
 * Dispatches a product id to be added as a new order line.
 * @param {string} productId
 */
export function requestOrderPrefill(productId) {
  if (!productId) return
  sessionStorage.setItem(PREFILL_STORAGE_KEY, productId)
  window.dispatchEvent(
    new CustomEvent(PREFILL_EVENT, { detail: { productId } }),
  )
}

export function readPrefillProductId() {
  const productId = sessionStorage.getItem(PREFILL_STORAGE_KEY)
  if (productId) sessionStorage.removeItem(PREFILL_STORAGE_KEY)
  return productId
}

export function createEmptyOrderLine() {
  return { productId: '', quantity: 1 }
}

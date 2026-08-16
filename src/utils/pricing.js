//import { orderCatalog } from '../data/menu'
//import { extrasCatalog } from '../data/menu';


export function getProductById(productId, orderCatalog = []) {
  if (!productId) return null
  return orderCatalog.find((item) => item.uuid === productId) ?? null
}

/**
 * Formats a USD-style price. Null/undefined → "A cotizar".
 * @param {number | null | undefined} amount
 */
export function formatMoney(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return 'A cotizar'
  return new Intl.NumberFormat('es-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function getUnitPrice(productId, orderCatalog = []) {
  const product = getProductById(productId, orderCatalog)
  if (!product) return null
  return product.price
}

/*export function calcLineTotal(productId, quantity) {
  const unit = getUnitPrice(productId)
  if (unit == null) return null
  const qty = Number(quantity)
  if (!Number.isFinite(qty) || qty <= 0) return null
  return unit * qty
}*/

export function calcLineTotal(productId, quantity, extras = [], extrasCatalog = [], orderCatalog = []) {
  if (!productId || !quantity) return 0;

  const unit = getUnitPrice(productId, orderCatalog)
  if (unit == null) return null

  // Suma de precios de los extras seleccionados
  const extrasTotalPrice = extras.reduce((sum, extra) => {
    const extraData = extrasCatalog.find((e) => e.uuid === extra.extraId);
    return sum + (extraData?.price || 0);
  }, 0);

  // Precio unitario = precio del producto + suma de precios de extras
  const unitPrice = (unit || 0) + extrasTotalPrice;

  return unitPrice * Number(quantity);
}

/**
 * @param {{ productId: string, quantity: number|string }[]} items
 */
export function calcOrderTotal(items) {
  let total = 0
  let hasPriced = false
  let hasUnpriced = false

  for (const item of items) {
    if (!item?.productId) continue
    const line = calcLineTotal(item.productId, item.quantity, item.extras)
    if (line == null) {
      hasUnpriced = true
      continue
    }
    hasPriced = true
    total += line
  }

  if (!hasPriced && hasUnpriced) return null
  if (!hasPriced) return 0
  return total
}

/**
 * Enrich form lines with product metadata for messaging / UI.
 * @param {{ productId: string, quantity: number|string }[]} items
 * @param {Array} orderCatalog
 */
export function enrichOrderItems(items, extrasCatalog = [], orderCatalog = []) {
  return items
    .filter((item) => item?.productId)
    .map((item) => {
      const product = getProductById(item.productId, orderCatalog)
      const quantity = Number(item.quantity) || 1
      const extras = item?.extras || []
      const lineTotal = calcLineTotal(item.productId, quantity, extras, extrasCatalog || [], orderCatalog || [])
      const unitPrice = lineTotal/quantity ?? product?.price ?? null

      return {
        productId: item.productId,
        name: product?.name ?? item.productId,
        quantity,
        extras,
        unitPrice,
        lineTotal,
      }
    })
}

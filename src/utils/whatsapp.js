import { siteConfig } from '../config/site'
import { enrichOrderItems, formatMoney, calcOrderTotal } from './pricing'

/**
 * Builds a prefilled WhatsApp order message and opens wa.me in a new tab.
 * @param {{
 *   name: string,
 *   phone: string,
 *   location: string,
 *   time: string,
 *   notes?: string,
 *   items: { productId: string, quantity: number|string }[]
 * }} data
 */
export function openWhatsAppOrder(data, extrasData, productsData) {
  const {
    name,
    phone,
    location,
    time,
    date,
    notes = '',
    items = [],
  } = data

  const enriched = enrichOrderItems(items, extrasData, productsData)
  const orderTotal = calcOrderTotal(enriched, extrasData, productsData)
  const businessPhone = siteConfig.whatsapp.phone

  const lines = [
    `¡Hola, Gaby's Burgers! 🍔`,
    ``,
    `Quiero hacer un pedido a domicilio:`,
    ``,
    `👤 Nombre: ${name}`,
    `📱 Teléfono: ${phone}`,
    `📍 Dirección / zona: ${location}`,
    `🕐 Fecha deseada: ${date}`,
    `🕐 Hora deseada: ${time}`,
    ``,
    `🛒 Detalle del pedido:`,
  ]

  enriched.forEach((item, index) => {
    const unitLabel = formatMoney(item.unitPrice)
    const lineLabel = formatMoney(item.lineTotal)
    const extrasList = !item?.extras.length ? "" : item?.extras.reduce((current, extra) => {
      //console.log(extrasData)
      const extraData = extrasData?.find((e) => e.uuid === extra.extraId);
      return current + ` ${extraData.name},`
    }, ` con agrego de: `) 

    lines.push(
      `${index + 1}. *${item.name}${extrasList}* x ${item.quantity}`,
      `   Precio unitario: ${unitLabel}`,
      `   Subtotal: ${lineLabel}`,
    )
  })

  lines.push(``, `💰 *Total estimado: ${formatMoney(orderTotal)}*`)

  if (orderTotal == null) {
    lines.push(`(Algunos ítems quedan sujetos a cotización.)`)
  }

  if (notes.trim()) {
    lines.push(``, `📝 Notas: ${notes.trim()}`)
  }

  lines.push(``, `¡Gracias! Quedo atento/a a su confirmación.`)

  const message = lines.join('\n')
  const url = `https://wa.me/${businessPhone}?text=${encodeURIComponent(message)}`

  window.open(url, '_blank', 'noopener,noreferrer')
}

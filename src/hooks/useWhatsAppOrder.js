import { useCallback } from 'react'
import { openWhatsAppOrder } from '../utils/whatsapp'

/**
 * Hook that exposes a stable submit handler for WhatsApp order forms.
 */
export function useWhatsAppOrder() {
  const sendOrder = useCallback((formData, extrasData, productsData, deliveryData) => {
    openWhatsAppOrder(formData, extrasData, productsData, deliveryData)
  }, [])

  return { sendOrder }
}

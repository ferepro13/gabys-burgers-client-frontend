import { useEffect } from 'react'

/**
 * Locks body scroll while `locked` is true (e.g. open mobile menu).
 * @param {boolean} locked
 */
export function useBodyScrollLock(locked) {
  useEffect(() => {
    if (!locked) return undefined

    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previous
    }
  }, [locked])
}

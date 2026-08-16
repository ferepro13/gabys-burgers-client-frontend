import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { siteConfig } from '../../config/site'
import { useBodyScrollLock } from '../../hooks/useBodyScrollLock'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'

export function Header() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuId = useId()
  const panelRef = useRef(null)
  const buttonRef = useRef(null)

  useBodyScrollLock(open)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!open) return undefined

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false)
    }

    const onPointerDown = (event) => {
      const target = event.target
      if (
        panelRef.current?.contains(target) ||
        buttonRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  const closeAndNavigate = () => setOpen(false)

  const handleMobileNavClick = (e, href) => {
    e.preventDefault();               // Evita la navegación automática
    setOpen(false);                   // Cierra el menú

    // Espera un tick para que el cierre se procese y luego hace scroll
    requestAnimationFrame(() => {
      const targetId = href.replace('#', '');
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    });
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? 'border-b border-gold/15 bg-ink/90 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <Container className="flex h-16 items-center justify-between sm:h-18">
        <a
          href="#inicio"
          className="group flex items-center gap-2"
          onClick={closeAndNavigate}
        >
          <span
            aria-hidden="true"
            className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 bg-ink-elevated text-sm"
          >
            🍔
          </span>
          <span className="font-display text-lg tracking-wide text-gold transition group-hover:text-gold-light sm:text-xl">
            {siteConfig.name}
          </span>
        </a>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Principal">
          <ul className="flex items-center gap-6">
            {siteConfig.nav.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-cream/75 transition hover:text-gold"
                  onClick={(e) => handleMobileNavClick(e, item.href)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          
          <Button href="#pedido" size="sm">
            {siteConfig.cta.primary}
          </Button>
        </nav>

        <button
          ref={buttonRef}
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-gold/30 text-cream md:hidden"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setOpen((value) => !value)}
        >
          <span className="sr-only">{open ? 'Cerrar' : 'Menú'}</span>
          <span className="relative block h-3.5 w-5" aria-hidden="true">
            <span
              className={`absolute left-0 h-0.5 w-full bg-current transition ${
                open ? 'top-1.5 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 h-0.5 w-full bg-current transition ${
                open ? 'opacity-0' : 'opacity-100'
              }`}
            />
            <span
              className={`absolute left-0 h-0.5 w-full bg-current transition ${
                open ? 'top-1.5 -rotate-45' : 'top-3'
              }`}
            />
          </span>
        </button>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            id={menuId}
            ref={panelRef}
            className="border-t border-gold/15 bg-ink/95 md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            <nav aria-label="Móvil" className="px-5 py-5">
              <ul className="flex flex-col gap-1">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="block rounded-md px-3 py-3 text-cream/90 transition hover:bg-gold/10 hover:text-gold"
                      onClick={(e) => handleMobileNavClick(e, item.href)}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
              <Button
                href="#pedido"
                className="mt-4 w-full"
                onClick={(e) => handleMobileNavClick(e, '#pedido')}
              >
                {siteConfig.cta.primary}
              </Button>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}

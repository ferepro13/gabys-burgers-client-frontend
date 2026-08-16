import { motion } from 'framer-motion'
import { siteConfig } from '../../config/site'
import { useParallax } from '../../hooks/useParallax'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=1920&q=80'

export function Hero() {
  const offset = useParallax(0.22)

  return (
    <section
      id="inicio"
      className="relative min-h-svh overflow-hidden"
      aria-labelledby="hero-brand"
    >
      <div
        className="absolute inset-0 scale-110"
        style={{ transform: `translate3d(0, ${offset * 0.45}px, 0)` }}
        aria-hidden="true"
      >
        <img
          src={HERO_IMAGE}
          alt=""
          className="h-full w-full object-cover"
          fetchPriority="high"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/50" />
      </div>

      <Container className="relative flex min-h-svh flex-col justify-end pb-20 pt-28 sm:justify-center sm:pb-24">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-3 font-display text-sm tracking-[0.28em] text-gold uppercase">
            Experiencias con sabor
          </p>
          <h1
            id="hero-brand"
            className="font-display text-5xl leading-[0.95] text-gold sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {siteConfig.name}
          </h1>
          <p className="mt-5 max-w-lg text-lg text-cream/80 sm:text-xl">
            {siteConfig.tagline}. Ingredientes frescos, pan cuco y el toque que
            enamora.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Button href="#pedido" size="lg">
              {siteConfig.cta.primary}
            </Button>
            <Button href="#menu" variant="secondary" size="lg">
              {siteConfig.cta.secondary}
            </Button>
          </div>
        </motion.div>
      </Container>

      <motion.div
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
        aria-hidden="true"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
      >
        <span className="block h-8 w-px bg-gradient-to-b from-gold to-transparent" />
      </motion.div>
    </section>
  )
}

import { siteConfig } from '../../config/site'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { FadeUp } from '../ui/FadeUp'

export function Promo() {
  return (
    <section
      className="relative overflow-hidden py-20 sm:py-24"
      aria-labelledby="promo-title"
    >
      <div
        className="absolute inset-0"
        aria-hidden="true"
      >
        <img
          src="https://images.unsplash.com/photo-1571091718767-18b5b1457add?auto=format&fit=crop&w=1800&q=80"
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-ink/85" />
        <div className="absolute inset-0 bg-linear-to-r from-gold/15 via-transparent to-flame/10" />
      </div>

      <Container className="relative">
        <FadeUp className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm tracking-[0.24em] text-gold uppercase">
            Esta semana
          </p>
          <h2
            id="promo-title"
            className="mt-3 font-display text-3xl text-cream sm:text-5xl"
          >
            No te pierdas la promoción de la semana
          </h2>
          <p className="mt-4 text-base text-cream/70 sm:text-lg">
            {siteConfig.promotion} Pide ahora por mensaje directo y
            te confirmamos al instante.
          </p>
          <div className="mt-8 flex justify-center">
            <Button href="#pedido" size="lg">
              {siteConfig.cta.primary}
            </Button>
          </div>
        </FadeUp>
      </Container>
    </section>
  )
}

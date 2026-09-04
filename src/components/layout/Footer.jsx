import { siteConfig } from '../../config/site'
import { Container } from '../ui/Container'

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-gold/15 bg-ink-deep py-12">
      <Container className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-2xl text-gold">{siteConfig.name}</p>
          <p className="mt-1 text-sm text-cream/60">{siteConfig.slogan}</p>
          <p className="mt-4 text-sm text-cream/55">
            {siteConfig.social.whatsappLabel}:{' '}
            <a
              href={`https://wa.me/${siteConfig.whatsapp.phone}`}
              className="text-gold transition hover:text-gold-light"
              target="_blank"
              rel="noopener noreferrer"
            >
              {siteConfig.whatsapp.display}
            </a>
          </p>
          <p className="mt-2 text-sm text-cream/55">
            Aceptamos {siteConfig.payments.join(', ')}.
          </p>
          <p className='mt-6 text-sm text-cream/55'>
            Contacto del desarrollador: <a
              href={`https://wa.me/5356661510`}
              className="text-gold transition hover:text-gold-light"
              target="_blank"
              rel="noopener noreferrer"
            >
              +53 5666-1510
            </a>
          </p>
        </div>

        <div className="text-sm text-cream/45">
          <p>© {year} {siteConfig.name}. Todos los derechos reservados.</p>
        </div>
      </Container>
    </footer>
  )
}

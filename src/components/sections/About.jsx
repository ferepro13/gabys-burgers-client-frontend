import { FadeUp } from '../ui/FadeUp'
import { SectionHeading } from '../ui/SectionHeading'
import { Container } from '../ui/Container'
import brandPoster from '../../assets/brand-poster.png'

export function About() {
  return (
    <section
      id="nosotros"
      className="relative overflow-hidden py-20 sm:py-28"
      aria-labelledby="about-title"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 20%, #c9a227 0.6px, transparent 0.7px)',
          backgroundSize: '28px 28px',
        }}
        aria-hidden="true"
      />

      <Container className="relative grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <FadeUp>
          <SectionHeading
            id="about-title"
            align="left"
            eyebrow="Quiénes somos"
            title="No solo hamburguesas: creamos experiencias"
            description="En Gaby's Burgers usamos ingredientes frescos, pan esponjoso y una dosis extra de cariño. Desde las clásicas irresistibles hasta creaciones únicas que despiertan tus sentidos."
          />
          <p className="mt-6 max-w-xl text-cream/65">
            Cada bocado lleva el toque secreto Gaby: una receta especial pensada
            para hacerte volver. Pide por WhatsApp y disfrutá el sabor que
            enamora, donde estés.
          </p>
        </FadeUp>

        <FadeUp delay={0.12} className="relative">
          <div className="overflow-hidden rounded-2xl border border-gold/20 shadow-[0_30px_80px_-40px_rgba(201,162,39,0.45)]">
            <img
              src={brandPoster}
              alt="Gaby's Burgers — sabor que enamora, encargos por WhatsApp y pago con Zelle"
              className="h-full w-full object-cover"
              loading="lazy"
            />
          </div>
        </FadeUp>
      </Container>
    </section>
  )
}

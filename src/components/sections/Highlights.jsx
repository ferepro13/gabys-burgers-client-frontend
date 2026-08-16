import { highlights } from '../../data/menu'
import { Container } from '../ui/Container'
import { FadeUp } from '../ui/FadeUp'
import { FloatingCard } from '../ui/FloatingCard'
import { SectionHeading } from '../ui/SectionHeading'
import { TiltCard } from '../ui/TiltCard'

export function Highlights() {
  return (
    <section
      className="border-y border-gold/10 bg-ink-deep py-20 sm:py-24"
      aria-labelledby="highlights-title"
    >
      <Container>
        <FadeUp>
          <SectionHeading
            id="highlights-title"
            eyebrow="¿Qué encontrarás?"
            title="El sabor que vuelve a pedirse"
            description="Calidad, variedad y el secreto de la casa en cada preparación."
          />
        </FadeUp>

        <ul className="mt-14 grid gap-6 md:grid-cols-3">
          {highlights.map((item, index) => (
            <li key={item.id || item.uuid}>
              <FadeUp delay={index * 0.08}>
                <TiltCard>
                  <FloatingCard className="h-full p-6 sm:p-7" float={index === 1}>
                    <p className="font-display text-sm tracking-[0.2em] text-gold/80 uppercase">
                      0{index + 1}
                    </p>
                    <h3 className="mt-4 font-display text-2xl text-cream">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-cream/65 sm:text-base">
                      {item.description}
                    </p>
                  </FloatingCard>
                </TiltCard>
              </FadeUp>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}

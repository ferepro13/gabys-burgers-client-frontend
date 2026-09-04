import { siteConfig } from '../../config/site'
import { formatMoney } from '../../utils/pricing'
import { requestOrderPrefill } from '../../utils/orderPrefill'
import { Container } from '../ui/Container'
import { FadeUp } from '../ui/FadeUp'
import { FloatingCard } from '../ui/FloatingCard'
import { SectionHeading } from '../ui/SectionHeading'
import { TiltCard } from '../ui/TiltCard'
import { Button } from '../ui/Button'
import { useProducts } from '../../hooks/useProducts'
import { LoadingState } from "../ui/LoadingState"
import { EmptyState } from "../ui/EmptyState"

export function Menu() {
  const { categorizedData: productsCategoriesData, isLoading: productsLoading, isError: productsError, refetch } = useProducts();

  if (productsError) {
    console.error("Error al cargar los productos:", productsError);
  }

  return (
    <section
      id="menu"
      className="py-20 sm:py-28"
      aria-labelledby="menu-title"
    >
      <Container>
        <FadeUp>
          <SectionHeading
            id="menu-title"
            eyebrow="Menú"
            title="Creaciones que despiertan los sentidos"
            description="Clásicas irresistibles, innovadoras y sorpresas semanales. Elige tu favorita y pide por WhatsApp."
          />
        </FadeUp>

        {!productsCategoriesData?.length && !productsLoading && !productsError && <EmptyState title={"No hay productos que mostrar..."} description={"Compruebe su conexión a internet"} action={refetch} actionName={"Reintentar"} ActionRenderer = {Button}/>}
        {productsLoading && <LoadingState label={"Cargando productos..."}/>}
        {productsError && <EmptyState title={"Ocurrió un error al cargar los productos"} description={"Compruebe su conexión a internet"} action={refetch} actionName={"Reintentar"} ActionRenderer={Button}/>}

        <div className='mt-4 flex flex-col'>
          {productsCategoriesData?.map((category, i) => (
            <div key={i}>
              <h2 className='mt-7 font-display text-2xl'></h2>
              <ul className="mt-10 grid gap-5 sm:grid-cols-2" >
                {category?.map((item, index) => (
                  <li key={item.uuid}>
                    <FadeUp delay={index * 0.06}>
                      <TiltCard maxTilt={6}>
                        <FloatingCard
                          className="overflow-hidden"
                          float={index % 2 === 0}
                        >
                          <article className="grid sm:grid-cols-[1.05fr_1fr]">
                            <div className="relative min-h-48 overflow-hidden sm:min-h-full">
                              <img
                                src={item.image ?? item.imageUrl}
                                alt={item.name}
                                className="h-full w-full object-cover"
                                loading="lazy"
                              />
                              {item?.tag && 
                              (<span className="absolute top-3 left-3 rounded-md border border-gold/40 bg-ink/80 px-2.5 py-1 text-xs tracking-wide text-gold backdrop-blur-sm">
                                {item.tag}
                              </span>)}
                            </div>
                            <div className="flex flex-col justify-between gap-3 p-5 sm:p-6">
                              <div>
                                <h3 className="font-display text-2xl text-cream">
                                  {item.name}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-cream/65">
                                  {item.description}
                                </p>
                              </div>
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-sm font-medium text-gold">
                                  {formatMoney(item.price)}
                                </p>
                                <Button
                                  href="#pedido"
                                  size="sm"
                                  variant="secondary"
                                  onClick={() => requestOrderPrefill(item.uuid)}
                                  disabled={!item.stock /* || !item.isAvailable */ } 
                                >
                                  {siteConfig.cta.primary}
                                </Button>
                              </div>
                              <div className="flex items-center">
                                <p className={`mt-0 text-sm leading-relaxed ${(item.stock || item.isAvailable) ? "text-cream/65" : "text-flame"}`}>
                                <i> {item.stock ? `Disponibles: ${item.stock} unidades` : "No disponible por ahora"}</i></p>
                              </div>
                            </div>
                          </article>
                        </FloatingCard>
                      </TiltCard>
                    </FadeUp>
                  </li>
                ))}
              </ul> 
            </div>
          ))}
        </div>


        
      </Container>
    </section>
  )
}

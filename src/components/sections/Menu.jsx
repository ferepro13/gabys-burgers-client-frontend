//import { menuItems } from '../../data/menu'
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

/**
 * 
 * need to use useProducts hook to get the products from the provider instead of using the static menuItems, lets change it
 * the data should come in the same format and structure as in the menuItems, so we can use the same logic to filter and display the products
 * this format/structure is {uuid, name, description, price, imageUrl, tag, stock, isAvailable} and the uuid is the one that we use to match the product with the selected products in the order
 * in the future I might add a category field to the products, so we can filter them by category and display them in different sections, but for now we will just display them all in one section
 */

export function Menu() {
  // luego debo manejar los estados de carga y error de los productos, para mostrar un mensaje o spinner mientras se cargan
  const { data: productsData, isLoading: productsLoading, isError: productsError } = useProducts();


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

        {!productsData?.length && <p>No hay productos aun, estado temporal</p>}
        {productsLoading && <p>Cargando productos, estado temporal</p>}
        {productsError && <p>Error al cargar productos, estado temporal</p>}


        <ul className="mt-14 grid gap-7 sm:grid-cols-2">
          {productsData?.map((item, index) => (
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
      </Container>
    </section>
  )
}

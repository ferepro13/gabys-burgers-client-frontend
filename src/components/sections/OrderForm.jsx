import { useCallback, useEffect } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { siteConfig } from '../../config/site'
import { useWhatsAppOrder } from '../../hooks/useWhatsAppOrder'
import { sendOrderData } from '../../api/api'
import {
  calcOrderTotal,
  enrichOrderItems,
  formatMoney,
} from '../../utils/pricing'
import {
  PREFILL_EVENT,
  PREFILL_STORAGE_KEY,
  createEmptyOrderLine,
  readPrefillProductId,
} from '../../utils/orderPrefill'
import { Button } from '../ui/Button'
import { Container } from '../ui/Container'
import { FadeUp } from '../ui/FadeUp'
import { FloatingCard } from '../ui/FloatingCard'
import { SectionHeading } from '../ui/SectionHeading'
import { OrderLineFields } from './OrderLineFields'
import { useProducts } from '../../hooks/useProducts'
import { useExtras } from '../../hooks/useExtras'

const fieldClass =
  'w-full rounded-lg border border-gold/20 bg-ink px-4 py-3 text-cream placeholder:text-cream/35 outline-none transition focus:border-gold/55 focus:ring-1 focus:ring-gold/40'

const labelClass = 'mb-1.5 block text-sm text-cream/70'

export function OrderForm() {
  const { sendOrder } = useWhatsAppOrder()
  const {
    register,
    control,
    handleSubmit,
    getValues,
    setValue,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      phone: '',
      location: '',
      time: '',
      notes: '',
      items: [createEmptyOrderLine()],
    },
  })

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'items',
  })

  // no creo necesario manejar estados de carga y error en el formulario directamente
  // luego debo manejar los estados de carga y error de los productos y extras, para mostrar un mensaje o spinner mientras se cargan
  const { data: productsData } = useProducts();
  const { data: extrasData } = useExtras();

  const watchedItems = useWatch({ control, name: 'items' }) ?? []
  const filledItems = enrichOrderItems(watchedItems, extrasData || [], productsData || [])
  if (filledItems.length > 2) {
    console.log("watched", watchedItems)
    console.log("filled", filledItems)
  }
  const orderTotal = calcOrderTotal(filledItems, extrasData, productsData)

  const addProductLine = useCallback(
    (productId) => {
      if (!productId) return

      const current = getValues('items') ?? []
      const emptyIndex = current.findIndex((line) => !line.productId)

      if (emptyIndex >= 0) {
        update(emptyIndex, { productId, quantity: 1 })
        if (emptyIndex === current.length - 1) {
          append(createEmptyOrderLine(), { shouldFocus: false })
        }
        return
      }

      append({ productId, quantity: 1 }, { shouldFocus: false })
      append(createEmptyOrderLine(), { shouldFocus: false })
    },
    [append, getValues, update],
  )

  useEffect(() => {
    const applyPrefill = (event) => {
      const fromEvent = event?.detail?.productId
      const productId = fromEvent || readPrefillProductId()
      if (!productId) return
      if (fromEvent) sessionStorage.removeItem(PREFILL_STORAGE_KEY)
      addProductLine(productId)
      clearErrors('items')
    }

    applyPrefill()
    window.addEventListener('hashchange', applyPrefill)
    window.addEventListener(PREFILL_EVENT, applyPrefill)

    return () => {
      window.removeEventListener('hashchange', applyPrefill)
      window.removeEventListener(PREFILL_EVENT, applyPrefill)
    }
  }, [addProductLine, clearErrors])

  const onSubmit = (data) => {
    const items = (data.items ?? []).filter((item) => item.productId)

    if (!items.length) {
      setError('items', {
        type: 'manual',
        message: 'Agregue al menos un producto a su pedido.',
      })
      return
    }

    clearErrors('items')
    sendOrderData({...data, items})
    sendOrder({ ...data, items }, extrasData || [], productsData || [])
  }

  const handleRemove = (index) => {
    remove(index)
    queueMicrotask(() => {
      const next = getValues('items') ?? []
      if (!next.length) {
        append(createEmptyOrderLine(), { shouldFocus: false })
        return
      }
      const last = next[next.length - 1]
      if (last?.productId) {
        append(createEmptyOrderLine(), { shouldFocus: false })
      }
    })
  }

  return (
    <section
      id="pedido"
      className="border-t border-gold/10 bg-ink-deep py-20 sm:py-28"
      aria-labelledby="order-title"
    >
      <Container className="grid gap-12 lg:grid-cols-[0.95fr_1.15fr] lg:items-start lg:gap-14">
        <FadeUp>
          <SectionHeading
            id="order-title"
            align="left"
            eyebrow="Encargos"
            title="Hagámoslo fácil: pide por WhatsApp"
            description="Arma tu pedido con varios productos, indica domicilio y horario. Te redirigimos a WhatsApp con todo el detalle y el total estimado."
          />

          <ul className="mt-8 space-y-3 text-sm text-cream/65">
            <li>
              WhatsApp:{' '}
              <a
                className="text-gold hover:text-gold-light"
                href={`https://wa.me/${siteConfig.whatsapp.phone}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {siteConfig.whatsapp.display}
              </a>
            </li>
            <li>Opciones de pago: {siteConfig.payments.join(', ')}.</li>
            <li>Entregas a domicilio — confirmamos zona y horario al instante.</li>
          </ul>

          {filledItems.length > 0 ? (
            <aside
              className="mt-8 hidden rounded-2xl border border-gold/20 bg-ink/50 p-5 lg:block"
              aria-live="polite"
            >
              <p className="text-xs tracking-[0.18em] text-gold uppercase">
                Resumen
              </p>
              <ul className="mt-3 space-y-2 text-sm text-cream/75">
                {filledItems.map((item, index) => (
                  <li
                    key={`${item.productId}-${index}`}
                    className="flex items-start justify-between gap-3"
                  >
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span className="shrink-0 text-gold">
                      {formatMoney(item.lineTotal)}
                    </span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-center justify-between border-t border-gold/15 pt-3 font-medium text-cream">
                <span>Total estimado</span>
                <span className="text-gold-light">{formatMoney(orderTotal)}</span>
              </p>
            </aside>
          ) : null}
        </FadeUp>

        <FadeUp delay={0.1}>
          <FloatingCard className="p-4 sm:p-6 md:p-8" float={false}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-5"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Nombre
                  </label>
                  <input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Tu nombre"
                    className={fieldClass}
                    aria-invalid={Boolean(errors.name)}
                    {...register('name', {
                      required: 'Ingrese su nombre.',
                      minLength: {
                        value: 2,
                        message: 'El nombre es demasiado corto.',
                      },
                    })}
                  />
                  {errors.name ? (
                    <p className="mt-1.5 text-sm text-flame" role="alert">
                      {errors.name.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Teléfono
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="Ej. 54564497"
                    className={fieldClass}
                    aria-invalid={Boolean(errors.phone)}
                    {...register('phone', {
                      required: 'Ingrese un teléfono para contactarlo.',
                      pattern: {
                        value: /^\+?\d{6,15}$/,
                        message: 'Use solo números (6 a 15 dígitos).',
                      },
                    })}
                  />
                  {errors.phone ? (
                    <p className="mt-1.5 text-sm text-flame" role="alert">
                      {errors.phone.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-3">
                <div>
                  <label htmlFor="location" className={labelClass}>
                    Localización (domicilio)
                  </label>
                  <input
                    id="location"
                    type="text"
                    autoComplete="street-address"
                    placeholder="Calle, barrio o zona de entrega"
                    className={fieldClass}
                    aria-invalid={Boolean(errors.location)}
                    {...register('location', {
                      required: 'Indique la dirección o zona de entrega.',
                      minLength: {
                        value: 3,
                        message: 'La localización es demasiado corta.',
                      },
                    })}
                  />
                  {errors.location ? (
                    <p className="mt-1.5 text-sm text-flame" role="alert">
                      {errors.location.message}
                    </p>
                  ) : null}
                </div>

                <div>
                  <label htmlFor="date" className={labelClass}>
                    Fecha de entrega
                  </label>
                  <input
                    id="date"
                    type='date'
                    className={fieldClass}
                    aria-invalid={Boolean(errors.time)}
                    {...register('date', {
                      required: 'Indique la fecha de entrega del pedido.',
                    })}
                  />
                  {errors.date ? (
                    <p className="mt-1.5 text-sm text-flame" role="alert">
                      {errors.date.message}
                    </p>
                  ) : null}
                </div>
                
                <div>
                  <label htmlFor="time" className={labelClass}>
                    Hora deseada
                  </label>
                  <input
                    id="time"
                    type="time"
                    className={fieldClass}
                    aria-invalid={Boolean(errors.time)}
                    {...register('time', {
                      required: 'Indique la hora de entrega del pedido.',
                    })}
                  />
                  {errors.time ? (
                    <p className="mt-1.5 text-sm text-flame" role="alert">
                      {errors.time.message}
                    </p>
                  ) : null}
                </div>
              </div>

              <fieldset className="space-y-3">
                <legend className="text-sm font-medium text-cream/80">
                  Productos del pedido
                </legend>
                <p className="text-xs text-cream/45">
                  Elige un producto y aparecerá otra fila para seguir sumando a tu orden.
                </p>

                {fields.map((field, index) => {
                  const line = watchedItems[index] ?? {}
                  const isLast = index === fields.length - 1

                  return (
                    <OrderLineFields
                      key={field.id || field.productId}
                      index={index}
                      control={control}
                      register={register}
                      getValues = {getValues}
                      setValue = {setValue}
                      errors={errors.items?.[index]}
                      productId={line.productId}
                      quantity={line.quantity}
                      isLast={isLast}
                      canRemove={Boolean(line.productId) && fields.length > 1}
                      onRemove={() => handleRemove(index)}
                      onProductSelected={(emptyLine) =>
                        append(emptyLine, { shouldFocus: false })
                      }
                    />
                  )
                })}

                {errors.items?.message ? (
                  <p className="text-sm text-flame" role="alert">
                    {errors.items.message}
                  </p>
                ) : null}
              </fieldset>

              <div
                className="rounded-xl border border-gold/25 bg-gold/5 px-4 py-3 sm:px-5"
                aria-live="polite"
              >
                <div className="flex flex-wrap items-end justify-between gap-2">
                  <div>
                    <p className="text-xs tracking-wide text-cream/50 uppercase">
                      Total del pedido
                    </p>
                    <p className="mt-1 font-display text-2xl text-gold-light sm:text-3xl">
                      {formatMoney(orderTotal)}
                    </p>
                  </div>
                  <p className="text-xs text-cream/45">
                    {filledItems.length === 0
                      ? 'Sin productos aún'
                      : `${filledItems.length} producto${filledItems.length === 1 ? '' : 's'}`}
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="notes" className={labelClass}>
                  Notas (opcional)
                </label>
                <textarea
                  id="notes"
                  rows={3}
                  placeholder="Detalles de los agregos, referencias del domicilio…"
                  className={`${fieldClass} resize-y`}
                  {...register('notes', {
                    maxLength: {
                      value: 400,
                      message: 'Máximo 400 caracteres.',
                    },
                  })}
                />
                {errors.notes ? (
                  <p className="mt-1.5 text-sm text-flame" role="alert">
                    {errors.notes.message}
                  </p>
                ) : null}
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                Enviar por WhatsApp
              </Button>

              <p className="text-center text-xs text-cream/45">
                Al enviar se abrirá WhatsApp con tu pedido, domicilio y total
                listos para confirmar.
              </p>
            </form>
          </FloatingCard>
        </FadeUp>
      </Container>
    </section>
  )
}

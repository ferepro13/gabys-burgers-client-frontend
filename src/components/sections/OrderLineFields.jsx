import { Controller } from 'react-hook-form';
//import { orderCatalog } from '../../data/menu';
import { calcLineTotal, formatMoney } from '../../utils/pricing';
import { createEmptyOrderLine } from '../../utils/orderPrefill';
import { ExtrasSelect } from './ExtrasSelect';
import { useProducts } from '../../hooks/useProducts';
import { useExtras } from '../../hooks/useExtras';
import {LoadingState} from "../ui/LoadingState";
import {EmptyState} from "../ui/EmptyState";

/**
 * need to use useProducts hook to get the products from the provider instead of using the static menuItems, lets change it
 * the data should come in the same format and structure as in the menuItems, so we can use the same logic to filter and display the products
 * this format/structure is {uuid, name, description, price, imageUrl, tag, stock, isAvailable} and the uuid is the one that we use to match the product with the selected products in the order
 */

const fieldClass =
  'w-full rounded-lg border border-gold/20 bg-ink px-3 py-2.5 text-sm text-cream placeholder:text-cream/35 outline-none transition focus:border-gold/55 focus:ring-1 focus:ring-gold/40 sm:px-4 sm:py-3 sm:text-base';

const labelClass = 'mb-1 block text-xs text-cream/60';

export function OrderLineFields({
  index,
  control,
  register,
  getValues,
  setValue,
  errors,
  productId,
  quantity,
  isLast,
  canRemove,
  onRemove,
  onProductSelected,
}) {

  // luego debo manejar los estados de carga y error de los productos y extras, para mostrar un mensaje o spinner mientras se cargan
  const { data: productsData, isLoading: productsLoading, isError: productsError } = useProducts();
  const { data: extrasData } = useExtras();

  const stockProductsData = productsData?.filter((p) => p.stock > 0) || [];

  // Obtener el producto seleccionado y su stock
  const product = stockProductsData?.find((p) => p.uuid === productId);
  const stock = product?.stock ?? 0;

  // Calcular cuántas unidades de este producto ya se pidieron en otras líneas
  const items = getValues().items || [];
  let totalOtherLines = 0;
  if (productId) {
    items.forEach((item, idx) => {
      if (idx !== index && item.productId === productId) {
        totalOtherLines += Number(item.quantity) || 0;
      }
    });
  }
  const maxAllowed = Math.max(0, stock - totalOtherLines);

  // Obtener los extras seleccionados para este producto
  const extras = getValues(`items.${index}.extras`) || [];

  // Calcular subtotal (producto + extras)
  const lineTotal = calcLineTotal(productId, quantity, extras, extrasData || [], productsData || []);
  const showSubtotal = Boolean(productId);

  return (
    <div className="rounded-xl border border-gold/15 bg-ink/60 p-3 sm:p-3.5">
      <div className="grid grid-cols-[1fr_5.5rem] items-end gap-2 sm:grid-cols-[minmax(0,1fr)_5.5rem_auto]">
        {/* Selector de producto */}
        <div className="col-span-2 min-w-0 sm:col-span-1">
          <div className="mb-1 flex items-center justify-between gap-2">
            <label htmlFor={`items.${index}.productId`} className={labelClass}>
              Pedido
            </label>
            {canRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="text-[11px] leading-none text-cream/45 transition hover:text-flame sm:hidden"
                aria-label={`Quitar producto ${index + 1}`}
              >
                Quitar
              </button>
            )}
          </div>

            {/** if data is ok render the controller, if not render the corresponding state */}
          {productsLoading && <LoadingState label={"Cargando productos..."}/>}
          {productsError && <EmptyState title={"Ocurrió un error al cargar los productos"} description={"Compruebe su conexión a internet"}/>}

          {!productsLoading && !productsError && <Controller
            name={`items.${index}.productId`}
            control={control}
            rules={{
              validate: (value) => {
                if (isLast && !value) return true;
                return value ? true : 'Selecciona un producto.';
              },
            }}
            render={({ field }) => (
              <select
                id={`items.${index}.productId`}
                className={fieldClass}
                aria-invalid={Boolean(errors?.productId)}
                value={field.value}
                onChange={(event) => {
                  const next = event.target.value;
                  field.onChange(next);

                  if (next && isLast) {
                    onProductSelected?.(createEmptyOrderLine());
                  }

                  // Ajustar cantidad al cambiar de producto
                  if (next) {
                    const newProduct = stockProductsData?.find((p) => p.uuid === next);
                    const newStock = newProduct?.stock ?? 0;
                    const allItems = getValues().items || [];
                    let otherTotal = 0;
                    allItems.forEach((item, idx) => {
                      if (idx !== index && item.productId === next) {
                        otherTotal += Number(item.quantity) || 0;
                      }
                    });
                    const newMax = Math.max(0, newStock - otherTotal);
                    const currentQty = getValues(`items.${index}.quantity`);
                    if (currentQty > newMax) {
                      setValue(`items.${index}.quantity`, newMax);
                    }
                  }
                }}
                onBlur={field.onBlur}
                ref={field.ref}
              >
                <option value="">Elige una opción</option>
                {stockProductsData?.map((option) => (
                  <option key={option.uuid} value={option.uuid}>
                    {option.name}
                    {option.price != null
                      ? ` — ${formatMoney(option.price)}`
                      : ' — A cotizar'}
                  </option>
                ))}
              </select>
            )}
          />}

          {errors?.productId && (
            <p className="mt-1 text-xs text-flame" role="alert">
              {errors.productId.message}
            </p>
          )}

          {/* 👇 Aquí insertamos el selector de extras */}
          {(product?.category === "Hamburguesas") && // agregar una lista de las categorias q admiten agregos
          <ExtrasSelect 
            productIndex={index}
            control={control}
            /*getValues={getValues}
            setValue={setValue}
            errors={errors?.extras}*/
          />}
        </div>

        {/* Input de cantidad */}
        <div>
          <label htmlFor={`items.${index}.quantity`} className={labelClass}>
            Cant.
          </label>
          <input
            id={`items.${index}.quantity`}
            type="number"
            inputMode="numeric"
            min="1"
            max={maxAllowed || 0}
            className={fieldClass}
            disabled={!productId}
            aria-invalid={Boolean(errors?.quantity)}
            {...register(`items.${index}.quantity`, {
              valueAsNumber: true,
              validate: (value) => {
                if (!productId) return true;
                if (!Number.isFinite(value) || value < 1) return 'Mínimo 1.';

                const allItems = getValues().items || [];
                let otherTotal = 0;
                allItems.forEach((item, idx) => {
                  if (idx !== index && item.productId === productId) {
                    otherTotal += Number(item.quantity) || 0;
                  }
                });

                if (value + otherTotal > stock) {
                  return `Máximo ${Math.max(0, stock - otherTotal)} disponibles.`;
                }
                return true;
              },
            })}
          />
          {errors?.quantity && (
            <p className="mt-1 text-xs text-flame" role="alert">
              {errors.quantity.message}
            </p>
          )}
        </div>

        {/* Subtotal y botón quitar */}
        <div className="flex min-h-10.5 items-center justify-end gap-3 sm:min-h-0 sm:pb-2.5">
          {showSubtotal && (
            <div className="text-right">
              <p className="text-[10px] leading-none text-cream/45 uppercase">
                Subtotal
              </p>
              <p className="mt-1 text-sm font-medium text-gold-light tabular-nums">
                {formatMoney(lineTotal)}
              </p>
            </div>
          )}

          {canRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="hidden shrink-0 text-xs text-cream/45 transition hover:text-flame sm:inline"
              aria-label={`Quitar producto ${index + 1}`}
            >
              Quitar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


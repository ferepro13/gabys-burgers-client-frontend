import { useFieldArray } from 'react-hook-form';
import { useState } from 'react';
//import { extrasCatalog } from '../../data/menu';
import { useExtras } from '../../hooks/useExtras';
/**
 * need to use useExtras hook to get the extras from the provider instead of using the static extrasCatalog, lets change it
 * the data should come in the same format and structure as in the extrasCatalog, so we can use the same logic to filter and display the extras
 * this format/structure is {uuid, name, price, isAvailable} and the uuid is the one that we use to match the extra with the selected extras in the product
 */

const tagClass =
  'inline-flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 text-sm text-cream';

const removeButtonClass =
  'ml-1 text-cream/50 hover:text-flame transition';

const dropdownClass =
  'absolute z-10 mt-1 w-48 rounded-lg border border-gold/20 bg-ink py-1 shadow-xl';

const optionClass =
  'w-full px-3 py-1.5 text-left text-sm text-cream hover:bg-gold/10 transition';

export function ExtrasSelect({
  productIndex,       // índice del producto en el array items
  control,
  //getValues,
  //setValue,           // (opcional, por si se necesita)
  //errors,             // (opcional)
}) {
  // useFieldArray anidado para manejar los extras de este producto
  const { fields, append, remove } = useFieldArray({
    control,
    name: `items.${productIndex}.extras`,
  });

  const [isOpen, setIsOpen] = useState(false);

  // Obtener los extras desde el contexto
  // luego debo manejar los estados de carga y error de los extras, para mostrar un mensaje o spinner mientras se cargan

  const { data: extrasData, isLoading: extrasLoading, isError: extrasError } = useExtras();

  // Obtener los IDs de los extras ya seleccionados en este producto
  const selectedExtraIds = fields.map((field) => field.extraId);

  // Filtrar el catálogo: solo los disponibles y no seleccionados
  const availableExtras = extrasData?.filter(
    (extra) =>
      extra.isAvailable && !selectedExtraIds.includes(extra.uuid)
  );

  // Manejar la selección de un extra
  const handleSelectExtra = (extraId) => {
    append({ extraId });
    setIsOpen(false);
  };

  // Manejar la eliminación de un extra
  const handleRemoveExtra = (index) => {
    remove(index);
  };

  return (
    <div className="mt-2 flex flex-wrap items-center gap-2">
      {/* Tags de extras seleccionados */}
      {fields.map((field, idx) => {
        const extra = extrasData?.find((e) => e.uuid === field.extraId);
        if (!extra) return null;
        return (
          <div key={field.id} className={tagClass}>
            <span>{extra.name}</span>
            <button
              type="button"
              className={removeButtonClass}
              onClick={() => handleRemoveExtra(idx)}
              aria-label={`Quitar ${extra.name}`}
            >
              ✕
            </button>
          </div>
        );
      })}

      {/* Botón para abrir el dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full border border-gold/30 px-3 py-1 text-xs text-gold-light transition hover:border-gold/60"
        >
          {isOpen ? 'Cerrar' : 'Agregos…'}
        </button>

        {/* Dropdown con opciones */}
        {isOpen && (
          <div className={dropdownClass}>
            {availableExtras.length === 0 ? (
              <div className="px-3 py-2 text-sm text-cream/40">
                No hay más agregos disponibles
              </div>
            ) : (
              availableExtras.map((extra) => (
                <button
                  key={extra.uuid}
                  type="button"
                  className={optionClass}
                  onClick={() => handleSelectExtra(extra.uuid)}
                >
                  {extra.name} — {extra.price.toFixed(2)}€
                </button>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
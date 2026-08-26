export const menuItems = [ // no longer used, intended only for testing stage
  {
    uuid: 'clasica',
    name: 'Clásica Gaby',
    description:
      'Carne jugosa, queso derretido, lechuga, tomate, cebolla y nuestra salsa secreta.',
    price: 6,
    tag: 'Favorita',
    stock: 5,
    image:
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
  },
  {
    uuid: 'bacon',
    name: 'Bacon Flame',
    description:
      'Doble carne, bacon crocante, cheddar ahumado y cebolla caramelizada.',
    price: 8,
    tag: 'Intensa',
    stock: 10,
    image:
      'https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80',
  },
  {
    uuid: 'smash',
    name: 'Smash Cuco',
    description:
      'Smash burger en pan cuco tostado, pickles y salsa especial de la casa.',
    price: 7,
    tag: 'Nueva',
    stock: 10,
    image:
      'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=800&q=80',
  },
  {
    uuid: 'veggie',
    name: 'Verde Enamora',
    description:
      'Medallón vegetal, aguacate, rúcula y aderezo cítrico. Fresca y sorprendente.',
    price: 7,
    tag: 'Ligera',
    stock: 0,
    image:
      'https://images.unsplash.com/photo-1520072959219-c595dc870360?auto=format&fit=crop&w=800&q=80',
  },
]

export const orderCatalog = [ // no longer used, intended only for testing stage
  ...menuItems.filter(({ stock }) => (stock)),
]

export const highlights = [
  {
    uuid: 'quality',
    title: 'Ingredientes de primera',
    description:
      'Hamburguesas jugosas con carne seleccionada, vegetales frescos y pan cuco.',
  },
  {
    uuid: 'variety',
    title: 'Para todos los gustos',
    description:
      'Clásicas, innovadoras y sorpresas semanales que despiertan tus sentidos.',
  },
  {
    uuid: 'secret',
    title: 'El toque secreto Gaby',
    description:
      'Una receta especial con cariño de sobra: el sabor que te hace volver.',
  },
]

export const extrasCatalog = [ // no longer used, intended only for testing stage
  { uuid: 'extra-cebolla', name: 'Cebolla', price: 2.00, isAvailable: true },
  { uuid: 'extra-queso', name: 'Queso', price: 1.50, isAvailable: true },
  { uuid: 'extra-jamon', name: 'Jamón', price: 2.50, isAvailable: true },
  { uuid: 'extra-tortilla', name: 'Tortilla', price: 3.00, isAvailable: true },
];
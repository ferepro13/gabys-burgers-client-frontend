const API_URL = import.meta.env.VITE_API_URL;

const parseResponse = async (response) => {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(
      data?.error || 'Ocurrió un error en la solicitud'
    );
  }

  return data;
};

const getProducts = async () => {
    const response = await fetch(`${API_URL}/productos`);
    const productos = parseResponse(response);
    //array de objetos con {uuid, name, description, imageUrl, price, stock, isAvailable, etc}

    return productos;
}

const getExtras = async () => {
    const response = await fetch(`${API_URL}/extras`);
    const extras = parseResponse(response);

    return extras;
    //array de objetos con {uuid, name, price, stock, isAvailable, etc}
}

const getDeliveries = async () => {
    const response = await fetch(`${API_URL}/domicilios`);
    const domicilios = parseResponse(response);

    return domicilios;
    //array de objetos con {uuid, locationName, price}
}

const sendOrderData = async (orderData) => {
    const response = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify(orderData)
    })

    const result = parseResponse(response);

    console.log("Orden enviada... resultado:", result);
    return result;
}

export {getProducts, getExtras, sendOrderData, getDeliveries}
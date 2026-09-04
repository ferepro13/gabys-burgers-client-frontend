const API_URL = import.meta.env.VITE_API_URL;

const getProducts = async () => {
    const response = await fetch(`${API_URL}/productos`);
    const productos = await response.json();
    //array de objetos con {uuid, name, description, imageUrl, price, stock, isAvailable, etc}

    return productos;
}

const getExtras = async () => {
    const response = await fetch(`${API_URL}/extras`);
    const extras = await response.json();

    return extras;
    //array de objetos con {uuid, name, price, stock, isAvailable, etc}
}

const sendOrderData = async (orderData) => {
    const response = await fetch(`${API_URL}/pedidos`, {
        method: "POST",
        headers: {"Content-Type": "application/json" },
        body: JSON.stringify(orderData)
    })

    const result = await response.json();

    console.log("Orden enviada... resultado:", result);
    return result;
}

export {getProducts, getExtras, sendOrderData}
import ProductsContext from "./ProductsContext";
import {useQuery} from "@tanstack/react-query";

import { getProducts } from "../api/api";


export const ProductsProvider = ({children}) => {
    const {
        data, // lets do something with the data before sending, that should be in the api.js file
        isLoading,
        isError,
        isFetching,
        refetch
    } = useQuery(
        {
            queryKey: ["products"],
            queryFn: getProducts,
        }
    )
    console.log("products data", data);
    
    const result = data ? Object.groupBy(data, ({category}) => String(category)) : {}
    console.log(JSON.stringify(result))

    return (
        <ProductsContext.Provider value={{data, isLoading, isError, isFetching, refetch}}>
            {children}
        </ProductsContext.Provider>
    )
}

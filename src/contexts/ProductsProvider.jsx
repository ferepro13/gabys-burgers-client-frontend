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
    const categorizedData = data ? Object.values(Object.groupBy(data, ({category}) => String(category))) : data

    return (
        <ProductsContext.Provider value={{data, categorizedData, isLoading, isError, isFetching, refetch}}>
            {children}
        </ProductsContext.Provider>
    )
}

import DeliveriesContext from "./DeliveriesContext";
import {useQuery} from "@tanstack/react-query";
import { getDeliveries } from "../api/api";

export const DeliveriesProvider = ({children}) => {
    const {
        data,
        isFetching,
        isLoading,
        isError,
        refetch
    } = useQuery({
        queryFn:getDeliveries,
        queryKey:["deliveries"],
    })

    return (
        <DeliveriesContext.Provider value={{data, isFetching, isLoading, isError, refetch}}>
            {children}
        </DeliveriesContext.Provider>
    )
}
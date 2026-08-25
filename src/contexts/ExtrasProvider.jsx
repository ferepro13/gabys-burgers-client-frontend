import ExtrasContext from "./ExtrasContext";
import {useQuery} from "@tanstack/react-query";
import { getExtras } from "../api/api";

export const ExtrasProvider = ({children}) => {
    const {
        data, 
        isLoading,
        isError,
        isFetching,
        refetch
    } = useQuery(
        {
            queryKey: ["extras"],
            queryFn: getExtras,
        }
    )
    return (
        <ExtrasContext.Provider value={{data, isLoading, isError, isFetching, refetch}}>
            {children}
        </ExtrasContext.Provider>
    )
}

import { useContext } from "react";
import DeliveriesContext from "../contexts/DeliveriesContext";

export const useDeliveries = () => useContext(DeliveriesContext);
import { useContext } from "react";
import ExtrasContext from "../contexts/ExtrasContext";

export const useExtras = () => useContext(ExtrasContext);
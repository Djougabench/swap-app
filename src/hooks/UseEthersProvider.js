import { useContext } from "react";
import EthersContext from "../context/EthersProviderContext";

export default function useEthersProvider() {
  const context = useContext(EthersContext);
  if (!context) {
    throw new Error("useEthersProvider must be used within an EthersProvider");
  }
  return context;
}

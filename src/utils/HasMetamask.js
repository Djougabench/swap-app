const hasMetamask = () => {
  return (
    typeof window !== "undefined" &&
    typeof window !== null &&
    typeof window.ethereum !== "undefined"
  );
};

export { hasMetamask };

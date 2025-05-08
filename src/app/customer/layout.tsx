import { CartProvider } from "./components/CartContext";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return <CartProvider>{children}</CartProvider>;
}

import { Nunito } from "next/font/google";
import Banner from "src/components/Banner";
import ProductFeed from "src/components/ProductFeed";
import { Product } from "../../typings";

const nunito = Nunito({ subsets: ["latin"] });
const BASE_URL = "https://fakestoreapi.com";

export default async function Home() {
  const products: Product[] = await fetch(`${BASE_URL}/products`).then((res) =>
    res.json()
  );
  console.log("products", products);
  return (
    <main
      className={`${nunito.className} max-w-screen-2xl mx-auto bg-gray-100`}
    >
      <Banner />
      <ProductFeed products={products} />
    </main>
  );
}

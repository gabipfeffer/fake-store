import { Nunito } from "next/font/google";
import Banner from "src/components/Banner";
import ProductFeed from "src/components/ProductFeed";
import { Product } from "../typings";
import type { InferGetServerSidePropsType, GetServerSideProps } from "next";

const nunito = Nunito({ subsets: ["latin"] });

export default function Home({
  products,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main
      className={`${nunito.className} max-w-screen-2xl mx-auto bg-gray-100`}
    >
      <Banner />
      <ProductFeed products={products} />
    </main>
  );
}

export const getServerSideProps: GetServerSideProps<{}> = async () => {
  const BASE_URL = "https://fakestoreapi.com";
  const products: Product[] = await fetch(`${BASE_URL}/products`).then((res) =>
    res.json()
  );
  return { props: { products } };
};

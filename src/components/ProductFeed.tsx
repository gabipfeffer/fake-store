import { Product } from "../../typings";
import ProductCard from "src/components/ProductCard";
import Image from "next/image";

type Props = {
  products: Product[];
};

export default function ProductFeed({ products }: Props) {
  return (
    <div
      className={
        "grid grid-flow-row-dense md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:-mt-52 mx-auto"
      }
    >
      {products.slice(0, 4).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
      <Image
        className={"md:col-span-full object-cover"}
        src={"https://links.papareact.com/dyz"}
        alt={"advert-banner"}
        width={1500}
        height={600}
      />
      <div className={"md:col-span-2"}>
        {products.slice(4, 5).map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.slice(5, products.length).map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

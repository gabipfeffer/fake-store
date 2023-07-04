import Link from "next/link";
import { Product } from "../../typings";
import { ChangeEvent, FormEvent } from "react";

type Props = {
  product: Partial<Product>;
  onSubmit: (e: FormEvent) => void;
  onChange: (e: ChangeEvent) => void;
};

export default function ProductForm({ product, onSubmit, onChange }: Props) {
  return (
    <form onSubmit={onSubmit} className={"max-w-md flex flex-col space-y-3"}>
      <label className={"adminLabel"}>
        Title
        <input
          required={true}
          placeholder={"Title"}
          type={"text"}
          name={"title"}
          value={product?.title}
          className={"input"}
          onChange={onChange}
        />
      </label>
      <label className={"adminLabel"}>
        Category
        <input
          placeholder={"Category"}
          type={"text"}
          name={"category"}
          value={product?.category}
          className={"input"}
          onChange={onChange}
        />
      </label>
      <label className={"adminLabel"}>
        Price
        <input
          required={true}
          placeholder={"Price"}
          type={"text"}
          name={"price"}
          value={product?.price}
          className={"input"}
          onChange={onChange}
        />
      </label>
      <label className={"adminLabel"}>
        Description
        <textarea
          placeholder={"Description"}
          name={"description"}
          value={product?.description}
          className={"input"}
          onChange={onChange}
        />
      </label>
      <label className={"adminLabel"}>
        Status
        <select
          required={true}
          name={"status"}
          value={product?.status}
          className={"input"}
          onChange={onChange}
        >
          <option value={""}>Choose a status</option>
          <option value={"inactive"}>Inactive</option>
          <option value={"active"}>Active</option>
        </select>
      </label>
      <div className={"flex items-center justify-center gap-2"}>
        <Link href={"/admin/products"} className={"adminButton"}>
          Cancel
        </Link>
        <button className={"adminButton"} type={"submit"}>
          Save
        </button>
      </div>
    </form>
  );
}

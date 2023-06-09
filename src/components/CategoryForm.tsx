import Link from "next/link";
import { Category } from "../../typings";
import { ChangeEvent, FormEvent } from "react";
import { ArrowDownTrayIcon, TrashIcon } from "@heroicons/react/24/solid";

type Props = {
  category: Partial<Category>;
  onSubmit: (e: FormEvent) => void;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
  onImageChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onImageDelete: (fileName: string) => void;
};

export default function CategoryForm({
  category,
  onSubmit,
  onChange,
  onImageChange,
  onImageDelete,
}: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className={"max-w-md flex flex-col space-y-3 w-full"}
    >
      <label className={"adminLabel"}>
        Title
        <input
          required={true}
          placeholder={"Title"}
          type={"text"}
          name={"title"}
          value={category?.title}
          className={"input"}
          onChange={onChange}
        />
      </label>
      <label className={"adminLabel"}>
        Images
        <label
          className={
            "cursor-pointer w-24 h-24 flex flex-col items-center justify-center text-gray-500 rounded-md bg-gray-200"
          }
        >
          <ArrowDownTrayIcon className={"w-8 h-8"} />
          Upload
          <input
            type={"file"}
            multiple
            className={"hidden"}
            onChange={onImageChange}
          />
        </label>
      </label>
      <div className={"flex items-center space-x-5 mt-5 w-full"}>
        {category?.images?.map((image) => (
          <div key={image.name} className={"relative"}>
            <img
              src={image.imageUrl}
              alt={image.name}
              className={"w-40 h-40 object-cover"}
            />
            <button onClick={() => onImageDelete(image.name)}>
              <TrashIcon
                className={
                  "w-6 h-6 absolute -top-2 -right-2 bg-white rounded-full p-1"
                }
              />
            </button>
          </div>
        ))}
      </div>

      <label className={"adminLabel"}>
        Description
        <textarea
          placeholder={"Description"}
          name={"description"}
          value={category?.description}
          className={"input"}
          onChange={onChange}
        />
      </label>
      <label className={"adminLabel"}>
        Status
        <select
          required={true}
          name={"status"}
          value={category?.status}
          className={"input"}
          onChange={onChange}
        >
          <option value={""}>Choose a status</option>
          <option value={"inactive"}>Inactive</option>
          <option value={"active"}>Active</option>
        </select>
      </label>
      <label className={"adminLabel"}>
        Ranking
        <input
          required={true}
          placeholder={"Ranking"}
          type={"number"}
          name={"ranking"}
          value={category?.ranking}
          className={"input"}
          onChange={onChange}
        />
      </label>
      <div className={"flex items-center justify-center gap-2"}>
        <Link href={"/admin/categorys"} className={"adminButton"}>
          Cancel
        </Link>
        <button className={"adminButton"} type={"submit"}>
          Save
        </button>
      </div>
    </form>
  );
}

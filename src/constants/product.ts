import { Product } from "../../typings";

export const searchProperties: { name: keyof Product; label: string }[] = [
  { name: "title", label: "Title" },
  { name: "category", label: "Category" },
];

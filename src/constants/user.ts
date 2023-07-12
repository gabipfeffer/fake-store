import { User } from "../../typings";

export const searchProperties: { name: keyof User; label: string }[] = [
  { name: "name", label: "Name" },
  { name: "email", label: "Email" },
];

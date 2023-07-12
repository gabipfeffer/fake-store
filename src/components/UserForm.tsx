import Link from "next/link";
import { User } from "../../typings";
import { ChangeEvent, FormEvent } from "react";

type Props = {
  user: Partial<User>;
  onSubmit: (e: FormEvent) => void;
  onChange: (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => void;
};

export default function UserForm({ user, onSubmit, onChange }: Props) {
  return (
    <form
      onSubmit={onSubmit}
      className={"max-w-md flex flex-col space-y-3 w-full"}
    >
      <label className={"adminLabel"}>
        Name
        <input
          required={true}
          placeholder={"Name"}
          type={"text"}
          name={"name"}
          value={user?.name}
          className={"input"}
          onChange={onChange}
        />
      </label>

      <label className={"adminLabel"}>
        Email
        <input
          required={true}
          placeholder={"Email"}
          type={"email"}
          name={"email"}
          value={user?.email}
          className={"input"}
          onChange={onChange}
        />
      </label>

      <div className={"flex items-center justify-center gap-2"}>
        <Link href={"/admin/admin-users"} className={"adminButton"}>
          Cancel
        </Link>
        <button className={"adminButton"} type={"submit"}>
          Save
        </button>
      </div>
    </form>
  );
}

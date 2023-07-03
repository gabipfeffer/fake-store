import AdminLayout from "src/components/AdminLayout";
import Link from "next/link";

export default function ProductsPage() {
  return (
    <AdminLayout>
      <Link href={"/admin/products/new"} className={"adminButton"}>
        Add new product
      </Link>
    </AdminLayout>
  );
}

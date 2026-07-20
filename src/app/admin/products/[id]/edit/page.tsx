import { redirect } from "next/navigation";

/** Product editing is handled in the unified admin product workspace. */
export default function EditProductPage() {
  redirect("/admin/products");
}

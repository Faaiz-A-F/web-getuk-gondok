interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Edit Product - {id}</h1>
      {/* Product edit form will go here */}
    </div>
  );
}

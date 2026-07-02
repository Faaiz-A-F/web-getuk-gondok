import {InvoicePreview} from "@/components/pages/InvoicePreview";

export default function InvoicePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Invoice</h1>
      <InvoicePreview />
      {/* Invoice details will go here */}
    </div>
  );
}
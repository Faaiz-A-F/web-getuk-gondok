export function formatPrice(price: number | string | { toString(): string }): string {
  const numericValue = typeof price === "number" ? price : Number(price);

  // Use explicit formatting to ensure consistent output between server and client
  // This avoids hydration mismatches that can occur with Intl.NumberFormat locale differences
  const formattedNumber = numericValue.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `Rp ${formattedNumber}`;
}

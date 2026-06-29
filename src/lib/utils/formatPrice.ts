export function formatPrice(price: number): string {
  // Use explicit formatting to ensure consistent output between server and client
  // This avoids hydration mismatches that can occur with Intl.NumberFormat locale differences
  const formattedNumber = price.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return `Rp ${formattedNumber}`;
}

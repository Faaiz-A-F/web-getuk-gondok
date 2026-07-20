import { LegalPage, LegalSection } from "@/components/pages/LegalPage";

export default function TermsPage() {
  return (
    <LegalPage title="Syarat & Ketentuan" intro="Ketentuan sederhana untuk menjaga proses pemesanan tetap jelas, aman, dan nyaman bagi semua pelanggan.">
      <LegalSection title="Pemesanan"><p>Pesanan dianggap tercatat setelah pelanggan mengirimkan data yang benar dan menerima nomor pesanan. Ketersediaan produk mengikuti stok pada saat pemesanan diproses.</p></LegalSection>
      <LegalSection title="Pembayaran"><p>Pembayaran dilakukan melalui metode yang tersedia pada halaman keranjang. Pesanan diproses setelah pembayaran berhasil dikonfirmasi.</p></LegalSection>
      <LegalSection title="Perubahan dan pembatalan"><p>Perubahan atau pembatalan dapat diajukan sebelum pesanan masuk tahap produksi. Hubungi kami sesegera mungkin dengan menyertakan nomor pesanan.</p></LegalSection>
      <LegalSection title="Kualitas produk"><p>Produk dibuat segar. Warna, bentuk, dan dekorasi dapat sedikit berbeda karena proses pembuatan dilakukan secara manual tanpa mengurangi kualitas.</p></LegalSection>
    </LegalPage>
  );
}

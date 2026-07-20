import { LegalPage, LegalSection } from "@/components/pages/LegalPage";

export default function PrivacyPage() {
  return (
    <LegalPage title="Kebijakan Privasi" intro="Kami menggunakan data pelanggan hanya untuk memberikan layanan pemesanan dan dukungan yang dibutuhkan.">
      <LegalSection title="Data yang dikumpulkan"><p>Kami menyimpan nama, email, nomor telepon, alamat, dan riwayat pesanan yang Anda berikan secara langsung.</p></LegalSection>
      <LegalSection title="Penggunaan data"><p>Data digunakan untuk autentikasi akun, pemrosesan pesanan, komunikasi layanan, dan peningkatan pengalaman pelanggan.</p></LegalSection>
      <LegalSection title="Perlindungan data"><p>Kami menerapkan kontrol akses dan sesi autentikasi untuk mencegah penggunaan data tanpa izin. Kami tidak menjual data pribadi kepada pihak lain.</p></LegalSection>
      <LegalSection title="Hak pelanggan"><p>Anda dapat memperbarui data melalui halaman akun atau menghubungi kami untuk meminta koreksi dan penghapusan data sesuai ketentuan yang berlaku.</p></LegalSection>
    </LegalPage>
  );
}

"use client";

import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Play, Clock, Award, Layers, CheckCircle, Package, Heart, Shield, Star } from "lucide-react";

export function AboutUsPage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const scrollY = window.scrollY;
        const elementTop = rect.top + scrollY;
        const viewportHeight = window.innerHeight;
        const elementHeight = rect.height;
        
        // Calculate parallax offset based on scroll position relative to element
        const elementCenter = elementTop + elementHeight / 2;
        const viewportCenter = scrollY + viewportHeight / 2;
        const distance = (elementCenter - viewportCenter) * 0.15; // 0.15 is the parallax intensity
        
        setParallaxOffset(distance);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF3E8]">
      <Header />
      
      <main>
        {/* ========== HERO SECTION ========== */}
        <section className="relative min-h-screen flex items-center bg-[#3D2314] overflow-hidden">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_30%,rgba(232,197,71,0.08)_0%,transparent_50%)]"></div>
          {/* Bottom fade to cream */}
          <div className="absolute bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-[#FAF3E8] to-transparent"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Hero Content */}
              <div className="text-center lg:text-left">
                {/* Status Badge */}
                <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                  <span className="w-2 h-2 bg-[#E86A17] rounded-full animate-pulse"></span>
                  <span className="text-sm font-medium text-white/90">Buka & Menerima Pesanan</span>
                </div>
                
                <h1 className="font-['Playfair_Display'] text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-4">
                  Warisan Rasa
                  <span className="block text-[#E8C547]">Getuk Gondok Khas Magelang</span>
                </h1>
                
                <p className="font-['Playfair_Display'] text-2xl sm:text-3xl font-normal text-white/60 mb-6">
                  Sejak 1985.
                </p>
                
                <p className="text-lg text-white/80 leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0">
                  Selama lebih dari empat dekade, Getuk Gondok Hj. Sri Rahayu menghadirkan cita rasa autentik khas Magelang melalui resep warisan keluarga, bahan-bahan pilihan, dan proses pembuatan yang tetap menjaga kualitas hingga saat ini.
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                  <a 
                    href="#craft" 
                    className="inline-flex items-center gap-2 bg-[#E86A17] hover:bg-[#D55A0E] text-white px-7 py-3.5 rounded-lg font-semibold transition-all hover:-translate-y-0.5 shadow-lg"
                  >
                    Ikuti Proses Pembuatan
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </a>
                  <a 
                    href="#origin" 
                    className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-7 py-3.5 rounded-lg font-semibold transition-all hover:border-[#E8C547] hover:text-[#E8C547]"
                  >
                    Cerita Kami
                  </a>
                </div>
              </div>
              
              {/* Hero Visual */}
              <div className="relative hidden lg:block">
                {/* Main Image Frame */}
                <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-[#5C3D28] to-[#3D2314]">
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_70%,rgba(232,197,71,0.15)_0%,transparent_60%)]"></div>
                  <div className="w-full h-full flex flex-col items-center justify-center text-white/40">
                    <svg className="w-20 h-20 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm">Foto Produk Getuk Gondok</span>
                  </div>
                </div>
                
                {/* Floating Badges */}
                <div className="absolute bottom-8 -left-8 bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-3">
                  <div className="w-11 h-11 bg-[#FAF3E8] rounded-xl flex items-center justify-center">
                    <Clock className="w-6 h-6 text-[#E86A17]" />
                  </div>
                  <div>
                    <strong className="block text-[#3D2314] font-bold text-lg font-['Playfair_Display']">1985</strong>
                    <span className="text-sm text-[#5C3D28]">Tahun Berdiri</span>
                  </div>
                </div>
                
                <div className="absolute top-8 -right-4 bg-white rounded-2xl p-4 shadow-2xl flex items-center gap-3">
                  <div className="w-11 h-11 bg-[#FAF3E8] rounded-xl flex items-center justify-center">
                    <Layers className="w-6 h-6 text-[#E86A17]" />
                  </div>
                  <div>
                    <strong className="block text-[#3D2314] font-bold">Tradisional</strong>
                    <span className="text-sm text-[#5C3D28]">Resep Warisan</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== ORIGIN STORY SECTION ========== */}
        <section id="origin" className="py-24 lg:py-32 bg-[#FAF3E8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#E86A17] mb-3">Cerita Kami</p>
              <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3D2314] mb-4 leading-tight">
                Warisan Rasa yang Terjaga
                <span className="block text-[#E86A17]">Lintas Generasi</span>
              </h2>
              <p className="text-lg text-[#5C3D28] leading-relaxed">
                Berawal dari resep sederhana yang diwariskan sejak tahun 1943, Getuk Gondok terus berkembang menjadi salah satu oleh-oleh khas Magelang yang tetap mempertahankan cita rasa autentik dari generasi ke generasi.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Origin Visual */}
              <div className="relative">
                <div 
                  ref={imageRef}
                  className="relative rounded-3xl overflow-hidden aspect-square bg-gradient-to-br from-[#F5EBE0] to-[#FAF3E8] border border-[#5C3D28]/10 flex flex-col items-center justify-center text-[#5C3D28]"
                  style={{ transform: `translateY(${parallaxOffset}px)` }}
                >
                  <svg className="w-16 h-16 mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm opacity-60">Keluarga Pendiri Getuk Gondok</span>
                  <span className="text-xs opacity-40 mt-1">Warisan resep yang terus dijaga dan diteruskan dari generasi ke generasi.</span>
                </div>
                {/* Decorative circles */}
                <div className="absolute -inset-4 border-2 border-[#E8C547]/30 rounded-full -z-10"></div>
                <div className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border-2 border-[#E8C547]/20 rounded-full -z-10 bg-[#E8C547]/5"></div>
              </div>
              
              {/* Origin Content */}
              <div>
                <h3 className="font-['Playfair_Display'] text-2xl lg:text-3xl font-semibold text-[#3D2314] mb-6">
                  Warisan yang Terus Dijaga
                </h3>
                <p className="text-[#5C3D28] leading-relaxed mb-5">
                  Perjalanan Getuk Gondok bermula pada tahun 1943 ketika Mbah Ali Mohtar menciptakan getuk berbahan dasar singkong sebagai alternatif pangan di tengah kelangkaan beras pada masa itu. Dengan memanfaatkan singkong yang melimpah dan mengolahnya secara tradisional, beliau berhasil menghadirkan getuk dengan tekstur yang lembut dan cita rasa yang khas.
                </p>
                <p className="text-[#5C3D28] leading-relaxed mb-8">
                  Seiring berjalannya waktu, usaha ini terus diwariskan dari generasi ke generasi. Semangat untuk menjaga resep keluarga, mempertahankan kualitas, dan melestarikan cita rasa autentik menjadi nilai yang terus dijaga dalam setiap proses pembuatannya.
                </p>
                <p className="text-[#5C3D28] leading-relaxed mb-8">
                  Pada tahun 1985, Hj. Sri Rahayu sebagai generasi ketiga mulai mengelola usaha secara mandiri dan menggunakan nama Getuk Gondok sebagai identitas usaha keluarga. Hingga kini, warisan tersebut terus dipertahankan dengan memadukan resep tradisional, bahan-bahan pilihan, dan proses produksi yang terus berkembang tanpa menghilangkan cita rasa khas yang telah diwariskan sejak awal.
                </p>
                
                {/* Timeline */}
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="relative">
                      <div className="w-3 h-3 bg-[#E8C547] rounded-full mt-2 flex-shrink-0"></div>
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-full bg-[#5C3D28]/15"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#3D2314] mb-1">1943 — Lahir dari Kreativitas di Masa Sulit</h4>
                      <p className="text-sm text-[#5C3D28]/80">Perjalanan Getuk Gondok bermula pada tahun 1943 ketika Mbah Ali Mohtar menciptakan getuk berbahan dasar singkong sebagai alternatif pangan di tengah kelangkaan beras pada masa itu. Dengan memanfaatkan singkong yang melimpah, beliau mengolahnya secara tradisional menggunakan lesung hingga menghasilkan getuk dengan cita rasa yang khas dan tekstur yang lembut.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative">
                      <div className="w-3 h-3 bg-[#E8C547] rounded-full mt-2 flex-shrink-0"></div>
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-full bg-[#5C3D28]/15"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#3D2314] mb-1">1950-an — Mulai Dikenal Masyarakat</h4>
                      <p className="text-sm text-[#5C3D28]/80">Melihat respons positif dari masyarakat, usaha pembuatan getuk mulai dikenal lebih luas di Magelang. Cita rasa yang khas dan proses pembuatan yang masih dilakukan secara tradisional menjadikan getuk ini semakin diminati oleh masyarakat.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative">
                      <div className="w-3 h-3 bg-[#E8C547] rounded-full mt-2 flex-shrink-0"></div>
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-full bg-[#5C3D28]/15"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#3D2314] mb-1">1970-an — Estafet Generasi Kedua</h4>
                      <p className="text-sm text-[#5C3D28]/80">Setelah Mbah Ali Mohtar wafat, usaha keluarga diteruskan oleh generasi kedua, yaitu orang tua dari Hj. Sri Rahayu. Pada masa ini, resep warisan dan proses pembuatan tradisional tetap dipertahankan untuk menjaga keaslian cita rasa yang telah dikenal masyarakat.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative">
                      <div className="w-3 h-3 bg-[#E8C547] rounded-full mt-2 flex-shrink-0"></div>
                      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-0.5 h-full bg-[#5C3D28]/15"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#3D2314] mb-1">1985 — Awal Kemandirian & Lahirnya Identitas Usaha</h4>
                      <p className="text-sm text-[#5C3D28]/80">Tahun 1985 menjadi babak baru dalam perjalanan usaha keluarga. Hj. Sri Rahayu, cucu Mbah Ali Mohtar sekaligus generasi ketiga, mulai mengelola usaha secara mandiri. Pada masa inilah nama Getuk Gondok mulai digunakan sebagai identitas usaha. Nama tersebut berasal dari sebutan masyarakat kepada Mbah Ali Mohtar yang dikenal menderita penyakit gondok.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="relative">
                      <div className="w-3 h-3 bg-[#E8C547] rounded-full mt-2 flex-shrink-0"></div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-[#3D2314] mb-1">Masa Kini — Menjaga Tradisi, Menghadirkan Kualitas</h4>
                      <p className="text-sm text-[#5C3D28]/80">Hingga saat ini, Getuk Gondok Hj. Sri Rahayu tetap menjaga resep warisan keluarga dengan memadukan bahan-bahan pilihan dan proses pembuatan yang terus berkembang. Komitmen terhadap kualitas, cita rasa autentik, dan pelayanan terbaik menjadikan Getuk Gondok Hj. Sri Rahayu tetap dipercaya sebagai salah satu oleh-oleh khas Magelang hingga saat ini.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========== CRAFT PROCESS SECTION ========== */}
        <section id="craft" className="py-24 lg:py-32 bg-[#3D2314] text-white relative overflow-hidden">
          {/* Background gradient */}
          <div className="absolute top-0 right-0 w-1/2 h-full bg-[radial-gradient(ellipse_at_right,rgba(232,197,71,0.05)_0%,transparent_60%)]"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#E8C547] mb-3">Proses Pembuatan</p>
              <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                Dari Singkong Pilihan Menjadi Getuk Autentik
              </h2>
              <p className="text-lg text-white/70 leading-relaxed">
                Setiap Getuk Gondok Hj. Sri Rahayu dibuat melalui proses yang diwariskan dari generasi ke generasi. Mulai dari pemilihan singkong berkualitas hingga pengemasan, setiap tahapan dilakukan dengan penuh ketelitian untuk menghasilkan getuk yang lembut, bercita rasa autentik, dan berkualitas.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-5 gap-12 items-start">
              {/* Video Showcase */}
              <div className="lg:col-span-3">
                <div className="relative rounded-3xl overflow-hidden aspect-video bg-gradient-to-br from-[#5C3D28] to-[#2A1810]">
                  <div className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer group" onClick={() => setVideoModalOpen(true)}>
                    {/* Decorative pattern */}
                    <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'40\' fill=\'none\' stroke=\'%23E8C547\' stroke-width=\'0.3\'/%3E%3C/svg%3E")', backgroundSize: '180px'}}></div>
                    
                    {/* Play Button */}
                    <div className="relative w-22 h-22 bg-[#E86A17] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-[#E8C547] shadow-2xl" style={{width: '88px', height: '88px'}}>
                      <svg className="w-9 h-9 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </div>
                </div>
                <p className="text-center text-sm text-white/50 mt-5 relative z-10">
                  Proses pembuatan Getuk Gondok Hj. Sri Rahayu
                </p>
              </div>
              
              {/* Craft Steps */}
              <div className="lg:col-span-2 space-y-4">
                {[
                  { num: "1", title: "Pemilihan & Persiapan Singkong", desc: "Singkong berkualitas dipilih, kemudian dikupas dan dicuci hingga bersih sebagai langkah awal untuk menghasilkan getuk dengan kualitas terbaik." },
                  { num: "2", title: "Pengukusan Singkong", desc: "Singkong dikukus hingga matang sempurna agar menghasilkan tekstur yang lembut dan siap diolah pada tahap berikutnya." },
                  { num: "3", title: "Penumbukan & Pencampuran", desc: "Singkong yang telah matang ditumbuk hingga halus, kemudian serat atau bagian tengahnya dipisahkan. Selanjutnya singkong dicampur dengan gula, garam, serta bahan-bahan lainnya, lalu dibagi menjadi berbagai varian rasa seperti pandan, gula jawa, vanila, coklat, dan frambos." },
                  { num: "4", title: "Penghalusan & Pembentukan", desc: "Singkong yang telah dicampur digiling hingga bertekstur lebih halus, kemudian diuleni agar tercampur merata. Setelah itu getuk dibentuk dan dipotong dengan ukuran yang seragam sehingga siap untuk dikemas." },
                  { num: "5", title: "Pengemasan", desc: "Setiap potong Getuk Gondok dikemas dengan rapi untuk menjaga kualitas, kebersihan, dan kesegarannya sebelum sampai ke tangan pelanggan." },
                ].map((step, index) => (
                  <div key={index} className="p-6 bg-white/5 rounded-2xl border border-white/10 transition-all duration-300 hover:bg-white/10 hover:border-[#E8C547]/30">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-[#E8C547] rounded-xl flex items-center justify-center font-['Playfair_Display'] font-bold text-[#3D2314] flex-shrink-0">
                        {step.num}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-2">{step.title}</h4>
                        <p className="text-sm text-white/65 leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========== WHY CHOOSE US SECTION ========== */}–
        <section id="why-us" className="py-24 lg:py-32 bg-[#FAF3E8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 items-center">
              {/* Content */}
              <div className="lg:col-span-2">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#E86A17] mb-3">Mengapa Memilih Kami</p>
                <h2 className="font-['Playfair_Display'] text-2xl sm:text-3xl lg:text-4xl font-bold text-[#3D2314] mb-4 leading-tight">
                  Kepercayaan pelanggan dibangun dari kualitas yang konsisten.
                </h2>
                <p className="text-lg text-[#5C3D28] leading-relaxed">
                  Kami menggabungkan tradisi, ketelitian, dan pelayanan yang personal agar setiap pesanan terasa istimewa.
                </p>
              </div>
              
              {/* Cards */}
              <div className="lg:col-span-3 grid sm:grid-cols-3 gap-6">
                {[
                  { icon: Award, title: "Resep Warisan", desc: "Diproduksi dengan cara tradisional yang diwariskan turun-temurun dan tetap menjaga cita rasa autentik." },
                  { icon: CheckCircle, title: "Bahan Pilihan", desc: "Menggunakan singkong segar, kelapa muda, dan gula merah alami untuk kualitas terbaik." },
                  { icon: Package, title: "Kemasan Premium", desc: "Tersedia dalam berbagai pilihan kemasan modern yang cocok untuk hadiah dan acara spesial." },
                ].map((card, index) => (
                  <div key={index} className="bg-white rounded-2xl p-6 lg:p-7 text-center border border-[#5C3D28]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#3D2314]/10">
                    <div className="w-14 h-14 bg-[#E8C547] rounded-2xl flex items-center justify-center mx-auto mb-5">
                      <card.icon className="w-7 h-7 text-[#3D2314]" />
                    </div>
                    <h4 className="font-['Playfair_Display'] text-lg font-semibold text-[#3D2314] mb-3">{card.title}</h4>
                    <p className="text-sm text-[#5C3D28] leading-relaxed">{card.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ========== MORE VIDEOS SECTION ========== */}
        <section id="videos" className="py-24 lg:py-32 bg-[#F5EBE0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#E86A17] mb-3">Galeri Video</p>
              <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3D2314] mb-4 leading-tight">
                Saksi Proses Autentik
              </h2>
              <p className="text-lg text-[#5C3D28] leading-relaxed">
                Nikmati lebih banyak video yang menunjukkan keindahan proses pembuatan getuk tradisional secara langsung.
              </p>
            </div>
            
            {/* Videos Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Memilih Singkong Berkualitas", desc: "Tips memilih singkong terbaik untuk getuk yang sempurna." },
                { title: "Teknik Mengukus Sempurna", desc: "Rahasia mendapatkan tekstur singkong yang tepat." },
                { title: "Membuat Isi Kacang", desc: "Resep isian kacang premium untuk getuk gondok." },
                { title: "Pengemasan Tradisional", desc: "Keindahan bungkusan daun pisang yang autentik." },
              ].map((video, index) => (
                <div key={index} className="bg-white rounded-2xl overflow-hidden border border-[#5C3D28]/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#3D2314]/10">
                  <div className="relative aspect-video bg-gradient-to-br from-[#5C3D28] to-[#3D2314] flex items-center justify-center cursor-pointer group">
                    <div className="w-15 h-15 bg-[#E86A17] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-[#E8C547]" style={{width: '60px', height: '60px'}}>
                      <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                  </div>
                  <div className="p-5">
                    <h4 className="font-['Playfair_Display'] text-lg font-semibold text-[#3D2314] mb-2">{video.title}</h4>
                    <p className="text-sm text-[#5C3D28]/80 leading-relaxed">{video.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== VALUES SECTION ========== */}
        <section id="values" className="py-24 lg:py-32 bg-[#FAF3E8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#E86A17] mb-3">Nilai-Nilai Kami</p>
              <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3D2314] mb-4 leading-tight">
                Komitmen untuk Kualitas
              </h2>
              <p className="text-lg text-[#5C3D28] leading-relaxed">
                Setiap keputusan yang kami buat didasarkan pada nilai-nilai yang telah kami pegang sejak awal.
              </p>
            </div>
            
            {/* Values Grid */}
            <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Layers, title: "Bahan Pilihan", desc: "Menggunakan singkong segar dari petani lokal dan gula Jawa premium untuk rasa autentik." },
                { icon: Shield, title: "Tanpa Pengawet", desc: "Tanpa bahan tambahan buatan. Kesegaran dan keamanan adalah prioritas utama." },
                { icon: Heart, title: "Dibuat dengan Cinta", desc: "Setiap getuk dibuat dengan penuh perhatian dan dedikasi, seperti buatan rumah sendiri." },
              ].map((value, index) => (
                <div key={index} className="p-8 bg-white rounded-2xl border border-[#5C3D28]/10 text-center transition-all duration-300 hover:-translate-y-1">
                  <div className="w-14 h-14 bg-[#E8C547] rounded-2xl flex items-center justify-center mx-auto mb-5">
                    <value.icon className="w-7 h-7 text-[#3D2314]" />
                  </div>
                  <h4 className="font-['Playfair_Display'] text-xl font-semibold text-[#3D2314] mb-3">{value.title}</h4>
                  <p className="text-[#5C3D28] leading-relaxed text-sm">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========== CTA SECTION ========== */}
        <section id="contact" className="py-24 lg:py-32 bg-gradient-to-br from-[#3D2314] to-[#2A1810] text-center relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'80\' height=\'80\' viewBox=\'0 0 80 80\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23E8C547\' fill-opacity=\'1\'%3E%3Cpath d=\'M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
          
          <div className="relative z-10 max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
              Siap Memesan?
            </h2>
            <p className="text-lg text-white/80 mb-10 leading-relaxed">
              Jadikan momen Anda lebih istimewa dengan oleh-oleh autentik dari Getuk Gondok. Hubungi kami untuk pemesanan khusus, hampers, maupun kebutuhan acara besar.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a 
                href="/catalogue" 
                className="inline-flex items-center gap-2 bg-[#E86A17] hover:bg-[#E8C547] text-white hover:text-[#3D2314] px-8 py-4 rounded-lg font-semibold transition-all hover:-translate-y-0.5 shadow-lg"
              >
                Pilih Produk Sekarang
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </a>
              <a 
                href="https://wa.me/6285643730540" 
                className="inline-flex items-center gap-2 border-2 border-white/30 text-white px-8 py-4 rounded-lg font-semibold transition-all hover:border-white hover:bg-white/10"
              >
                Hubungi Kami
              </a>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
      
      {/* Video Modal */}
      {videoModalOpen && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setVideoModalOpen(false)}
        >
          <div className="relative w-full max-w-4xl aspect-video bg-[#3D2314] rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60">
              <Play className="w-16 h-16 mb-4 opacity-50" />
              <p>Video player would appear here</p>
            </div>
            <button 
              className="absolute top-4 right-4 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              onClick={() => setVideoModalOpen(false)}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}


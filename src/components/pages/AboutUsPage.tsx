"use client";

import { useEffect, useState, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Play, Clock, Award, Layers, CheckCircle, Package, Heart, Shield, Star, Sparkles, Leaf } from "lucide-react";

export function AboutUsPage() {
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [parallaxOffset, setParallaxOffset] = useState(0);
  const imageRef = useRef<HTMLDivElement>(null);
  const modalVideoRef = useRef<HTMLVideoElement>(null);
  const previewVideoRef = useRef<HTMLVideoElement>(null);

  // Path to the video file (public/Video)
  const videoSrc = "/Video/getuk-gondok-video.mp4";

  // Pause video when modal closes
  useEffect(() => {
    if (!videoModalOpen && modalVideoRef.current) {
      modalVideoRef.current.pause();
      modalVideoRef.current.currentTime = 0;
    }
  }, [videoModalOpen]);

  useEffect(() => {
    const handleScroll = () => {
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        const distance = -rect.top * 0.15;
        setParallaxOffset(distance);
      }
    };

    let ticking = false;
    const handleScrollRAF = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScrollRAF, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScrollRAF);
  }, []);

  // About us images
  const aboutImages = [
    "/about-us/IMG_5931_SnapseedCopy-ezgif.com-jpg-to-webp-converter.webp",
    "/about-us/IMG_5932_SnapseedCopy-ezgif.com-jpg-to-webp-converter.webp",
    "/about-us/IMG_5933_SnapseedCopy-ezgif.com-jpg-to-webp-converter.webp",
    "/about-us/IMG_5934_SnapseedCopy-ezgif.com-jpg-to-webp-converter.webp",
  ];

  return (
    <div className="font-['Playfair_Display'] min-h-screen bg-[#FAF3E8]">
      <Header />
      
      <main>
        {/* ========== HERO SECTION — EDITORIAL/ABOUT STYLE ========== */}
        <section className="relative min-h-[85vh] flex items-center bg-[#FAF3E8] overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-l from-[#F5EBE0] to-transparent pointer-events-none"></div>
          <div className="absolute top-20 left-10 w-72 h-72 bg-[#E8C547]/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-[#E86A17]/5 rounded-full blur-3xl"></div>
          
          {/* Decorative line */}
          <div className="absolute top-32 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#5C3D28]/20 to-transparent"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
            {/* Editorial label */}
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-px bg-[#E86A17]"></div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#E86A17]">Tentang Kami</span>
            </div>
            
            <div className="grid lg:grid-cols-12 gap-12 items-start">
              {/* Left Column — Story headline */}
              <div className="lg:col-span-7">
                {/* Main headline */}
                <h1 className="font-['Playfair_Display'] text-5xl sm:text-6xl lg:text-7xl font-bold text-[#3D2314] leading-[1.05] mb-6">
                  Kisah di Balik
                  <span className="block text-[#E86A17]">Setiap Gigitan</span>
                </h1>
                
                {/* Story intro */}
                <p className="font-['Playfair_Display'] text-xl text-[#5C3D28] leading-relaxed mb-8 max-w-xl">
                  Lebih dari sekadar makanan, Getuk Gondok adalah cerita tentang keluarga, tradisi, dan kecintaan yang tak pernah padam terhadap cita rasa autentik khas Magelang.
                </p>
                
                {/* Year badge */}
                <div className="inline-flex items-center gap-4 bg-white rounded-2xl px-6 py-4 shadow-lg shadow-[#3D2314]/5 border border-[#5C3D28]/10">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#E8C547] to-[#E86A17] rounded-xl flex items-center justify-center">
                    <span className="font-['Playfair_Display'] font-bold text-white text-lg">85</span>
                  </div>
                  <div>
                    <strong className="block text-[#3D2314] font-bold text-lg font-['Playfair_Display']">Tahun Berdiri</strong>
                    <span className="text-sm text-[#5C3D28]">Warisan rasa sejak 1943</span>
                  </div>
                </div>
              </div>
              
              {/* Right Column — Visual narrative */}
              <div className="lg:col-span-5">
                <div className="relative">
                  {/* Main story image */}
                  <div className="relative rounded-3xl overflow-hidden aspect-[4/5] bg-gradient-to-br from-[#E8C547]/20 to-[#E86A17]/10 border border-[#5C3D28]/15">
                    <img 
                      src={aboutImages[0]} 
                      alt="Kisah Keluarga Pendiri Getuk Gondok"
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Decorative overlay */}
                    <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-[#3D2314]/80 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 right-6">
                      <p className="text-white/90 text-sm font-medium mb-1">Hj. Sri Rahayu</p>
                      <p className="text-white/60 text-xs">Pewaris Resep & Pendiri Getuk Gondok</p>
                    </div>
                  </div>
                  
                  {/* Floating quote card */}
                  <div className="absolute -left-6 top-1/4 bg-white rounded-2xl p-5 shadow-xl shadow-[#3D2314]/10 border border-[#5C3D28]/10 max-w-[200px]">
                    <div className="text-[#E8C547] text-3xl font-serif mb-2">"</div>
                    <p className="text-[#3D2314] text-sm leading-relaxed italic">
                      Setiap getuk yang kami buat penuh dengan cinta dan dedikasi, menjaga warisan rasa yang telah diwariskan dari generasi ke generasi.
                    </p>
                  </div>
                  
                  {/* Floating stat */}
                  <div className="absolute -right-4 bottom-12 bg-[#3D2314] rounded-2xl px-5 py-4 shadow-xl">
                    <div className="flex items-center gap-3">
                      <Layers className="w-6 h-6 text-[#E8C547]" />
                      <div>
                        <strong className="block text-white font-bold">4 Generasi</strong>
                        <span className="text-white/60 text-xs">Resep diwariskan</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Bottom scroll indicator */}
            <div className="mt-16 flex items-center justify-center lg:justify-start gap-3 text-[#5C3D28]/60">
              <span className="text-sm">Gulir untuk membaca kisah kami</span>
              <div className="w-6 h-10 border-2 border-[#5C3D28]/30 rounded-full flex justify-center pt-2">
                <div className="w-1.5 h-3 bg-[#E86A17] rounded-full animate-bounce"></div>
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
                  className="relative rounded-3xl overflow-hidden aspect-square bg-gradient-to-br from-[#F5EBE0] to-[#FAF3E8] border border-[#5C3D28]/10"
                  style={{ transform: `translateY(${parallaxOffset}px)` }}
                >
                  <img 
                    src={aboutImages[1]} 
                    alt="Keluarga Pendiri Getuk Gondok"
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Decorative circles */}
                <div 
                  className="absolute -inset-4 border-2 border-[#E8C547]/30 rounded-full -z-10" 
                  style={{ transform: `translateY(${parallaxOffset}px)` }}
                ></div>
                <div 
                  className="absolute -bottom-4 -right-4 w-2/3 h-2/3 border-2 border-[#E8C547]/20 rounded-full -z-10 bg-[#E8C547]/5" 
                  style={{ transform: `translateY(${parallaxOffset}px)` }}
                ></div>
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
                <div className="relative rounded-3xl overflow-hidden aspect-video bg-gradient-to-br from-[#5C3D28] to-[#2A1810] group cursor-pointer" onClick={() => setVideoModalOpen(true)}>
                  {/* Video Preview (muted, autoplay, loop) */}
                  <video
                    ref={previewVideoRef}
                    src={videoSrc}
                    className="absolute inset-0 w-full h-full object-cover"
                    muted
                    autoPlay
                    loop
                    playsInline
                    preload="metadata"
                  />

                  {/* Overlay gradient for better text contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#3D2314]/60 via-transparent to-[#3D2314]/20 pointer-events-none"></div>

                  {/* Decorative pattern */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 100 100\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Ccircle cx=\'50\' cy=\'50\' r=\'40\' fill=\'none\' stroke=\'%23E8C547\' stroke-width=\'0.3\'/%3E%3C/svg%3E")', backgroundSize: '180px'}}></div>

                  {/* Play Button */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="relative w-22 h-22 bg-[#E86A17] rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-[#E8C547] shadow-2xl" style={{width: '88px', height: '88px'}}>
                      <svg className="w-9 h-9 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <polygon points="5,3 19,12 5,21" />
                      </svg>
                    </div>
                    <p className="mt-4 text-white/90 text-sm font-medium tracking-wide">Klik untuk memutar video</p>
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

        {/* ========== KEUNGGULAN KAMI SECTION ========== */}
        <section id="why-us" className="py-24 lg:py-32 bg-[#FAF3E8]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-5 gap-12 items-center">
              {/* Content */}
              <div className="lg:col-span-2">
                <p className="text-sm font-bold uppercase tracking-[0.15em] text-[#E86A17] mb-3">Keunggulan Kami</p>
                <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3D2314] mb-4 leading-tight">
                  Mengapa Pelanggan
                  <span className="block">Mempercayai Kami?</span>
                </h2>
                <p className="text-lg text-[#5C3D28] leading-relaxed">
                  Resep warisan keluarga, bahan-bahan pilihan, serta proses pembuatan yang teliti menjadi komitmen kami dalam menghadirkan Getuk Gondok dengan cita rasa autentik dan kualitas yang konsisten.
                </p>
              </div>
              
              {/* Cards Grid - 2x2 on desktop, 2 cols on tablet, 1 col on mobile */}
              <div className="lg:col-span-3 grid sm:grid-cols-2 gap-6">
                {[
                  { icon: Award, title: "Resep Warisan", desc: "Menggunakan resep keluarga yang diwariskan secara turun-temurun untuk menjaga cita rasa autentik khas Getuk Gondok." },
                  { icon: CheckCircle, title: "Bahan Pilihan", desc: "Menggunakan singkong berkualitas dan bahan-bahan pilihan untuk menghasilkan tekstur yang lembut dan rasa yang konsisten." },
                  { icon: Sparkles, title: "Proses yang Teliti", desc: "Setiap tahap pembuatan dilakukan dengan penuh ketelitian untuk menjaga kualitas, tekstur, dan cita rasa di setiap produk." },
                  { icon: Package, title: "Kemasan Premium", desc: "Tersedia berbagai pilihan kemasan yang praktis dan menarik, cocok sebagai oleh-oleh, hampers, maupun hadiah." },
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

        {/* ========== GALLERY SECTION ========== */}
        <section id="gallery" className="py-24 lg:py-32 bg-[#F5EBE0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[#E86A17] mb-3">Galeri</p>
              <h2 className="font-['Playfair_Display'] text-3xl sm:text-4xl lg:text-5xl font-bold text-[#3D2314] mb-4 leading-tight">
                Momen Berharga
                <span className="block text-[#E86A17]">Bersama Getuk Gondok</span>
              </h2>
              <p className="text-lg text-[#5C3D28] leading-relaxed">
                Kenali lebih dekat perjalanan dan suasana di balik Getuk Gondok Hj. Sri Rahayu melalui galeri foto kami.
              </p>
            </div>
            
            {/* Images Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {aboutImages.map((image, index) => (
                <div 
                  key={index} 
                  className="relative rounded-2xl overflow-hidden aspect-square bg-gradient-to-br from-[#5C3D28]/20 to-[#3D2314]/10 group cursor-pointer"
                >
                  <img 
                    src={image} 
                    alt={`Galeri Getuk Gondok ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-[#3D2314]/0 group-hover:bg-[#3D2314]/30 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <svg className="w-5 h-5 text-[#3D2314]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))} 
            </div>
          </div>
        </section>

        {/* ========== FOOTER ========== */}
        <Footer />
      </main>

      {/* Video Modal */}
      {videoModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          onClick={() => setVideoModalOpen(false)}
        >
          <div
            className="relative w-full max-w-4xl aspect-video bg-[#3D2314] rounded-2xl overflow-hidden shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
              onClick={() => setVideoModalOpen(false)}
              aria-label="Tutup video"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <video
              ref={modalVideoRef}
              src={videoSrc}
              className="w-full h-full object-contain bg-black"
              controls
              autoPlay
              playsInline
            >
              Browser Anda tidak mendukung tag video.
            </video>
          </div>
        </div>
      )}
    </div>
  );
}

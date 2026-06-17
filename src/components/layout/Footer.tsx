import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-amber-950 text-amber-100/70 border-t border-amber-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="bg-white p-1.5 rounded-lg inline-block">
                      <Image src="/logo/1_20260505_231853_0000(1).png" alt="Logo" width={40} height={40} className="object-contain" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Getuk Gondok</h3>
                  </div>
                  <p className="text-sm leading-relaxed">
                    Pusat oleh-oleh khas Magelang yang memadukan resep tradisional dengan kualitas modern sejak 1985.
                  </p>
                </div>
    
                <div>
                  <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Hubungi Kami</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                      0856 4373 0540
                    </li>
                    <li className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      Magelang, Jawa Tengah
                    </li>
                  </ul>
                </div>
    
                <div>
                  <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Sosial Media</h4>
                  <ul className="space-y-3 text-sm">
                    <li><a href="#" className="hover:text-amber-400 transition-colors">@getukkondok (Instagram)</a></li>
                    <li><a href="#" className="hover:text-amber-400 transition-colors">@getukkondok_magelang (TikTok)</a></li>
                  </ul>
                </div>
    
                <div>
                  <h4 className="text-white font-bold mb-6 uppercase tracking-wider text-sm">Jam Operasional</h4>
                  <ul className="space-y-3 text-sm">
                    <li className="flex justify-between border-b border-amber-900 pb-2"><span>Senin - Jumat</span> <span>08:00 - 20:00</span></li>
                    <li className="flex justify-between border-b border-amber-900 pb-2"><span>Sabtu - Minggu</span> <span>07:00 - 21:00</span></li>
                  </ul>
                </div>
              </div>
    
              <div className="pt-8 border-t border-amber-900 text-center text-sm">
                <p>© {new Date().getFullYear()} Getuk Gondok Hj. Sri Rahayu. All rights reserved.</p>
              </div>
            </div>
          </footer>
  );
}

'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div key={pathname} className="page-transition flex min-h-full flex-1 flex-col">
      <span className="page-transition-indicator" aria-hidden="true" />
      {children}
    </div>
  );
}

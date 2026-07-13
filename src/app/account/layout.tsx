import type { ReactNode } from "react";

export default function AccountLayout({ children }: { children: ReactNode }) {
    return (
        <div className="flex flex-col min-h-screen font-['Playfair_Display']">
            {children}
        </div>
    );
}
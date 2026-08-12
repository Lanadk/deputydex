import Link from 'next/link'
import { notFound } from 'next/navigation'
import { NavLinks } from './nav-links'
import { ThemeSwitcherLib } from "@/app/(ui)/component-library/molecules/theme-switcher/theme-switcher-lib"

export default function ComponentLibraryLayout({ children }: { children: React.ReactNode }) {
    // Route réservée au dev : bloquée côté serveur
    // afin qu'un accès direct à l'URL en prod renvoie un vrai 404.
    if (process.env.NODE_ENV === 'production') {
        notFound()
    }

    return (
        <div className="min-h-screen">
            <header className="border-b border-main bg-main sticky top-0">
                <div className="max-w-7xl mx-auto px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/component-library">
                            <h1>
                                <span className="hidden md:inline">COMPONENT </span>
                                LIBRARY
                            </h1>
                        </Link>
                        <NavLinks />
                    </div>
                </div>
            </header>
            <main className="max-w-7xl mx-auto px-8 py-8">
                {children}
            </main>
            <ThemeSwitcherLib/>
        </div>
    )
}
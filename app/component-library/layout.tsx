import Link from 'next/link'
import { NavLinks } from './nav-links'
import { ThemeSwitcher } from "@/app/component-library/molecules/theme-switcher/theme-switcher"

export default function ComponentLibraryLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen">
            <header className="border-b border-main bg-main sticky top-0 z-50">
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
            <ThemeSwitcher/>
        </div>
    )
}
"use client"

import Link from 'next/link'
import { useSearchParams, usePathname } from 'next/navigation'
import { Suspense } from 'react'

function NavLinksContent() {
    const searchParams = useSearchParams()
    const pathname = usePathname()

    const getActiveType = () => {
        const typeParam = searchParams.get('type');
        if (typeParam) return typeParam;
        if (pathname.includes('/atoms')) return 'Atoms';
        if (pathname.includes('/molecules')) return 'Molecules';
        return 'Atoms';
    }

    const type = getActiveType()

    return (
        <nav className="flex gap-8">
            <Link
                href="/component-library?type=Atoms"
                className={`nav-link ${type === 'Atoms' ? 'nav-link-active' : ''}`}
            >
                Atoms
            </Link>
            <Link
                href="/component-library?type=Molecules"
                className={`nav-link ${type === 'Molecules' ? 'nav-link-active' : ''}`}
            >
                Molecules
            </Link>
        </nav>
    )
}

export function NavLinks() {
    return (
        <Suspense fallback={<nav className="flex gap-8">Chargement...</nav>}>
            <NavLinksContent />
        </Suspense>
    )
}
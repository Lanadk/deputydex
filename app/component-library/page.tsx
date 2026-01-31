"use client"

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {PageHeader} from "@/app/component-library/molecules/page-header/page-header";

const components = {
    Atoms: [
        { name: 'Button', path: '/component-library/atoms/button' },
        { name: 'Span', path: '/component-library/atoms/span' },
        { name: 'Badge', path: '/component-library/atoms/badge' },
        { name: 'Badge-avatar', path: '/component-library/atoms/badge-avatar' }

    ],
    Molecules: [
        { name: 'ToggleSwitch', path: '/component-library/molecules/toggle-switch' },
        { name: 'Input', path: '/component-library/molecules/input' },
        { name: 'Select', path: '/component-library/molecules/select' },
        { name: 'Page-Header', path: '/component-library/molecules/page-header' },
        { name: 'Activity-calendar', path: '/component-library/molecules/activity-calendar' }
    ],
};

export default function ComponentLibraryPage() {
    const searchParams = useSearchParams();
    const type = searchParams.get('type') || 'Atoms';
    const currentComponents = components[type as keyof typeof components] || components.Atoms;

    return (
        <div>
            <PageHeader
                title={type}
                subtitle="Sélectionnez un composant pour voir tous ses variants"
            />

            {/* Grid de cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentComponents.map((component) => (
                    <Link href={component.path} key={component.name}>
                        <div className="border border-main bg-card rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                            <h3>{component.name}</h3>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
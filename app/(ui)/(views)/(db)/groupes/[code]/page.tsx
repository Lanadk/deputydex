import { PageHeaderLib } from "@/app/(ui)/component-library/molecules/page-header/page-header-lib";

export default async function GroupePage({
                                             params,
                                         }: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;

    return (
        <>
            <div className="border-b border-main pb-6 mb-8">
                <PageHeaderLib
                    title={`Groupe ${code}`}
                    subtitle="Présentation, composition, activité et informations détaillées."
                />
            </div>

            <main>
                Contenu du groupe {code}
            </main>
        </>
    );
}
import GroupePageClient from "@/app/(ui)/(views)/(db)/groupes/[code]/groupe-page-client";

export default async function GroupePage({
                                             params,
                                         }: {
    params: Promise<{ code: string }>;
}) {
    const { code } = await params;

    return <GroupePageClient code={code} />;
}
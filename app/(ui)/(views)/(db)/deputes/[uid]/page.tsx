import DeputePageClient from "@/app/(ui)/(views)/(db)/deputes/[uid]/depute-page-client";

export default async function DeputePage({
    params,
}: {
    params: Promise<{ uid: string }>;
}) {
    const { uid } = await params;
    return <DeputePageClient uid={uid} />;
}

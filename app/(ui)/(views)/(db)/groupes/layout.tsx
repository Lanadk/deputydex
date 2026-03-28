import {BaseLayout} from "@/app/(ui)/component-library/template/base-layout/base-layout-lib";


export default function GroupesLayout({children,}: {
    children: React.ReactNode;
}) {
    return <BaseLayout>{children}</BaseLayout>;
}
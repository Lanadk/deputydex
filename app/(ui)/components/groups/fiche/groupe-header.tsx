import React from "react";
import {GroupeInfosDTO} from "@/app/domains/groupes/dto/groupe-infos.dto";

type GroupeHeaderProps = {
    groupeInfos: GroupeInfosDTO
};

export const GroupeHeader: React.FC<GroupeHeaderProps> = (props: GroupeHeaderProps) => {

    return (
        <p>Header</p>
    );
}
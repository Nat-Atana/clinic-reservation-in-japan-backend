type doctorType = {
    id: number;
    clinic: number;
    name: string;
    furigana: string;
    sex: string;
    sort: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
};

type clinicListType = {
    id: number;
    title: string;
    active: number;
}

type filterOptionType = {
    type: string;
    name: string;
    label: string;
    value: any;
}

export type { doctorType, clinicListType, filterOptionType }
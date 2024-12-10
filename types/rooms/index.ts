type roomType = {
    id: number;
    clinic: number;
    name: string;
    sort: number;
    createdAt: string;
    updatedAt: string;
    active: string;
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

export type { roomType, clinicListType, filterOptionType }
type breakdayType = {
    id: number;
    title: string;
    date: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
};

type filterOptionType = {
    type: string;
    name: string;
    label: string;
    value: any;
}

export type { breakdayType, filterOptionType }
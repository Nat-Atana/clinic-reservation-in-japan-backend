type atanaType = {
    id: number;
    name: string;
    session: string;
    content: string;
    created_at: string;
};

type filterOptionType = {
    type: string;
    name: string;
    label: string;
    value: any;
}

export type { atanaType, filterOptionType }
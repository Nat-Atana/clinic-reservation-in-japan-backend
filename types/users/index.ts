type userType = {
    id: number;
    name: string;
    email: string;
    active: number;
    createdAt: string;
    updatedAt: string;
    role: string;
    menu: string;
};

type filterOptionType = {
    type: string;
    name: string;
    label: string;
    value: any;
}

export type { userType, filterOptionType }
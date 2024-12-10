type clinicType = {
    id: number;
    title: string;
    webURL: string;
    reserveDate: number;
    questionDate: number;
    isNoti: boolean;
    webInterview1: number;
    webInterview2: number;
    exam1: number;
    exam2: number;
    roomsURL: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
    sort: string;
};

type filterOptionType = {
    type: string;
    name: string;
    label: string;
    value: any;
}

export type { clinicType, filterOptionType }
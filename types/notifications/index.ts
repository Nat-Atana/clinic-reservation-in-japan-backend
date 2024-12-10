type notificationType = {
    id: number;
    patientEmail: string;
    isNoti: boolean;
    webInterview1: number;
    webInterview2: number;
    exam1: number;
    exam2: number;
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

export type { notificationType, filterOptionType }
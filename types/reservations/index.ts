type reservationType = {
    id: number;
    patientName: string;
    patientFurigana: string;
    patientGender: string;
    patientDOB: string;
    patientPhone: string;
    patientEmail: string;
    patientZipCode: string;
    patientAddress: string;
    patientNote: string;
    medicalNum: string;
    frame: number;
    clinic: number;
    room: number;
    doctor: number;
    date: string;
    fromTime: string;
    toTime: string;
    webURL: string;
    webInterviewStatus: string;
    createdAt: string;
    updatedAt: string;
    active: boolean;
};

type frameListType = {
    id: number;
    title: string;
}

type filterOptionType = {
    type: string;
    name: string;
    label: string;
    value: any;
}

export type { reservationType, frameListType, filterOptionType }
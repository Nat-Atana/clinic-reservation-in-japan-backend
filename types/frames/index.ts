type frameType = {
    id: number;
    room: number;
    doctor: number;
    clinic: number;
    date: string;
    title: string;
    fromTime: string;
    toTime: string;
    availableReserve: number;
    remainReserve: number;
    createdAt: string;
    updatedAt: string;
    active: boolean;
};

type roomType = {
    id: number;
    name: string;
    clinic: number;
    active: number;
}

type doctorType = {
    id: number;
    name: string;
    clinic: number;
    active: number;
}

type clinicType = {
    id: number;
    title: string;
    active: number;
}

type holidayType = {
    id: number;
    title: string;
    date: string;
}

type eventType = {
    id: number,
    start: string,
    end: string,
    data: any
    title: string,
    class: string,
}

type filterOptionType = {
    type: string;
    name: string;
    label: string;
    value: any;
}

export type { frameType, roomType, doctorType, clinicType, eventType, holidayType, filterOptionType }
<script setup lang="ts">
/*Call Components*/
import { useAxios } from '@/composables/useAxios';
import type { frameType, doctorType, roomType, clinicType, eventType, holidayType, filterOptionType } from '@/types/frames/index';
import VueCal from 'vue-cal';
import 'vue-cal/dist/i18n/ja.es.js';
import "vue-cal/dist/vuecal.css"
import { useField, useForm } from 'vee-validate'
import { useRoute } from 'vue-router';

const axios = useAxios();
const route = useRoute();
const roomId = route.params.id;

const frames = ref<frameType[]>([]);
const doctorList = ref<doctorType[]>([]);
const roomList = ref<roomType[]>([]);
const clinicList = ref<clinicType[]>([]);
const holidayList = ref<holidayType[]>([]);
const doctorListForTable = ref<doctorType[]>([]);
const roomListForTable = ref<roomType[]>([]);
const roomCListForTable = ref<roomType[]>([]);
const clinicListForTable = ref<clinicType[]>([]);
const events = ref<eventType[]>([]);
const isModalOpen = ref(false);
const isEdit = ref(false);
const newFrame = ref({ doctor: 0, room: 0, clinic: 0, date: '',fromTime: '', toTime: '', availableReserve: 0, id: 0, index: 0 });
const modalTitle = ref("");
const totalItems = ref(1);
const currentPage = ref(1);
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000,
});
const filteredFrames = ref<frameType[]>([]);
const currentRoom = ref(roomId);
const searchInput = ref("");
const tab = ref("");
const showCopyDialog = ref(false);
const selectedEvent = ref<any>();
const toggle = ref([]);
const copyFromDate = ref('');
const copyToDate = ref('');
const errorFromMessage = ref('');
const errorToMessage = ref('');
const errorWeekMessage = ref('');
const vuecal = ref<InstanceType<typeof VueCal>| null>(null);
const searchFromDate = ref(new Date().toISOString().slice(0, 10));
const searchToDate = ref('');
const searchFromTime = ref('');
const searchToTime = ref('');

const isDeleteDialogOpen = ref(false);
const deleteData = ref({
    id: 0,
    index: 0
})
const menu = ref(false);
const filterOptions = ref<filterOptionType[]>([
    {
        type: 'switch',
        label: '無効データを含める',
        name: 'active',
        value: false
    },
    {
        type : 'number',
        label : '診察室',
        name : 'room',
        value : 0
    },
    {
        type : 'date',
        label : '年⽉⽇',
        name : 'fromDate',
        value : '0000-00-00'
    },
    {
        type : 'date',
        label : '年⽉⽇',
        name : 'toDate',
        value : '0000-00-00'
    },
    {
        type : 'time',
        label : '時刻',
        name : 'fromTime',
        value : '00:00'
    },
    {
        type : 'time',
        label : '時刻',
        name : 'toTime',
        value : '00:00'
    },
])

const handleApplyFilter = () => {
    menu.value = false;
    currentPage.value = 1;
    
    if ( currentRoom.value > 0 )
        filterOptions.value[1].value = currentRoom.value;
    if ( searchFromDate.value !== "" )
        filterOptions.value[2].value = searchFromDate.value;
    if ( searchToDate.value !== "" )
        filterOptions.value[3].value = searchToDate.value;
    if ( searchFromTime.value !== "" )
        filterOptions.value[4].value = searchFromTime.value;
    if ( searchToTime.value !== "" )
        filterOptions.value[5].value = searchToTime.value;
    
    fetchFramesByFilter(filterOptions.value);
}

const handleRemoveFilter = () => {
    menu.value = false;
    currentPage.value = 1;

    searchFromDate.value = new Date().toISOString().slice(0, 10);
    searchToDate.value = "";
    searchFromTime.value = "";
    searchToTime.value = "";
    
    filterOptions.value[2].value = new Date().toISOString().slice(0, 10);
    filterOptions.value[3].value = "0000-00-00";
    filterOptions.value[4].value = "00:00";
    filterOptions.value[5].value = "00:00";
    
    fetchFramesByFilter(filterOptions.value);
}

const openDeleteDialog = (id: number, index: number) => {
    isDeleteDialogOpen.value = true;
    deleteData.value = {id: id, index: index};
}

function showToast(color: string, text: string) {
  snackbar.value = {
    show: true,
    text: text,
    color: color,
    timeout: 3000,
  };
}

const handleAddClick = () => {
    const now = new Date();

    modalTitle.value = "予約枠追加";
    newFrame.value = { doctor: doctorList.value[0]?.id, room: roomList.value[0]?.id, clinic: clinicList.value[0]?.id, date: '', fromTime: '', toTime: '', availableReserve: 0, id: 0, index: 0}
    isModalOpen.value = true;
    isEdit.value = false;

    let doctorData = Object.values(doctorListForTable.value);
    doctorList.value = doctorData?.filter((doctor: doctorType) => doctor.active == 1 && doctor.clinic === clinicList.value[0]?.id);

    doctor.value.value = '';
    date.value.value = '';
    fromTime.value.value = '';
    toTime.value.value = '';
    reserveCnt.value.value = '';
}

const handleEditClick = (data: frameType, index: number) => {
    modalTitle.value = "予約枠編集";
    isModalOpen.value = true;
    isEdit.value = true;

    newFrame.value = {
        doctor: data.doctor,
        clinic: data.clinic,
        room: data.room,
        date: data.date,
        fromTime: data.fromTime,
        toTime: data.toTime,
        availableReserve: data.availableReserve,
        id: data.id,
        index: index
    };

    let doctorData = Object.values(doctorListForTable.value);
    doctorList.value = doctorData?.filter((doctor: doctorType) => doctor.active == 1 && doctor.clinic === Number(data.clinic));

    doctor.value.value = data.doctor;
    date.value.value = data.date;
    fromTime.value.value = data.fromTime.slice(0, 5);
    toTime.value.value = data.toTime.slice(0, 5);
    reserveCnt.value.value = data.availableReserve;
}

const fetchFrames = async (filters: filterOptionType[] = []) => {
    try {
        const response = await axios.get('/frames/room', {
            params: { id: roomId }
        });

        let selClinic;
        frames.value = response.data.frames;
        roomList.value = response.data.rooms?.filter((room: roomType) => room.active == 1);
        selClinic = roomList.value[0].clinic;

        doctorList.value = response.data.doctors?.filter((doctor: doctorType) => doctor.active == 1 && doctor.clinic == selClinic);
        if (Object.values(doctorList.value).length)
            doctor.value.value = doctorList.value[0].id;
        else
            doctor.value.value = "";

        clinicList.value = response.data.clinics?.filter((clinic: clinicType) => clinic.active == 1);
        holidayList.value = response.data.holidays;

        filteredFrames.value = frames.value;

        currentRoom.value = Number(roomId);

        roomListForTable.value = response.data.rooms.reduce((obj: any, item: any) => {
            obj[item.id] = {id: item.id, name: item.name};
            return obj;
        }, {});
        roomCListForTable.value = response.data.rooms.reduce((obj: any, item: any) => {
            obj[item.id] = {id: item.id, clinic: item.clinic};
            return obj;
        }, {});
        doctorListForTable.value = response.data.doctors.reduce((obj: any, item: any) => {
            obj[item.id] = item;
            return obj;
        }, {});
        
        clinicListForTable.value = response.data.clinics.reduce((obj: any, item: any) => {
            obj[item.id] = item;
            return obj;
        }, {});
        totalItems.value = response.data.frames.length;

        events.value = [
            ...response.data.frames.map((item: frameType) => ({
                id: item.id,
                title: ((item.availableReserve == item.remainReserve) ? "〇" : (item.remainReserve == 0) ? "×" : "△") + " " + item.fromTime.slice(0, 5) + "~" + item.toTime.slice(0, 5) + " (" + item.remainReserve + "/" + item.availableReserve + ")",
                start: item.date + " " + item.fromTime,
                end: item.date + " " + item.toTime,
                class: (item.remainReserve == 0) ? 'bg-surface-light' : 'bg-secondary',
                data: item
            })),
            ...response.data.holidays.map((item: holidayType) => ({
                id: item.id,
                title: item.title,
                start: item.date.slice(0, 10),
                end: item.date.slice(0, 10),
                class: 'bg-success',
                data: item
            }))
        ];

        events.value = events.value.sort((a, b) => {
            const aStartTime = new Date(a.start).getTime();
            const bStartTime = new Date(b.start).getTime();
            return aStartTime - bStartTime;
        });
    } catch (error) {
        showToast("error", "データの取得に失敗しました。");
        frames.value = [];
    }
};

const fetchFramesByFilter = async (filters: filterOptionType[] = []) => {
    try {
        const response = await axios.get('/frames', {
            params: filters
        });
        frames.value = response.data.frames;
        
        totalItems.value = response.data.frames.length;

        events.value = [
            ...response.data.frames.map((item: frameType) => ({
                id: item.id,
                title: ((item.availableReserve == item.remainReserve) ? "〇" : (item.remainReserve == 0) ? "×" : "△") + " " + item.fromTime.slice(0, 5) + "~" + item.toTime.slice(0, 5) + " (" + item.remainReserve + "/" + item.availableReserve + ")",
                start: item.date + " " + item.fromTime,
                end: item.date + " " + item.toTime,
                class: (item.remainReserve == 0) ? 'bg-surface-light' : 'bg-secondary',
                data: item
            })),
            ...Object.values(holidayList.value).map((item: holidayType) => ({
                id: item.id,
                title: item.title,
                start: item.date.slice(0, 10),
                end: item.date.slice(0, 10),
                class: 'bg-success',
                data: item
            }))
        ];

        events.value = events.value.sort((a, b) => {
            const aStartTime = new Date(a.start).getTime();
            const bStartTime = new Date(b.start).getTime();
            return aStartTime - bStartTime;
        });
    } catch (error) {
        showToast("error", "データの取得に失敗しました。");
        frames.value = [];
    }
};

const handleChangeRoom = async (value: any) => {
    try {
        filterOptions.value[1].value = value;
        if ( searchFromDate.value !== "" )
            filterOptions.value[2].value = searchFromDate.value;

        const response = await axios.get('/frames', {
            params: filterOptions.value
        });
        frames.value = response.data.frames;
        
        totalItems.value = response.data.frames.length;

        events.value = [
            ...response.data.frames.map((item: frameType) => ({
                id: item.id,
                title: ((item.availableReserve == item.remainReserve) ? "〇" : (item.remainReserve == 0) ? "×" : "△") + " " + item.fromTime.slice(0, 5) + "~" + item.toTime.slice(0, 5) + " (" + item.remainReserve + "/" + item.availableReserve + ")",
                start: item.date + " " + item.fromTime,
                end: item.date + " " + item.toTime,
                class: (item.remainReserve == 0) ? 'bg-surface-light' : 'bg-secondary',
                data: item
            })),
            ...Object.values(holidayList.value).map((item: holidayType) => ({
                id: item.id,
                title: item.title,
                start: item.date.slice(0, 10),
                end: item.date.slice(0, 10),
                class: 'bg-success',
                data: item
            }))
        ];

        events.value = events.value.sort((a, b) => {
            const aStartTime = new Date(a.start).getTime();
            const bStartTime = new Date(b.start).getTime();
            return aStartTime - bStartTime;
        });
    } catch (error) {
        showToast("error", "データの取得に失敗しました。");
        frames.value = [];
    }
};

const handleChangeRoomOnAdd = (value: any) => {
    let roomData = Object.values(roomCListForTable.value);
    const roomInfo = roomData?.filter((room: roomType) => room.id == value);

    let doctorData = Object.values(doctorListForTable.value);
    doctorList.value = doctorData?.filter((doctor: doctorType) => doctor.active == 1 && Number(doctor.clinic) === Number(roomInfo[0].clinic));

    if (Object.values(doctorList.value).length)
        doctor.value.value = doctorList.value[0].id;
    else
        doctor.value.value = "";
}

const { handleSubmit, handleReset } = useForm({
    validationSchema: {
        doctor (value: string) {
            if (Number(value) > 0) return true;
            return '担当医を選択してください。';
        },
        date (value: string) {
            if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(value)) return true;
            return '年⽉⽇を正確に入力してください。';
        },
        fromTime (value: string) {
            if (/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/.test(value)) return true;
            return '開始時間を正確に入力してください。';
        },
        toTime (value: string, formValues: any) {
            if (/^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/.test(value)) {
                if (value <= formValues.form.fromTime)
                    return '終了時間を正確に入力してください。';
                else
                    return true;
            } 
            return '終了時間を正確に入力してください。';
        },
        reserveCnt (value: number) {
            if (value > 0) return true;
            return '予約可能数を正確に入力してください。';
        },
    },
})

const doctor = useField('doctor');
const date = useField('date');
const fromTime = useField('fromTime');
const toTime = useField('toTime');
const reserveCnt = useField('reserveCnt');

const saveframe = handleSubmit(async (values) => {
    newFrame.value.doctor = values.doctor;
    newFrame.value.date = values.date;
    newFrame.value.fromTime = values.fromTime;
    newFrame.value.toTime = values.toTime;
    newFrame.value.availableReserve = values.reserveCnt;
    newFrame.value.clinic = roomCListForTable.value[newFrame.value.room]?.clinic;

    if (isEdit.value) {
        isModalOpen.value = false;

        try {
            const response = await axios.put(`/frames/${newFrame.value.id}`, {
                data: newFrame
            });

            if (response && response.data) {
                if (response.data.message && response.data.message == "Already Exist") {
                    showToast("warning", "すでに登録されている予約枠があります。");
                    return;
                }

                if (response.data.message && response.data.message == "Can't Update") {
                    showToast("warning", "すでに予約済みの情報があります。");
                    return;
                }
            }

            if (response && response.data.room == currentRoom.value)
                frames.value.splice(newFrame.value.index, 1, response.data);
            
            filteredFrames.value = frames.value;

            const eventIndex = events.value.findIndex(event => event.id === response.data.id);
            if (eventIndex !== -1) {
                events.value.splice(eventIndex, 1, {
                    id: response.data.id,
                    title: ((response.data.availableReserve == response.data.remainReserve) ? "〇" : (response.data.remainReserve == 0) ? "×" : "△") + " " + response.data.fromTime.slice(0, 5) + "~" + response.data.toTime.slice(0, 5) + " (" + response.data.remainReserve + "/" + response.data.availableReserve + ")",
                    start: response.data.date + " " + response.data.fromTime,
                    end: response.data.date + " " + response.data.toTime,
                    class: (response.data.remainReserve == 0) ? 'bg-surface-light' : 'bg-secondary',
                    data: response.data
                });
            }

            showToast("success", "正確に編集されました。");
        } catch (error) {
            showToast("error", "編集に失敗しました。");
        }
    } else {
        isModalOpen.value = false;

        try {
            const response = await axios.post('/frames', {
                data: newFrame
            });

            if (response && response.data) {
                if (response.data.message && response.data.message == "Already Exist") {
                    showToast("warning", "すでに登録されている予約枠があります。");
                    return;
                }
            }

            if (response && response.data.room == currentRoom.value)
                frames.value = frames.value.concat(response.data);
            filteredFrames.value = frames.value;

            totalItems.value += 1;

            events.value = events.value.concat({
                id: response.data.id,
                title: "〇" + " " + response.data.fromTime.slice(0, 5) + "~" + response.data.toTime.slice(0, 5) + " (" + response.data.remainReserve + "/" + response.data.availableReserve + ")",
                start: response.data.date + " " + response.data.fromTime,
                end: response.data.date + " " + response.data.toTime,
                class: 'bg-secondary',
                data: response.data
            });

            events.value = events.value.sort((a, b) => {
                const aStartTime = new Date(a.start).getTime();
                const bStartTime = new Date(b.start).getTime();
                return aStartTime - bStartTime;
            });
            
            showToast("success", "正確に追加されました。");
        } catch (error) {
            showToast("error", "追加に失敗しました。");
        }
    }
});

const deleteFrame = async (id: number, index: number = deleteData.value.index) => {
    isDeleteDialogOpen.value = false;
    try {
        const response = await axios.delete(`/frames/${deleteData.value.id}`);

        if (response && response.data) {
            if (response.data.message && response.data.message == "Reservation Exist") {
                showToast("warning", "すでに登録されている予約データがあります。");
                return;
            }
        }
        
        frames.value.splice(index, 1);
        filteredFrames.value = frames.value;

        totalItems.value -= 1;

        events.value.splice(index, 1);
        
        showToast("success", "正確に無効化されました。");
    } catch (error) {
        showToast("error", "無効化に失敗しました。");
    }
}

const onCalEventClick = (event: any, e: any) => {
    if (event && event.data && event.data.active) {
        showCopyDialog.value = true;
        selectedEvent.value = event;
        e.stopPropagation();
    }
}

const onCalDayClick = (event: any, e: any) => {
    const currentView = vuecal.value?.view;
    if ( currentView.id === "month" || currentView.id === "week" || currentView.id === "day" ) {
        if ( event instanceof Date ) {
            const year = event.getFullYear();
            const month = String(event.getMonth() + 1).padStart(2, '0');
            const date = String(event.getDate()).padStart(2, '0');
            const copyDate = `${year}-${month}-${date}`;
            
            const copyEvents = events.value.filter(frame => frame.data.date === copyDate && frame.data.clinic);
            if ( copyEvents.length > 0 ) {
                showCopyDialog.value = true;
                selectedEvent.value = copyEvents;
            }
        }
    }
}

const validateFromDate = (value : string) => {
    const urlRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
    if (!urlRegex.test(value)) {
        errorFromMessage.value = '年⽉⽇を正確に入力してください。';
        return false;
    } else {
        errorFromMessage.value = '';
        return true;
    }
}

const validateToDate = (value : string) => {
    const urlRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/
    if (!urlRegex.test(value)) {
        errorToMessage.value = '年⽉⽇を正確に入力してください。';
        return false;
    } else {
        errorToMessage.value = '';
        return true;
    }
}

const saveCopyFrames = async (value: any) => {
    const fromDateValid = validateFromDate(copyFromDate.value);
    const toDateValid = validateToDate(copyToDate.value);
    const toggleValid = toggle.value.length > 0 ? true : false;

    if (toggle.value.length == 0)
        errorWeekMessage.value = '曜日を選択してください。';

    if (!fromDateValid || !toDateValid || !toggleValid)
        return;

    showCopyDialog.value = false;
    try {
        let selFrames = [];
        if ( Array.isArray(selectedEvent.value) ) {
            selFrames = selectedEvent.value.reduce((newframes: any, frame: any) => {
                newframes.push(frame.data);
                return newframes;
            }, []);
        } else {
            selFrames.push(selectedEvent.value.data);
        }
        
        const response = await axios.post('/frames/copy', {
            from: copyFromDate.value,
            to: copyToDate.value,
            toggle: toggle.value,
            frames: selFrames,
            // clinic: selectedEvent.value.data.clinic,
            // room: selectedEvent.value.data.room,
            // doctor: selectedEvent.value.data.doctor,
            // fromTime: selectedEvent.value.data.fromTime,
            // toTime: selectedEvent.value.data.toTime,
            // availableReserve: selectedEvent.value.data.availableReserve
        });

        if (response && response.data && response.data.length > 0) {
            frames.value = frames.value.concat(response.data);
            filteredFrames.value = frames.value;
            totalItems.value = frames.value.length;
            
            const newEvents = response.data.map((item: frameType) => ({
                id: item.id,
                title: ((item.availableReserve == item.remainReserve) ? "〇" : (item.remainReserve == 0) ? "×" : "△") + " " + item.fromTime.slice(0, 5) + "~" + item.toTime.slice(0, 5) + " (" + item.remainReserve + "/" + item.availableReserve + ")",
                start: item.date + " " + item.fromTime,
                end: item.date + " " + item.toTime,
                class: (item.remainReserve == 0) ? 'bg-surface-light' : 'bg-secondary',
                data: item
            }));
            
            events.value = events.value.concat(newEvents);
        }

        showToast("success", "正確にコピーされました。");
    } catch (error) {
        showToast("error", "予約枠コピーに失敗しました。");
    }
}

const handleSearchInput = () => {
    // filteredFrames.value = frames.value.filter(item => item.doctor.includes(searchInput.value));
}

onMounted(fetchFrames);
</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-row>
                <v-card elevation="10" class="">
                    <v-tabs
                        v-model="tab"
                        bg-color="primary"
                    >
                        <v-tab value="table">一覧で表示</v-tab>
                        <v-tab value="calendar">カレンダー形式で表示</v-tab>
                    </v-tabs>
                    <v-card-item class="pa-6">
                        <div class="d-flex justify-space-between">
                            <v-card-title class="text-h5 pt-sm-2 pb-7">予約枠管理 <span class="text-h6">(1つの予約枠と1日分の予約枠を選択してコピーすることができます。)</span></v-card-title>
                            <div>
                                <v-btn @click="handleAddClick" color="primary" size="large">追加</v-btn>
                            </div>
                        </div>
                        <div class="d-flex justify-space-between align-center">
                            <v-label class="text-h5 mb-1 mr-3">診察室</v-label>
                            <v-select
                                v-model="currentRoom"
                                :items="roomList"
                                item-title="name"
                                item-value="id"
                                variant="outlined"
                                density="compact"
                                hide-details
                                @update:modelValue="handleChangeRoom"
                                class="mr-3 dense-height"
                            ></v-select>
                            <v-switch
                                class="pl-3"
                                v-if="filterOptions[0].type === 'switch'"
                                v-model="filterOptions[0].value"
                                color="primary"
                                :label="filterOptions[0].label"
                                hide-details
                                @change="handleApplyFilter"
                            ></v-switch>
                        </div>
                        <div class="d-flex justify-space-between">
                            <div class="d-flex align-start">
                                <v-label class="text-h5 mb-1 mr-3">年⽉⽇</v-label>
                                <v-text-field 
                                    type="date" 
                                    v-model="searchFromDate"
                                    variant="outlined" 
                                    density="compact"
                                    class="custom-date-input"
                                    style="max-width: 150px;">
                                </v-text-field>
                                <v-label class="text-h5 mb-1 mr-3 ml-3">~</v-label>
                                <v-text-field 
                                    type="date" 
                                    v-model="searchToDate"
                                    variant="outlined" 
                                    density="compact"
                                    class="custom-date-input"
                                    style="max-width: 150px;">
                                </v-text-field>
                                <v-label class="text-h5 mb-1 mr-3 ml-10">時刻</v-label>
                                <v-text-field 
                                    type="time" 
                                    v-model="searchFromTime"
                                    variant="outlined" 
                                    class="custom-date-input"
                                    density="compact"
                                    style="max-width: 150px;"
                                ></v-text-field>
                                <v-label class="text-h5 mb-1 mr-3 ml-3">~</v-label>
                                <v-text-field 
                                    type="time" 
                                    v-model="searchToTime"
                                    variant="outlined" 
                                    class="custom-date-input"
                                    density="compact"
                                    style="max-width: 150px;"
                                ></v-text-field>
                            </div>
                            <div>
                                <v-btn @click="handleApplyFilter" color="primary" size="large">検索</v-btn>
                                <v-btn @click="handleRemoveFilter" color="primary" size="large" class="ml-3">初期化</v-btn>
                            </div>
                        </div>
                        <v-container>
                            <v-window v-model="tab">
                                <v-window-item value="table">
                                    <v-table class="month-table">
                                        <thead>
                                            <tr>
                                                <th class="text-subtitle-1 font-weight-bold">番号</th>
                                                <th class="text-subtitle-1 font-weight-bold">予約枠ID</th>
                                                <th class="text-subtitle-1 font-weight-bold">診療科</th>
                                                <!-- <th class="text-subtitle-1 font-weight-bold">診察室</th> -->
                                                <th class="text-subtitle-1 font-weight-bold">担当医</th>
                                                <th class="text-subtitle-1 font-weight-bold">年⽉⽇</th>
                                                <th class="text-subtitle-1 font-weight-bold">時刻From</th>
                                                <th class="text-subtitle-1 font-weight-bold">時刻To</th>
                                                <th class="text-subtitle-1 font-weight-bold">予約枠数</th>
                                                <th class="text-subtitle-1 font-weight-bold">予約データ</th>
                                                <!-- <th class="text-subtitle-1 font-weight-bold">作成⽇</th>
                                                <th class="text-subtitle-1 font-weight-bold">更新⽇</th> -->
                                                <th class="text-subtitle-1 font-weight-bold text-center">作用</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(item, index) in frames.slice((currentPage-1) * 10, currentPage * 10)" :key="item.id" class="month-item">
                                                <td>
                                                    <p class="text-15 font-weight-medium">{{ (currentPage-1) * 10 + index + 1 }}</p>
                                                </td>
                                                <td>
                                                    <p class="text-15 font-weight-medium">{{ item.id }}</p>
                                                </td>
                                                <td>
                                                    <h6 class="text-h5 font-weight-bold">{{ clinicListForTable[item.clinic]?.title }}</h6>
                                                </td>
                                                <!-- <td>
                                                    <h6 class="text-body-1 font-weight-bold">{{ roomListForTable[item.room]?.name }}</h6>
                                                </td> -->
                                                <td>
                                                    <h6 class="text-body-1 font-weight-bold">{{ doctorListForTable[item.doctor]?.name }}</h6>
                                                </td>
                                                <td>
                                                    <h6 class="text-body-1 font-weight-bold">{{ item.date }}</h6>
                                                </td>
                                                <td>
                                                    <h6 class="text-body-1 font-weight-bold">{{ item.fromTime.slice(0,5) }}</h6>
                                                </td>
                                                <td>
                                                    <h6 class="text-body-1 font-weight-bold">{{ item.toTime.slice(0,5) }}</h6>
                                                </td>
                                                <td>
                                                    <h6 class="text-body-1 font-weight-bold">{{ item.remainReserve }} / {{ item.availableReserve }}</h6>
                                                </td>
                                                <td>
                                                    <h6 class="text-body-1 font-weight-bold">
                                                        <NuxtLink :to="`/reserve/${item.id}`">予約データ⼀覧</NuxtLink>
                                                    </h6>
                                                </td>
                                                <!-- <td>
                                                    <h6 class="text-body-1">{{ item.createdAt.slice(0, 10) }}</h6>
                                                </td>
                                                <td>
                                                    <h6 class="text-body-1">{{ item.updatedAt.slice(0, 10) }}</h6>
                                                </td> -->
                                                <td class="text-right" v-if="item.active">
                                                    <v-btn @click="handleEditClick(item, (currentPage-1) * 10 + index)" color="secondary" size="large" class="mr-2">編集</v-btn>
                                                    <v-btn @click="openDeleteDialog(item.id, (currentPage-1) * 10 + index)" color="error" size="large">無効化</v-btn>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </v-table>
                                    <div class="d-flex justify-center">
                                        <v-pagination :length="Math.ceil(totalItems / 10)" style="max-width: 600px; min-width: 400px;" v-model="currentPage"></v-pagination>
                                    </div>
                                </v-window-item>

                                <v-window-item value="calendar">
                                    <vue-cal
                                        locale="ja"
                                        ref="vuecal"
                                        active-view="month"
                                        :events="events"
                                        :on-event-click="onCalEventClick"
                                        events-on-month-view="short"
                                        style="height: 550px"
                                        @cell-click="onCalDayClick"
                                    ></vue-cal>
                                    <v-dialog v-model="showCopyDialog" max-width="600px">
                                        <v-card>
                                            <v-card-title>
                                                <div class="text-h5 mx-4 mt-5">予約枠コピー</div>
                                            </v-card-title>
                                            <v-card-text>
                                                <v-container>
                                                    <v-row>
                                                        <template v-if="Array.isArray(selectedEvent) && selectedEvent.length > 0">
                                                            <v-col cols="12" v-for="(frame, index) in selectedEvent" :key="frame.id">
                                                                <strong>
                                                                    {{ (index + 1) + ". 診察室: " + 
                                                                    roomListForTable[frame.data.room]?.name + 
                                                                    " 担当医: " + 
                                                                    doctorListForTable[frame.data.doctor]?.name + 
                                                                    "(" + frame.data.fromTime.slice(0, 5) + 
                                                                    " ~ " + frame.data.toTime.slice(0, 5) + 
                                                                    ")" + 
                                                                    " 予約枠数: " + 
                                                                    frame.data.availableReserve
                                                                    }}
                                                                </strong>
                                                            </v-col>
                                                        </template>
                                                        <template v-else>
                                                            <v-col cols="12">
                                                                <strong>
                                                                    {{ selectedEvent && "1. 診察室: " + 
                                                                    roomListForTable[selectedEvent.data.room]?.name + 
                                                                    " 担当医: " + 
                                                                    doctorListForTable[selectedEvent.data.doctor]?.name + 
                                                                    "(" + selectedEvent.start.formatTime() + 
                                                                    " ~ " + selectedEvent.end.formatTime() + 
                                                                    ")" + 
                                                                    " 予約枠数: " + 
                                                                    selectedEvent.data.availableReserve
                                                                    }}
                                                                </strong>
                                                            </v-col>
                                                        </template>
                                                        <v-col cols="12">
                                                            <p>（上記の内容で、予約枠を一括作成する期間と曜日を選択してください。）</p>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <v-text-field 
                                                                type="date" 
                                                                v-model="copyFromDate" 
                                                                label="⽇付From" 
                                                                variant="outlined" 
                                                                class="custom-date-input" 
                                                                :error-messages="errorFromMessage">
                                                            </v-text-field>
                                                        </v-col>
                                                        <v-col cols="12">
                                                            <v-text-field 
                                                                type="date" 
                                                                v-model="copyToDate" 
                                                                label="⽇付To" 
                                                                variant="outlined" 
                                                                class="custom-date-input" 
                                                                :error-messages="errorToMessage">
                                                            </v-text-field>
                                                        </v-col>
                                                    </v-row>
                                                </v-container>
                                                <div class="d-flex flex-column align-center bg-grey-lighten-4 pa-6">
                                                    <v-btn-toggle
                                                        v-model="toggle"
                                                        class="border-md border-primary"
                                                        multiple>
                                                        <v-btn value="1" variant="elevated" color="secondary" rounded>月</v-btn>
                                                        <v-btn value="2" variant="elevated" color="secondary" rounded>火</v-btn>
                                                        <v-btn value="3" variant="elevated" color="secondary" rounded>水</v-btn>
                                                        <v-btn value="4" variant="elevated" color="secondary" rounded>木</v-btn>
                                                        <v-btn value="5" variant="elevated" color="secondary" rounded>金</v-btn>
                                                        <v-btn value="6" variant="elevated" color="error" rounded>土</v-btn>
                                                        <v-btn value="7" variant="elevated" color="error" rounded>日</v-btn>
                                                        <v-btn value="8" variant="elevated" color="error" rounded>休</v-btn>
                                                    </v-btn-toggle>
                                                    <div v-if="errorWeekMessage" class="error-message">{{ errorWeekMessage }}</div>
                                                </div>
                                            </v-card-text>
                                            <v-card-actions>
                                                <v-spacer></v-spacer>
                                                <v-btn color="primary" variant="elevated" @click="saveCopyFrames">保存</v-btn>
                                                <v-btn color="warning" variant="elevated" @click="showCopyDialog = false">閉じる</v-btn>
                                            </v-card-actions>
                                        </v-card>
                                    </v-dialog>
                                </v-window-item>
                            </v-window>
                        </v-container>
                    </v-card-item>
                </v-card>
            </v-row>
            <v-dialog v-model="isModalOpen" max-width="600px">
                <v-card>
                <v-card-title>
                    <span class="text-h5">{{ modalTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="saveframe">
                        <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-label class="font-weight-bold mb-1">診察室</v-label>
                                <v-select
                                    v-model="newFrame.room"
                                    :items="roomList"
                                    item-title="name"
                                    item-value="id"
                                    variant="outlined"
                                    density="compact"
                                    hide-details
                                    @update:modelValue="handleChangeRoomOnAdd"
                                ></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-label class="font-weight-bold mb-1">担当医</v-label>
                                <v-select
                                    v-model="doctor.value.value"
                                    :items="doctorList"
                                    item-title="name"
                                    item-value="id"
                                    variant="outlined"
                                    density="compact"
                                    :error-messages="doctor.errorMessage.value"
                                ></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    type="date" 
                                    v-model="date.value.value"
                                    label="年⽉⽇" 
                                    variant="outlined" 
                                    class="custom-date-input"
                                    :error-messages="date.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    type="time" 
                                    v-model="fromTime.value.value"
                                    label="時刻From" 
                                    variant="outlined" 
                                    class="custom-date-input"
                                    :error-messages="fromTime.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    type="time" 
                                    v-model="toTime.value.value"
                                    label="時刻To" 
                                    variant="outlined" 
                                    class="custom-date-input"
                                    :error-messages="toTime.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    type="number" 
                                    v-model="reserveCnt.value.value"
                                    label="予約可能数" 
                                    variant="outlined" 
                                    min="1"
                                    :error-messages="reserveCnt.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                        </v-container>
                    </form>
                    </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" variant="elevated" @click="saveframe">保存</v-btn>
                    <v-btn color="error" variant="elevated" @click="isModalOpen = false">閉じる</v-btn>
                </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="isDeleteDialogOpen" persistent max-width="290px">
                <v-card>
                    <v-card-title class="text-h5">無効化</v-card-title>
                    <v-card-text>
                        本当に無効化しますか？
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="secondary" @click="deleteFrame" variant="elevated">確認</v-btn>
                        <v-btn color="error" @click="isDeleteDialogOpen = false" variant="elevated">閉じる</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-snackbar v-model="snackbar.show" location="top right" :timeout="snackbar.timeout" :color="snackbar.color">
                {{ snackbar.text }}
            </v-snackbar>
        </v-col>
    </v-row>
</template> 
<style scoped>
    .dense-height {
    height: 40px;
    }

    .dense-height .v-input__control {
    min-height: auto !important;
    }

    .v-label.text-h5 {
    line-height: 40px;
    }

    .vuecal--month-view .vuecal__cell {height: 80px;}

    .vuecal--month-view .vuecal__cell-content {
        justify-content: flex-start;
        height: 100%;
        align-items: flex-end;
    }

    .vuecal--month-view .bg-success {
        background-color: red;
    }

    .vuecal--month-view .vuecal__cell-date {padding: 4px;}
    .vuecal--month-view .vuecal__no-event {display: none;}

    .error-message {
        color: rgb(250, 137, 107);
        line-height: 12px;
        font-size: 12px;
    }
</style>
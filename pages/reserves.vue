<script setup lang="ts">
/*Call Components*/
import { useAxios } from '@/composables/useAxios';
import type { reservationType, frameListType, filterOptionType } from '@/types/reservations/index';
import { useField, useForm } from 'vee-validate'
import type { clinicListType, doctorType } from '~/types/doctors';
import type { roomType } from '~/types/frames';

const axios = useAxios();

const reservations = ref<reservationType[]>([]);
const clinics = ref<clinicListType[]>([]);
const doctors = ref<doctorType[]>([]);
const rooms = ref<roomType[]>([]);
const frameList = ref<frameListType[]>([]);
const isModalOpen = ref(false);
const isEdit = ref(false);
const isFrameDisable = ref(false);
const newReservation = ref({ 
    patientName: '', 
    patientFurigana: '', 
    patientGender: '', 
    patientDOB: '', 
    patientPhone: '', 
    patientEmail: '', 
    patientZipCode: '',
    patientAddress: '',
    patientNote: '',
    medicalNum: '',
    frame: '',
    webURL: '',
    webInterviewStatus: '',
    id: 0,
    index: 0,
    clinic: 0,
    room: 0,
    doctor: 0,
    date: '',
    fromTime: '',
    toTime: '',
});
const modalTitle = ref("");
const currentPage = ref(1);
const totalItems = ref(1);
const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000,
});

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
const currentRoom = ref(0);
const currentClinic = ref(0);
const roomList = ref<roomType[]>([]);
const searchFromDate = ref(new Date().toISOString().slice(0, 10));
const searchToDate = ref('');
const searchFromTime = ref('');
const searchToTime = ref('');

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

    fetchReservationsByFilter(filterOptions.value);
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

const handleAddClick = async() => {
    try {
        const response = await axios.get('/reservations/frames', {
            params: {roomId: currentRoom.value}
        });

        frameList.value = response.data.frames.reduce((obj: any, item: any) => {
            obj.push({id: item.id, title: doctors.value[item.doctor]?.name + ", " + 
                item.date + " (" + 
                item.fromTime.slice(0, 5) + " ~ " + item.toTime.slice(0, 5) + "), " + 
                item.remainReserve + " / " + item.availableReserve
            });
            return obj;
        }, []);

        const now = new Date();

        modalTitle.value = "予約データ追加";
        newReservation.value = { 
            patientName: '', 
            patientFurigana: '', 
            patientGender: '', 
            patientDOB: '', 
            patientPhone: '', 
            patientEmail: '', 
            patientZipCode: '',
            patientAddress: '',
            patientNote: '',
            medicalNum: '',
            frame: 0,
            webURL: '',
            webInterviewStatus: '',
            id: 0,
            index: 0,
            clinic: currentClinic.value,
            room: 0,
            doctor: 0,
            date: '',
            fromTime: '',
            toTime: '',
        }
        isModalOpen.value = true;
        isEdit.value = false;
        isFrameDisable.value = false;

        patientName.value.value = '';
        patientFurigana.value.value = '';
        medicalNum.value.value = '';
        patientGender.value.value = '';
        patientDOB.value.value = '';
        patientPhone.value.value = '';
        patientEmail.value.value = '';
        patientFrame.value.value = '';
    } catch (error) {
        showToast("error", "データの取得に失敗しました。");
    }
}

const handleEditClick = async(data: reservationType, index: number) => {
    try {
        const response = await axios.get('/reservations/frames', {
            params: {roomId: currentRoom.value}
        });

        frameList.value = response.data.frames.reduce((obj: any, item: any) => {
            obj.push({id: item.id, title: doctors.value[item.doctor]?.name + ", " + 
                item.date + " (" + 
                item.fromTime.slice(0, 5) + " ~ " + item.toTime.slice(0, 5) + "), " + 
                item.remainReserve + " / " + item.availableReserve
            });
            return obj;
        }, []);

        modalTitle.value = "予約データ編集";
        isModalOpen.value = true;
        isEdit.value = true;
        
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const day = String(currentDate.getDate()).padStart(2, '0');
        const currentDateStr = `${year}-${month}-${day}`;

        if (data.date < currentDateStr)
            isFrameDisable.value = true;
        else
            isFrameDisable.value = false;

        newReservation.value = {
            patientName: data.patientName,
            patientFurigana: data.patientFurigana,
            patientGender: data.patientGender,
            patientDOB: data.patientDOB,
            patientPhone: data.patientPhone,
            patientEmail: data.patientEmail,
            patientZipCode: data.patientZipCode,
            patientAddress: data.patientAddress,
            patientNote: data.patientNote,
            medicalNum: data.medicalNum,
            frame: data.frame,
            webURL: data.webURL,
            webInterviewStatus: data.webInterviewStatus,
            id: data.id,
            index: index,
            clinic: currentClinic.value,
            room: data.room,
            doctor: data.doctor,
            date: data.date,
            fromTime: data.fromTime,
            toTime: data.toTime,
        };

        patientName.value.value = data.patientName;
        patientFurigana.value.value = data.patientFurigana;
        medicalNum.value.value = data.medicalNum;
        patientGender.value.value = data.patientGender;
        patientDOB.value.value = data.patientDOB.slice(0, 10);
        patientPhone.value.value = data.patientPhone;
        patientEmail.value.value = data.patientEmail;
        patientFrame.value.value = Number(data.frame);
    } catch (error) {
        showToast("error", "データの取得に失敗しました。");
    }
}

const fetchReservations = async (filters: filterOptionType[] = []) => {
    try {
        const response = await axios.get('/reservations', {
            params: filters
        });
        reservations.value = response.data.reservations;
        clinics.value = response.data.clinics.reduce((obj: any, item: any) => {
            obj[item.id] = {id: item.id, title: item.title};
            return obj;
        }, {});
        doctors.value = response.data.doctors.reduce((obj: any, item: any) => {
            obj[item.id] = {id: item.id, name: item.name};
            return obj;
        }, {});
        roomList.value = response.data.rooms?.filter((room: roomType) => room.active == 1);
        rooms.value = response.data.rooms.reduce((obj: any, item: any) => {
            obj[item.id] = {id: item.id, name: item.name};
            return obj;
        }, {});

        currentRoom.value = roomList.value[0].id;
        currentClinic.value = Number(roomList.value[0].clinic);
        
        totalItems.value = response.data.reservations.length;
    } catch (error) {
        showToast("error", "データの取得に失敗しました。");
        reservations.value = [];
    }
};

const fetchReservationsByFilter = async (filters: filterOptionType[] = []) => {
    try {
        const response = await axios.get('/reservations', {
            params: filters
        });
        reservations.value = response.data.reservations;
        
        totalItems.value = response.data.reservations.length;
    } catch (error) {
        showToast("error", "データの取得に失敗しました。");
        reservations.value = [];
    }
};

const { handleSubmit, handleReset } = useForm({
    validationSchema: {
        patientName (value: string) {
            if (value?.length > 0) return true;
            return '⽒名を入力してください。';
        },
        patientFurigana (value: string) {
            if (value?.length > 0) return true;
            return 'フリガナを入力してください。';
        },
        medicalNum (value: string) {
            if (value === "" || /^\d{1,14}$/.test(value)) return true;
            return '診察券番号を正確に入力してください。';
        },
        patientGender (value: string) {
            if (value == "男性" || value == "女性") return true;
            return '性別を入力してください。';
        },
        patientDOB (value: string) {
            if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(value)) return true;
            return '⽣年⽉⽇を正確に入力してください。';
        },
        patientPhone (value: string) {
            if (/^(?:\(?(\d{2,4})\)?[- ]?)?(\d{1,4})[- ]?(\d{4})$/.test(value)) return true;
            return '電話番号を入力してください。';
        },
        patientEmail (value: string) {
            if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value)) return true;
            return 'メールアドレスを正確に入力してください。';
        },
        patientFrame (value: number) {
            if (value > 0) return true;
            return '予約枠を選択してください。';
        },
    },
})

const patientName = useField('patientName');
const patientFurigana = useField('patientFurigana');
const medicalNum = useField('medicalNum');
const patientGender = useField('patientGender');
const patientDOB = useField('patientDOB');
const patientPhone = useField('patientPhone');
const patientEmail = useField('patientEmail');
const patientFrame = useField('patientFrame');

const saveReservation = handleSubmit(async (values) => {
    newReservation.value.patientName = values.patientName;
    newReservation.value.patientFurigana = values.patientFurigana;
    newReservation.value.medicalNum = values.medicalNum;
    newReservation.value.patientGender = values.patientGender;
    newReservation.value.patientDOB = values.patientDOB;
    newReservation.value.patientPhone = values.patientPhone;    
    newReservation.value.patientEmail = values.patientEmail;
    newReservation.value.frame = values.patientFrame;

    if (isEdit.value) {
        isModalOpen.value = false;

        try {
            const response = await axios.put(`/reservations/${newReservation.value.id}`, {
                data: newReservation
            });

            if (response.data) {
                if (response.data.message && response.data.message == "Invalid Frame") {
                    showToast("warning", "予約は受け付けておりません。");
                } else {
                    reservations.value.splice(newReservation.value.index, 1, response.data);
                    showToast("success", "正確に編集されました。");
                }
            }
        } catch (error) {
            showToast("error", "編集に失敗しました。");
        }
    } else {
        isModalOpen.value = false;

        try {
            const response = await axios.post('/reservations', {
                data: newReservation
            });

            if (response.data) {
                if (response.data.message && response.data.message == "Invalid Frame") {
                    showToast("warning", "予約は受け付けておりません。");
                } else {
                    reservations.value = reservations.value.concat(response.data);
                    totalItems.value += 1;

                    showToast("success", "正確に追加されました。");
                }
            }
        } catch (error) {
            showToast("error", "追加に失敗しました。");
        }
    }
});

const deleteReservation = async (id: number, index: number = deleteData.value.index) => {
    isDeleteDialogOpen.value = false;
    try {
        await axios.delete(`/reservations/${deleteData.value.id}`);
        reservations.value.splice(index, 1);
        totalItems.value -= 1;
        
        showToast("success", "正確に無効化されました。");
    } catch (error) {
        showToast("error", "無効化に失敗しました。");
    }
}

const handleChangeRoom = async (value: any) => {
    try {
        filterOptions.value[1].value = value;
        if ( searchFromDate.value !== "" )
            filterOptions.value[2].value = searchFromDate.value;

        const response = await axios.get('/reservations', {
            params: filterOptions.value
        });
        reservations.value = response.data.reservations;

        currentClinic.value = Number(roomList.value.find(item => item.id === value)?.clinic);
        
        totalItems.value = response.data.reservations.length;
    } catch (error) {
        showToast("error", "データの取得に失敗しました。");
        reservations.value = [];
    }
};

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
    
    fetchReservationsByFilter(filterOptions.value);
}

onMounted(fetchReservations);
</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-row>
                <v-card elevation="10" class="">
                    <v-card-item class="pa-6">
                        <div class="d-flex justify-space-between">
                            <v-card-title class="text-h5 pt-sm-2 pb-7">予約データ管理</v-card-title>
                            <div>
                                <v-btn @click="handleAddClick" color="primary" size="large">追加</v-btn>
                            </div>
                        </div>
                        <div class="border-md border-info rounded-lg pt-5 mb-5">
                            <div class="d-flex justify-space-between align-center ml-5 mr-5">
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
                            <div class="d-flex justify-space-between ml-5 mr-5">
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
                        </div>
                        
                        <v-table class="month-table">
                            <thead>
                                <tr>
                                    <th class="text-subtitle-1 font-weight-bold">番号</th>
                                    <th class="text-subtitle-1 font-weight-bold">予約枠ID</th>
                                    <th class="text-subtitle-1 font-weight-bold">予約データID</th>
                                    <th class="text-subtitle-1 font-weight-bold">診療科</th>
                                    <th class="text-subtitle-1 font-weight-bold">診察室</th>
                                    <th class="text-subtitle-1 font-weight-bold">担当医</th>
                                    <th class="text-subtitle-1 font-weight-bold">年⽉⽇</th>
                                    <th class="text-subtitle-1 font-weight-bold">時刻From</th>
                                    <th class="text-subtitle-1 font-weight-bold">時刻To</th>
                                    <th class="text-subtitle-1 font-weight-bold">氏名</th>
                                    <th class="text-subtitle-1 font-weight-bold">診察券番号</th>
                                    <th class="text-subtitle-1 font-weight-bold">web問診URL</th>
                                    <th class="text-subtitle-1 font-weight-bold">web問診回答ステータス</th>
                                    <!-- <th class="text-subtitle-1 font-weight-bold">作成⽇</th>
                                    <th class="text-subtitle-1 font-weight-bold">更新⽇</th> -->
                                    <th class="text-subtitle-1 font-weight-bold text-center">作用</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in reservations.slice((currentPage-1) * 10, currentPage * 10)" :key="item.id" class="month-item">
                                    <td>
                                        <p class="text-15 font-weight-medium">{{ (currentPage-1) * 10 + index + 1 }}</p>
                                    </td>
                                    <td>
                                        <p class="text-15 font-weight-medium">{{ item.frame }}</p>
                                    </td>
                                    <td>
                                        <p class="text-15 font-weight-medium">{{ item.id }}</p>
                                    </td>
                                    <td>
                                        <h6 class="text-h5 font-weight-bold">{{ clinics[item.clinic]?.title }}</h6>
                                    </td>
                                    <td>
                                        <h6 class="text-h5 font-weight-bold">{{ rooms[item.room]?.name }}</h6>
                                    </td>
                                    <td>
                                        <h6 class="text-h5 font-weight-bold">{{ doctors[item.doctor]?.name }}</h6>
                                    </td>
                                    <td>
                                        <h6 class="text-h5 font-weight-bold">{{ item.date }}</h6>
                                    </td>
                                    <td>
                                        <h6 class="text-h5 font-weight-bold">{{ item.fromTime.slice(0, 5) }}</h6>
                                    </td>
                                    <td>
                                        <h6 class="text-h5 font-weight-bold">{{ item.toTime.slice(0, 5) }}</h6>
                                    </td>
                                    <td>
                                        <h6 class="text-h5 font-weight-bold">{{ item.patientName }}</h6>
                                    </td>
                                    <td>
                                        <h6 class="text-h5 font-weight-bold">{{ item.medicalNum }}</h6>
                                    </td>
                                    <td>
                                        <h6 class="text-body-1 font-weight-bold">
                                            <NuxtLink :to="`${item.webURL}`">web問診</NuxtLink>
                                        </h6>
                                    </td>
                                    <td>
                                        <v-chip  class='text-body-1 bg-secondary' color="white"  size="small" >
                                            {{ item.webInterviewStatus }}
                                        </v-chip>
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
                    </v-card-item>
                </v-card>
            </v-row>
            <v-dialog v-model="isModalOpen" max-width="600px">
                <v-card>
                <v-card-title>
                    <span class="text-h5">{{ modalTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="saveReservation">
                        <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-label class="font-weight-bold mb-1">予約枠</v-label>
                                <v-select
                                    v-model="patientFrame.value.value"
                                    :items="frameList"
                                    item-text="title"
                                    item-value="id"
                                    variant="outlined"
                                    density="compact"
                                    :error-messages="patientFrame.errorMessage.value"
                                    :disabled="isFrameDisable ? true : false"
                                ></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-label class="font-weight-bold mb-1">予約者データ</v-label>
                                <v-text-field 
                                    v-model="medicalNum.value.value"
                                    type="number"
                                    label="診察券番号" 
                                    variant="outlined"
                                    maxlength="14"
                                    :error-messages="medicalNum.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="patientName.value.value"
                                    label="⽒名" 
                                    variant="outlined"
                                    :error-messages="patientName.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="patientFurigana.value.value"
                                    label="フリガナ" 
                                    variant="outlined"
                                    :error-messages="patientFurigana.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-select
                                    v-model="patientGender.value.value"
                                    label="性別"
                                    :items="['男性', '女性']"
                                    variant="outlined"
                                    density="compact"
                                    :error-messages="patientGender.errorMessage.value"
                                ></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    type="date" 
                                    v-model="patientDOB.value.value"
                                    label="⽣年⽉⽇" 
                                    variant="outlined" 
                                    class="custom-date-input"
                                    :error-messages="patientDOB.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="patientPhone.value.value"
                                    label="電話番号" 
                                    variant="outlined"
                                    :error-messages="patientPhone.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="patientEmail.value.value"
                                    label="メールアドレス" 
                                    variant="outlined" 
                                    type="email"
                                    :error-messages="patientEmail.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field v-model="newReservation.patientZipCode" label="郵便番号" variant="outlined"></v-text-field>
                                <v-text-field v-model="newReservation.patientAddress" label="住所" variant="outlined"></v-text-field>
                                <v-textarea v-model="newReservation.patientNote" label="備考欄" variant="outlined"></v-textarea>
                                <v-select
                                    v-model="newReservation.webInterviewStatus"
                                    label="web問診回答ステータス"
                                    :items="['予約', '問診済']"
                                    variant="outlined"
                                    density="compact"
                                    hide-details
                                ></v-select>
                            </v-col>
                        </v-row>
                        </v-container>
                    </form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" @click="saveReservation" variant="elevated">保存</v-btn>
                    <v-btn color="error" @click="isModalOpen = false" variant="elevated">閉じる</v-btn>
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
                        <v-btn color="secondary" @click="deleteReservation" variant="elevated">確認</v-btn>
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
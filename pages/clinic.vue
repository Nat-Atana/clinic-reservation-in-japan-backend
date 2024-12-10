<script setup lang="ts">
/*Call Components*/
import { useAxios } from '@/composables/useAxios';
import type { clinicType, filterOptionType } from '@/types/clinics/index';
import { useField, useForm } from 'vee-validate'

const axios = useAxios();

const clinics = ref<clinicType[]>([]);
const filteredClinics = ref<clinicType[]>([]);
const searchInput = ref("");
const isModalOpen = ref(false);
const isEdit = ref(false);
const newClinic = ref({ title: '', webURL: "", reserveDate: 0, questionDate: 0, isNoti: false, webInterview1: 0, webInterview2: 0, exam1: 0, exam2: 0, id: 0, sort: 1, index: 0 });
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
    }
])

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
    modalTitle.value = "診療科追加";
    newClinic.value = {title: '', webURL: "", reserveDate: 0, questionDate: 0, isNoti: false, webInterview1: 0, webInterview2: 0, exam1: 0, exam2: 0, id: 0, sort: 1, index: 0}
    isModalOpen.value = true;
    isEdit.value = false;

    title.value.value = '';
    webURL.value.value = '';
    reserveDate.value.value = 1;
    questionDate.value.value = 1;
}

const handleEditClick = (data: clinicType, index: number) => {
    modalTitle.value = "診療科編集";
    isModalOpen.value = true;
    isEdit.value = true;

    newClinic.value = {
        title: data.title,
        webURL: data.webURL,
        reserveDate: data.reserveDate,
        questionDate: data.questionDate,
        isNoti: data.isNoti ? true: false,
        webInterview1: data.webInterview1,
        webInterview2: data.webInterview2,
        exam1: data.exam1,
        exam2: data.exam2,
        id: data.id,
        sort: Number(data.sort),
        index: index
    };

    title.value.value = data.title;
    webURL.value.value = data.webURL;
    reserveDate.value.value = data.reserveDate;
    questionDate.value.value = data.questionDate;
}

const fetchClinics = async (filters: filterOptionType[] = []) => {
    try {
        const response = await axios.get('/clinics', {
            params: filters
        });
        clinics.value = response.data;
        totalItems.value = response.data.length;

        filteredClinics.value = clinics.value;
    } catch (error) {
        showToast("error", "データの取得に失敗しました。");
        clinics.value = [];
    }
};

const handleApplyFilter = () => {
    menu.value = false;
    currentPage.value = 1;
    fetchClinics(filterOptions.value);
}

const { handleSubmit, handleReset } = useForm({
    validationSchema: {
        title (value: string) {
            if (value?.length > 0) return true;
            return '名称を入力してください。';
        },
        webURL (value: string) {
            if (value?.length > 0) {
                if (!/^[a-zA-Z0-9=&]*$/.test(value)) {
                    return 'web問診追加パラメータを正確に入力してください。';
                }
            }
            return true;
        },
        reserveDate (value: number) {
            if (value > 0) return true;
            return '予約可能(操作⽇から⽇先まで)を入力してください。';
        },
        questionDate (value: number) {
            if (value > 0) return true;
            return '問診回答可能(診察日の日前から当日まで)を入力してください。';
        },
    },
})

const title = useField('title');
const webURL = useField('webURL');
const reserveDate = useField('reserveDate');
const questionDate = useField('questionDate');

const saveClinic = handleSubmit(async (values) => {
    newClinic.value.title = values.title;
    newClinic.value.webURL = values.webURL;
    newClinic.value.reserveDate = values.reserveDate;
    newClinic.value.questionDate = values.questionDate;

    if (isEdit.value) {
        isModalOpen.value = false;

        try {
            const response = await axios.put(`/clinics/${newClinic.value.id}`, {
                data: newClinic
            });

            clinics.value.splice(newClinic.value.index, 1, response.data);
            filteredClinics.value = clinics.value.sort((a, b) => Number(a.sort) - Number(b.sort));

            showToast("success", "正確に編集されました。");
        } catch (error) {
            showToast("error", "編集に失敗しました。");
        }
    } else {
        isModalOpen.value = false;

        try {
            const response = await axios.post('/clinics', {
                data: newClinic
            });

            clinics.value = clinics.value.concat(response.data);
            totalItems.value += 1;
            filteredClinics.value = clinics.value.sort((a, b) => Number(a.sort) - Number(b.sort));
            
            showToast("success", "正確に追加されました。");
        } catch (error) {
            showToast("error", "追加に失敗しました。");
        }
    }
});

const deleteClinic = async (id: number, index: number = deleteData.value.index) => {
    isDeleteDialogOpen.value = false;
    try {
        await axios.delete(`/clinics/${deleteData.value.id}`);
        clinics.value.splice(index, 1);
        totalItems.value -= 1;
        filteredClinics.value = clinics.value;
        
        showToast("success", "正確に無効化されました。");
    } catch (error) {
        showToast("error", "無効化に失敗しました。");
    }
}

const handleSearchInput = () => {
    filteredClinics.value = clinics.value.filter(item => item.title.includes(searchInput.value));
    currentPage.value = 1;
}

onMounted(fetchClinics);
</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-row>
                <v-card elevation="10" class="">
                    <v-card-item class="pa-6">
                    <div class="d-flex justify-space-between">
                        <v-card-title class="text-h5 pt-sm-2 pb-7">診療科管理</v-card-title>
                        <div class="d-flex align-baseline w-50">
                            <v-text-field 
                                v-model="searchInput" 
                                variant="outlined" 
                                @input="handleSearchInput" 
                                placeholder="検索キーワードを入力してください" 
                                append-inner-icon="mdi-magnify" 
                                hide-details 
                                style="max-width: 300px;">
                            </v-text-field>
                            <v-list>
                                <v-list-item v-for="(option, index) in filterOptions" :key="index" class="ml-4">
                                    <v-switch
                                        class="pl-3"
                                        v-if="option.type === 'switch'"
                                        v-model="option.value"
                                        color="primary"
                                        :label="option.label"
                                        hide-details
                                        @change="handleApplyFilter"
                                    ></v-switch>
                                </v-list-item>
                            </v-list>
                        </div>
                        <div>
                            <v-btn @click="handleAddClick" color="primary" size="large">追加</v-btn>
                        </div>
                    </div>
                    <v-table class="month-table">
                        <thead>
                            <tr>
                                <th class="text-subtitle-1 font-weight-bold">番号</th>
                                <th class="text-subtitle-1 font-weight-bold">診療科ID</th>
                                <th class="text-subtitle-1 font-weight-bold">名称</th>
                                <th class="text-subtitle-1 font-weight-bold">診察室</th>
                                <th class="text-subtitle-1 font-weight-bold">作成⽇</th>
                                <th class="text-subtitle-1 font-weight-bold">更新⽇</th>
                                <th class="text-subtitle-1 font-weight-bold text-center">作用</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in filteredClinics.slice((currentPage-1) * 10, currentPage * 10)" :key="item.title" class="month-item">
                                <td>
                                    <p class="text-15 font-weight-medium">{{ (currentPage-1) * 10 + index + 1 }}</p>
                                </td>
                                <td>
                                    <h6 class="text-h5 font-weight-bold">{{ item.id }}</h6>
                                </td>
                                <td>
                                    <h6 class="text-h5 font-weight-bold">{{ item.title }}</h6>
                                </td>
                                <td>
                                    <h6 class="text-body-1 font-weight-bold">
                                        <NuxtLink :to="`/room/${item.id}`">診察室一覧画面</NuxtLink>
                                    </h6>
                                </td>
                                <td>
                                    <h6 class="text-body-1">{{ item.createdAt.slice(0, 10) }}</h6>
                                </td>
                                <td>
                                    <h6 class="text-body-1">{{ item.updatedAt.slice(0, 10) }}</h6>
                                </td>
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
            <v-dialog v-model="isDeleteDialogOpen" persistent max-width="290px">
                <v-card>
                    <v-card-title class="text-h5">無効化</v-card-title>
                    <v-card-text>
                        本当に無効化しますか？
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="secondary" @click="deleteClinic" variant="elevated">確認</v-btn>
                        <v-btn color="error" @click="isDeleteDialogOpen = false" variant="elevated">閉じる</v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
            <v-dialog v-model="isModalOpen" max-width="600px">
                <v-card>
                <v-card-title>
                    <span class="text-h5">{{ modalTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="saveClinic">
                        <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="title.value.value"
                                    label="名称" 
                                    variant="outlined"
                                    :error-messages="title.errorMessage.value">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="webURL.value.value" 
                                    label="web問診追加パラメータ" 
                                    variant="outlined"
                                    :error-messages="webURL.errorMessage.value">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="reserveDate.value.value" 
                                    :label="`予約可能(操作⽇から${reserveDate.value.value}⽇先まで)`" 
                                    variant="outlined" 
                                    type="number" 
                                    :error-messages="reserveDate.errorMessage.value"
                                    min="1">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="questionDate.value.value" 
                                    :label="`問診回答可能(診察日の${questionDate.value.value}日前から当日まで)`" 
                                    variant="outlined" 
                                    type="number" 
                                    :error-messages="questionDate.errorMessage.value"
                                    min="1">
                                </v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-label class="font-weight-bold mb-1">並び順</v-label>
                                <v-text-field v-model="newClinic.sort" variant="outlined" type="number" min="1"></v-text-field>
                            </v-col>
                            <v-card outlined>
                                <v-card-title>
                                    通知
                                </v-card-title>
                                <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12">
                                            <v-checkbox  color="primary" v-model="newClinic.isNoti" hide-details>
                                                <template v-slot:label class="text-body-1">web問診案内:即時</template>
                                            </v-checkbox>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="newClinic.webInterview1" :label="`web問診案内1(診察⽇の${newClinic.webInterview1}⽇前)`" variant="outlined" type="number" min="0"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="newClinic.webInterview2" :label="`web問診案内2(診察⽇の${newClinic.webInterview2}⽇前)`" variant="outlined" type="number" min="0"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="newClinic.exam1" :label="`診察案内1(診察⽇の${newClinic.exam1}⽇前)`" variant="outlined" type="number" min="0"></v-text-field>
                                        </v-col>
                                        <v-col cols="12">
                                            <v-text-field v-model="newClinic.exam2" :label="`診察案内2(診察⽇の${newClinic.exam2}⽇前)`" variant="outlined" type="number" min="0"></v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                                </v-card-text>
                            </v-card>
                        </v-row>
                        </v-container>
                    </form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" @click="saveClinic" variant="elevated">保存</v-btn>
                    <v-btn color="error" @click="isModalOpen = false" variant="elevated">閉じる</v-btn>
                </v-card-actions>
                </v-card>
            </v-dialog>
            <v-snackbar v-model="snackbar.show" location="top right" :timeout="snackbar.timeout" :color="snackbar.color">
                {{ snackbar.text }}
            </v-snackbar>
        </v-col>
    </v-row>
</template>
<script setup lang="ts">
/*Call Components*/
import { useAxios } from '@/composables/useAxios';
import type { breakdayType, filterOptionType } from '@/types/breakdays/index';
import { useField, useForm } from 'vee-validate'

const axios = useAxios();

const breakdays = ref<breakdayType[]>([]);
const filteredBreakdays = ref<breakdayType[]>([]);
const searchInput = ref("");
const isModalOpen = ref(false);
const isEdit = ref(false);
const newBreakday = ref({ title: '', date: '', id: 0, index: 0 });
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

const handleApplyFilter = () => {
    menu.value = false;
    currentPage.value = 1;
    fetchBreakdays(filterOptions.value);
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

    modalTitle.value = "休⽇追加";
    newBreakday.value = {title: "", date: now.toISOString().slice(0, 10), id: 0, index: 0}
    isModalOpen.value = true;
    isEdit.value = false;

    title.value.value = '';
    date.value.value = '';
}

const handleEditClick = (data: breakdayType, index: number) => {
    modalTitle.value = "休⽇編集";
    isModalOpen.value = true;
    isEdit.value = true;

    newBreakday.value = {
        title: data.title,
        date: data.date.slice(0, 10),
        id: data.id,
        index: index
    };

    title.value.value = data.title;
    date.value.value = data.date.slice(0, 10);
}

const fetchBreakdays = async (filters: filterOptionType[] = []) => {
    try {
        const response = await axios.get('/breakdays', {
            params: filters
        });
        breakdays.value = response.data;
        totalItems.value = response.data.length;

        filteredBreakdays.value = breakdays.value;
    } catch (error) {
        console.error('Login error:', error);
        breakdays.value = [];
    }
};

const deleteBreakday = async (id: number, index: number = deleteData.value.index) => {
    isDeleteDialogOpen.value = false;
    try {
        await axios.delete(`/breakdays/${deleteData.value.id}`);
        breakdays.value.splice(index, 1);
        totalItems.value -= 1;

        filteredBreakdays.value = breakdays.value;
        
        showToast("success", "正確に無効化されました。");
    } catch (error) {
        showToast("error", "無効化に失敗しました。");
    }
}

const handleSearchInput = () => {
    filteredBreakdays.value = breakdays.value.filter(item => item.title.includes(searchInput.value));
    currentPage.value = 1;
}

const { handleSubmit, handleReset } = useForm({
    validationSchema: {
        title (value: string) {
            if (value?.length > 0) return true;
            return 'タイトルを入力してください。';
        },
        date (value: string) {
            if (/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$/.test(value)) return true;
            return '日付を正確に入力してください。';
        },
    },
})

const title = useField('title');
const date = useField('date');

const saveBreakday = handleSubmit(async (values) => {
    if (isEdit.value) {
        isModalOpen.value = false;

        newBreakday.value.title = values.title;
        newBreakday.value.date = values.date;

        try {
            const response = await axios.put(`/breakdays/${newBreakday.value.id}`, {
                title: newBreakday.value.title,
                date: newBreakday.value.date
            });

            breakdays.value.splice(newBreakday.value.index, 1, response.data);
            filteredBreakdays.value = breakdays.value;

            showToast("success", "正確に編集されました。");
        } catch (error) {
            showToast("error", "編集に失敗しました。");
        }
    } else {
        isModalOpen.value = false;

        try {
            const response = await axios.post('/breakdays', {
                title: values.title,
                date: values.date
            });

            breakdays.value = breakdays.value.concat(response.data);
            totalItems.value += 1;
            filteredBreakdays.value = breakdays.value;
            
            showToast("success", "正確に追加されました。");
        } catch (error) {
            showToast("error", "追加に失敗しました。");
        }
    }
})

onMounted(fetchBreakdays);
</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-row>
                <v-card elevation="10" class="">
                    <v-card-item class="pa-6">
                    <div class="d-flex justify-space-between">
                        <v-card-title class="text-h5 pt-sm-2 pb-7">休⽇管理</v-card-title>
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
                                <th class="text-subtitle-1 font-weight-bold">休⽇ID</th>
                                <th class="text-subtitle-1 font-weight-bold">名称</th>
                                <th class="text-subtitle-1 font-weight-bold">日付</th>
                                <th class="text-subtitle-1 font-weight-bold">作成⽇</th>
                                <th class="text-subtitle-1 font-weight-bold">更新⽇</th>
                                <th class="text-subtitle-1 font-weight-bold text-center">作用</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in filteredBreakdays.slice((currentPage-1) * 10, currentPage * 10)" :key="index" class="month-item">
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
                                    <h6 class="text-body-1 font-weight-bold">{{ item.date.slice(0, 10) }}</h6>
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
                        <v-pagination :length="Math.ceil(filteredBreakdays.length / 10)" style="max-width: 600px; min-width: 400px;" v-model="currentPage"></v-pagination>
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
                    <form @submit.prevent="saveBreakday">
                        <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="title.value.value"
                                    label="タイトル" 
                                    variant="outlined"
                                    :error-messages="title.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    type="date" 
                                    v-model="date.value.value" 
                                    label="日付" 
                                    variant="outlined" 
                                    class="custom-date-input"
                                    :error-messages="date.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                            <v-col class="d-flex justify-end">
                                <v-btn color="secondary" class="mr-2" type="submit">保存</v-btn>
                                <v-btn color="error" @click="isModalOpen = false">閉じる</v-btn>
                            </v-col>
                        </v-row>
                        </v-container>
                    </form>
                </v-card-text>
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
                        <v-btn color="secondary" @click="deleteBreakday" variant="elevated">確認</v-btn>
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
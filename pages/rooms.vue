<script setup lang="ts">
/*Call Components*/
import { useAxios } from '@/composables/useAxios';
import type { roomType, clinicListType, filterOptionType } from '@/types/rooms/index';
import { useField, useForm } from 'vee-validate'

const axios = useAxios();

const rooms = ref<roomType[]>([]);
const filteredRooms = ref<roomType[]>([]);
const searchInput = ref("");
const clinicList = ref<clinicListType[]>([]);
const clinicListForTable = ref<clinicListType[]>([]);
const isModalOpen = ref(false);
const isEdit = ref(false);
const newRoom = ref({ name: '', clinic: 0, sort: 1, id: 0, index: 0 });
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
    fetchrooms(filterOptions.value);
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

    modalTitle.value = "診察室追加";
    newRoom.value = { name: '', clinic: clinicList.value[0]?.id, sort: 1, id: 0, index: 0}
    isModalOpen.value = true;
    isEdit.value = false;

    name.value.value = '';
}

const handleEditClick = (data: roomType, index: number) => {
    modalTitle.value = "診察室編集";
    isModalOpen.value = true;
    isEdit.value = true;

    newRoom.value = {
        name: data.name,
        clinic: Number(data.clinic),
        sort: data.sort,
        id: data.id,
        index: index
    };

    name.value.value = data.name;
}

const fetchrooms = async (filters: filterOptionType[] = []) => {
    try {
        const response = await axios.get('/rooms', {
            params: filters
        });
        rooms.value = response.data.rooms;
        clinicList.value = response.data.clinics?.filter((clinic: clinicListType) => clinic.active == 1);
        totalItems.value = response.data.rooms.length;

        filteredRooms.value = rooms.value;

        clinicListForTable.value = response.data.clinics.reduce((obj: any, item: any) => {
            obj[item.id] = item;
            return obj;
        }, {});
    } catch (error) {
        showToast("error", "データの取得に失敗しました。");
        rooms.value = [];
    }
};

const { handleSubmit, handleReset } = useForm({
    validationSchema: {
        name (value: string) {
            if (value?.length > 0) return true;
            return '名称を入力してください。';
        },
    },
})

const name = useField('name');

const saveroom = handleSubmit(async (values) => {
    newRoom.value.name = values.name;

    if (isEdit.value) {
        isModalOpen.value = false;

        try {
            const response = await axios.put(`/rooms/${newRoom.value.id}`, {
                data: newRoom
            });

            rooms.value.splice(newRoom.value.index, 1, response.data);
            filteredRooms.value = rooms.value.sort((a, b) => a.sort - b.sort);

            showToast("success", "正確に編集されました。");
        } catch (error) {
            showToast("error", "編集に失敗しました。");
        }
    } else {
        isModalOpen.value = false;

        try {
            const response = await axios.post('/rooms', {
                data: newRoom
            });

            rooms.value = rooms.value.concat(response.data);
            totalItems.value += 1;
            filteredRooms.value = rooms.value.sort((a, b) => a.sort - b.sort);
            
            showToast("success", "正確に追加されました。");
        } catch (error) {
            showToast("error", "追加に失敗しました。");
        }
    }
});

const deleteroom = async (id: number, index: number = deleteData.value.index) => {
    isDeleteDialogOpen.value = false;
    try {
        await axios.delete(`/rooms/${deleteData.value.id}`);
        rooms.value.splice(index, 1);
        totalItems.value -= 1;
        filteredRooms.value = rooms.value;

        showToast("success", "正確に無効化されました。");
    } catch (error) {
        showToast("error", "無効化に失敗しました。");
    }
}

const handleSearchInput = () => {
    filteredRooms.value = rooms.value.filter(item => item.name.includes(searchInput.value));
    currentPage.value = 1;
}

onMounted(fetchrooms);
</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-row>
                <v-card elevation="10" class="">
                    <v-card-item class="pa-6">
                    <div class="d-flex justify-space-between">
                        <v-card-title class="text-h5 pt-sm-2 pb-7">診察室管理</v-card-title>
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
                                <th class="text-subtitle-1 font-weight-bold">診察室ID</th>
                                <th class="text-subtitle-1 font-weight-bold">名称</th>
                                <th class="text-subtitle-1 font-weight-bold">診療科</th>
                                <th class="text-subtitle-1 font-weight-bold">予約枠</th>
                                <th class="text-subtitle-1 font-weight-bold">作成⽇</th>
                                <th class="text-subtitle-1 font-weight-bold">更新⽇</th>
                                <th class="text-subtitle-1 font-weight-bold text-center">作用</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in filteredRooms.slice((currentPage-1) * 10, currentPage * 10)" :key="item.id" class="month-item">
                                <td>
                                    <p class="text-15 font-weight-medium">{{ (currentPage-1) * 10 + index + 1 }}</p>
                                </td>
                                <td>
                                    <h6 class="text-h5 font-weight-bold">{{ item.id }}</h6>
                                </td>
                                <td>
                                    <h6 class="text-h5 font-weight-bold">{{ item.name }}</h6>
                                </td>
                                <td>
                                    <h6 class="text-body-1 font-weight-bold">{{ clinicListForTable[item.clinic]?.title  }}</h6>
                                </td>
                                <td>
                                    <h6 class="text-body-1 font-weight-bold">
                                        <NuxtLink :to="`/frame/${item.id}`">予約枠画⾯</NuxtLink>
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
            <v-dialog v-model="isModalOpen" max-width="600px">
                <v-card>
                <v-card-title>
                    <span class="text-h5">{{ modalTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="saveroom">
                        <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="name.value.value"
                                    label="名称" 
                                    variant="outlined"
                                    :error-messages="name.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-label class="font-weight-bold mb-1">診療科</v-label>
                                <v-select
                                    v-model="newRoom.clinic"
                                    :items="clinicList"
                                    item-text="title"
                                    item-value="id"
                                    variant="outlined"
                                    density="compact"
                                    hide-details
                                ></v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-label class="font-weight-bold mb-1">並び順</v-label>
                                <v-text-field v-model="newRoom.sort" variant="outlined" type="number" min="1"></v-text-field>
                            </v-col>
                        </v-row>
                        </v-container>
                    </form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" @click="saveroom" variant="elevated">保存</v-btn>
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
                        <v-btn color="secondary" @click="deleteroom" variant="elevated">確認</v-btn>
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
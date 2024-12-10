<script setup lang="ts">
/*Call Components*/
import { useAxios } from '@/composables/useAxios';
import type { notificationType, filterOptionType } from '@/types/notifications/index';

const axios = useAxios();

const notifications = ref<notificationType[]>([]);
const isModalOpen = ref(false);
const isEdit = ref(false);
const newNotification = ref({ patientEmail: '', isNoti: false, webInterview1: 0, webInterview2: 0, exam1: 0, exam2: 0, id: 0, index: 0 });
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
    fetchNotifications(filterOptions.value);
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
    modalTitle.value = "通知追加";
    newNotification.value = {patientEmail: '', isNoti: false, webInterview1: 0, webInterview2: 0, exam1: 0, exam2: 0, id: 0, index: 0}
    isModalOpen.value = true;
    isEdit.value = false;
}

const handleEditClick = (data: notificationType, index: number) => {
    modalTitle.value = "通知編集";
    isModalOpen.value = true;
    isEdit.value = true;

    newNotification.value = {
        patientEmail: data.patientEmail,
        isNoti: data.isNoti,
        webInterview1: data.webInterview1,
        webInterview2: data.webInterview2,
        exam1: data.exam1,
        exam2: data.exam2,
        id: data.id,
        index: index
    };
}

const fetchNotifications = async (filters: filterOptionType[] = []) => {
    try {
        const response = await axios.get('/notifications', {
            params: filters
        });
        notifications.value = response.data;
        totalItems.value = response.data.length;
    } catch (error) {
        showToast("error", "データの取得に失敗しました。");
        notifications.value = [];
    }
};

const saveNotification = async () => {

    if (isEdit.value) {
        isModalOpen.value = false;

        try {
            const response = await axios.put(`/notifications/${newNotification.value.id}`, {
                data: newNotification
            });

            notifications.value.splice(newNotification.value.index, 1, response.data);

            showToast("success", "正確に編集されました。");
        } catch (error) {
            showToast("error", "編集に失敗しました。");
        }
    } else {
        isModalOpen.value = false;

        try {
            const response = await axios.post('/notifications', {
                data: newNotification
            });

            notifications.value = notifications.value.concat(response.data);
            totalItems.value += 1;
            
            showToast("success", "正確に追加されました。");
        } catch (error) {
            showToast("error", "追加に失敗しました。");
        }
    }
};

const deleteNotification = async (id: number, index: number = deleteData.value.index) => {
    isDeleteDialogOpen.value = false;
    try {
        await axios.delete(`/notifications/${deleteData.value.id}`);
        notifications.value.splice(index, 1);
        totalItems.value -= 1;
        
        showToast("success", "正確に無効化されました。");
    } catch (error) {
        showToast("error", "無効化に失敗しました。");
    }
}

onMounted(fetchNotifications);
</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-row>
                <v-card elevation="10" class="">
                    <v-card-item class="pa-6">
                    <div class="d-flex justify-space-between">
                        <v-card-title class="text-h5 pt-sm-2 pb-7">通知管理</v-card-title>
                        <div>
                            <v-btn @click="handleAddClick" color="primary" size="large">追加</v-btn>
                            <v-menu
                                v-model="menu"
                                :close-on-content-click="false"
                                location="end"
                                >
                                <template v-slot:activator="{ props }">
                                    <v-btn icon="mdi-dots-vertical" v-bind="props" color="secondary" class="ml-2" style="border-radius: 5px;"></v-btn>
                                </template>

                                <v-card min-width="300">
                                    <v-list>
                                        <v-list-item v-for="(option, index) in filterOptions" :key="index" class="ml-4">
                                            <v-switch
                                                v-if="option.type === 'switch'"
                                                v-model="option.value"
                                                color="primary"
                                                :label="option.label"
                                                hide-details
                                            ></v-switch>
                                        </v-list-item>
                                    </v-list>

                                    <v-card-actions>
                                        <v-spacer></v-spacer>

                                        <v-btn
                                            color="error"
                                            variant="outlined"
                                            @click="menu = false"
                                        >
                                            閉じる
                                        </v-btn>
                                        <v-btn
                                            color="primary"
                                            variant="outlined"
                                            @click="handleApplyFilter"
                                        >
                                            適用
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-menu>
                        </div>
                    </div>
                    <v-table class="month-table">
                        <thead>
                            <tr>
                                <th class="text-subtitle-1 font-weight-bold">番号</th>
                                <th class="text-subtitle-1 font-weight-bold">予約者</th>
                                <th class="text-subtitle-1 font-weight-bold">web問診案内</th>
                                <th class="text-subtitle-1 font-weight-bold">作成⽇</th>
                                <th class="text-subtitle-1 font-weight-bold">更新⽇</th>
                                <th class="text-subtitle-1 font-weight-bold text-center">作用</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in notifications.slice((currentPage-1) * 10, currentPage * 10)" :key="item.id" class="month-item">
                                <td>
                                    <p class="text-15 font-weight-medium">{{ (currentPage-1) * 10 + index + 1 }}</p>
                                </td>
                                <td>
                                    <h6 class="text-h5 font-weight-bold">{{ item.patientEmail }}</h6>
                                </td>
                                <td>
                                    <v-chip  :class="['text-body-1', item.isNoti ? 'bg-secondary' : 'bg-warning']" color="white"  size="small" >
                                        {{ item.isNoti ? "On" : "Off" }}
                                    </v-chip>
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
                    <v-container>
                    <v-row>
                        <v-col cols="12">
                            <v-text-field v-model="newNotification.patientEmail" label="予約者" variant="outlined"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-checkbox  color="primary"  v-model="newNotification.isNoti" hide-details>
                                <template v-slot:label class="text-body-1">通知:web問診案内:即時</template>
                            </v-checkbox>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="newNotification.webInterview1" label="通知:web問診案内1(⽇前)" variant="outlined" type="number" min="0"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="newNotification.webInterview2" label="通知:web問診案内2(⽇前)" variant="outlined" type="number" min="0"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="newNotification.exam1" label="通知:診察案内1(⽇前)" variant="outlined" type="number" min="0"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field v-model="newNotification.exam2" label="通知:診察案内2(⽇前)" variant="outlined" type="number" min="0"></v-text-field>
                        </v-col>
                    </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="secondary" @click="saveNotification" variant="elevated">保存</v-btn>
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
                        <v-btn color="secondary" @click="deleteNotification" variant="elevated">確認</v-btn>
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
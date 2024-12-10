<script setup lang="ts">
/*Call Components*/
import { useAxios } from '@/composables/useAxios';
import type { atanaType, filterOptionType } from '@/types/atanas/index';
import { useField, useForm } from 'vee-validate'


const axios = useAxios();


const visible = ref(false);
const pwdConfirmVisible = ref(false);
const searchInput = ref("");
const isModalOpen = ref(false);
const isSettingOpen = ref(false);
const isEdit = ref(false);

const menuUser = ref(0);
const menuSetting = ref({ holiday: true, depart: true, doctor: true, room: true, frame: true, reservation: true, user: true });
const modalTitle = ref("");
const currentPage = ref(1);
const totalItems = ref(1);

const menu = ref(false);

const snackbar = ref({
  show: false,
  text: '',
  color: 'success',
  timeout: 3000,
});

function showToast(color: string, text: string) {
  snackbar.value = {
    show: true,
    text: text,
    color: color,
    timeout: 3000,
  };
}

const { userId, userRole } = useAuth();
const atanas = ref<atanaType[]>([]);
const filteredAtanas = ref<atanaType[]>([]);
const filterOptions = ref<filterOptionType[]>([
    {
        type: 'switch',
        label: '無効データを含める',
        name: 'active',
        value: false
    }
])
const fetchAtanas = async (filters: filterOptionType[] = []) => {
    try {
        const response = await axios.get('/atana', {
            params: filters
        });
        if ( userRole.value === "admin" )
            atanas.value = response.data.filter((item: any) => item.id !== userId.value);
        else
            atanas.value = response.data.filter((item: any) => item.id === userId.value);

        totalItems.value = response.data.length;

        filteredAtanas.value = atanas.value;
    } catch (error) {
        console.log(error);
        showToast("error", "feching data failed。");
        atanas.value = [];
    }
};

onMounted(fetchAtanas);
</script>
<template>
    <v-row>
        <v-col cols="12">
            <v-row>
                <v-card elevation="10" class="">
                    <v-card-item class="pa-6">
                    <div class="d-flex justify-space-between">
                        <v-card-title class="text-h5 pt-sm-2 pb-7">ユーザー管理</v-card-title>
                        <div class="d-flex align-baseline w-50">
                            <v-text-field 
                                v-model="searchInput" 
                                variant="outlined" 
                                @input="" 
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
                                        @change=""
                                    ></v-switch>
                                </v-list-item>
                            </v-list>
                        </div>
                        <div>
                            <v-btn v-if="userRole === 'admin'" @click="" color="primary" size="large">追加</v-btn>
                        </div>
                    </div>
                    <v-table class="month-table">
                        <thead>
                            <tr>
                                <th class="text-subtitle-1 font-weight-bold">No</th>
                                <th class="text-subtitle-1 font-weight-bold">ID</th>
                                <th class="text-subtitle-1 font-weight-bold">name</th>
                                <th class="text-subtitle-1 font-weight-bold">session</th>
                                <th class="text-subtitle-1 font-weight-bold">content</th>
                                <th class="text-subtitle-1 font-weight-bold">created_at</th>
                                <th class="text-subtitle-1 font-weight-bold text-center">operation</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in filteredAtanas.slice((currentPage-1) * 10, currentPage * 10)" :key="item.id" class="month-item">
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
                                    <h6 class="text-body-1 font-weight-bold">{{ item.session }}</h6>
                                </td>
                                <td>
                                    <h6 class="text-body-1">{{ item.content }}</h6>
                                </td>
                                <td>
                                    <h6 class="text-body-1">{{ item.created_at.slice(0, 10) }}</h6>
                                </td>
                                <td class="text-right" v-if="true">
                                    <v-btn @click="" color="secondary" size="large" class="mr-2">編集</v-btn>
                                    <v-btn v-if="userRole === 'admin'" @click="" color="secondary" size="large" class="mr-2">権限設定</v-btn>
                                    <v-btn v-if="userRole === 'admin'" @click="" color="error" size="large">無効化</v-btn>
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
            
            <v-snackbar v-model="snackbar.show" location="top right" :timeout="snackbar.timeout" :color="snackbar.color">
                {{ snackbar.text }}
            </v-snackbar>
        </v-col>
    </v-row>
</template>
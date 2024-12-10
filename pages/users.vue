<script setup lang="ts">
/*Call Components*/
import { useAxios } from '@/composables/useAxios';
import type { userType, filterOptionType } from '@/types/users/index';
import { useField, useForm } from 'vee-validate'

const axios = useAxios();
const { userId, userRole } = useAuth();

const users = ref<userType[]>([]);
const filteredUsers = ref<userType[]>([]);
const visible = ref(false);
const pwdConfirmVisible = ref(false);
const searchInput = ref("");
const isModalOpen = ref(false);
const isSettingOpen = ref(false);
const isEdit = ref(false);
const newUser = ref({ name: '', email: '', password: '', role: '', id: 0, index: 0 });
const menuUser = ref(0);
const menuSetting = ref({ holiday: true, depart: true, doctor: true, room: true, frame: true, reservation: true });
const modalTitle = ref("");
const currentPage = ref(1);
const totalItems = ref(1);
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

const handleAddClick = () => {
    modalTitle.value = "ユーザー追加";
    newUser.value = {name: '', email: '', password: '', role: '', id: 0, index: 0}
    isModalOpen.value = true;
    isEdit.value = false;

    name.value.value = '';
    email.value.value = '';
    password.value.value = '';
    pwdConfirm.value.value = '';
    role.value.value = '';
}

const fetchUsers = async (filters: filterOptionType[] = []) => {
    try {
        const response = await axios.get('/users', {
            params: filters
        });
        if ( userRole.value === "admin" )
            users.value = response.data.filter((item: any) => item.id !== userId.value);
        else
            users.value = response.data.filter((item: any) => item.id === userId.value);

        totalItems.value = response.data.length;

        filteredUsers.value = users.value;
    } catch (error) {
        showToast("error", "データの取得に失敗しました。");
        users.value = [];
    }
};

const handleApplyFilter = () => {
    menu.value = false;
    currentPage.value = 1;
    fetchUsers(filterOptions.value);
}

const openDeleteDialog = (id: number, index: number) => {
    isDeleteDialogOpen.value = true;
    deleteData.value = {id: id, index: index};
}

const deleteUser = async (id: number, index: number = deleteData.value.index) => {
    isDeleteDialogOpen.value = false;
    try {
        await axios.delete(`/users/${deleteData.value.id}`);
        users.value.splice(index, 1);
        totalItems.value -= 1;
        
        showToast("success", "正確に無効化されました。");
    } catch (error) {
        showToast("error", "無効化に失敗しました。");
    }
}

const handleSearchInput = () => {
    filteredUsers.value = users.value.filter(item => item.name.includes(searchInput.value) || item.email.includes(searchInput.value));
    currentPage.value = 1;
}

const { handleSubmit, handleReset } = useForm({
    validationSchema: {
        name (value: string) {
            if (value?.length > 0) return true;
            return '氏名を入力してください。';
        },
        email (value: string) {
            if (/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i.test(value)) return true;
            return 'メールアドレスを正確に入力してください。';
        },
        password (value: string) {
            if (!value || value.length === 0) return 'パスワードを入力してください。';
            // if (formValues.pwdConfirm && value !== formValues.pwdConfirm) return 'パスワードが一致しません。';
            return true;
        },
        pwdConfirm (value: string, formValues: any) {
            if (!value || value.length === 0) return 'パスワード（確認用）を入力してください。';
            if(value !== formValues.form.password) return "パスワードが一致しません";
            return true;
        },
        role (value: string) {
            if (value !== "" && value !== undefined ) return true;
            return '権限を選択してください。';
        },
    },
})

const name = useField('name');
const email = useField('email');
const password = useField('password');
const pwdConfirm = useField('pwdConfirm');
const role = useField('role');

const handleEditClick = (data: userType, index: number) => {
    modalTitle.value = "ユーザー編集";
    isModalOpen.value = true;
    isEdit.value = true;

    newUser.value = {
        name: data.name,
        email: data.email,
        password: '',
        role: data.role,
        id: data.id,
        index: index
    };

    name.value.value = data.name;
    email.value.value = data.email;
    password.value.value = '';
    pwdConfirm.value.value = '';
    role.value.value = data.role;
}

const saveUser = handleSubmit(async (values) => {
    if (isEdit.value) {
        isModalOpen.value = false;

        newUser.value.name = values.name;
        newUser.value.email = values.email;
        newUser.value.password = values.password;
        newUser.value.role = values.role;

        try {
            const response = await axios.put(`/users/${newUser.value.id}`, {
                data: newUser
            });

            users.value.splice(newUser.value.index, 1, response.data);

            showToast("success", "正確に編集されました。");
        } catch (error) {
            showToast("error", "編集に失敗しました。");
        }
    } else {
        isModalOpen.value = false;

        try {
            const defaultMenu = { holiday: false, depart: false, doctor: false, room: false, frame: true, reservation: true };

            const response = await axios.post('/users', {
                email: values.email,
                name: values.name,
                password: values.password,
                role: values.role,
                menu: JSON.stringify(defaultMenu)
            });

            if (response?.data?.message === "User already exists") {
                showToast("error", "既に存在しているメールアドレスを使用いたしました。");
            } else {
                users.value = users.value.concat(response.data);
                filteredUsers.value = users.value;
                totalItems.value += 1;

                showToast("success", "正確に追加されました。");
            }
        } catch (error) {
            showToast("error", "追加に失敗しました。");
        }
    }
});

const handlePermissionClick = (data: userType, index: number) => {
    modalTitle.value = "権限設定";
    isSettingOpen.value = true;

    menuUser.value = data.id;
    if ( data.menu !== "" ) {
        menuSetting.value = JSON.parse(data.menu);
    } else {
        menuSetting.value = { holiday: true, depart: true, doctor: true, room: true, frame: true, reservation: true };
    }
    
}

const saveSetting = async (values: any) => {
    try {
        isSettingOpen.value = false;

        const response = await axios.put(`/users/menu/${menuUser.value}`, {
            data: menuSetting
        });

        if ( response && response.data ) {
            const userIndex = users.value.findIndex(user => user.id === response.data.id);
            if (userIndex !== -1) {
                users.value[userIndex].menu = response.data.menu;
            }
        }

        showToast("success", "正確に設定されました。");
    } catch (error) {
        showToast("error", "設定に失敗しました。");
    }
};

onMounted(fetchUsers);
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
                            <v-btn v-if="userRole === 'admin'" @click="handleAddClick" color="primary" size="large">追加</v-btn>
                        </div>
                    </div>
                    <v-table class="month-table">
                        <thead>
                            <tr>
                                <th class="text-subtitle-1 font-weight-bold">番号</th>
                                <th class="text-subtitle-1 font-weight-bold">ユーザーID</th>
                                <th class="text-subtitle-1 font-weight-bold">氏名</th>
                                <th class="text-subtitle-1 font-weight-bold">メールアドレス</th>
                                <th class="text-subtitle-1 font-weight-bold">作成⽇</th>
                                <th class="text-subtitle-1 font-weight-bold">更新⽇</th>
                                <th class="text-subtitle-1 font-weight-bold text-center">作用</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in filteredUsers.slice((currentPage-1) * 10, currentPage * 10)" :key="item.id" class="month-item">
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
                                    <h6 class="text-body-1 font-weight-bold">{{ item.email }}</h6>
                                </td>
                                <td>
                                    <h6 class="text-body-1">{{ item.createdAt.slice(0, 10) }}</h6>
                                </td>
                                <td>
                                    <h6 class="text-body-1">{{ item.updatedAt.slice(0, 10) }}</h6>
                                </td>
                                <td class="text-right" v-if="item.active">
                                    <v-btn @click="handleEditClick(item, (currentPage-1) * 10 + index)" color="secondary" size="large" class="mr-2">編集</v-btn>
                                    <v-btn v-if="userRole === 'admin' && item.role === 'user'" @click="handlePermissionClick(item, (currentPage-1) * 10 + index)" color="secondary" size="large" class="mr-2">権限設定</v-btn>
                                    <v-btn v-if="userRole === 'admin'" @click="openDeleteDialog(item.id, (currentPage-1) * 10 + index)" color="error" size="large">無効化</v-btn>
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
                        <v-btn color="secondary" @click="deleteUser" variant="elevated">確認</v-btn>
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
                    <form @submit.prevent="saveUser">
                        <v-container>
                        <v-row>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="name.value.value"
                                    label="氏名" 
                                    variant="outlined" 
                                    :error-messages="name.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    v-model="email.value.value" 
                                    label="メールアドレス" 
                                    variant="outlined"
                                    :error-messages="email.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    variant="outlined" 
                                    :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
                                    :type="visible ? 'text' : 'password'"
                                    color="primary" 
                                    label="パスワード" 
                                    @click:append-inner="visible = !visible"
                                    v-model="password.value.value"
                                    :error-messages="password.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-text-field 
                                    variant="outlined" 
                                    :append-inner-icon="pwdConfirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
                                    :type="pwdConfirmVisible ? 'text' : 'password'"
                                    color="primary" 
                                    label="パスワード（確認用）" 
                                    @click:append-inner="pwdConfirmVisible = !pwdConfirmVisible"
                                    v-model="pwdConfirm.value.value"
                                    :error-messages="pwdConfirm.errorMessage.value"
                                ></v-text-field>
                            </v-col>
                            <v-col cols="12">
                                <v-label class="font-weight-bold mb-1">権限</v-label>
                                <v-select
                                    v-model="role.value.value"
                                    :items="[{title: 'ユーザー', id: 'user'}, {title: '管理者', id: 'admin'}]"
                                    item-text="title"
                                    item-value="id"
                                    variant="outlined"
                                    density="compact"
                                    :error-messages="role.errorMessage.value"
                                ></v-select>
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
            <v-dialog v-model="isSettingOpen" max-width="600px">
                <v-card>
                <v-card-title>
                    <span class="text-h5">{{ modalTitle }}</span>
                </v-card-title>
                <v-card-text>
                    <form @submit.prevent="saveSetting">
                        <v-container>
                        <v-row>
                            <v-col cols="12" class="px-8 d-flex justify-space-around">
                                <v-checkbox  color="primary" hide-details v-model="menuSetting.holiday">
                                    <template v-slot:label class="text-body-1">休⽇管理</template>
                                </v-checkbox>
                                <v-checkbox  color="primary" hide-details v-model="menuSetting.depart">
                                    <template v-slot:label class="text-body-1">診療科管理</template>
                                </v-checkbox>
                                <v-checkbox  color="primary" hide-details v-model="menuSetting.doctor">
                                    <template v-slot:label class="text-body-1">担当医管理</template>
                                </v-checkbox>
                            </v-col>
                            <v-col cols="12" class="px-8 d-flex justify-space-around">
                                <v-checkbox  color="primary" hide-details v-model="menuSetting.room">
                                    <template v-slot:label class="text-body-1">診察室管理</template>
                                </v-checkbox>
                                <v-checkbox  color="primary" hide-details v-model="menuSetting.frame">
                                    <template v-slot:label class="text-body-1">予約枠管理</template>
                                </v-checkbox>
                                <v-checkbox  color="primary" hide-details v-model="menuSetting.reservation">
                                    <template v-slot:label class="text-body-1">予約データ管理</template>
                                </v-checkbox>
                            </v-col>
                            <v-col class="d-flex justify-end">
                                <v-btn color="secondary" class="mr-2" type="submit">保存</v-btn>
                                <v-btn color="error" @click="isSettingOpen = false">閉じる</v-btn>
                            </v-col>
                        </v-row>
                        </v-container>
                    </form>
                </v-card-text>
                </v-card>
            </v-dialog>
            <v-snackbar v-model="snackbar.show" location="top right" :timeout="snackbar.timeout" :color="snackbar.color">
                {{ snackbar.text }}
            </v-snackbar>
        </v-col>
    </v-row>
</template>
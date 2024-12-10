<script setup lang="ts">
import { ref } from 'vue';
const router = useRouter();
const checkbox = ref(true);

const { login } = useAuth();
const email = ref('');
const password = ref('');

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

const handleLogin = async () => {
    const result = await login(email.value, password.value);
    if (result) {
        router.push("/users");
    } else {
        showToast("error", "ログインに失敗しました");
    }
};


</script>

<template>
    <v-row class="d-flex mb-3">
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">メールアドレス</v-label>
            <v-text-field variant="outlined" hide-details color="primary" v-model="email"></v-text-field>
        </v-col>
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">パスワード</v-label>
            <v-text-field variant="outlined" type="password"  hide-details color="primary" v-model="password"></v-text-field>
        </v-col>
        <v-col cols="12" class="pt-0">
            <div class="d-flex flex-wrap align-center ml-n2">
                <v-checkbox v-model="checkbox"  color="primary" hide-details>
                    <template v-slot:label class="text-body-1">次回から自動でログイン</template>
                </v-checkbox>
               
            </div>
        </v-col>
        <v-col cols="12" class="pt-0">
            <v-btn @click="handleLogin" color="primary" size="large" block   flat>ログイン</v-btn>
        </v-col>
        <!-- <v-col cols="12" class="pt-0 text-center mt-5">
            <NuxtLink to="/"
                class="text-primary text-decoration-none text-body-1 opacity-1 font-weight-medium">パスワードをお忘れですか？
            </NuxtLink>        
        </v-col> -->
        <v-snackbar v-model="snackbar.show" location="top right" :timeout="snackbar.timeout" :color="snackbar.color">
            {{ snackbar.text }}
        </v-snackbar>
    </v-row>
</template>

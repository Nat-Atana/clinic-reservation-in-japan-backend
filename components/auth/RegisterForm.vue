<script setup lang="ts">
import { ref } from 'vue';
const checkbox = ref(true);
const router = useRouter();

const { register } = useAuth();

const name = ref('');
const email = ref('');
const password = ref('');

const handleRegister = async () => {
    // const result = await register(name.value, email.value, password.value);
    // if (result) {
    //     router.push("/clinic");
    // } else {
        
    // }
};
</script>

<template>
    <v-row class="d-flex mb-3 mt-5">
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">氏名</v-label>
            <v-text-field variant="outlined" hide-details color="primary" v-model="name"></v-text-field>
        </v-col>
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">メールアドレス</v-label>
            <v-text-field variant="outlined" type="email" hide-details color="primary" v-model="email"></v-text-field>
        </v-col>
        <v-col cols="12">
            <v-label class="font-weight-bold mb-1">パスワード</v-label>
            <v-text-field variant="outlined" type="password"  hide-details color="primary" v-model="password"></v-text-field>
        </v-col>
        <v-col cols="12" >
            <v-btn color="primary" size="large" block  flat @click="handleRegister">新規登録</v-btn>
        </v-col>
    </v-row>
</template>

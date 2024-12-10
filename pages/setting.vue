<script setup lang="ts">
import { ref } from 'vue';
import UiParentCard from '@/components/shared/UiParentCard.vue';
import { useAxios } from '@/composables/useAxios';

const axios = useAxios();

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

const clinic = ref('');
const reservationDescription = ref('');
const privacy = ref('');
const clientName = ref(true);
const clientFurigana = ref(true);
const clientGender = ref(true);
const clientDOB = ref(true);
const reservationNum = ref("有効(任意)");
const phone = ref("有効(任意)");
const email = ref("有効(任意)");
const zipCode = ref("有効(任意)");
const address = ref("有効(任意)");
const additionalInfo = ref("有効(任意)");
const webBaseURL = ref(false);
const mailingScheduleDate = ref('');
const mailingTime = ref('');
const mailContent = ref('');
const clinicMailContent = ref('');
// const mailingDate = ref('');
// const dispClientName = ref('');
// const dispClientDOB = ref('');
// const dispClientURL = ref('');
const status = ref([
  { label: "有効(必須)", id: "0" },
  { label: "有効(任意)", id: "1" },
  { label: "無効", id: "2" },
]);

const handleSave = async () => {
    try {
        await axios.post('setting', {
            clinic : clinic.value,
            reservationDescription : reservationDescription.value,
            privacy : privacy.value,
            clientName : clientName.value,
            clientFurigana : clientFurigana.value,
            clientGender : clientGender.value,
            clientDOB : clientDOB.value,
            reservationNum : reservationNum.value,
            phone : phone.value,
            email : email.value,
            zipCode : zipCode.value,
            address : address.value,
            additionalInfo : additionalInfo.value,
            webBaseURL : webBaseURL.value,
            mailingScheduleDate : mailingScheduleDate.value,
            mailingTime : mailingTime.value,
            mailContent : mailContent.value,
            clinicMailContent : clinicMailContent.value,
            // mailingDate : mailingDate.value,
            // dispClientName : dispClientName.value,
            // dispClientDOB : dispClientDOB.value,
            // dispClientURL : dispClientURL.value
        })

        showToast("success", "正確に編集されました。");
        window.location.reload();
    } catch (e) {
        showToast("error", "編集に失敗しました。");
    }
}

const fetchSettings = async() => {
    try {
        const response = await axios.get('/setting');
        const resultObject = response.data.reduce((accumulator: any, currentItem: any) => {
            accumulator[currentItem.field] = currentItem.value;
            return accumulator;
        }, {});

        clinic.value = resultObject.clinic;
        reservationDescription.value = resultObject.reservationDescription;
        privacy.value = resultObject.privacy;
        clientName.value = resultObject.clientName;
        clientFurigana.value = resultObject.clientFurigana;
        clientGender.value = resultObject.clientGender;
        clientDOB.value = resultObject.clientDOB;
        reservationNum.value = resultObject.reservationNum;
        phone.value = resultObject.phone;
        email.value = resultObject.email;
        zipCode.value = resultObject.zipCode;
        address.value = resultObject.address;
        additionalInfo.value = resultObject.additionalInfo;

        webBaseURL.value = resultObject.webBaseURL;
        mailingScheduleDate.value = resultObject.mailingScheduleDate;
        mailingTime.value = resultObject.mailingTime;
        mailContent.value = resultObject.mailContent;
        clinicMailContent.value = resultObject.clinicMailContent;
        // mailingDate.value = resultObject.mailingDate;
        // dispClientName.value = resultObject.dispClientName;
        // dispClientDOB.value = resultObject.dispClientDOB;
        // dispClientURL.value = resultObject.dispClientURL;

    } catch (error) {
        showToast("error", "Fetch Failure");
    }
}

const validateWebBaseURL = (value : string) => {
    const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?(\?[^\s]*)?(\#[^\s]*)?$/;
    if (!urlRegex.test(value))
        return 'URLを正確に入力してください。';
    return true;
}

onMounted(fetchSettings);
</script>
<template>
    <v-row>
        <v-col cols="12" md="12">
            <UiParentCard title="設定">
                <v-col cols="12" class="px-8">
                    <v-label class="font-weight-bold mb-1">施設名</v-label>
                    <v-text-field variant="outlined" v-model="clinic"></v-text-field>
                </v-col>
                <v-col cols="12" class="px-8">
                    <v-label class="font-weight-bold mb-1">予約ページ説明⽂</v-label>
                    <v-textarea variant="outlined" v-model="reservationDescription"></v-textarea>
                </v-col> 
                <v-col cols="12" class="px-8">
                    <v-label class="font-weight-bold mb-1">プライバシーポリシー⽂⾯</v-label>
                    <v-textarea variant="outlined" v-model="privacy"></v-textarea>
                </v-col>
                <v-label class="font-weight-bold mb-1 px-8">常に有効＆必須</v-label>
                <v-col cols="12" class="px-8 d-flex">
                    <v-checkbox  color="primary" hide-details :model-value="true" readonly>
                        <template v-slot:label class="text-body-1">⽒名</template>
                    </v-checkbox>
                    <v-checkbox  color="primary" hide-details :model-value="true" readonly>
                        <template v-slot:label class="text-body-1" v-model="">フリガナ</template>
                    </v-checkbox>
                    <v-checkbox  color="primary" hide-details :model-value="true" readonly>
                        <template v-slot:label class="text-body-1" v-model="">性別</template>
                    </v-checkbox>
                    <v-checkbox  color="primary" hide-details :model-value="true" readonly>
                        <template v-slot:label class="text-body-1" v-model="">⽣年⽉⽇</template>
                    </v-checkbox>
                </v-col>
                <v-label class="font-weight-bold mb-1 px-8">有効(必須)/有効(任意)/無効</v-label>
                <v-row class="pl-6 d-flex align-center">
                    <v-col cols="3" class="px-8 d-flex">
                        <v-label class="mb-1">診察券番号 : </v-label>
                        <v-select
                            v-model="reservationNum"
                            :items="status"
                            item-title="label"
                            item-value="id"
                            variant="outlined"
                            density="compact"
                            hide-details
                            class="pl-1"
                            style="max-width: 150px;">
                        </v-select>
                    </v-col>
                    <v-col cols="3" class="px-8 d-flex">
                        <v-label class="mb-1">電話番号 : </v-label>
                        <v-select
                            v-model="phone"
                            :items="status"
                            item-title="label"
                            item-value="id"
                            variant="outlined"
                            density="compact"
                            hide-details
                            class="pl-1"
                            style="max-width: 150px;">
                        </v-select>
                    </v-col>
                    <v-col cols="4" class="px-8 d-flex">
                        <v-label class="mb-1">メールアドレス : </v-label>
                        <v-select
                            v-model="email"
                            :items="status"
                            item-title="label"
                            item-value="id"
                            variant="outlined"
                            density="compact"
                            hide-details
                            class="pl-1"
                            style="max-width: 150px;">
                        </v-select>
                    </v-col>
                </v-row>
                <v-row class="pl-6 d-flex align-center">
                    <v-col cols="3" class="px-8 d-flex">
                        <v-label class="mb-1">郵便番号 : </v-label>
                        <v-select
                            v-model="zipCode"
                            :items="status"
                            item-title="label"
                            item-value="id"
                            variant="outlined"
                            density="compact"
                            hide-details
                            class="pl-1"
                            style="max-width: 150px;">
                        </v-select>
                    </v-col>
                    <v-col cols="3" class="px-8 d-flex">
                        <v-label class="mb-1">住所 : </v-label>
                        <v-select
                            v-model="address"
                            :items="status"
                            item-title="label"
                            item-value="id"
                            variant="outlined"
                            density="compact"
                            hide-details
                            class="pl-1"
                            style="max-width: 150px;">
                        </v-select>
                    </v-col>
                    <v-col cols="3" class="px-8 d-flex">
                        <v-label class="mb-1">備考欄 : </v-label>
                        <v-select
                            v-model="additionalInfo"
                            :items="status"
                            item-title="label"
                            item-value="id"
                            variant="outlined"
                            density="compact"
                            hide-details
                            class="pl-1"
                            style="max-width: 150px;">
                        </v-select>
                    </v-col>
                </v-row>
                <v-col cols="12" class="px-8">
                    <v-label class="font-weight-bold mb-1">web問診ベースURL</v-label>
                    <v-text-field variant="outlined" v-model="webBaseURL" :rules="[validateWebBaseURL]"></v-text-field>
                </v-col>
                <v-label class="font-weight-bold mb-1 px-8">案内メール⾃動送信</v-label>
                <v-col cols="12" class="px-8 d-flex">
                    <v-text-field variant="outlined" label="web問診案内(⽇前の)" type="number" class="mr-2" v-model="mailingScheduleDate"></v-text-field>
                    <v-text-field variant="outlined" label="web問診案内(時)" type="number" class="mx-2" v-model="mailingTime"></v-text-field>
                    <!-- <v-text-field type="date" label="診察⽇" variant="outlined" class="custom-date-input ml-2" v-model="mailingDate"></v-text-field> -->
                </v-col>
                <v-label class="font-weight-bold mb-1 px-8">web問診案内メールの文面</v-label>
                <v-col cols="12" class="px-8">
                    <v-label class="font-weight-bold mb-1">「予約者⽒名」 → ＠name＠、「予約⽇時」 → ＠datetime＠、「診療科名」 → ＠depart＠、</v-label>
                    <v-label class="font-weight-bold mb-1">「担当医」 → ＠doctor＠、「診察券番号」 → ＠patientnum＠、「web問診URL」 → ＠url＠ を利用してください。</v-label>
                    <v-textarea variant="outlined" v-model="mailContent"></v-textarea>
                </v-col>
                
                <v-label class="font-weight-bold mb-1 px-8">診察案内メールの文面</v-label>
                <v-col cols="12" class="px-8">
                    <v-label class="font-weight-bold mb-1">「予約者⽒名」 → ＠name＠、「予約⽇時」 → ＠datetime＠、「診療科名」 → ＠depart＠、</v-label>
                    <v-label class="font-weight-bold mb-1">「担当医」 → ＠doctor＠、「診察券番号」 → ＠patientnum＠、「web問診URL」 → ＠url＠ を利用してください。</v-label>
                    <v-textarea variant="outlined" v-model="clinicMailContent"></v-textarea>
                </v-col>
                <v-col cols="12" class="px-8 d-flex justify-end mb-4">
                    <v-btn size="large" class="bg-secondary" @click="handleSave">保存</v-btn>
                </v-col>
                <v-snackbar v-model="snackbar.show" location="top right" :timeout="snackbar.timeout" :color="snackbar.color">
                    {{ snackbar.text }}
                </v-snackbar>
            </UiParentCard>
        </v-col>
    </v-row>
</template>

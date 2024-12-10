// ===============================|| Blank Layout ||=============================== //
<script setup lang="ts">

const title = ref("施設スタッフ向け | 診察予約システム");
useHead({
  meta: [{ content: title.value }],
  titleTemplate: (titleChunk) => {
    return "施設スタッフ向け | 診察予約システム";
  },
});
</script>
<template>
  <v-app>
    <NuxtPage  />
  </v-app>
</template>

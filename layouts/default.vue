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
    <v-locale-provider >
        <v-app>
            <LayoutFullMain/>
            <v-main>
                <v-container fluid class="page-wrapper">
                    <div class="maxWidth">
                        <NuxtPage  />
                    </div>
                </v-container>
            </v-main>
        </v-app>
    </v-locale-provider>
</template>

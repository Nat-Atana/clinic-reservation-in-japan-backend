<script setup lang="ts">
import { ref, shallowRef } from 'vue';
import sidebarItems from '@/components/layout/full/vertical-sidebar/sidebarItem';
import { Menu2Icon } from 'vue-tabler-icons';
const sidebarMenu = shallowRef(sidebarItems);
const sDrawer = ref(true);
const { userRole, userMenu } = useAuth();
</script>

<template>
    <!------Sidebar-------->
    <v-navigation-drawer left elevation="0"  app class="leftSidebar"  v-model="sDrawer">
        <!---Logo part -->
        <div class="pa-5">
            <LayoutFullLogo />
        </div>
        <!-- ---------------------------------------------- -->
        <!---Navigation -->
        <!-- ---------------------------------------------- -->
        <div>
        <perfect-scrollbar class="scrollnavbar">
            <v-list class="pa-6">
                <!---Menu Loop -->
                <template v-if="userRole === 'admin'" v-for="(item, i) in sidebarMenu">
                    <LayoutFullVerticalSidebarNavItem :item="item" />
                </template>
                <template v-if="userRole === 'user'">
                    <LayoutFullVerticalSidebarNavItem :item="sidebarMenu[1]" />
                    <LayoutFullVerticalSidebarNavItem :item="sidebarMenu[2]" v-if="userMenu.holiday" />
                    <LayoutFullVerticalSidebarNavItem :item="sidebarMenu[3]" v-if="userMenu.depart" />
                    <LayoutFullVerticalSidebarNavItem :item="sidebarMenu[4]" v-if="userMenu.doctor" />
                    <LayoutFullVerticalSidebarNavItem :item="sidebarMenu[5]" v-if="userMenu.room" />
                    <LayoutFullVerticalSidebarNavItem :item="sidebarMenu[6]" v-if="userMenu.frame" />
                    <LayoutFullVerticalSidebarNavItem :item="sidebarMenu[7]" v-if="userMenu.reservation" />
                    <LayoutFullVerticalSidebarNavItem :item="sidebarMenu[8]" v-if="userMenu.atana" />
                    <LayoutFullVerticalSidebarNavItem :item="sidebarMenu[9]" />
                </template>
            </v-list>
            <div class="pa-4">
                <LayoutFullVerticalSidebarExtraBox/>
            </div>
        </perfect-scrollbar>
    </div>
    </v-navigation-drawer>

    <!------Header-------->
    <v-app-bar elevation="0" height="70">
        <div class="d-flex align-center justify-space-between w-100">
            <div>
                <!------ css hidden-lg-and-up -------->
                <v-btn class="ms-md-3 ms-sm-5 ms-3 text-muted" @click="sDrawer = !sDrawer" icon variant="flat"
                    size="small">
                    <Menu2Icon size="20" stroke-width="1.5" />
                </v-btn>
                <!-- Notification -->
                <LayoutFullVerticalHeaderNotificationDD/>
            </div>
            <div>
                <!-- User Profile -->
                <LayoutFullVerticalHeaderProfileDD />
            </div>
        </div>
    </v-app-bar>
</template>

<template>
    <div id="layoutVue" style="width: 100%; display: flex; justify-content: center;">
        <div style="width: 100%;">
            <slot name="header" v-if="!$router.currentRoute.value.path.includes('/login') && $router.currentRoute.value.path != '/error'">
                <div style="width: 100%; display: flex; justify-content: center; border-bottom: 1px solid #eaeaea;">
                    <div style="width: 1300px; height: 72px; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <p class="fkB " style="font-size: 32px; margin: 0; cursor: pointer;">YBR</p>
                        </div>
                        <div>
                            <q-tabs v-model="tab" class="text-black">
                                <template v-for="row,idx in item_list" :key="idx">
                                    <q-tab :name="row.name" class="fkB" @click="$router.push(row.url)">
                                        <template v-slot:default>
                                            <p class="q-ma-none ft20">{{ row.label }}</p>
                                        </template>
                                    </q-tab>
                                </template>
                            </q-tabs>
                        </div>
                        <div>
                            <q-chip>
                                <q-avatar>
                                    <img :src="$store.state.host + $store.state.user.image">
                                </q-avatar>
                                <p class="q-ma-none fkR ft20">{{ $store.state.user.userName }}</p>
                                <q-menu>
                                    <q-list style="min-width: 100px">
                                        <q-item clickable v-close-popup>
                                            <q-item-section class="ft18 fkR">계정 관리</q-item-section>
                                        </q-item>
                                        <q-separator />
                                        <q-item clickable @click="onLogout">
                                            <q-item-section class="ft18 fkR">로그아웃</q-item-section>
                                        </q-item>
                                    </q-list>
                                </q-menu>
                            </q-chip>
                        </div>
                    </div>
                </div>
            </slot>
            <div style="width: 100%; display: flex; justify-content: center;">
                <div style="width: 1300px; min-height: 800px;">
                    <slot name="body">
    
                    </slot>
                </div>
            </div>
            <slot name="footer">
                <div 
                    style="height: 70px; border-top: 1px solid #eaeaea;"  class="q-pa-md">
                    <p class="fkR" style="font-size: 16px; color: grey;">
                        @primero-pjh. All right reserved.
                    </p>
                </div>
            </slot>
        </div>
    </div>
</template>

<script>
export default {
    name: 'layoutVue',
    data() {
        return {
            height: 0,
            tab: 'home',
            isShow: true,
            unShowPage: {
                login: true,
                error: true,
                waiting: true,
                admin: true,
            },
            item_list: [
                { icon: 'calendar-o', label: '홈', url: '/home', name: 'home',  },
                { icon: 'calendar-o', label: '캘린더', url: '/calendar', name: 'calendar',  },
                { icon: 'chat-o', label: '채팅', url: '/chat', name: 'chat', isCustom: true,  },
                { icon: 'friends-o', label: '커뮤니티', url: '/community', name: 'community',  },
                { icon: 'smile-o', label: '프로필', url: '/profile', name: 'profile',  },
            ],
            active: 0,
        }
    },
    props: {
    },
    computed: {
        isAdmin: function() {
            return this.$store.state.user.isAdmin;
        },
    },
    methods: {
        onLogout() {
            let vm = this;
            vm.$router.push("/login");
        },
        location_href(row) {
            let vm = this;
            vm.$router.push(row.url);
        },
    },
    mounted() {
        let vm = this;
        let routeName = vm.$router.currentRoute.value.name;
        let idx = vm.item_list.findIndex(x => x.name == routeName);
        vm.active = idx;
    },
    created() {
        let vm = this;
        vm.height = vm.$store.state.height;
    }
}
</script>
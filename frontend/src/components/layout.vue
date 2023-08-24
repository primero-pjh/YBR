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
                        <div @click="openRightDialog">
                            <q-chip >
                                <q-avatar>
                                    <img :src="$store.state.host + $store.state.user.image">
                                </q-avatar>
                                <p class="q-ma-none fkR ft20">{{ $store.state.user.userName }}</p>
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
                        <q-btn label="github" outline color="black" @click="goto_github"/>
                    </p>
                </div>
            </slot>
        </div>
        <div>
            <q-dialog v-model="isRightDialog" position="right" full-height>
                <q-card class="column full-height" style="width: 350px">
                    <q-linear-progress :value="1.0" color="primary" />
                    <q-card-section>
                        <div v-if="$store.state.user">
                            <q-item dense class="q-pa-sm" style="border: 1px solid #eee;">
                                <q-item-section side>
                                    <q-avatar rounded size="48px">
                                        <q-img :src="$store.state.host + $store.state.user.image" style="border-radius: 15px;"/>
                                    </q-avatar>
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label class="fkR ft20">{{ $store.state.user.userName }}</q-item-label>
                                    <q-item-label class="fkR ft20">{{ $store.state.user.email }}</q-item-label>
                                </q-item-section>
                            </q-item>
                        </div>
                    </q-card-section>
                    <q-card-section class="col q-ma-md fkR ft16" style="border: 1px solid #eee;">
                        알림
                    </q-card-section>
                    <q-card-actions class="q-pa-md">
                        <q-btn outline label="계정설정" v-close-popup style="width: 100%; margin-left: 0;" 
                            class="q-mb-md" @click="goto_setting"/>
                        <q-btn outline label="로그아웃" v-close-popup style="width: 100%; margin-left: 0;" 
                            @click="onLogout" />
                    </q-card-actions>
                </q-card>
            </q-dialog>
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
            isRightDialog: false,
            
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
        openRightDialog() {
            let vm = this;
            vm.isRightDialog = !vm.isRightDialog;
        },
        goto_setting() {
            this.$router.push("/setting");
        },
        goto_github() {
            window.open('https://github.com/primero-pjh/ybr');
        },
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
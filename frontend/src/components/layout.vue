<template>
    <div id="layoutVue" style="width: 100%; display: flex; justify-content: center;">
        <div style="width: 100%;">
            <slot name="header" v-if="!$router.currentRoute.value.path.includes('/login') && $router.currentRoute.value.path != '/error'">
                <div style="width: 100%; display: flex; justify-content: center; border-bottom: 1px solid #eaeaea;">
                    <div style="width: 1300px; height: 72px; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <p class="fkB " style="font-size: 36px; margin: 0;">YBR</p>
                        </div>
                        <div>
                            <q-tabs v-model="tab" class="text-black" >
                                <template v-for="(row, idx) in menu_list" :key="idx">
                                    <template v-if="row.name == 'chat'">
                                        <q-tab :name="row.name" class="fkB" @click="location_href(row.url)">
                                            <template v-slot:default>
                                                <p class="q-ma-none ft20">{{ row.label }}</p>
                                                <q-badge floating color="negative" v-if="chatCount > 0"> 
                                                    {{ chatCount }} 
                                                </q-badge>
                                                <div style="display: flex;" v-if="$store.state.couple.socketId && row.inCouple">
                                                    <div>
                                                        <q-img style="width: 20px;" 
                                                            :src="$store.state.host + $store.state.couple.image"></q-img>
                                                    </div>
                                                </div>
                                            </template>
                                        </q-tab>
                                    </template>
                                    <template v-else-if="row.name == 'profile'">
                                        <q-tab :name="row.name" class="fkB" @click="location_href(row.url)">
                                            <template v-slot:default>
                                                <p class="q-ma-none ft20">프로필</p>
                                                <div style="display: flex;" v-if="$store.state.couple.socketId && row.inCouple">
                                                    <div>
                                                        <q-img style="width: 20px;" 
                                                            :src="$store.state.host + $store.state.couple.image"></q-img>
                                                    </div>
                                                </div>
                                            </template>
                                        </q-tab>
                                    </template>
                                    <template v-else>
                                        <q-tab :name="row.name" class="fkB" @click="location_href(row.url)">
                                            <template v-slot:default>
                                                <p class="q-ma-none ft20">{{ row.label }}</p>
                                                <div style="display: flex;" v-if="$store.state.couple.socketId && row.inCouple">
                                                    <div>
                                                        <q-img style="width: 20px;" 
                                                            :src="$store.state.host + $store.state.couple.image"></q-img>
                                                    </div>
                                                </div>
                                            </template>
                                        </q-tab>
                                    </template>
                                </template>
                            </q-tabs>
                        </div>
                        <div @click="openRightDialog">
                            <q-item clickable v-ripple>
                                <q-item-section side>
                                    <q-avatar rounded size="48px">
                                    <img :src="$store.state.host + user.image" />
                                    <q-badge floating color="negative"> {{ alarmListCount }} </q-badge>
                                    </q-avatar>
                                </q-item-section>
                                <q-item-section>
                                    <q-item-label class="fkR ft20">{{ user.userName }}</q-item-label>
                                    <q-item-label caption class="fkR">{{ user.email }}</q-item-label>
                                </q-item-section>
                            </q-item>
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
                <div style="min-height: 70px; border-top: 1px solid #eaeaea; width: 100%;
                        background-color: gray;"
                        class="q-pa-md"
                        v-if="!$router.currentRoute.value.path.includes('/login')">
                    <div class="fkR" style="font-size: 20px; color: white;">
                        © 2023. (PRITRAS)&nbsp; all rights reserved.
                    </div>
                    <q-chip style="cursor: pointer;">
                        <q-avatar @click="goto_github">
                            <img :src="$store.state.host + '/images/github_icon.png'">
                        </q-avatar>
                        <span class="fkR ft16" @click="goto_github">primero-pjh</span>
                    </q-chip>
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
                        <div>
                            <div class="text-h6">알림({{alarmList.length}})</div>
                            <q-list bordered separator>
                                <template v-for="row, idx in alarmList" :key="idx">
                                    <q-item>
                                        <q-item-section>
                                            <q-item-label>{{ row.message }}</q-item-label>
                                            <q-item-label caption>{{ row.dateView }}</q-item-label>
                                        </q-item-section>
                                        <q-menu auto-close>
                                            <q-list style="min-width: 100px">
                                                <q-item clickable @click="onRight(idx)">
                                                    <q-item-section>삭제</q-item-section>
                                                </q-item>
                                            </q-list>
                                        </q-menu>
                                    </q-item>
                                </template>
                            </q-list>
                        </div>
                        
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
            isShow: true,
            isRightDialog: false,
            tab: 'home',
            
            unShowPage: {
                login: true,
                error: true,
                waiting: true,
                admin: true,
            },
            active: 0,
        }
    },
    props: {
    },
    computed: {
        user: function() { return this.$store.state.user; },
        alarmList: function() { return this.$store.state.alarmList; },
        alarmListCount: function() { return this.$store.state.alarmListCount; },
        chatCount: function() { return this.$store.state.chatCount; },
        isAdmin: function() {
            return this.$store.state.user.isAdmin;
        },
        menu_list() {
            return this.$store.getters.getMenuList;
        },
    },
    methods: {
        onRight(idx) {
            let vm = this;
            vm.$store.commit("deleteAlarm", idx);
        },
        openRightDialog() {
            let vm = this;
            vm.isRightDialog = !vm.isRightDialog;
            vm.$store.commit("setAlarmListCount", 0);
        },
        goto_page(args) {
            let vm = this;
            vm.$store.commit("setTab", args.name);
            vm.$router.push(args.url);
        },
        goto_setting() {
            let vm = this;
            vm.tab = 'setting';
            vm.$router.push("/setting");
        },
        goto_github() {
            window.open('https://github.com/primero-pjh/ybr');
        },
        onLogout() {
            let vm = this;
            vm.$store.state.socket.emit(`/socket/user/logOut`, {
                coupleSocketId: vm.$store.state.couple.socketId,
            });
            vm.$router.push("/login");
        },
        location_href(url) {
            let vm = this;
            let idx = vm.$store.state.menu_list.findIndex(x=>x.url == url);
            let next = vm.menu_list[idx];
            vm.$store.state.socket.emit(`/socket/router`, {
                toPath: next.url,
            });
            vm.$router.push(url);
        },
    },
    mounted() {
        let vm = this;
        let routeName = vm.$router.currentRoute.value.name;
        let idx = vm.menu_list.findIndex(x => x.name == routeName);
        vm.active = idx;

    },
    created() {
        let vm = this;
        vm.height = vm.$store.state.height;
    }
}
</script>
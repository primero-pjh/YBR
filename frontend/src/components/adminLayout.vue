<template>
    <div id="adminLayoutVue" style="width: 100%; display: flex; justify-content: center;">
        <div style="width: 100%;">
            <q-layout
                view="hHh lpr lff" container style="height: 800px;"
                :style="{height: $store.state.height + 'px'}"
                class="shadow-2 rounded-borders"
                :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
                <q-header reveal :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
                    <q-toolbar>
                        <!-- <q-btn flat @click="drawerLeft = !drawerLeft" 
                            round dense icon="menu" /> -->
                        <q-toolbar-title class="q-ml-md">YBR</q-toolbar-title>
                        <div>
                            <q-btn>
                                {{ $store.state.user.userName }}님 반갑습니다.
                                <q-menu>
                                    <q-list style="min-width: 100px">
                                        <q-item clickable @click="onLogout">
                                            <q-item-section class="fkR">로그아웃</q-item-section>
                                        </q-item>
                                        <!-- <q-separator /> -->
                                    </q-list>
                                </q-menu>
                            </q-btn>
                        </div>
                    </q-toolbar>
                    <q-toolbar class="bg-white text-black shadow-1">
                        <q-toolbar-title class="fkR q-ml-md" style="font-size: 16px;">
                            관리자 > SUBHEADER > LIRGHT ASD
                        </q-toolbar-title>
                    </q-toolbar>
                </q-header>
               
                <q-drawer v-model="drawerLeft" :width="270" :breakpoint="700" bordered>
                    <q-scroll-area class="fit">
                        <q-list bordered padding>
                            <template v-for="row, idx in item_list" :key="idx">
                                <div class="q-pa-sm">
                                    <q-item-label header style="height: 30px;">{{ row.label }}</q-item-label>
                                    <template v-for="item,idx2 in row.childrens" :key="idx2+'ch'">
                                        <q-item clickable v-ripple >
                                            <q-item-section @click="$router.push(item.url)">
                                                <q-item-label class="fkR ft20">{{item.label}}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </template> 
                                    
                                </div>
                                <q-separator spaced />
                            </template>
                            <q-item-label header style="height: 30px;">특수앱</q-item-label>
                            <q-item clickable v-ripple >
                                <q-item-section @click="goto_swagger">
                                    <q-item-label class="fkR ft20">
                                        Swagger
                                    </q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </q-scroll-area>
                </q-drawer>

                <q-page-container>
                    <q-page class="q-pa-md">
                        
                        <slot name="body">

                        </slot>
                    </q-page>
                </q-page-container>
            </q-layout>
        </div>
    </div>
</template>

<script>
export default {
    name: 'adminLayoutVue',
    data() {
        return {
            drawerLeft: true,
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
                { label: '홈', name: 'home', childrens: [
                    { icon: 'chat-o', label: '대시보드', url: '/admin/dashboard', name: 'dashboard' },
                ]  },
                { label: '앱 유저', name: 'user', childrens: [
                    { icon: 'chat-o', label: '계정 관리', url: '/admin/user/person', name: 'dashboard' },
                    { icon: 'chat-o', label: '커플 관리', url: '/admin/user/couple', name: 'dashboard' },
                ]  },
                { label: '데이터베이스', name: 'database', childrens: [
                    { icon: 'chat-o', label: '관리', url: '/admin/db', name: 'dashboard' },
                ]  },
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
            window.location.reload();
        },
        location_href(row) {
            let vm = this;
            vm.$router.push(row.url);
        },

        goto_swagger() {
            let vm = this;
            window.open('/api-docs');
        }
    },
    mounted: function() {
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
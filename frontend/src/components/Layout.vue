<template>
    <div id="layoutVue" style="width: 100%; display: flex; justify-content: center;">
        <div style="width: 100%;">
            <slot name="header">
                <div style="width: 100%; display: flex; justify-content: center; border-bottom: 1px solid #eaeaea;">
                    <div style="width: 1300px; height: 72px; display: flex; align-items: center; justify-content: space-between;">
                        <div>
                            <p class="fkB " style="font-size: 32px; margin: 0; cursor: pointer;" @click="$router.push('/home')">YBR</p>
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
                            <q-btn icon="settings" flat />
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
                <div style="height: 58px; border-top: 1px solid #eaeaea;" class="q-pa-md">
                    <p class="fkR" style="font-size: 16px; color: grey;">@primero-pjh. All right reserved.</p>
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
        location_href(row) {
            let vm = this;
            vm.$router.push(row.url);
        },
        onChange: function(idx) {
            let vm = this;
            let item = vm.item_list[idx];
            vm.$router.push(item.url);
        },
        onClickLeft: function() {
            let vm = this;
            let back_route = vm.$router.options.history.state.back;
            if(back_route == '/login') { return; }
            vm.$router.back();
        },
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
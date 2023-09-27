<template>
    <div id="app">
        <template v-if="$store.state.user.isAdmin == true">
            <adminLayout>
                <template v-slot:body>
                    <router-view />
                </template>    
            </adminLayout>
        </template>
        <template v-else>
            <layout ref="layout">
                <template v-slot:body>
                    <router-view />
                </template>
            </layout>
        </template>
        <dialog_modify_album ref="dialog_modify_album" />
        <dialog_scheduled ref="dialog_scheduled" />
    </div>
</template>

<script>
import layout from "@/components/layout.vue";
import adminLayout from "@/components/adminLayout.vue";
import dialog_modify_album from "@/components/dialog_modify_album.vue";
import dialog_scheduled from '@/components/dialog_scheduled.vue';

export default {
    name: 'App',
    computed: {
        width() {
            return this.$store.state.width;
        },
        height() {
            return this.$store.state.height;
        },
    },
    components: {
        layout,
        adminLayout,
        dialog_modify_album,
        dialog_scheduled,
    },
    data() {
        return {
        }
    },
    mounted: function() {
        let vm = this;
        // console.log("query:", vm.$router.currentRoute.value.query);
        // if(!vm.$store.state.UID) {
        //     if(Object.prototype.hasOwnProperty.call(vm.$router.currentRoute.value.query, "code")) {
        //         let code = vm.$router.currentRoute.value.query.code; 
        //         vm.$router.push("/login?code=" + code);
        //     } else {
        //         vm.$router.push("/login");
        //     }
        // }
    }
}
</script>
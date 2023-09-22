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
        <dialog_add_album ref="dialog_add_album" />
    </div>
</template>

<script>
import layout from "@/components/layout.vue";
import adminLayout from "@/components/adminLayout.vue";
import dialog_add_album from "@/components/dialog_add_album.vue";

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
        dialog_add_album,
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
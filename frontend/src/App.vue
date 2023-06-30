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
            <layout>
                <template v-slot:body>
                    <router-view />
                </template>
            </layout>
        </template>
    </div>
</template>

<script>
import layout from "@/components/layout.vue";
import adminLayout from "@/components/adminLayout.vue";

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
        adminLayout
    },
    data() {
        return {
        }
    },
    mounted: function() {
        let vm = this;
        if(!vm.$store.state.UID) {
            vm.$router.push("/login");
        }
    }
}
</script>
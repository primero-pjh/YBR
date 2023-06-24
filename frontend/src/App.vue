<template>
    <div id="app">
        <layout>
            <template v-slot:body>
                <router-view></router-view>
            </template>
        </layout>
    </div>
</template>

<script>
import layout from "@/components/layout.vue";

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
    },
    data() {
        return {
        }
    },
    mounted: function() {
        let vm = this;
    }
}
</script>
<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
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
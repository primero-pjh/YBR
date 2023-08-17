<template>
    <div id="homeVue" style="height: 100%;">
        <div>
            <p class="fkR">안녕</p>
        </div>
    </div>
</template>

<script>

import { io } from "socket.io-client";


export default {
    name: 'homeVue',
    components: {
    },
    data() {
        return {

        }
    },
    methods: {
        
    },
    mounted: function() {
        let vm = this;
        console.log("homeVue");
    },
}
</script>
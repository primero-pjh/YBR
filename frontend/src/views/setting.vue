<template>
    <div id="settingVue" style="height: 100%;">
        <div>
            <q-btn label="커플 해제" @click="onDisconnectCouple">
                
            </q-btn>
        </div>
    </div>
</template>

<script>

import axios from 'axios';
export default {
    name: 'settingVue',
    components: {
    },
    data() {
        return {

        }
    },
    methods: {
        onDisconnectCouple() {
            let vm = this;
            let coupleInfoId = vm.$store.state.user.coupleInfoId;
            axios.delete(`/api/couple/${coupleInfoId}`, {}).then((res) => {
                let data = res.data;
                if(data.success) {
                    window.location.reload();
                }
            });
        }
    },
    mounted: function() {
        let vm = this;
    },
}
</script>
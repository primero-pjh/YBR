<template>
    <div id="_dbVue" style="height: 100%;">
        <div>
            <q-card>
                <q-card-section>
                    <div class="q-pa-md">
                        <p class="text-h5 fkR">Connection 수 확인</p>
                        <table style="border-top: 1px solid #eee;" class="ft20 fkR">
                            <tr>
                                <td>최대 접속가능 수(max_connections)</td>
                                <td>151</td>
                            </tr>
                            <tr>
                                <td>현재 접속 수(Threads_connected)</td>
                                <td>151</td>
                            </tr>
                        </table>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script>

export default {
    name: '_dbVue',
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
    },
}
</script>
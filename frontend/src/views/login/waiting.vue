<template>
    <div id="waitingVue" class="center">
        <div style="width: 580px;" class="q-pa-md q-mt-md">
            <div style="display: flex; ">
                <div style="width: 50%;" class="q-mr-md shadow-2 ">
                    <div class="q-pa-md">
                        <div class="text-h6 fkR">신청</div>
                        <q-input dense outlined placeholder="상대 개인 연락처를 입력하세요."></q-input>
                    </div>
                    
                </div>
                <div style="width: 50%;" class="shadow-2 ">
                    <div class="q-pa-md">
                        <div class="text-h6 fkR">대기열</div>
                        <div>
                            <q-list>
                                <q-item>
                                    안넝?
                                </q-item>
                                <q-item>
                                    안넝?
                                </q-item>
                            </q-list>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'waitingVue',
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
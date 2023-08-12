<template>
    <div id="waitingVue" style="display: flex; justify-content: center;">
        <div style="width: 800px;" class="q-pa-md q-mt-md">
            <div class="q-mb-md">
                <q-expansion-item expand-separator class="shadow-2 fkR ft20" default-opened
                    label="나의 개인정보">
                    <q-card>
                        <q-card-section>
                            <div style="display: flex; width: 100%;" v-if="user">
                                <div style="position: relative; width: 150px;" class="q-mr-md">
                                    <template v-if="user.image">
                                        <q-img :src="$store.state.host + user.image" 
                                            style="border: 1px solid #eee; border-radius: 15px; width: 150px;" />
                                    </template>
                                    <template v-else>
                                        <q-img src="/images/default_avatar_image.png" 
                                            style="border: 1px solid #eee; border-radius: 15px; width: 150px;" />
                                    </template>
                                    
                                    <div style="position: absolute; top: -5px; right: -5px;">
                                        <q-btn icon="upload" color="primary" dense round @click="onUpload" />
                                    </div>
                                </div>
                                <div class="q-pa-md" style="background-color: #eee; width: 100%;" >
                                    <q-toggle v-model="form.isEdit" :label="form.isEdit?'ON':'OFF'" color="green"></q-toggle>
                                    <q-input label="이름" v-model="user.userName" class="ft20" :disable="!form.isEdit"></q-input>
                                    <q-input label="전화번호" v-model="user.phoneNumber" class="ft20" :disable="!form.isEdit"></q-input>
                                    <q-input type="textarea" label="자기소개" v-model="user.memo" :disable="!form.isEdit"></q-input>
                                </div>
                                
                            </div>
                            <div class="q-pa-sm" v-if="user">
                                <div>
                                    초대코드: {{user.code}}
                                    <q-btn icon="refresh" dense class="q-mr-md">
                                    </q-btn>
                                    <q-btn icon="board" dense></q-btn>
                                </div>
                            </div>
                        </q-card-section>
                    </q-card>
                </q-expansion-item>

            </div>
            <div style="display: flex; ">
                <div style="width: 50%;" class="q-mr-md shadow-2 ">
                    <div class="q-pa-md">
                        <div class="text-h6 fkR">신청</div>
                        <q-input dense outlined 
                            v-model="form.targetCode"
                            :error="formError.targetCode?true:false" :error-message="formError.targetCode"
                            placeholder="상대방의 요청코드를 입력 후 엔터를 누르세요."
                            @keyup.enter="onSend" />
                        <div v-if="search_user">
                            {{ search_user.userName }} 님이 맞나요 ?
                            <q-btn label="예" @click="onSend"></q-btn>
                            <q-btn label="아니오"></q-btn>
                        </div>
                        
                    </div>
                </div>
                <div style="width: 50%;" class="shadow-2 ">
                    <div class="q-pa-md">
                        <div style="width: 100%; display: flex; justify-content: space-between;">
                            <div class="text-h6 fkR">신청 대기열</div>
                            <div>
                                <q-btn icon="refresh" dense flat></q-btn>
                            </div>
                        </div>
                        
                        <div>
                            <q-list bordered separator>
                                <q-item>
                                    안넝?
                                </q-item>
                            </q-list>
                        </div>
                        <div class="text-h6 fkR">요청 대기열</div>
                        <div>
                            <q-list bordered separator>
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
import axios from 'axios';


export default {
    name: 'waitingVue',
    components: {
    },
    data() {
        return {
            user: null,
            search_user: null,
            form: {
                targetCode: '',
                userName: '',
                phoneNumber: '',
                memo: '',
                isEdit: false,
            },
            formError: {
                targetCode: '',
            },
            waiting_list: [],
        }
    },
    methods: {
        onSend() {
            let vm = this;
            vm.$q.loading.show();
            axios.post(`/api/user/waiting`, {
                targetCode: vm.form.targetCode.trim(),
            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    console.log("data: ", data);
                } else {
                    vm.$store.state.setError(vm.formError, data.error);
                }
                vm.$q.loading.hide();
            });
        },
        onUpload() {
            let vm = this;
            console.log("onUpload");
        }
    },
    mounted: function() {
        let vm = this;
        let user = vm.$store.getters.getUser;
        vm.user = user;
    },
}
</script>
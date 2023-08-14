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
                                    
                                    <template v-if="user.code">
                                        초대코드: 
                                        {{user.code}}
                                    </template>
                                    <template v-else>
                                        <span class="text-negative">
                                            초대코드가 존재하지 않습니다. 발급 후 이용해주세요.
                                        </span>
                                    </template>
                                    <q-btn dense icon="refresh" color="positive" flat
                                        @click="refreshCode">
                                        <q-tooltip>
                                            재발급
                                        </q-tooltip>
                                    </q-btn>
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
                            @keyup.enter="onApply" />
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
                                <q-btn icon="refresh" dense flat @click="loadWaitingList" />
                            </div>
                        </div>
                        
                        <div>
                            <q-list bordered separator>
                                <template v-for="(row, idx) in from_user_list" :key="idx">
                                    <q-item>
                                        <div style="display: flex; justify-content: space-between; width: 100%;">
                                            <div class="fkR ft20">
                                                {{ row.toUserName }}
                                            </div>
                                            <div>
                                                <q-btn icon="close" dense flat color="negative"></q-btn>
                                            </div>
                                        </div>
                                    </q-item>
                                </template>
                                
                            </q-list>
                        </div>
                        <div class="text-h6 fkR">요청 대기열({{ to_user_list.length }})</div>
                        <div>
                            <q-list bordered separator>
                                <template v-for="(row, idx) in to_user_list" :key="idx">
                                    <q-item>
                                        <div style="display: flex; justify-content: space-between; width: 100%;">
                                            <div class="fkR ft20">
                                                {{ row.fromUserName }}
                                            </div>
                                            <div>
                                                <q-btn icon="done" dense flat color="positive" 
                                                    class="q-mr-sm" 
                                                    @click="onAccept(row)" />
                                                <q-btn icon="close" dense flat color="negative"
                                                    @click="onDismiss(row)" />
                                            </div>
                                        </div>
                                    </q-item>
                                </template>
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
            to_user_list: [],
            from_user_list: [],
        }
    },
    methods: {
        /* 상대방에게 요청을 보냄 */
        onApply() {
            let vm = this;
            vm.$q.loading.show();
            axios.post(`/api/user/waiting`, {
                targetCode: vm.form.targetCode.trim(),
            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    vm.$q.notify({
                        icon: 'check',
                        color: 'positive',
                        message: data.message
                    });
                } else {
                    vm.$store.state.setError(vm.formError, data.error);
                }
                vm.$q.loading.hide();
            });
        },
        refreshCode() {
            let vm = this;
            vm.$q.loading.show();
            axios.put(`/api/user/code`, {}).then((res) => {
                let data = res.data;
                if(data.success) {
                    vm.user.code = data.code;
                }
                vm.$q.loading.hide();
            });
        },
        
        /* image */
        onUpload() {
            let vm = this;
            console.log("onUpload");
        },

        /* 요청 대기열의 수락 */
        onAccept(row) {
            let vm = this;
            axios.put(`/api/user/couple`, {
                toUID: row.toUID,
                fromUID: row.fromUID,
            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    vm.$store.commit("setCouple", data.couple);
                    vm.$router.push("/home");
                } else {
                    vm.$q.notify({
                        icon: 'error',
                        color: 'negative',
                        message: data.message
                    });
                }
            });
        },
        /* 요청 대기열의 거절 */
        onDismiss(row) {
            let vm = this;
            console.log("row:", row);
        },

        loadWaitingList() {
            let vm = this;
            axios.get(`/api/waiting`, {
                params: {
                    UID: vm.$store.state.UID
                }
            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    vm.to_user_list = data.to_user_list;
                    vm.from_user_list = data.from_user_list;
                }
            });
        }
    },
    mounted: function() {
        let vm = this;
        if(!vm.$store.state.UID) {
            vm.$router.push("/login");
        }
        let user = vm.$store.getters.getUser;
        vm.user = user;
        vm.loadWaitingList();
    },
}
</script>
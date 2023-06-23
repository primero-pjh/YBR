<template>
    <div id="loginVue" class="center">
        <div class="text-h4">YBR</div>
        <div style="width: 580px;" class="shadow-2 q-pa-md">
            <div style="padding: 55px 69px;">
                <div>
                    <q-input outlined dense label="아이디" v-model="appUser.userId"
                        :error="formError.userId?true:false" :error-message="formError.userId" />
                    <q-input outlined dense label="비밀번호" type="password" v-model="appUser.password" 
                        :error="formError.password?true:false" :error-message="formError.password" />

                    <q-toggle label="자동 로그인" v-model="appUser.rememberMe" />

                    <q-btn class="q-mt-md" label="로그인" color="primary" 
                        style="width: 100%;" size="lg" @click="onLogin" :loading="isLoading" :disable="isLoading" />
                    <div style="display: flex; justify-content: space-between; height: 20px;" class="q-mt-md">
                        <div>
                            <p style="cursor: pointer;">회원가입</p>
                        </div>
                        <div style="display: flex;">
                            <p style="cursor: pointer;" class="q-mr-sm">계정찾기</p>
                            <q-separator vertical class="q-mr-sm" />
                            <p style="cursor: pointer;">비밀번호찾기</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { io } from "socket.io-client";

export default {
    name: 'loginVue',
    components: {
    },
    data() {
        return {
            isLoading: false,

            appUser: {
                userId: '',
                password: '',
                rememberMe: false,
            },
            formError: {
                userId: '',
                password: '',
            }
        }
    },
    methods: {
        onLogin() {
            let vm = this;
            vm.isLoading = !vm.isLoading;
            axios.post(`/api/user/login`, {
                params: {
                    userId: vm.appUser.userId,
                    password: vm.appUser.password,
                    rememberMe: vm.appUser.rememberMe,
                }
            }).then((res) => {
                let data = res.data;
                if(data.success) {  
                    vm.$router.push("/home");
                    console.log("data:", data);
                } else {
                    vm.$c.setError(vm.formError, data.error);
                }
                vm.isLoading = !vm.isLoading;
            });
        },
        onLoginKakao: function() {
            let vm = this;
        },
    },
    mounted: function() {
    },
    created: function() {
    },
}
</script>

<template>
    <div id="loginVue" class="center">
        <div class="text-h4 text-center">YBR</div>
        <div style="width: 580px;" class="shadow-2 q-pa-md q-mt-md">
            <div style="padding: 55px 69px;">
                <div>
                    <q-input outlined dense label="아이디" v-model="appUser.userId"
                        @keyup.enter="onLogin"
                        :error="formError.userId?true:false" :error-message="formError.userId" />
                    <q-input outlined dense label="비밀번호" type="password" v-model="appUser.password"
                        @keyup.enter="onLogin" 
                        :error="formError.password?true:false" :error-message="formError.password" />

                    <q-toggle label="자동 로그인" v-model="appUser.rememberMe" disable />

                    <q-btn class="q-mt-md" style="width: 100%;" label="로그인" color="primary" 
                        size="lg" @click="onLogin" 
                        :loading="isLoading" :disable="isLoading" />
                    <q-img src="/images/kakao_login_medium_wide.png" 
                        class="q-mt-md" style="height: 51px; cursor: pointer;" />
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
            vm.$axios.post(`/api/user/login`, {
                params: {
                    userId: vm.appUser.userId,
                    password: vm.appUser.password,
                    rememberMe: vm.appUser.rememberMe,
                }
            }).then((res) => {
                let data = res.data;
                if(data.success) {  
                    /* socket 등록 */
                    const token = data.token.APP_ACC_TKN;
                    const socket = io("ws://localhost:3000", {
                        // reconnectionDelayMax: 10000,
                        auth: {
                            token,
                        },
                    });
                    vm.$store.commit("setSocket", socket);
                    
                    if(data.user.isAdmin) {
                        vm.$store.commit("setUser", data.user);
                        vm.$store.commit("setUserUID", data.user.UID);
                        vm.$store.commit("setToken", data.token.APP_ACC_TKN);
                        vm.$router.push("/admin/home");
                        return;
                    }
                    /*
                        login logic flow
                        1. 커플인 경우
                            -> store에 값들을 저장 후 home 화면으로 이동
                        2. 커플이 아닌 경우
                            -> user의 값만 store에 저장 후 waiting 화면으로 이동
                    */
                    if(data.couple) {
                        vm.$store.commit("setToken", data.token.APP_ACC_TKN);
                        vm.$store.commit("setUser", data.user);
                        vm.$store.commit("setCouple", data.couple);
                        vm.$store.commit("setUserUID", data.user.UID);
                        vm.$router.push("/home");
                        return;
                    } else {
                        // vm.$store.commit("setToken", data.token.APP_ACC_TKN);
                        vm.$store.commit("setUser", data.user);
                        // vm.$store.commit("setCouple", data.couple);
                        vm.$store.commit("setUserUID", data.user.UID);
                        vm.$router.push("/login/waiting");
                        return;
                    }
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

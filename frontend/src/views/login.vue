<template>
    <div id="loginVue" class="center">
        <div class="text-center fkB ft24" style="font-size: 42px;">YBR</div>
        <div style="width: 580px; height: 100%;" class="shadow-2 q-pa-md q-mt-md">
            <div style="padding: 55px 69px;">
                <div>
                    <q-input outlined dense label="아이디" v-model="appUser.userId"
                        @keyup.enter="onLogin"
                        :error="formError.userId?true:false" :error-message="formError.userId" />
                    <q-input outlined dense label="비밀번호" type="password" v-model="appUser.password"
                        @keyup.enter="onLogin" 
                        :error="formError.password?true:false" :error-message="formError.password" />

                    <q-toggle label="자동 로그인" v-model="appUser.rememberMe" disable class="fkR ft18" />

                    <q-btn class="q-mt-md" style="width: 100%;" label="로그인" color="primary" 
                        size="lg" @click="onLogin" 
                        :loading="isLoading" :disable="isLoading" />
                    <q-separator class="q-my-md"></q-separator>
                    <q-img src="/images/kakao_login_medium_wide.png" @click="onLoginKakao"
                        style="height: 51px; cursor: pointer;" />
                    <div style="display: flex; justify-content: space-between; height: 20px;" class="q-mt-md fkR ft16">
                        <div @click="goto_signup">
                            <p style="cursor: pointer;" class="fkR" >회원가입</p>
                        </div>
                        <div style="display: flex;">
                            <!-- <p style="cursor: pointer;" class="q-mr-sm">계정찾기</p> -->
                            <!-- <q-separator vertical class="q-mr-sm" /> -->
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
import axios from "axios";

export default {
    name: 'loginVue',
    components: {
    },
    data() {
        return {
            isLoading: false,   /* login button loading state */

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
        goto_signup() {
            let vm = this;
            vm.$store.state.isSigned = true;
            vm.$router.push('/login/signup');
        },
        /* YBR에서 제공하는 LOGIN */
        onLogin() {
            let vm = this;
            vm.isLoading = !vm.isLoading;
            axios.post(`${vm.$store.state.host}/user/login`, {
                params: {
                    userId: vm.appUser.userId,
                    password: vm.appUser.password,
                    rememberMe: vm.appUser.rememberMe,
                }
            }).then((res) => {
                let data = res.data;
                if(data.success) {  
                    /* socket 등록 */
                    let token = data.token.APP_ACC_TKN;
                    vm.$store.state.setCookie("token", token);
                    const socket = io(`${vm.$store.state.host}`, {
                        // reconnectionDelayMax: 10000,
                        auth: {
                            token,
                        },
                    });
                    vm.$store.commit("setSocket", socket);

                    /* user_dict의 socketId 등록 */
                    socket.emit(`/socket/user/connect`, {
                        UID: data.user.UID,
                    }, (callback) => {
                        
                    });

                    /* admin 계정일 경우 */
                    if(data.user.isAdmin) {
                        vm.$store.commit("setUser", data.user);
                        vm.$store.commit("setUserUID", data.user.UID);
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
                        vm.$store.commit("setUser", data.user);
                        vm.$store.commit("setCouple", data.couple);
                        vm.$store.commit("onLoadScheduleClassificationList", data.user.coupleInfoId);
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
                    if(Object.prototype.hasOwnProperty.call(data, "isDuplicationLogin")) {
                        alert("이미 로그인 중인 계정입니다. 다시 로그인해주세요.");
                    }
                    vm.$c.setError(vm.formError, data.error);
                }
                vm.isLoading = !vm.isLoading;
            }).catch((err) => {
                vm.isLoading = false;
                vm.$q.loading.hide();
                vm.$q.notify({
                    icon: 'error',
                    color: 'negative',
                    message: vm.$store.state.catchErrorMessage,
                });
            });
        },

        onGetTokenWithInfo(code) {
            let vm = this;
            axios.post(`${vm.$store.state.host}/user/kakao/oauth/token`, {
                code: code,
            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    const token = data.token.APP_ACC_TKN;
                    vm.$store.state.setCookie("token", token);
                    const socket = io(`${vm.$store.state.host}`, {
                        auth: { token, },
                    });
                    vm.$store.commit("setSocket", socket);
                    socket.emit(`/socket/user/connect`, {
                        UID: data.user.UID,
                    }, (callback) => {
                        
                    });
                    if(data.isSigned) {
                        vm.$store.state.isSigned = true;
                        vm.$store.commit("setKakaoAccount", data.kakao_account);
                        vm.$router.push("/login/signup");
                        return;
                    }
                    
                    if(data.couple) {
                        vm.$store.commit("setUser", data.user);
                        vm.$store.commit("setCouple", data.couple);
                        vm.$store.commit("setUserUID", data.user.UID);
                        vm.$store.commit("onLoadScheduleClassificationList", data.user.coupleInfoId);
                        vm.$router.push("/home");
                        return;
                    } else {
                        vm.$store.commit("setUser", data.user);
                        vm.$store.commit("setUserUID", data.user.UID);
                        vm.$router.push("/login/waiting");
                        return;
                    }
                } else {
                    if(Object.prototype.hasOwnProperty.call(data, "isDuplicationLogin")) {
                        alert("이미 로그인 중인 계정입니다. 다시 로그인해주세요.");
                    }
                    if(Object.prototype.hasOwnProperty.call(data, "message")) {
                        vm.$q.notify({
                            icon: 'close',
                            color: 'negative',
                            message: "[" + data.code + "] " + data.message,
                        });
                        vm.$router.push("/login");
                    }
                }
            });
        },
        onLoginKakao: function() {
            let vm = this;
            window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=6d428fae7a51015c7356f1c83935cfe0&redirect_uri=http://localhost:3000/user/kakao/login&response_type=code&prompt=login`;
        },
    },
    mounted: function() {
        let vm = this;
        if(Object.prototype.hasOwnProperty.call(vm.$router.currentRoute.value.query, "code")) {
            let code = vm.$router.currentRoute.value.query.code; 
            vm.onGetTokenWithInfo(code);
        }
    },
    created: function() {
    },
}
</script>

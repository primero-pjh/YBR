<template>
    <div id="signupVue" style="display: flex; justify-content: center;">
        <div style="width: 800px;" class="q-pa-md q-mt-md">
            <div class="q-mb-md fkR">
                <div class="text-h4 text-center q-mb-md">YBR</div>
                <q-card class="q-pa-md">
                    <q-card-section v-if="step==1" >
                        <div class="ft24">
                            서비스 약관에 동의해 주세요.
                        </div>
                        <div class="ft14">
                            전체 동의는 필수 및 선택정보에 대한 동의도 포함되어 있으며, 개별적으로도 동의를 선택하실 수 있습니다.
                            선택항목에 대한 동의를 거부하시는 경우에도 서비스는 이용이 가능합니다.
                        </div>
                        <q-separator class="q-my-md"></q-separator>
                        <div>
                            <q-radio label="만 14세 이상입니다." class="ft20"
                                v-model="isAgree"></q-radio>
                        </div>
                        <div class="q-mt-md">
                            <q-btn label="동의" color="primary" style="width: 100%;" 
                                class="ft20" @click="step++"></q-btn>
                        </div>
                    </q-card-section>
                    <q-card-section v-if="step==2 && account">
                        <div style="display: flex;">
                            <div class="text-center">
                                <div class="text-center text-h6">프로필 사진</div>
                                <div class="q-mb-md" >
                                    <q-img v-if="isImageChange==false" :src="account.profile_image_url" 
                                        style="width: 110px; border-radius: 15px; border: 1px solid #eee;"></q-img>
                                    <q-img v-else :src="$store.state.host + account.profile_image_url" 
                                        style="width: 110px; border-radius: 15px; border: 1px solid #eee;"></q-img>
                                    <q-btn label="이미지 변경하기" class="q-mt-md" @click="onChangeImage"></q-btn>
                                    <q-file @update:model-value="changeImage"
                                        v-model="file" style="visibility: hidden;" 
                                        ref="profile_image" />
                                </div>
                            </div>
                            <div class="q-ml-md" style="width: 100%;">
                                <q-input outlined label="닉네임 *" v-model="account.nickname" 
                                    
                                    :error="formError.nickname?true:false || account.nickname.length == 0" :error-message="formError.nickname"
                                    ></q-input>
                                <q-input outlined label="이메일" disable
                                    v-model="account.email"
                                    :error="formError.email?true:false" :error-message="formError.email">
                                </q-input>
                                <q-input type="textarea" outlined :label="'자기소개 (' + account.memo.length + '/500)'"
                                    v-model="account.memo"
                                    :error="formError.memo?true:false" :error-message="formError.memo"
                                    >
                                </q-input>
                            </div>
                        </div>
                        <q-separator class="q-my-md"></q-separator>
                        <div>
                            <q-btn label="가입" color="primary" style="width: 100%;" class="ft20" 
                                @click="onSignup"></q-btn>
                        </div>
                    </q-card-section>
                </q-card>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'signupVue',
    components: {
    },
    data() {
        return {
            step: 2,
            isAgree: 1,
            account: null,
            isImageChange: 0,

            file: null,
            filename: '',

            formError: {
                email: '',
                memo: '',
                nickname: '',
                profile_image_url: '',
            },
        }
    },
    methods: {
        changeImage(file) {
            let vm = this;
            vm.$q.loading.show();
            vm.$nextTick(() => {
                let form_data = new FormData();
                form_data.append('file', vm.file);
                axios.post(`${vm.$store.state.host}/user/upload/temp/image`, form_data).then((res) => {
                    let data = res.data;
                    if(data.success) {
                        vm.isImageChange = 1;
                        vm.filename = data.filename;
                        vm.account.profile_image_url = data.path;
                    }
                });
                vm.$q.loading.hide();
            });
        },
        onChangeImage() {
            let vm = this;
            vm.$refs.profile_image.pickFiles();
        },
        onSignup() {
            let vm = this;
            axios.post(`${vm.$store.state.host}/user/kakao/signup`, {
                filename: vm.filename,
                account: vm.account,
                isImageChange: vm.isImageChange,
            }).then((res) => {
                let data = res.data;
                console.log("data:", data);
                if(data.success) {
                    vm.$q.notify({
                        color: 'positive',
                        icon: 'check',
                        message: data.message,
                    });
                    vm.$router.push("/login");
                } else {
                    if(Object.prototype.hasOwnProperty.call(data, "message")) {
                        vm.$q.notify({
                            color: 'negative',
                            icon: 'close',
                            message: data.message,
                        });
                    }
                    if(Object.prototype.hasOwnProperty.call(data, "error")) {
                        vm.$store.state.setError(vm.formError, data.error);
                    }
                }
            });
        }
    },
    mounted: function() {
        let vm = this;
        if(!vm.$store.state.isSigned) {
            vm.$router.push("/login");
            return;
        }
        vm.account = vm.$store.getters.getKakaoAccount;
        console.log("account:", vm.account);
    },
}
</script>
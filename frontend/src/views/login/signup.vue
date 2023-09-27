<template>
    <div id="signupVue" style="display: flex; justify-content: center;">
        <div style="width: 800px;" class="q-pa-md q-mt-md">
            <div class="q-mb-md ">
                <div class="text-h4 text-center q-mb-md fkB">YBR</div>
                <q-card class="q-pa-md">
                    <q-card-section v-if="step==1" >
                        <div class="ft24 fkB">
                            서비스 약관에 동의해 주세요.
                        </div>
                        <div class="ft16 fkR">
                            전체 동의는 필수 및 선택정보에 대한 동의도 포함되어 있으며, 개별적으로도 동의를 선택하실 수 있습니다.
                            선택항목에 대한 동의를 거부하시는 경우에도 서비스는 이용이 가능합니다.
                        </div>
                        <q-separator class="q-my-md"></q-separator>
                        <div class="q-mb-md fkB">
                            <q-checkbox label="만 14세 이상입니다." class="ft20" v-model="isAgree[0]" />
                        </div>
                        <div class="q-mb-md fkB">
                            <q-checkbox label="[필수] YBR 계정 약관" class="ft20" v-model="isAgree[1]" />
                        </div>
                        <div class="q-mb-md fkB">
                            <q-checkbox label="[필수] YBR 통합서비스 약관" class="ft20" v-model="isAgree[2]" />
                        </div>
                        <div class="q-mb-md fkB">
                            <q-checkbox label="[필수] 개인정보 수집 및 이용 동의" class="ft20" v-model="isAgree[3]" />
                        </div>
                        <div class="q-mt-md fkB">
                            <q-btn label="동의" color="primary" style="width: 100%;" :disabled="!onCheckAgree()"
                                class="ft20" @click="step++"></q-btn>
                        </div>
                    </q-card-section>
                    <q-card-section v-if="step==2 && account">
                        <div style="display: flex;">
                            <div class="text-center">
                                <div class="text-center text-h6 fkR">프로필 사진</div>
                                <div class="q-mb-md" >
                                    <q-img v-if="!account.image" fit="cover"
                                        :src="$store.state.host + '/images/default_avatar_image.jpg'"
                                        style="width: 110px; height: 110px; border-radius: 15px; border: 1px solid #eee;" /> 
                                    <q-img v-else :src="account.image" 
                                        style="width: 110px; height: 110px; border-radius: 15px; border: 1px solid #eee;" />
                                    <q-btn label="이미지 변경하기" class="q-mt-md" color="positive" outline
                                        @click="onChangeImage" />
                                    <q-file @update:model-value="changeImage"
                                        v-model="file" style="visibility: hidden;" ref="profile_image" />
                                </div>
                            </div>
                            <div class="q-ml-md" style="width: 100%;">
                                <q-input outlined label="아이디 *" v-model="account.userId" 
                                    :error="formError.userId?true:false" 
                                    :error-message="formError.userId" />
                                    <q-input outlined label="패스워드 *" v-model="account.password" type="password"
                                    :error="formError.password?true:false"  :error-message="formError.password" />
                                <q-input outlined label="닉네임 *" v-model="account.userName" 
                                    :error="formError.userName?true:false"  :error-message="formError.userName" />
                                <q-input outlined label="이메일"
                                    v-model="account.email" :error="formError.email?true:false" :error-message="formError.email" />
                                <q-input outlined label="HP" v-model="account.phoneNumber" 
                                    mask="###-####-####"
                                    :error="formError.phoneNumber?true:false" :error-message="formError.phoneNumber" />
                                <q-input type="textarea" outlined :label="'자기소개 (' + account.memo.length + '/500)'"
                                    v-model="account.memo"
                                    :error="formError.memo?true:false" :error-message="formError.memo" />
                            </div>
                        </div>
                        <q-separator class="q-my-md"></q-separator>
                        <div>
                            <q-btn label="가입" color="primary" outline style="width: 100%;" class="ft20" 
                                @click="onSignup" />
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
            isAgree: [false, false, false, false],
            account: {
                userId: '',
                userName: '',
                password: '',
                email: '',
                phoneNumber: '',  
                image: '',
                memo: '',
            },
            isImageChange: 0,

            file: null,
            filename: '',

            formError: {
                userId: '',
                userName: '',
                password: '',
                email: '',
                phoneNumber: '',  
                image: '',
                memo: '',
            },
        }
    },
    methods: {
        onCheckAgree() {
            let vm = this;
            return vm.isAgree[0] == true && vm.isAgree[1] == true && vm.isAgree[2] == true && vm.isAgree[3] == true;
        },
        onChangeImage() {
            let vm = this;
            vm.$refs.profile_image.pickFiles();
        },
        changeImage(file) {
            let vm = this;
            vm.file = file;
            let blob = new Blob([file], { type: file.type });
            const url = window.URL.createObjectURL(blob);
            vm.isImageChange = true;
            vm.account.image = url;
        },
        onSignup() {
            let vm = this;
            vm.$q.loading.show();
            axios.post(`${vm.$store.state.host}/user/signup`, {
                filename: vm.filename,
                account: vm.account,
                isImageChange: vm.isImageChange,
            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    vm.$q.notify({
                        color: 'positive',
                        icon: 'check',
                        message: data.message,
                    });
                    next(data.UID);
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
                    vm.$q.loading.hide();
                }
            }).catch((err) => {
                vm.$q.notify({
                    color: 'negative',
                    icon: 'close',
                    message: vm.$store.state.catchErrorMessage,
                });
                vm.$q.loading.hide();
            });

            function next(UID) {
                if(vm.file) {
                    let formData = new FormData();
                    formData.append("file", vm.file);
                    axios({
                        method: "POST",
                        url: `${vm.$store.state.host}/user/${UID}/upload/profile_image`,
                        data: formData,
                    }).then((res) => {
                        let data = res.data;
                        if(data.success) {
                            let filename = data.filename;
                            console.log("data:", data);
                            window.location.reload();
                        }
                        vm.$q.loading.hide();
                    }).catch((err) => {
                        vm.$q.notify({
                            icon: 'error',
                            color: 'negative',
                            message: vm.$store.state.catchErrorMessage
                        });
                        vm.$q.loading.hide();
                    });
                } else {
                    window.location.reload();
                }
            }
        }
    },
    mounted: function() {
        let vm = this;
        if(!vm.$store.state.isSigned) {
            vm.$router.push("/login");
            return;
        }
    },
}
</script>
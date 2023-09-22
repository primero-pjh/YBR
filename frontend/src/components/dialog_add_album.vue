<template>
    <q-dialog v-model="isOpen" :position="position" full-height persistent>
        <q-card class="column full-height" style="min-width: 600px; height: calc(100% - 72px);" >
            <q-card-section>
                <div style="display: flex; justify-content: space-between;">
                    <q-btn dense icon="close" flat v-close-popup />
                    <div class="text-h6 text-center">앨범 생성</div>
                    <div></div>
                </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="col">
                <div style="width: 100%; height: 100%;">
                    <q-scroll-area style="width: 100%; height: 100%;">
                        <div>
                            <q-field stack-label :error="formError.coverFile?true:false" :error-message="formError.coverFile">
                                <template v-slot:hint>
                                    <div class="fkR text-negative">
                                        커버 이미지를 등록하지 않으면 앨범에 속한 첫 번째 이미지가 커버 이미지로 등록됩니다.
                                    </div>
                                </template>
                                <template v-slot:control>
                                    <q-uploader filled
                                        color="primary" :multiple="false" style="width: 100%;"
                                        @added="onAddCoverImage" accept="image/*"
                                        @removed="onRemoveBackgroundImage" @rejected="onReject">
                                        <template v-slot:header="scope">
                                            <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                                                <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all"
                                                    @click="scope.removeUploadedFiles" 
                                                    round dense flat >
                                                    <q-tooltip>Remove Uploaded Files</q-tooltip>
                                                </q-btn>
                                                <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                                                <div class="col">
                                                    <div class="q-uploader__title fkR ft16">커버 이미지를 업로드해주세요.</div>
                                                    <div class="q-uploader__subtitle">({{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }})</div>
                                                </div>
                                                <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
                                                    <q-uploader-add-trigger />
                                                    <q-tooltip>파일 선택</q-tooltip>
                                                </q-btn>
                                            </div>
                                        </template>
                                    </q-uploader>
                                </template>
                            </q-field>
                        </div>
                        <div >
                            <q-input :error="formError.title?true:false"  :error-message="formError.title"
                                v-model="form.title"
                                dense label="앨범명*(50자 이내로 작성해주세요.)" filled label-color="red" >
                                <template v-slot:hint>
                                    <div :style="{color: form.title.length > 50 ? 'red':'gray'}">{{ '(' + form.title.length + '/50)' }}</div>
                                </template>
                            </q-input>
                        </div>
                        <div >
                            <q-input  :error="formError.body?true:false" :error-message="formError.body"
                                type="textarea" v-model="form.body" 
                                dense label="설명(500자 이내로 작성해주세요.)" filled >
                                <template v-slot:hint>
                                    <div :style="{color: form.body.length > 500 ? 'red':'gray'}">{{ '(' + form.body.length + '/500)' }}</div>
                                </template>
                            </q-input>
                        </div>
                        <div>
                            <q-field stack-label :error="formError.imageList?true:false" :error-message="formError.imageList">
                                <template v-slot:control>
                                    <q-uploader multiple accept="image/*" style="width: 100%;"
                                        @added="onAddImages" 
                                        @removed="onRemoveImage" @rejected="onReject">
                                        <template v-slot:header="scope">
                                            <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                                                <!-- <q-btn v-if="form.imageList.length > 0" icon="close" 
                                                    @click="onRemoveImage(scope.files)" round dense flat >
                                                    <q-tooltip class="fkR ft14">모든 이미지 삭제</q-tooltip>
                                                </q-btn> -->
                                                <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                                                <div class="col">
                                                    <div class="q-uploader__title fkR ft16">앨범에 넣을 이미지를 업로드해주세요.(최대 {{maxImageCount}}개)</div>
                                                    <div class="q-uploader__subtitle">({{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }})</div>
                                                </div>
                                                <q-btn type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
                                                    <q-uploader-add-trigger />
                                                    <q-tooltip class="fkR">파일 선택</q-tooltip>
                                                </q-btn>
                                            </div>
                                        </template>
                                        <template v-slot:list="scope">
                                            <q-list separator>
                                                <q-item v-for="file in scope.files" :key="file.__key">
                                                    <q-item-section>
                                                        <q-item-label class="full-width ellipsis">
                                                            {{ file.name }}
                                                        </q-item-label>
                                                        <q-item-label caption>
                                                            Status: {{ file.__status }}
                                                        </q-item-label>
                                                        <q-item-label caption>
                                                            {{ file.__sizeLabel }} / {{ file.__progressLabel }}
                                                        </q-item-label>
                                                    </q-item-section>
                                                    <q-item-section v-if="file.__img"
                                                        thumbnail class="gt-xs" >
                                                        <img :src="file.__img.src">
                                                    </q-item-section>
                                                    <q-item-section top side>
                                                        <q-btn class="gt-xs" size="12px" flat dense round
                                                            icon="delete" @click="scope.removeFile(file)" />
                                                    </q-item-section>
                                                </q-item>
                                            </q-list>
                                        </template>
                                        </q-uploader>
                                </template>
                            </q-field>
                        </div>
                    </q-scroll-area>
                </div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-section align="right">
                <q-btn outline label="닫기" class="q-mr-sm" v-close-popup />
                <q-btn outline label="저장" @click="onSave" color="positive" />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import axios from 'axios';

export default {
    name: 'dialog_add_album',
    data() {
        return {
            position: 'right',
            isOpen: false,
            callback: null,

            maxImageCount: 10,

            form: {
                coverFile: null,
                title: '',
                body: '',
                imageList: [],
            },
            formError: {
                coverFile: '',
                title: '',
                body: '',
                imageList: '',
            }
        }
    },
    methods: {
        clearForm() {
            this.form.coverFile = null;
            this.form.title = '';
            this.form.body = '';
            this.form.imageList = new Array();
        },
        onReject(entry) {
            let vm = this;
            entry.map((x) => {
                if(x.failedPropValidation === 'accept') {
                    vm.$q.notify({
                        icon: 'close',
                        color: 'negative',
                        message: '이미지 파일만 가능합니다.',
                    });
                }
            });
        },
        onAddCoverImage(info) {
            let vm = this;
            let image = info[0];
            vm.form.coverFile = image;
            // let blob = new Blob([image], { type: image.type });
            // const url = window.URL.createObjectURL(blob);
        },
        onRemoveBackgroundImage() {
            let vm = this;
            vm.form_data.file = null;
            document.getElementById('coupleBackgroundBox').style.backgroundImage = ``;
        },

        onAddImages(file_list) {
            let vm = this;
            if(file_list.length > vm.maxImageCount) {
                vm.$q.notify({
                    icon: 'error',
                    color: 'negative',
                    message: `이미지는 최대 ${vm.maxImageCount}개까지 업로드가 가능합니다.`,
                });
                return;
            }
            file_list.map((x) => {
                vm.form.imageList.push(x);
            });
        },
        onRemoveImage(files) {
            let vm = this;
            files.map((file) => {
                let idx = vm.form.imageList.findIndex(x=>x.__key==file.__key);
                vm.form.imageList.splice(idx, 1);
            });
        },

        open(callback) {
            let vm = this;
            vm.clearForm();
            vm.$store.state.clearError(vm.formError);
            vm.isOpen = true;
            if(callback) { vm.callback = callback; }
        },
        onSave() {
            let vm = this;
            let coupleInfoId = vm.$store.state.user.coupleInfoId;
            let form_data = new FormData();

            if(vm.form.coverFile) {
                form_data.append("files", vm.form.coverFile);
            }
            vm.form.imageList.map((x) => {
                form_data.append("files", x);
            });
            let count = vm.form.imageList.length + (vm.form.coverFile ? 1 : 0);
            axios({
                method: "POST",
                url: `/api/couple/${coupleInfoId}/albums`,
                data: {
                    title: vm.form.title,
                    body: vm.form.body,
                    imageCount: count
                },
            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    axios({
                        method: "POST",
                        url: `/api/couple/${coupleInfoId}/albums/${data.albumId}/images`,
                        data: form_data,
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }).then((res2) => {
                        let data2 = res2.data;
                        vm.$q.notify({
                            icon: 'check',
                            color: 'positive',
                            message: data2.message,
                        });
                        vm.isOpen = false;
                        if(vm.callback) { vm.callback(); }
                        vm.$q.loading.hide();
                    }).catch((err) => {
                        vm.$q.loading.hide();
                        vm.$q.notify({
                            icon: 'close',
                            color: 'negative',
                            message: vm.$store.state.catchErrorMessage,
                        });
                    });
                } else {
                    if(Object.prototype.hasOwnProperty.call(data, "error") == true) {
                        vm.$store.state.setError(vm.formError, data.error);
                    }
                    vm.$q.loading.hide();
                }
            }).catch((err) => {
                vm.$q.loading.hide();
                vm.$q.notify({
                    icon: 'close',
                    color: 'negative',
                    message: vm.$store.state.catchErrorMessage,
                });
            })

            
        },
    },
    mounted() {
        let vm = this;
    }
}
</script>
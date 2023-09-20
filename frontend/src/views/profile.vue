<template>
    <div id="profileVue" style="height: 100%;">
        <div style="display: flex; justify-content: center;" class="w100p q-pa-md">
            <q-layout
                view="hhh LpR lff" container
                style="height: 775px" class="shadow-2 rounded-borders"
                :class="$q.dark.isActive ? 'bg-grey-9' : 'bg-grey-3'">
                <q-header reveal :class="$q.dark.isActive ? 'bg-secondary' : 'bg-black'">
                    <q-toolbar>
                        <q-btn flat @click="drawerLeft = !drawerLeft" round dense icon="group">
                            <q-tooltip class="fkR ft16">접속자</q-tooltip>
                        </q-btn>
                        <q-toolbar-title class="fkB">편집기</q-toolbar-title>
                        <q-btn flat @click="drawerRight = !drawerRight" round dense icon="construction">
                            <q-tooltip class="fkR ft16">도구</q-tooltip>
                        </q-btn>
                        <q-btn flat @click="onSave" round dense icon="save">
                            <q-tooltip class="fkR ft16">저장하기</q-tooltip>
                        </q-btn>
                    </q-toolbar>
                </q-header>

                <q-drawer v-model="drawerLeft" :width="200" :breakpoint="700" bordered >
                    <q-scroll-area class="fit">
                        <div class="q-pa-md">
                            <template v-for="user, idx in user_list" :key="idx">
                                <q-list>
                                    <q-item>{{ user.userName }}</q-item>
                                </q-list>
                            </template>
                        </div>
                    </q-scroll-area>
                </q-drawer>

                <q-drawer side="right" v-model="drawerRight"
                    bordered :width="400" :breakpoint="500" >
                    <q-scroll-area class="fit">
                        <div class="q-pa-md">
                            <q-list padding bordered class="rounded-borders">
                                <q-expansion-item class="fkR ft18" label="배경 이미지 삽입" icon="image">
                                    <q-card>
                                        <q-card-section style="display: flex; justify-content: center;">
                                            <q-uploader
                                                label="배경 이미지를 선택해주세요." color="primary" :multiple="false"
                                                @added="onAddImage" accept="image/*"
                                                @removed="onRemoveImage" @rejected="onReject">
                                                <template v-slot:header="scope">
                                                    <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                                                        <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all"
                                                            @click="scope.removeUploadedFiles" 
                                                            round dense flat >
                                                            <q-tooltip>Remove Uploaded Files</q-tooltip>
                                                        </q-btn>
                                                        <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                                                        <div class="col">
                                                            <div class="q-uploader__title fkR ft16">배경 이미지를 선택해주세요.</div>
                                                            <div class="q-uploader__subtitle">({{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }})</div>
                                                        </div>
                                                        <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
                                                            <q-uploader-add-trigger />
                                                            <q-tooltip>파일 선택</q-tooltip>
                                                        </q-btn>
                                                    </div>
                                                </template>
                                            </q-uploader>
                                        </q-card-section>
                                    </q-card>
                                </q-expansion-item>
                                <q-item clickable bordered v-ripple @click="onAddText">
                                    <q-item-section avatar>
                                        <q-icon rounded color="purple" text-color="white" name="description" flat dense />
                                    </q-item-section>
                                    <q-item-section class="fkR ft18">텍스트</q-item-section>
                                </q-item>
                                <q-expansion-item
                                    icon="drafts"
                                    label="Drafts"
                                    header-class="text-orange"
                                >
                                    <q-card class="bg-grey-9">
                                    <q-card-section>
                                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quidem, eius reprehenderit eos corrupti
                                        commodi magni quaerat ex numquam, dolorum officiis modi facere maiores architecto suscipit iste
                                        eveniet doloribus ullam aliquid.
                                    </q-card-section>
                                    </q-card>
                                </q-expansion-item>
                                </q-list>
                        </div>
                    </q-scroll-area>
                </q-drawer>

                <q-page-container>
                    <q-page class="q-pa-md" style="display: flex; flex-direction: column; justify-content: center; align-items: center;">
                        <span class="fkB ft20 q-mb-md">480 * 640</span>
                        <div id="ybrZone" style="position: relative;">

                        </div>
                        
                    </q-page>
                </q-page-container>
            </q-layout>
            
        </div>
    </div>
</template>

<style>
#ybrText {
    font-family: 'KakaoRegular';
    border: 1px solid black;
    cursor: pointer;
    border-style: dashed;
}
</style>

<script>
export default {
    name: 'profileVue',
    components: {
    },
    data() {
        return {
            drawerRight: true,
            drawerLeft: false,

            form_data: {
                file: null,
            },
            user_list: [],
        }
    },
    methods: {    
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
        onAddImage(info) {
            let vm = this;
            let image = info[0];
            vm.form_data.file = image;
            let blob = new Blob([image], { type: image.type });
            const url = window.URL.createObjectURL(blob);
            document.getElementById('coupleBackgroundBox').style.backgroundImage = `url(${url})`;
            document.getElementById('coupleBackgroundBox').style.backgroundRepeat = 'no-repeat';
            document.getElementById('coupleBackgroundBox').style.backgroundSize = '100%';
        },
        onRemoveImage() {
            let vm = this;
            vm.form_data.file = null;
            document.getElementById('coupleBackgroundBox').style.backgroundImage = ``;
        },

        onCreateText() {
            let vm = this;
            let span = document.createElement("span");
            span.id = "ybrText";
            span.innerText = "여기에 값을 입력하세요.";
            span.draggable = true;
            span.addEventListener('dragstart', (e) => {
                console.log('start');
                console.log(e);
            });
            span.addEventListener('dragover', (e) => {
                console.log(e);
            });
            span.addEventListener('dragleave', (e) => {
                console.log('dragleave');
                console.log(e);
            });
            // span.addEventListener('drop', (e) => {
            //     console.log('drop');
            //     console.log(e);
            // });
            document.getElementById('coupleBackgroundBox').appendChild(span);
        },
        onAddText() {
            let vm = this;
            vm.onCreateText();
        },

        onSave() {
            let vm = this;
            let text = (document.getElementById('coupleBackgroundBox').outerHTML);
            console.log("text:", text);
        }
    },
    mounted: function() {
        let vm = this;
        if(!vm.$store.state.couple.backgroundImage) {
            var div = document.createElement("div");
            div.id = "coupleBackgroundBox";
            div.className = "shadow-2";
            div.style.width = "480px";
            div.style.height = "640px";
            div.style.maxWidth = "480px";
            div.style.maxHeight = "640px";
            div.style.position = "relative";
            document.getElementById('ybrZone').appendChild(div);
        }
    },
}
</script>
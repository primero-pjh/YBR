<style>
    #ybrZone #ybrText {
        font-family: 'KakaoRegular';
        border: 1px solid #31CCEC;
        color: black;
        border-style: dashed;
    }
    #ybrZone .textActive {
        border: 5px solid red !important;
        border-style: dashed !important;
        cursor: all-scroll !important;
    }
    #ybrZone #ybrText:hover {
        border-width: 5px;
        cursor: pointer;
    }
    #ybrZone #ybrText:active {
        background-color: rgba(168, 218, 220, 1.00);
    }

    #ybrZone #ybrImage {
        border: 3px solid gray;
        
    }
    #ybrZone #ybrImage:hover {
        border-width: 5px;
        cursor: pointer;
    }
    #ybrZone #ybrImage:active {
        background-color: rgba(168, 218, 220, 1.00);
    }
    #ybrZone .ybrImageActive {
        border: 5px solid red !important;
        border-style: dashed !important;
        cursor: all-scroll !important;
        border-radius: 25px !important;
    }
</style>

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
                    bordered :width="640" :breakpoint="640" >
                    <q-scroll-area class="fit">
                        <div class="q-pa-md">
                            <q-splitter v-model="splitterModel"
                                    style="height: 100%" class="shadow-2">
                                <template v-slot:before>
                                    <div >
                                        <q-tabs v-model="tab" vertical class="text-gray fkR"
                                            @update:model-value="onClickTab">
                                            <q-tab name="backgroundImage" icon="image" label="배경이미지" />
                                            <q-tab name="text" icon="text_fields" label="텍스트" />
                                            <q-tab name="couple" icon="people" label="커플" />
                                            <!-- <q-tab name="image" icon="image" label="이미지" /> -->
                                            <q-tab name="preview" icon="preview" label="미리보기" />
                                        </q-tabs>
                                    </div>
                                </template>

                                <template v-slot:after>
                                    <div>
                                        <q-tab-panels keep-alive
                                            v-model="tab" animated swipeable vertical
                                            transition-prev="jump-up" transition-next="jump-up" >
                                            <q-tab-panel name="backgroundImage">
                                                <q-uploader
                                                    color="primary" :multiple="false"
                                                    @added="onAddBackgroundImage" accept="image/*" style="width: 100%;"
                                                    @removed="onRemoveBackgroundImage" @rejected="onReject"
                                                    ref="refBackgroundImage">
                                                    <template v-slot:header="scope">
                                                        <div class="row no-wrap items-center q-pa-sm q-gutter-xs">
                                                            <q-btn v-if="scope.uploadedFiles.length > 0" icon="done_all"
                                                                @click="scope.removeUploadedFiles" 
                                                                round dense flat >
                                                                <q-tooltip>Remove Uploaded Files</q-tooltip>
                                                            </q-btn>
                                                            <q-spinner v-if="scope.isUploading" class="q-uploader__spinner" />
                                                            <div class="col">
                                                                <div class="q-uploader__title fkR ft16">배경 이미지를 업로드해주세요.</div>
                                                                <div class="q-uploader__subtitle">({{ scope.uploadSizeLabel }} / {{ scope.uploadProgressLabel }})</div>
                                                            </div>
                                                            <q-btn v-if="scope.canAddFiles" type="a" icon="add_box" @click="scope.pickFiles" round dense flat>
                                                                <q-uploader-add-trigger />
                                                                <q-tooltip>파일 선택</q-tooltip>
                                                            </q-btn>
                                                        </div>
                                                    </template>
                                                </q-uploader>
                                            </q-tab-panel>

                                            <q-tab-panel name="text">
                                                <q-btn class="w100p" outline @click="onCreateText" color="positive">
                                                    <div class="text-center fkR ft18">텍스트 추가</div>
                                                </q-btn>
                                                <div class="q-mt-md">
                                                    <q-card v-if="selectText">
                                                        <q-card-section class="fkR ft18">
                                                            <div>
                                                                <q-input label="라벨" v-model="selectTextObj.label" outlined dense
                                                                    @blur="blurTextLabel" @keyup.enter="enterTextLabel" />
                                                            </div>
                                                            <div style="display: flex;" class="q-mt-sm">
                                                                <q-input dense label="x축" v-model.number="selectTextObj.x" class="q-mr-sm"
                                                                    type="number" outlined @update:model-value="moveItem('text')" />
                                                                <q-input dense label="y축" v-model.number="selectTextObj.y"
                                                                    type="number" outlined @update:model-value="moveItem('text')" />
                                                            </div>
                                                            <div style="display: flex;" class="q-mt-sm">
                                                                <q-input dense label="폰트 크기" v-model.number="selectTextObj.fontSize"
                                                                    min="14" 
                                                                    class="w100p" type="number" outlined 
                                                                    @update:model-value="updateTextFontSize" />
                                                            </div>
                                                            <div class="q-mt-sm">
                                                                <q-input label="텍스트 색상" outlined dense @update:model-value="updateTextColor" 
                                                                    v-model="selectTextObj.color" class="my-input" >
                                                                    <template v-slot:append>
                                                                        <q-icon name="colorize" class="cursor-pointer">
                                                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                                                <q-color v-model="selectTextObj.color" 
                                                                                @update:model-value="updateTextColor" />
                                                                            </q-popup-proxy>
                                                                        </q-icon>
                                                                    </template>
                                                                </q-input>
                                                            </div>
                                                            <q-separator class="q-my-md"></q-separator>
                                                            <div class="q-mt-sm" style="display: flex; justify-content: end;">
                                                                <q-btn color="negative" outline @click="removeItem">삭제</q-btn>
                                                            </div>
                                                        </q-card-section>
                                                    </q-card>    
                                                    <q-card v-else>
                                                        <div class="fkR ft18 text-center q-pa-md">
                                                            선택된 텍스트가 없습니다.
                                                        </div>
                                                    </q-card>
                                                </div>
                                            </q-tab-panel>

                                            <q-tab-panel name="image">
                                                <div class="text-h4 q-mb-md">임히지</div>
                                            </q-tab-panel>

                                            <q-tab-panel name="couple">
                                                <div class="q-mt-md">
                                                    <q-card v-if="selectCoupleImage">
                                                        <q-card-section class="fkR ft18">
                                                            <div style="display: flex;" class="q-mt-sm">
                                                                <q-input dense label="x축" v-model.number="selectCoupleImageObj.x" class="q-mr-sm"
                                                                    type="number" outlined @update:model-value="moveItem('image')" />
                                                                <q-input dense label="y축" v-model.number="selectCoupleImageObj.y"
                                                                    type="number" outlined @update:model-value="moveItem('image')" />
                                                            </div>
                                                            <div style="display: flex;" class="q-mt-sm">
                                                                <q-checkbox dense label="테두리" v-model="selectCoupleImageObj.isBorder"
                                                                    @update:model-value="updateCoupleImageBorder" />
                                                            </div>
                                                            <div v-if="selectCoupleImageObj.isBorder">
                                                                <div style="display: flex;" class="q-mt-sm">
                                                                    <q-input dense label="테두리 사이즈" 
                                                                        v-model.number="selectCoupleImageObj.borderWidth"
                                                                        min="1" class="w100p" type="number" outlined 
                                                                        @update:model-value="updateCoupleImageBorderWidth" />
                                                                </div>
                                                                <div class="q-mt-sm">
                                                                    <q-input label="테두리 색상" outlined dense 
                                                                        @update:model-value="updateCoupleImageBorderColor" 
                                                                        v-model="selectCoupleImageObj.borderColor" class="my-input" >
                                                                        <template v-slot:append>
                                                                            <q-icon name="colorize" class="cursor-pointer">
                                                                                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                                                    <q-color v-model="selectCoupleImageObj.borderColor" 
                                                                                    @update:model-value="updateCoupleImageBorderColor" />
                                                                                </q-popup-proxy>
                                                                            </q-icon>
                                                                        </template>
                                                                    </q-input>
                                                                </div>
                                                                <div style="display: flex;" class="q-mt-sm">
                                                                    <q-input dense label="테두리 Radius" 
                                                                        v-model.number="selectCoupleImageObj.borderRadius"
                                                                        min="1" class="w100p" type="number" outlined 
                                                                        @update:model-value="updateCoupleImageBorderRadius" />
                                                                </div>
                                                            </div>
                                                            <q-separator class="q-my-md"></q-separator>
                                                            <div class="q-mt-sm" style="display: flex; justify-content: end;">
                                                                <q-btn color="negative" outline @click="removeItem">삭제</q-btn>
                                                            </div>
                                                        </q-card-section>
                                                    </q-card>    
                                                    <q-card v-else>
                                                        <div class="fkR ft18 text-center q-pa-md">
                                                            선택된 커플 이미지가 없습니다.
                                                        </div>
                                                    </q-card>
                                                </div>
                                            </q-tab-panel>

                                            <q-tab-panel name="preview">
                                                <div id="ybrPreview"></div>
                                            </q-tab-panel>
                                        </q-tab-panels>
                                    </div>
                                </template>

                            </q-splitter>
                        </div>
                        <div class="q-pa-md">
                            <div>currentX: {{ currentX }}</div>
                            <div>currentY: {{ currentY }}</div>
                            <div>initialX: {{ initialX }}</div>
                            <div>initialY: {{ initialY }}</div>
                            <div>xOffset: {{ xOffset }}</div>
                            <div>yOffset: {{ yOffset }}</div>
                        </div>
                    </q-scroll-area>
                </q-drawer>

                <q-page-container>
                    <q-page class="q-pa-md text-center" style="display: flex; flex-direction: column; align-items: center;">
                        <span class="fkB ft20">480 * 640</span>
                        <div id="ybrZone" style="position: relative; ">

                        </div>
                    </q-page>
                </q-page-container>
            </q-layout>
        </div>
    </div>
</template>



<script>
import axios from 'axios';

export default {
    name: 'profileVue',
    computed: {
    },
    components: {
    },
    data() {
        return {
            tab: 'backgroundImage',
            splitterModel: 15,

            drawerRight: true,
            drawerLeft: false,

            form_data: {
                backgroundImageFile: null,
            },
            user_list: [],

            selectText: null,
            selectTextObj: {
                label: '텍스트',
                x: 0,
                y: 0,
                fontSize: 0,
                color: '#000000',
            },
            dragText: null,
            text_list: [],

            selectCoupleImage: null,
            selectCoupleImageObj: {
                x: 0,
                y: 0,
                borderWidth: 0,
                borderRadius: 0,
                borderColor: '#000000',
                isBorder: false,
            },
            dragImage: null,

            currentX: 0,
            currentY: 0,
            initialX: 0,
            initialY: 0,
            xOffset: 0,
            yOffset: 0,
        }
    },
    methods: {
        /* tab */
        onClickTab(args) {
            let vm = this;
            vm.$nextTick(() => {
                if(args == 'preview') {
                    const ybrPreview = document.getElementById('ybrPreview');
                    const coupleBackgroundBox = document.getElementById("ybrZone").innerHTML;
                    ybrPreview.innerHTML = coupleBackgroundBox.trim();
                }
            });
        },
        /* text */
        enterTextLabel() {
            let vm = this;
            vm.$nextTick(() => {
                vm.selectText.innerText = vm.selectTextObj.label;
            });
        },
        blurTextLabel(label) {
            let vm = this;
            vm.selectText.innerText = vm.selectTextObj.label;
        },
        updateTextFontSize(args) {
            let vm = this;
            vm.selectText.style.fontSize = args + 'px';
        },
        updateTextColor(args) {
            let vm = this;
            vm.selectText.style.color = args;
        },
        onCreateText() {
            let vm = this;
            vm.tab = 'text';
            let span = document.createElement("div");
            let input = document.createElement("input");
            span.appendChild(input);
            span.id = "ybrText";
            span.innerText = "텍스트";
            if(vm.selectText) {
                vm.selectText.classList = "";
            }
            span.classList.add("textActive");
            span.style.position = 'absolute';
            span.style.fontSize = '18px';
            span.style.color = '#000000';
            
            span.addEventListener("click", (e) => {
                vm.ybrTextEventListener(e);
            });
            vm.selectText = span;
            vm.selectTextObj = {
                label: '텍스트',
                x: 0,
                y: 0,
                fontSize: 18,
                color: '#000000',
            };
            vm.xOffset = 0;
            vm.yOffset = 0;
            vm.text_list.push(span);

            document.getElementById('coupleBackgroundBox').appendChild(span);
        },
        setSelectText(element) {
            let vm = this;
            let matrix = vm.getElementMatrix(element);
            vm.tab = 'text';
            vm.selectTextObj = {
                label: element.innerText,
                x: matrix.x,
                y: matrix.y,
                fontSize: parseInt(element.style.fontSize),
                color: element.style.color,
            };
        },

        /* couple-image */
        updateCoupleImageBorder(args) {
            let vm = this;
            vm.$nextTick(() => {
                if(args) {
                    vm.selectCoupleImage.style.borderStyle = 'solid';
                } else {
                    vm.selectCoupleImage.style.borderStyle = 'none';
                }
            });
        },
        updateCoupleImageBorderColor(args) {
            let vm = this;
            vm.$nextTick(() => {
                vm.selectCoupleImage.style.borderColor = args;
            });
        },
        updateCoupleImageBorderWidth(args) {
            let vm = this;
            vm.$nextTick(() => {
                vm.selectCoupleImage.style.borderWidth = args + 'px';
            });
        },
        updateCoupleImageBorderRadius(args) {
            let vm = this;
            vm.$nextTick(() => {
                vm.selectCoupleImage.style.borderRadius = args + 'px';
            });
        },
        setSelectCoupleImage(element) {
            let vm = this;
            let matrix = vm.getElementMatrix(element);
            vm.tab = 'couple';
            vm.selectCoupleImageObj = {
                x: matrix.x,
                y: matrix.y,
                isBorder: element.style.borderStyle?true:false,
                borderWidth: element.style.borderWidth?parseInt(element.style.borderWidth):1,
                borderColor: element.style.borderColor?element.style.borderColor:'#000000',
                borderRadius: element.style.borderRadius?parseInt(element.style.borderRadius):1,
            };
        },

        /* item */
        removeItem() {
            let vm = this;
            document.getElementById('coupleBackgroundBox').removeChild(vm.selectText);
            vm.$nextTick(() => {
                vm.dragText = null;
                vm.selectText = null;
            });
        },

        /* background Image Uploader */
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
        onAddBackgroundImage(info) {
            let vm = this;
            let image = info[0];
            vm.form_data.backgroundImageFile = image;
            let blob = new Blob([image], { type: image.type });
            const url = window.URL.createObjectURL(blob);
            document.getElementById('coupleBackgroundBox').style.backgroundImage = `url(${url})`;
            document.getElementById('coupleBackgroundBox').style.backgroundRepeat = 'no-repeat';
            document.getElementById('coupleBackgroundBox').style.backgroundSize = '100%';
        },
        onRemoveBackgroundImage() {
            let vm = this;
            vm.form_data.backgroundImageFile = null;
            document.getElementById('coupleBackgroundBox').style.backgroundImage = ``;
        },

        /* function */
        getElementMatrix(element) {
            let style = window.getComputedStyle(element);
            let matrix = new DOMMatrixReadOnly(style.transform);
            let x = matrix.m41;
            let y = matrix.m42;
            return {
                x, y
            };
        },
        setTranslate(xPos, yPos, el) {
            //"translate3d(" + xPos + "px, " + yPos + "px, 0)";
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        },
        moveItem(type) {
            let vm = this;
            if(type == 'text') {
                if(vm.selectTextObj.x < 0) { vm.selectTextObj.x = 0; }
                if(vm.selectTextObj.y < 0) { vm.selectTextObj.y = 0; }
                if(vm.selectTextObj.x > 480) { vm.selectTextObj.x = 480; }
                if(vm.selectTextObj.y > 640) { vm.selectTextObj.y = 640; }
                vm.setTranslate(vm.selectTextObj.x, vm.selectTextObj.y, vm.selectText);
            } else if (type == 'image') {
                if(vm.selectCoupleImageObj.x < 0) { vm.selectCoupleImageObj.x = 0; }
                if(vm.selectCoupleImageObj.y < 0) { vm.selectCoupleImageObj.y = 0; }
                if(vm.selectCoupleImageObj.x > 480) { vm.selectCoupleImageObj.x = 480; }
                if(vm.selectCoupleImageObj.y > 640) { vm.selectCoupleImageObj.y = 640; }
                vm.setTranslate(vm.selectCoupleImageObj.x, vm.selectCoupleImageObj.y, vm.selectCoupleImage);
            }
        },

       

        /* eventlistener */
        ybrTextEventListener(e) {
            let vm = this;
            vm.dragText = null;
            vm.tab = 'text';
            if(vm.selectText) { vm.selectText.classList = ""; }
            if(vm.selectCoupleImage) { vm.selectCoupleImage.classList = ""; }
            vm.selectText = e.target;
            let matrix = vm.getElementMatrix(e.target);
            vm.setSelectText(e.target);
            vm.currentX = matrix.x;
            vm.currentY = matrix.y;
            vm.initialX = matrix.x;
            vm.initialY = matrix.y;
            vm.xOffset = matrix.x;
            vm.yOffset = matrix.y;
            vm.selectText.classList.add("textActive");
        },
        ybrImageEventListener(e) {
            let vm = this;
            vm.dragImage = null;
            vm.tab = 'couple';
            if(vm.selectText) { vm.selectText.classList = ""; }
            if(vm.selectCoupleImage) { vm.selectCoupleImage.classList = ""; }
            vm.selectCoupleImage = e.target;
            let matrix = vm.getElementMatrix(e.target);
            vm.setSelectCoupleImage(e.target);
            vm.currentX = matrix.x;
            vm.currentY = matrix.y;
            vm.initialX = matrix.x;
            vm.initialY = matrix.y;
            vm.xOffset = matrix.x;
            vm.yOffset = matrix.y;
            vm.selectCoupleImage.classList.add("ybrImageActive");
        },


        /* save */
        onSave() {
            let vm = this;
            vm.$q.loading.show();
            let coupleInfoId = vm.$store.state.user.coupleInfoId;
            if(vm.form_data.backgroundImageFile) {
                const file = vm.form_data.backgroundImageFile;
                let formData = new FormData();
                formData.append("file", file);
                axios({
                    method: "POST",
                    url: `/api/couple/${coupleInfoId}/upload/backgroundImage`,
                    data: formData,
                }).then((res) => {
                    let data = res.data;
                    if(data.success) {
                        let filename = data.filename;
                        let url = `${vm.$store.state.host}/images/${coupleInfoId}/backgroundImages/${filename}`;
                        step2(url);
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
                step2();
            }

            function step2(url) {
                if(url) { document.getElementById('coupleBackgroundBox').style.backgroundImage = `url(${url})`; }
                if(vm.selectText) { vm.selectText.classList = ""; }
                if(vm.selectCoupleImage) { vm.selectCoupleImage.classList = ""; }
                let text = (document.getElementById('coupleBackgroundBox').outerHTML);

                axios.put(`/api/couple/${coupleInfoId}/backgroundImageElement`, {
                    backgroundImageElement: text,
                }).then((res) => {
                    let data = res.data;
                    if(data.success) {
                        vm.$q.notify({
                            icon: 'check',
                            color: 'positive',
                            message: data.message
                        });
                    }
                    vm.$store.commit("onReloadCoupleInfo", coupleInfoId);
                    vm.$q.loading.hide();
                }).catch((err) => {
                    vm.$q.loading.hide();
                    vm.$q.notify({
                        icon: 'error',
                        color: 'negative',
                        message: vm.$store.state.catchErrorMessage
                    });
                });
            }
        },
    },
    mounted: async function() {
        let vm = this;
        if(!vm.$store.state.couple.backgroundImageElement) {
            let div = document.createElement("div");
            div.id = "coupleBackgroundBox";
            div.className = "shadow-2";
            div.style.width = "480px";
            div.style.height = "640px";
            div.style.maxWidth = "480px";
            div.style.maxHeight = "640px";
            div.style.position = "relative";
            div.style.fontFamily = 'kakaoRegular';

            let imageDivMe = document.createElement("div");
            imageDivMe.id = "ybrImage";
            imageDivMe.style.backgroundImage = `url(${vm.$store.state.host + vm.$store.state.user.image})`;
            imageDivMe.style.backgroundRepeat = 'no-repeat';
            imageDivMe.style.backgroundSize = '100%';
            imageDivMe.style.width = "100px";
            imageDivMe.style.height = "100px";
            imageDivMe.style.position = 'absolute';
            imageDivMe.addEventListener('click', (e) => {
                vm.dragImage = null;
                vm.tab = 'couple';
                if(vm.selectText) { vm.selectText.classList = ""; }
                if(vm.selectCoupleImage) { vm.selectCoupleImage.classList = ""; }
                vm.selectCoupleImage = e.target;
                let matrix = vm.getElementMatrix(e.target);
                vm.setSelectCoupleImage(e.target);
                vm.currentX = matrix.x;
                vm.currentY = matrix.y;
                vm.initialX = matrix.x;
                vm.initialY = matrix.y;
                vm.xOffset = matrix.x;
                vm.yOffset = matrix.y;
                vm.selectCoupleImage.classList.add("ybrImageActive");
            });
            div.appendChild(imageDivMe);

            let imageDivCouple = document.createElement("div");
            imageDivCouple.id = "ybrImage";
            imageDivCouple.style.backgroundImage = `url(${vm.$store.state.host + vm.$store.state.couple.image})`;
            imageDivCouple.style.backgroundRepeat = 'no-repeat';
            imageDivCouple.style.backgroundSize = '100%';
            imageDivCouple.style.width = "100px";
            imageDivCouple.style.height = "100px";
            imageDivCouple.style.position = 'absolute';
            imageDivCouple.addEventListener('click', (e) => {
                vm.dragImage = null;
                vm.tab = 'couple';
                if(vm.selectText) { vm.selectText.classList = ""; }
                if(vm.selectCoupleImage) { vm.selectCoupleImage.classList = ""; }
                vm.selectCoupleImage = e.target;
                let matrix = vm.getElementMatrix(e.target);
                vm.setSelectCoupleImage(e.target);
                vm.currentX = matrix.x;
                vm.currentY = matrix.y;
                vm.initialX = matrix.x;
                vm.initialY = matrix.y;
                vm.xOffset = matrix.x;
                vm.yOffset = matrix.y;
                vm.selectCoupleImage.classList.add("ybrImageActive");
            });
            div.appendChild(imageDivCouple);
            document.getElementById('ybrZone').appendChild(div);
        } else {
            let ybrZone = document.getElementById('ybrZone');
            ybrZone.innerHTML = vm.$store.state.couple.backgroundImageElement.trim();
            let coupleBackgroundBox = document.getElementById("coupleBackgroundBox");    
            for (const child of coupleBackgroundBox.children) {
                if(child.id == 'ybrText') {
                    child.addEventListener('click', (e) => {
                        vm.ybrTextEventListener(e);
                    });
                } else if (child.id == 'ybrImage') {
                    child.addEventListener('click', (e) => {
                        vm.ybrImageEventListener(e);
                    });
                }
            }

            let url = `${vm.$store.state.couple.backgroundImageUrl}`;
            if(url) {
                let response = await fetch(url);
                let data = await response.blob();
                let ext = url.split(".").pop();
                let filename = url.split("/").pop();
                let metadata = { type: `image/${ext}` };
                let file = new File([data], filename, metadata);
                vm.$refs.refBackgroundImage.addFiles([file]);
            }
        }

        let container = document.getElementById("coupleBackgroundBox");    

        // mobile
        container.addEventListener("touchstart", dragStart, false);
        container.addEventListener("touchend", dragEnd, false);
        container.addEventListener("touchmove", drag, false);
        // desktop
        container.addEventListener("mousedown", dragStart, false);
        container.addEventListener("mouseup", dragEnd, false);
        container.addEventListener("mousemove", drag, false);

        function dragStart(e) {
            if(e.target.id === 'ybrText' && vm.selectText == e.target) {
                vm.dragImage = null;
                vm.dragText = e.target;
                vm.tab = 'text';
                if (e.type === "touchstart") {
                    vm.initialX = e.touches[0].clientX - vm.xOffset;
                    vm.initialY = e.touches[0].clientY - vm.yOffset;
                } else {
                    vm.initialX = e.clientX - vm.xOffset;
                    vm.initialY = e.clientY - vm.yOffset;
                }
            } 
            else if(e.target.id === 'ybrImage' && vm.selectCoupleImage == e.target) {
                vm.dragText = null;
                vm.dragImage = e.target;
                vm.tab = 'couple';
                if (e.type === "touchstart") {
                    vm.initialX = e.touches[0].clientX - vm.xOffset;
                    vm.initialY = e.touches[0].clientY - vm.yOffset;
                } else {
                    vm.initialX = e.clientX - vm.xOffset;
                    vm.initialY = e.clientY - vm.yOffset;
                }
            }
        }

        function dragEnd(e) {
            vm.initialX = vm.currentX;
            vm.initialY = vm.currentY;
            vm.dragText = null;
            vm.dragImage = null;
        }

        function drag(e) {
            if (vm.dragText) {
                if (e.type === "touchmove") {
                    vm.currentX = e.touches[0].clientX - vm.initialX;
                    vm.currentY = e.touches[0].clientY - vm.initialY;
                } else {
                    vm.currentX = e.clientX - vm.initialX;
                    vm.currentY = e.clientY - vm.initialY;
                }

                vm.xOffset = vm.currentX;
                vm.yOffset = vm.currentY;
                vm.selectTextObj.x = vm.currentX;
                vm.selectTextObj.y = vm.currentY;
                vm.moveItem('text');
                // vm.setTranslate(currentX, currentY, vm.dragText);
            }
            if(vm.dragImage) {
                if (e.type === "touchmove") {
                    vm.currentX = e.touches[0].clientX - vm.initialX;
                    vm.currentY = e.touches[0].clientY - vm.initialY;
                } else {
                    vm.currentX = e.clientX - vm.initialX;
                    vm.currentY = e.clientY - vm.initialY;
                }
                vm.xOffset = vm.currentX;
                vm.yOffset = vm.currentY;
                vm.selectCoupleImageObj.x = vm.currentX;
                vm.selectCoupleImageObj.y = vm.currentY;
                vm.moveItem('image');
            }
        }
    },
}
</script>
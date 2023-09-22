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
        border-radius: 25px;
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
                    bordered :width="500" :breakpoint="500" >
                    <q-scroll-area class="fit">
                        <div class="q-pa-md">
                            <q-splitter v-model="splitterModel"
                                    style="height: 100%" class="shadow-2">
                                <template v-slot:before>
                                    <q-tabs v-model="tab" vertical class="text-gray fkR" >
                                        <q-tab name="backgroundImage" icon="image" label="배경이미지" />
                                        <q-tab name="text" icon="text_fields" label="텍스트" />
                                        <q-tab name="couple" icon="people" label="커플" />
                                        <q-tab name="image" icon="image" label="이미지" />
                                    </q-tabs>
                                </template>

                                <template v-slot:after>
                                    <q-tab-panels keep-alive
                                        v-model="tab" animated swipeable vertical
                                        transition-prev="jump-up" transition-next="jump-up" >
                                        <q-tab-panel name="backgroundImage">
                                            <q-uploader
                                                label="배경 이미지를 선택해주세요." color="primary" :multiple="false"
                                                @added="onAddBackgroundImage" accept="image/*"
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
                                        </q-tab-panel>

                                        <q-tab-panel name="text">
                                            <q-btn class="w100p" outline @click="onCreateText">
                                                <div class="text-center fkR ft18">텍스트 추가</div>
                                            </q-btn>
                                            <div class="q-mt-md">
                                                <q-card v-if="selectItem">
                                                    <q-card-section class="fkR ft18">
                                                        <div>
                                                            <q-input label="라벨" v-model="selectText.label" outlined dense
                                                                @blur="blurTextLabel" @keyup.enter="enterTextLabel" />
                                                        </div>
                                                        <div style="display: flex;" class="q-mt-sm">
                                                            <q-input dense label="x축" v-model.number="selectText.x" class="q-mr-sm"
                                                                type="number" outlined @update:model-value="moveItem" />
                                                            <q-input dense label="y축" v-model.number="selectText.y"
                                                                type="number" outlined @update:model-value="moveItem" />
                                                        </div>
                                                        <div style="display: flex;" class="q-mt-sm">
                                                            <q-input dense label="폰트 크기" v-model.number="selectText.fontSize" 
                                                                class="w100p" type="number" outlined 
                                                                @update:model-value="updateTextFontSize" />
                                                        </div>
                                                        <div class="q-mt-sm">
                                                            <q-input label="텍스트 색상" outlined dense @update:model-value="updateTextColor" 
                                                                v-model="selectText.color" class="my-input" >
                                                                <template v-slot:append>
                                                                    <q-icon name="colorize" class="cursor-pointer">
                                                                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                                            <q-color v-model="selectText.color" 
                                                                            @update:model-value="updateTextColor" />
                                                                        </q-popup-proxy>
                                                                    </q-icon>
                                                                </template>
                                                            </q-input>
                                                        </div>
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
                                            <div class="text-h4 q-mb-md">Movies</div>
                                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                                            <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Quis praesentium cumque magnam odio iure quidem, quod illum numquam possimus obcaecati commodi minima assumenda consectetur culpa fuga nulla ullam. In, libero.</p>
                                        </q-tab-panel>
                                    </q-tab-panels>
                                </template>

                            </q-splitter>
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
    components: {
    },
    data() {
        return {
            tab: 'text',
            splitterModel: 18,

            drawerRight: true,
            drawerLeft: false,

            form_data: {
                file: null,
            },
            user_list: [],

            selectItem: null,
            selectText: {
                label: '텍스트',
                x: 0,
                y: 0,
                fontSize: 0,
                color: '#000000',
            },
            dragText: null,
            text_list: [],

            selectImage: null,
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
        enterTextLabel() {
            let vm = this;
            vm.$nextTick(() => {
                vm.selectItem.innerText = vm.selectText.label;
            });
        },
        blurTextLabel(label) {
            let vm = this;
            vm.selectItem.innerText = vm.selectText.label;
        },
        
        updateTextFontSize(args) {
            let vm = this;
            vm.selectItem.style.fontSize = args + 'px';
        },
        updateTextColor(args) {
            let vm = this;
            vm.selectItem.style.color = args;
        },
        removeItem() {
            let vm = this;
            document.getElementById('coupleBackgroundBox').removeChild(vm.selectItem);
            vm.$nextTick(() => {
                vm.dragText = null;
                vm.selectItem = null;
            });
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
        onAddBackgroundImage(info) {
            let vm = this;
            let image = info[0];
            vm.form_data.file = image;
            let blob = new Blob([image], { type: image.type });
            const url = window.URL.createObjectURL(blob);
            document.getElementById('coupleBackgroundBox').style.backgroundImage = `url(${url})`;
            document.getElementById('coupleBackgroundBox').style.backgroundRepeat = 'no-repeat';
            document.getElementById('coupleBackgroundBox').style.backgroundSize = '100%';
        },
        onRemoveBackgroundImage() {
            let vm = this;
            vm.form_data.file = null;
            document.getElementById('coupleBackgroundBox').style.backgroundImage = ``;
        },

        getElementMatrix(element) {
            let style = window.getComputedStyle(element);
            let matrix = new DOMMatrixReadOnly(style.transform);
            let x = matrix.m41;
            let y = matrix.m42;
            return {
                x, y
            };
        },

        setSelectText(element) {
            let vm = this;
            let matrix = vm.getElementMatrix(element);
            vm.selectText = {
                label: element.innerText,
                x: matrix.x,
                y: matrix.y,
                fontSize: parseInt(element.style.fontSize),
                color: element.style.color,
            }
        },
        onCreateText() {
            let vm = this;
            vm.tab = 'text';
            let span = document.createElement("div");
            let input = document.createElement("input");
            span.appendChild(input);
            span.id = "ybrText";
            span.innerText = "텍스트";
            if(vm.selectItem) {
                vm.selectItem.classList = "";
            }
            span.classList.add("textActive");
            span.style.position = 'absolute';
            span.style.fontSize = '18px';
            span.style.color = '#000000';
            span.addEventListener("click", (e) => {
                vm.dragText = null;
                if(vm.selectItem) {
                    vm.selectItem.classList = "";
                }
                if(vm.selectImage) {
                    vm.selectImage.classList = "";
                }
                vm.selectItem = e.target;
                vm.setSelectText(e.target);
                vm.xOffset = e.clientX - vm.initialX;
                vm.yOffset = e.clientY - vm.initialY;
                // console.log(vm.xOffset, vm.yOffset);
                vm.selectItem.classList.add("textActive");
            });
            // console.log("span: ", span);
            vm.selectItem = span;
            vm.selectText = {
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

        onSave() {
            let vm = this;
            let text = (document.getElementById('coupleBackgroundBox').outerHTML);
            let coupleInfoId = vm.$store.state.user.coupleInfoId;
            vm.$q.loading.show();
            axios.put(`/api/couple/${coupleInfoId}/backgroundImage`, {
                backgroundImage: text,
            }).then((res) => {
                let data = res.data;
                console.log(data);
                if(data.success) {
                    vm.$q.notify({
                        icon: 'check',
                        color: 'positive',
                        message: data.message
                    });
                }
                vm.$q.loading.hide();

            }).catch((err) => {
                vm.$q.loading.hide();
                vm.$q.notify({
                    icon: 'error',
                    color: 'negative',
                    message: vm.$store.state.catchErrorMessage
                });
            });
            console.log("text:", text);
        },

        setTranslate(xPos, yPos, el) {
            //"translate3d(" + xPos + "px, " + yPos + "px, 0)";
            el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
        },

        moveItem(type) {
            let vm = this;
            if(type == 'text') {
                if(vm.selectText.x < 0) { vm.selectText.x = 0; }
                if(vm.selectText.y < 0) { vm.selectText.y = 0; }
                if(vm.selectText.x > 480) { vm.selectText.x = 480; }
                if(vm.selectText.y > 640) { vm.selectText.y = 640; }
                vm.setTranslate(vm.selectText.x, vm.selectText.y, vm.selectItem);
            } else if (type == 'image') {
                if(vm.selectImage.x < 0) { vm.selectImage.x = 0; }
                if(vm.selectImage.y < 0) { vm.selectImage.y = 0; }
                if(vm.selectImage.x > 480) { vm.selectImage.x = 480; }
                if(vm.selectImage.y > 640) { vm.selectImage.y = 640; }
                vm.setTranslate(vm.selectImage.x, vm.selectImage.y, vm.selectImage);
            }
        },
    },
    mounted: function() {
        let vm = this;
        if(!vm.$store.state.couple.backgroundImage) {
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
            imageDivMe.addEventListener("click", (e) => {
                vm.dragImage = null;
                vm.tab = 'couple';
                if(vm.selectImage) {
                    vm.selectImage.classList = "";
                }
                if(vm.selectItem) {
                    vm.selectItem.classList = "";
                }
                vm.selectImage = e.target;
                vm.xOffset = e.clientX - vm.initialX;
                vm.yOffset = e.clientY - vm.initialY;
                vm.selectImage.classList.add("ybrImageActive");
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
            imageDivCouple.addEventListener("click", (e) => {
                vm.dragImage = null;
                vm.tab = 'couple';
                if(vm.selectImage) {
                    vm.selectImage.classList = "";
                }
                if(vm.selectItem) {
                    vm.selectItem.classList = "";
                }
                vm.selectImage = e.target;
                vm.xOffset = e.clientX - vm.initialX;
                vm.yOffset = e.clientY - vm.initialY;
                vm.selectImage.classList.add("ybrImageActive");
            });
            div.appendChild(imageDivCouple);
            document.getElementById('ybrZone').appendChild(div);
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
            if(e.target.id === 'ybrText' && vm.selectItem == e.target) {
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
                // console.log("clientX, Y:", e.clientX, e.clientY);
                // console.log("offsetX, Y:", vm.xOffset, vm.yOffset);
                // console.log("initialX, Y:", vm.initialX, vm.initialY);
            } 
            else if(e.target.id === 'ybrImage' && vm.selectImage == e.target) {
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
                // console.log("clientX, Y:", e.clientX, e.clientY);
                // console.log("offsetX, Y:", vm.xOffset, vm.yOffset);
                // console.log("initialX, Y:", vm.initialX, vm.initialY);
            }
        }

        function dragEnd(e) {
            // console.log("dragEnd");
            // vm.initialX = vm.currentX;
            // vm.initialY = vm.currentY;
            // console.log("initialX, Y:", vm.initialX, vm.initialY);
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
                vm.selectText.x = vm.currentX;
                vm.selectText.y = vm.currentY;
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
                vm.selectImage.x = vm.currentX;
                vm.selectImage.y = vm.currentY;
                vm.moveItem('image');
            }
        }

       
    },
}
</script>
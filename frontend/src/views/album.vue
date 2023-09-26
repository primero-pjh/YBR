<template>
    <div id="albumVue" style="height: 100%; max-width: 1300px;">
        <div style="position: absolute; bottom: 85px; right: 15px;">
            <q-fab icon="add" direction="up" color="positive">
                <q-fab-action @click="openAddAlbum" color="primary" icon="photo_library">
                    <q-tooltip><span class="fkR">앨범 생성</span></q-tooltip>
                </q-fab-action>
            </q-fab>
        </div>
        <div style="width: 100%; display: flex; justify-content: center;" class="q-my-md">
            <div class="shadow-2 q-mr-md" style="width: 50%;">
                <div class="column" style="height: 100%;">   
                    <div>
                        <q-tabs v-model="tab" dense no-caps style="width: 100%;"
                            inline-label class="bg-indigo text-white shadow-2 fkR">
                            <q-tab name="album" icon="photo_library" label="앨범뷰" />
                            <q-tab name="image" icon="image" label="이미지뷰" />
                        </q-tabs>
                    </div>
                    <div>
                        <q-tab-panels v-model="tab" keep-alive animated class="shadow-2 rounded-borders q-pa-none">
                            <q-tab-panel name="album" class="q-pa-none">
                                <q-scroll-area style="width: 100%;" :style="{height: $store.state.height - 300 + 'px'}">
                                    <div style="display: flex; justify-content: start; flex-wrap: wrap; width: 100%;">
                                        <template v-if="isLoadAlbum">
                                            <div class="row text-center" style="width:100%; display: flex; justify-content: center;">
                                                <div v-for="i in 3" :key="i" class="q-mr-md" style="width: 30%;">
                                                    <q-skeleton height="170px" square animation="fade" />
                                                    <div class="row items-start no-wrap q-mt-sm">
                                                        <div class="col">
                                                            <q-skeleton type="text" square width="30%" animation="fade" />
                                                            <q-skeleton type="text" square height="12px" animation="fade" />
                                                            <q-skeleton type="text" square height="12px" width="75%" animation="fade" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </template>
                                        <template v-else v-for="(row, idx) in album_list" :key="idx">
                                            <q-card style="cursor: pointer; width: 100%;" class="q-mr-md q-mb-md"
                                                @click="onClickCover(row)">
                                                <q-img :src="$store.state.host + row.coverImageUrl" fit="cover" 
                                                    style="width: 100%; height: 150px;">
                                                    <div class="absolute-bottom fkR ft16">{{ row.title }}</div>
                                                </q-img>
                                            </q-card>
                                        </template>
                                    </div>
                                </q-scroll-area>
                            </q-tab-panel>
                            <q-tab-panel name="image">
                                <div v-if="dictDateImage" :key="dictDateImageKey">
                                    <template v-for="(value, key, idx) in dictDateImage" :key="idx">
                                        <div class="fkB ft18">{{ key }}</div>
                                        <div class="row q-mb-md ">
                                            <div class="col">
                                                <template v-for="row, idx2 in value" :key="idx2">
                                                    <q-img :src="$store.state.host + row.imageUrl" fit="cover" class="q-mr-sm" @click="onClickImage(row)"
                                                        style="width: 180px; height: 180px; max-width: 180px; max-height: 180px;
                                                            border: 1px solid #eee; cursor: pointer;" />
                                                </template>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </q-tab-panel>
                        </q-tab-panels>
                    </div>
                </div>
            </div>
            <div style="width: 50%;" class="q-pa-md shadow-2">
                <q-scroll-area style="width: 100%;" :style="{height: $store.state.height - 300 + 'px'}" class="q-px-md">
                    <template v-if="selectAlbum">
                        <div v-if="!isEdit">
                            <div class="fkB text-primary ft20">커버 이미지</div>
                            <q-img :src="$store.state.host + selectAlbum.coverImageUrl" style="width: 150px; height: 150px; border: 1px solid #eee;"
                                fit="contain" />
                            <div class="fkB text-primary ft20 q-mt-md">이미지리스트</div>
                            <q-carousel swipeable animated padding style="border: 1px solid black; border-radius: 5px;"
                                v-model="slide" thumbnails infinite 
                                v-model:fullscreen="fullscreen">
                                <template v-for="row, idx in selectAlbum.imageList" :key="idx">
                                    <q-carousel-slide :name="idx" :img-src="$store.state.host + row.imageUrl" />
                                </template>
                                <template v-slot:control>
                                <q-carousel-control position="bottom-right" :offset="[18, 18]">
                                    <q-btn
                                        push round dense color="white" text-color="primary"
                                        :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
                                        @click="fullscreen = !fullscreen"
                                    />
                                    </q-carousel-control>
                                </template>
                            </q-carousel>
                            <q-field filled stack-label dense label="앨범명" class="q-mt-md">
                                <template #control>
                                    <div>{{ selectAlbum.title }}</div>
                                </template>
                            </q-field>
                            <q-field filled stack-label dense label="설명" class="q-mt-md" type="textarea">
                                <template #control>
                                    <div>{{ selectAlbum.body }}</div>
                                </template>
                            </q-field>
                            <div class="w100p text-center q-mt-md">
                                <q-btn outline label="수정" color="positive" @click="openDialogAlbum" />
                            </div>
                        </div>
                    </template>
                    <template v-else>
                        <div style="width: 100%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);" 
                            class="text-center fkR ft20">
                            선택된 앨범이 없습니다!
                        </div>
                    </template>
                </q-scroll-area>
            </div>
        </div>
    </div>
</template>

<script>

import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';
import axios from 'axios';


export default {
    name: 'albumVue',
    components: {
    },
    data() {
        return {
            tab: 'album',
            slide: 0,

            fullscreen: false,
            isLoadAlbum: true,
            isEdit: false,

            form_data: {
                backgroundImageFile: null,
                imageFiles: [],
            },

            albumDict: {},
            album_list: [],

            dictDateImageKey: false,
            dictDateImage: null,
            image_dict: new Object(),
            image_list: [],
            selectAlbum: null,
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
        onAddBackgroundImage(info) {
            let vm = this;
            let image = info[0];
            vm.form_data.backgroundImageFile = image;
            let blob = new Blob([image], { type: image.type });
            const url = window.URL.createObjectURL(blob);
            // document.getElementById('coupleBackgroundBox').style.backgroundImage = `url(${url})`;
            // document.getElementById('coupleBackgroundBox').style.backgroundRepeat = 'no-repeat';
            // document.getElementById('coupleBackgroundBox').style.backgroundSize = '100%';
        },
        onRemoveBackgroundImage() {
            let vm = this;
            vm.form_data.backgroundImageFile = null;
        },

        onClickImage: async function (image) {
            let vm = this;
            let coupleAlbumId = image.coupleAlbumId;
            vm.onClickCover(vm.albumDict[coupleAlbumId]);
        },
        onClickCover(cover) {
            let vm = this;
            vm.isEdit = false;
            vm.selectAlbum = cover;
        },
        openDialogAlbum: async function() {
            let vm = this;
            vm.$root.$refs.dialog_modify_album.openEditMode(vm.selectAlbum, function() {
                console.log("callback");
            });
            // vm.$nextTick(async () => {
            //     let coupleAlbumId = vm.selectAlbum.coupleAlbumId;
            //     let album = vm.albumDict[coupleAlbumId];
            //     let url = `${album.coverImageUrl}`;
            //     const response = await fetch(url);
            //     const data = await response.blob();
            //     const ext = url.split(".").pop();
            //     const filename = url.split("/").pop();
            //     const metadata = { type: `image/${ext}` };
            //     let file = new File([data], filename, metadata);
            //     vm.$refs.refBackgroundImage.addFiles([file]);
            // });
        },
        openAddAlbum() {
            let vm = this;
            vm.$root.$refs.dialog_modify_album.openAddMode(() => {
                vm.onLoadAlbum();
            });
        },

        
        onLoadAlbum() {
            let vm = this;
            vm.$q.loading.show();
            let coupleInfoId = vm.$store.state.user.coupleInfoId;
            axios.all([
                axios.get(`/api/couple/${coupleInfoId}/albums/images`),
                axios.get(`/api/couple/${coupleInfoId}/albums`),
            ]).then(axios.spread((res1, res2) => {
                let data1 = res1.data;
                let dict = new Object();
                if(data1.success) {
                    let row = data1.image_list;
                    let dictDateImage = new Object();
                    row.map((x) => {
                        if(Object.prototype.hasOwnProperty.call(dict, x.coupleAlbumId) == false) {
                            dict[x.coupleAlbumId] = new Array();
                        }
                        if(Object.prototype.hasOwnProperty.call(dict, x.coupleAlbumId) == true) {
                            dict[x.coupleAlbumId].push(x);
                        }

                        x["dateAddedView"] = vm.$c.formatDate(x.dateAdded, "date");
                        let key = x.dateAddedView;
                        if(Object.prototype.hasOwnProperty.call(dictDateImage, key) == false) {
                            dictDateImage[key] = new Array();
                        }
                        if(Object.prototype.hasOwnProperty.call(dictDateImage, key) == true) {
                            dictDateImage[key].push(x);
                        }
                        vm.dictDateImage = dictDateImage;
                    })
                    vm.image_list = row;
                }

                let data2 = res2.data;
                if(data2.success) {
                    let row = data2.album_list;
                    let albumDict = new Object();
                    row.map((x) => {
                        if(Object.prototype.hasOwnProperty.call(dict, x.coupleAlbumId) == true) {
                            x["imageList"] = dict[x.coupleAlbumId];
                        } else {
                            x["imageList"] = new Array();
                        }
                        albumDict[x.coupleAlbumId] = x;
                    });
                    vm.isLoadAlbum = false;

                    vm.album_list = row;
                    vm.albumDict = albumDict;
                }
                vm.$q.loading.hide();
            })).catch((err) => {
                console.log("err:", err);
                vm.$q.loading.hide();
                vm.$q.notify({
                    icon: 'close',
                    color: 'negative',
                    message: vm.$store.state.catchErrorMessage,
                });
            });
        }
    },
    mounted: function() {
        let vm = this;
        const lightbox = new PhotoSwipeLightbox({
            gallery: '#my-gallery',
            children: 'a',
            pswpModule: () => import('photoswipe')
        });
        lightbox.init();

        vm.onLoadAlbum();
    },
}
</script>
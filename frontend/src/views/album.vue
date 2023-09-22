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
                            inline-label class="bg-primary text-white shadow-2 fkR">
                            <q-tab name="album" icon="photo_library" label="앨범뷰" />
                            <q-tab name="image" icon="image" label="이미지뷰" />
                        </q-tabs>
                    </div>
                    <div>
                        <q-tab-panels v-model="tab" keep-alive
                            animated class="shadow-2 rounded-borders">
                            <q-tab-panel name="album">
                                <div style="display: flex; justify-content: space-between; flex-wrap: wrap;">
                                    <template v-if="isLoadAlbum">
                                        <div class="row text-center" style="display: flex; justify-content: center;">
                                            <div v-for="i in 3" :key="i" class="q-mr-md">
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
                                        <q-card style="width: 33%; cursor: pointer;" class="q-mr-md q-mb-md col" @click="onClickCover(row)">
                                            <q-img :src="$store.state.host + row.coverImageUrl">
                                                <div class="absolute-bottom fkR ft16">{{ row.title }}</div>
                                            </q-img>
                                        </q-card>
                                    </template>
                                </div>
                            </q-tab-panel>
                            <q-tab-panel name="image">
                                <div v-if="dictDateImage" :key="dictDateImageKey">
                                    <template v-for="(value, key, idx) in dictDateImage" :key="idx">
                                        <div class="fkB ft18">{{ key }}</div>
                                        <div class="row q-mb-md ">
                                            <div class="col ">
                                                <template v-for="row, idx2 in value" :key="idx2">
                                                    <q-img :src="$store.state.host + row.imageUrl" fit="cover" class="q-mr-sm"
                                                        style="width: 180px; height: 180px; max-width: 180px; max-height: 180px;
                                                            border: 1px solid #eee;" />
                                                </template>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </q-tab-panel>
                        </q-tab-panels>
                    </div>
                    <div>
                        
                    </div>
                </div>
            </div>
            <div style="width: 50%;" class="q-pa-md shadow-2">
                <q-scroll-area style="max-width: 100%;" :style="{height: $store.state.height - 237 + 'px'}">
                    <div v-if="selectAlbum">
                        <q-carousel swipeable animated vertical padding
                            v-model="slide" thumbnails infinite >
                            <template v-for="row, idx in selectAlbum" :key="idx">
                                <q-carousel-slide class="q-pa-lg"
                                    :name="idx"  :img-src="$store.state.host + row.imageUrl"/>
                            </template>
                        </q-carousel>
                    </div>
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
            tab: 'image',
            slide: 1,

            isLoadAlbum: true,
            album_list: [],

            dictDateImageKey: false,
            dictDateImage: null,
            image_dict: new Object(),
            image_list: [],
            selectAlbum: null,
        }
    },
    methods: {
        onClickCover(cover) {
            let vm = this;
            if(Object.prototype.hasOwnProperty.call(vm.image_dict, cover.coupleAlbumId)) {
                vm.selectAlbum = vm.image_dict[cover.coupleAlbumId];
            }
        },
        openAddAlbum() {
            let vm = this;
            vm.$root.$refs.dialog_add_album.open(() => {
                vm.onLoadAlbum();
            });
        },

        onLoadAlbum() {
            let vm = this;
            vm.$q.loading.show();
            let coupleInfoId = vm.$store.state.user.coupleInfoId;
            axios.all([
                axios.get(`/api/couple/${coupleInfoId}/albums`),
                axios.get(`/api/couple/${coupleInfoId}/albums/images`),
            ]).then(axios.spread((res1, res2, res3, res4) => {
                let data1 = res1.data;
                if(data1.success) {
                    let row = data1.album_list;
                    vm.isLoadAlbum = false;
                    vm.album_list = row;
                }

                let data2 = res2.data;
                if(data2.success) {
                    let row = data2.image_list;
                    let dict = new Object();
                    let dictDateImage = new Object();
                    row.map((x) => {    
                        x["dateView"] = vm.$c.formatDate(x.dateAdded, "date");
                        let key = x.coupleAlbumId;
                        if(!Object.prototype.hasOwnProperty.call(dict, key)) {
                            dict[key] = new Array();
                        } 
                        if(Object.prototype.hasOwnProperty.call(dict, key)) {
                            dict[key].push(x);
                        } 
                        key = x.dateView;
                        if(!Object.prototype.hasOwnProperty.call(dictDateImage, key)) {
                            dictDateImage[key] = new Array();
                        } 
                        if(Object.prototype.hasOwnProperty.call(dictDateImage, key)) {
                            dictDateImage[key].push(x);
                        } 
                    });
                    vm.image_list = row;
                    vm.image_dict = dict; 
                    vm.dictDateImage = dictDateImage;
                    vm.$nextTick(() => {
                        vm.dictDateImageKey = !vm.dictDateImageKey;
                    });
                }
                vm.$q.loading.hide();
            })).catch((err) => {
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
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
                                <div class="row">
                                    <template v-if="!isLoadAlbum">
                                        <div class="row text-center" style="display: flex; justify-content: center;">
                                            <div style="min-width: 175px;" v-for="i in 3" :key="i" class="q-mr-md">
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
                                        <q-card style="min-width: 175px; cursor: pointer;" class="q-mr-md q-mb-md">
                                            <q-img :src="$store.state.host + row.coverImageUrl">
                                                <div class="absolute-bottom text-h6">
                                                    {{ row.title }}
                                                </div>
                                            </q-img>
                                            <q-card-section v-if="row.body">
                                                {{ row.body }}
                                            </q-card-section>
                                            <q-card-section v-else>
                                                None.
                                            </q-card-section>
                                        </q-card>
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
                <q-scroll-area style="max-width: 100%;" :style="{height: $store.state.height - 200 + 'px'}">
                    <div>
                        안니엉?
                    </div>
                </q-scroll-area>
            </div>
        </div>
    </div>
</template>

<script>

import PhotoSwipeLightbox from 'photoswipe/lightbox';
import axios from 'axios';
import 'photoswipe/style.css';


export default {
    name: 'albumVue',
    components: {
    },
    data() {
        return {
            tab: 'album',

            isLoadAlbum: true,
            album_list: [],
        }
    },
    methods: {
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
            axios.get(`/api/couple/${coupleInfoId}/albums`, {}).then((res) => {
                let data = res.data;
                if(data.success) {
                    let row = data.album_list;
                    vm.isLoadAlbum = false;
                    vm.album_list = row;
                }
                vm.$q.loading.hide();
            }).catch((err) => {
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
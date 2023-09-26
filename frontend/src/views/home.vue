<template>
    <div id="homeVue" style="height: 100%;">
        <div class="row q-mt-md q-mb-md" style="justify-content: center;">
            <template v-if="$store.state.couple.backgroundImage">
                <div class="q-mr-md" v-html="$store.state.couple.backgroundImage"></div>
            </template>
            <template v-else>
                <div class="q-mr-md shadow-2" style="width: 480px; height: 640px; position: relative;">
                    <div style="position: absolute; top: 50%; left: 50%;
                        transform: translate(-50%, -50%);" class="fkR ft16 text-center">
                        커플 배경사진이 세팅되지 않았습니다.
                        <q-btn outline @click="goto_profile">
                            설정하러가기
                        </q-btn>
                    </div>
                </div>
            </template>
            <div class="shadow-4 q-pa-md">
                <div style="display: flex; justify-content: space-between; align-items: center;"
                    class="q-mb-sm">
                    <div class="text-h6 fkB text-primary">
                        일정
                    </div>
                    <div>
                        <q-btn icon="open_in_new" flat rounded @click="openTimeline">
                            <q-tooltip><span class="fkR ft16">타임라인</span></q-tooltip>
                        </q-btn>
                    </div>
                </div>
                
                <div style="min-width: 400px; max-width: 400px;">
                    <q-table class="my-sticky-header-table fkR" style="height: 380px;"
                        flat bordered
                        virtual-scroll
                        :rows="sche_list"
                        :columns="sche_columns"
                        row-key="name">
                        <template v-slot:no-data>
                            <div class="fkR ft16">
                                일정이 없습니다.
                            </div>
                        </template>
                        <template v-slot:body="props">
                            <q-tr :props="props">
                                <q-td key="classification" :props="props">
                                    <span class="ft16">
                                        <div>
                                            {{ props.row.classification }}
                                        </div>
                                    </span>
                                </q-td>
                                <q-td key="title" :props="props">
                                    <span class="ft16">
                                        {{ props.row.title }}
                                    </span>
                                </q-td>
                                <q-td key="Dday" :props="props">
                                    <q-badge color="green" v-if="props.row.Dday <= 0">
                                        D-{{ Math.abs(props.row.Dday) }}
                                        <q-tooltip>
                                            <span class="fkR">
                                                {{ props.row.start }} ~ {{ props.row.end }}
                                            </span>
                                        </q-tooltip>
                                    </q-badge>
                                    <q-badge color="red" v-else>
                                        D+{{ Math.abs(props.row.Dday) }}
                                        <q-tooltip>
                                            <span class="fkR">
                                                {{ props.row.start }} ~ {{ props.row.end }}
                                            </span>
                                        </q-tooltip>
                                    </q-badge>
                                </q-td>
                                <q-td key="details" :props="props">
                                    <q-btn icon="input" dense flat @click="goto_detail(props.row)"/>
                                </q-td>
                            </q-tr>
                        </template>
                    </q-table>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center;"
                    class="q-mb-sm q-mt-md">
                    <div class="text-h6 fkB text-primary">
                        앨범
                    </div>
                    <div>
                        <q-btn icon="open_in_new" flat rounded @click="goto_album">
                            <q-tooltip><span class="fkR ft16">바로가기</span></q-tooltip>
                        </q-btn>
                    </div>
                </div>
                <div>
                    <template v-if="albumList.length > 0">
                        <q-virtual-scroll
                            :items="albumList"
                            virtual-scroll-horizontal
                            style="max-width: 400px;"
                            v-slot="{ item, index }">
                            <div :key="index">
                                <q-card flat bordered class="q-ma-sm" style="width: 150px;">
                                    <q-img :src="$store.state.host + item.coverImageUrl" 
                                        style="width: 150px; height: 150px;"
                                        fit="cover" />
                                    <q-separator></q-separator>
                                    <q-card-section>
                                        <div class="text-subtitle2 fkR ft16">{{ item.title }}</div>
                                    </q-card-section>
                                </q-card>
                            </div>
                        </q-virtual-scroll>
                    </template>
                    <template v-else>
                        <div class="shadow-2" style="height: 150px; position: relative;">
                            <div class="fkR ft18"
                                style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
                                앨범이 존재하지 않습니다.
                            </div>
                            
                        </div>
                    </template>
                </div>
            </div>
        </div>
        <dialog_schedule_timeline ref="dialog_schedule_timeline" />
    </div>
</template>

<script>

import axios from "axios";
import dialog_schedule_timeline from "@/components/dialog_schedule_timeline.vue";

export default {
    name: 'homeVue',
    components: {
        dialog_schedule_timeline,
    },
    data() {
        return {
            slide: 0,
            fullscreen: false, 

            albumList: [],

            sche_list: [],
            sche_columns: [
                { name: 'classification', label: '유형', align: 'left', field: 'classification', sortable: false },
                { name: 'title', label: '제목', align: 'left', field: 'title', sortable: false },
                // { name: 'dateRange', label: '날짜', align: 'left', field: 'dateRange', sortable: false },
                { name: 'Dday', label: 'D-day', align: 'left', field: 'Dday', sortable: false, },
                { name: 'details', label: '상세보기', align: 'left', field: 'details', sortable: false },
            ],
        }
    },
    methods: {
        goto_album() {
            let vm = this;
            vm.$root.$refs.layout.tab = 'album';
            vm.$root.$refs.layout.location_href('/album');
        },
        goto_profile() {
            let vm = this;
            vm.$root.$refs.layout.tab = 'profile';
            vm.$root.$refs.layout.location_href('/profile');
        },
        goto_detail(args) {
            let vm = this;
            vm.$root.$refs.layout.tab = 'calendar';
            vm.$router.push(`/calendar/${args.id}`);
        },  
        diffDay(date) {
            const masTime = new Date(date);
            const todayTime = new Date();
            const diff = todayTime - masTime;
            return Math.floor(diff / (1000*60*60*24));
        },

        openTimeline() {
            let vm = this;
            vm.$refs.dialog_schedule_timeline.open(vm.sche_list, function() {

            });
        },
        loadScheList() {
            let vm = this;
            let coupleInfoId = vm.$store.state.user.coupleInfoId;
            let classification_dict = vm.$store.state.classification_dict;
            axios.get(`/api/couple/${coupleInfoId}/schedules`, {

            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    let row = data.sche_list;
                    row.map((x) => {
                        const Dday = vm.diffDay(x.start);
                        x["Dday"] = Dday;
                        x["startDateView"] = vm.$c.formatDate(new Date(x.start), "date");
                        if(Object.prototype.hasOwnProperty.call(classification_dict, x.classification)) {
                            x["classificationColor"] = classification_dict[x.classification].color;
                        }
                    });
                    vm.sche_list = row;
                }
            }).catch((err) => {
                vm.$q.notify({
                    icon: 'error',
                    color: 'negative',
                    message: vm.$store.state.catchErrorMessage,
                });
            });
        },
        loadAlbumList() {
            let vm = this;
            let coupleInfoId = vm.$store.state.user.coupleInfoId;
            axios.get(`/api/couple/${coupleInfoId}/albums`, {

            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    let row = data.album_list;
                    vm.albumList = row;
                }
            }).catch((err) => {
                vm.$q.notify({
                    icon: 'error',
                    color: 'negative',
                    message: vm.$store.state.catchErrorMessage,
                });
            });
        },
    },
    mounted: function() {
        let vm = this;
        vm.loadScheList();
        vm.loadAlbumList();
    },
}
</script>
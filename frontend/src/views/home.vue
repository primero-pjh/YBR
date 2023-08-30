<template>
    <div id="homeVue" style="height: 100%;">
        <div class="row q-mt-md" style="justify-content: center;">
            <div class="q-mr-md q-pa-md col-3" style="border: 1px solid #eee; border-radius: 10px;">
                대충 이미지
            </div>
            <div class="shadow-4 q-pa-md col-7">
                <div style="display: flex; justify-content: space-between; align-items: center;"
                    class="q-mb-sm">
                    <div class="text-h6 fkB text-primary">
                        일정
                    </div>
                    <div>
                        <q-btn icon="open_in_new" flat rounded @click="openTimeline">
                            <q-tooltip>
                                <span class="fkR">전체보기</span>
                            </q-tooltip>
                        </q-btn>
                    </div>
                </div>
                
                <div>
                    <q-list bordered>
                        <q-table class="my-sticky-header-table fkR" 
                            flat bordered
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
                                    <q-td key="title" :props="props">
                                        <span class="ft18">
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
                    </q-list>
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
            sche_list: [],
            sche_columns: [
                { name: 'title', label: '제목', align: 'left', field: 'title', sortable: false },
                // { name: 'dateRange', label: '날짜', align: 'left', field: 'dateRange', sortable: false },
                { name: 'Dday', label: 'D-day', align: 'left', field: 'Dday', sortable: false, },
                { name: 'details', label: '상세보기', align: 'left', field: 'details', sortable: false },
            ],
        }
    },
    methods: {
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
            console.log("openTimeline");
            vm.$refs.dialog_schedule_timeline.open(vm.sche_list, function() {

            });
        },
        loadScheList() {
            let vm = this;
            let coupleInfoId = vm.$store.state.user.coupleInfoId;
            axios.get(`/api/couple/${coupleInfoId}/schedules`, {

            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    let row = data.sche_list;
                    row.map((x) => {
                        const Dday = vm.diffDay(x.start);
                        x["Dday"] = Dday;
                        x["startDateView"] = vm.$c.formatDate(new Date(x.start), "date");
                    });
                    vm.sche_list = row;
                    console.log("sche_list:", vm.sche_list);
                }
            });
        }
    },
    mounted: function() {
        let vm = this;
        vm.loadScheList();
    },
}
</script>
<template>
    <q-dialog v-model="isOpen" :position="position" full-height persistent>
        <q-card class="column full-height" style="min-width: 600px; height: calc(100% - 72px);" >
            <q-card-section>
                <div style="display: flex; justify-content: space-between;">
                    <q-btn dense icon="close" flat v-close-popup />
                    <div class="text-center fkB ft20">타임라인</div>
                    <div></div>
                </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="col q-pt-none scroll" style="max-height: 100vh;">
                <div class="q-mt-md">
                    <div>
                        <!-- <q-checkbox label="삭제된 일정도 보기" v-model="includeDeleteSchedule" /> -->
                    </div>
                    <q-timeline>
                        <template v-for="row, idx in schedule_list" :key="idx">
                            <q-timeline-entry>
                                <template v-slot:title>
                                    <div style="display: flex; align-items: center;">
                                        <div>
                                            <span class="fkB" :style="{color: row.classificationColor}">
                                                {{ row.title }}
                                                <q-tooltip class="fkR ft16">
                                                    {{ row.classification }}
                                                </q-tooltip>
                                            </span>
                                        </div>
                                    </div>
                                    
                                </template>
                                <template v-slot:subtitle>
                                    <span>{{ row.startDateView }}</span>
                                </template>
                                <div class="fkR ft16">
                                    {{ row.body }}
                                </div>
                            </q-timeline-entry>
                        </template>
                    </q-timeline>
                </div>
            </q-card-section>
            <q-separator></q-separator>
            <q-card-actions align="right">
                <q-btn outline label="닫기" class="q-mr-sm" v-close-popup />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
import axios from 'axios';

export default {
    name: 'dialog_schedule_timeline',
    data() {
        return {
            position: 'right',
            isOpen: false,
            callback: null,
            schedule_list: [],
        }
    },
    methods: {
        open(schedule_list, callback) {
            let vm = this;
            let list = vm.$c.tempObj(schedule_list);
            list.sort((a, b) => {
                return (b.startDateView - a.startDateView) ? 1 : -1;
            });
            vm.schedule_list = list;
            if(callback) { vm.callback = callback; }
            vm.isOpen = true;
            vm.$nextTick(() => {
                vm.$q.loading.show();
                let timeline = document.getElementsByClassName("q-timeline")[0];
                if(timeline) {
                    let idx = 0;
                    for (const child of timeline.children) {
                        if(child.childNodes[1]) {
                            child.childNodes[1].style.cssText = `color: ${list[idx].classificationColor} !important`;
                            idx++;
                        }
                    }
                }
                vm.$q.loading.hide();
            });
        },
    },
    mounted() {
        let vm = this;
    }
}
</script>
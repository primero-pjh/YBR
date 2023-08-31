<template>
    <q-dialog v-model="isOpen" :position="position" full-height persistent>
        <q-card class="column full-height" style="min-width: 600px; height: calc(100% - 72px);" >
            <q-card-section>
                <div style="display: flex; justify-content: space-between;">
                    <q-btn dense icon="close" flat v-close-popup />
                    <div class="text-h6 text-center">타임라인</div>
                    <div></div>
                </div>
                
            </q-card-section>
            <q-separator />
            <q-card-section class="col q-pt-none">
                <div class="q-mt-md">
                    <div>
                        <!-- <q-checkbox label="삭제된 일정도 보기" v-model="includeDeleteSchedule" /> -->
                    </div>
                    <q-timeline color="secondary">
                        <template v-for="row, idx in schedule_list" :key="idx">
                            <q-timeline-entry >
                                <template v-slot:title>
                                    <span class="fkB">{{ row.title }}</span>
                                </template>
                                <template v-slot:subtitle>
                                    <span>{{ row.startDateView }}</span>
                                </template>
                                <div class="fkR">
                                    {{row.body}}
                                </div>
                            </q-timeline-entry>
                        </template>
                        

                        <!-- <q-timeline-entry icon="delete">
                            <template v-slot:title>
                            Event Title
                            </template>
                            <template v-slot:subtitle>
                            February 21, 1986
                            </template>

                            <div>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </div>
                        </q-timeline-entry>

                        <q-timeline-entry heading>
                            November, 2017
                        </q-timeline-entry>

                        <q-timeline-entry avatar="https://cdn.quasar.dev/img/avatar5.jpg">
                            <template v-slot:title>
                            Event Title
                            </template>
                            <template v-slot:subtitle>
                            February 22, 1986
                            </template>

                            <div>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </div>
                        </q-timeline-entry>

                        <q-timeline-entry>
                            <template v-slot:title>
                            Event Title
                            </template>
                            <template v-slot:subtitle>
                            February 22, 1986
                            </template>

                            <div>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </div>
                        </q-timeline-entry>

                        <q-timeline-entry
                            color="orange"
                            icon="done_all"
                        >
                            <template v-slot:title>
                            Event Title
                            </template>
                            <template v-slot:subtitle>
                            February 22, 1986
                            </template>

                            <div>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </div>
                        </q-timeline-entry>

                        <q-timeline-entry>
                            <template v-slot:title>
                            Event Title
                            </template>
                            <template v-slot:subtitle>
                            February 22, 1986
                            </template>

                            <div>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </div>
                        </q-timeline-entry>

                        <q-timeline-entry>
                            <template v-slot:title>
                            Event Title
                            </template>
                            <template v-slot:subtitle>
                            February 22, 1986
                            </template>

                            <div>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                            </div>
                        </q-timeline-entry> -->
                        </q-timeline>
                </div>
            </q-card-section>
            <q-space></q-space>
            <q-card-section align="right">
                <q-btn outline label="닫기" class="q-mr-sm" v-close-popup />
            </q-card-section>
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
        },
    },
    mounted() {
        let vm = this;
    }
}
</script>
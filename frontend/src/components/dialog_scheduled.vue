<template>
    <q-dialog v-model="isOpen" :position="position">
        <q-card style="min-width: 400px; height: calc(100% - 72px);" >
            <q-card-section>
                <div class="text-h6 text-center">일정 생성</div>
            </q-card-section>
            <q-separator />
            <q-card-section class="row items-center no-wrap">
                <div style="width: 100%;">
                    <q-input label="제목 *" v-model="schedule.title" label-color="red" @keyup.enter="onSave" />
                    <q-input label="장소" v-model="schedule.place" @keyup.enter="onSave" />
                    <q-input label="시작시각" v-model="schedule.start" @keyup.enter="onSave" />
                    <q-input label="종료시각" v-model="schedule.end" @keyup.enter="onSave" />
                </div>
            </q-card-section>
            <q-separator />
            <q-card-actions align="right">
                <q-btn outline label="닫기" v-close-popup />
                <q-btn outline color="positive" label="저장" @click="onSave" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>

<script>
// import axios from 'axios';
export default {
    name: 'dialog_scheduled',
    data() {
        return {
            position: 'right',
            isOpen: false,
            callback: null,

            schedule: {
                id: 0,
                place: '',
                calendarId: '',
                title: '',
                isAllDay: '',
                start: '',
                end: '',
                category: ''
            },
            formError: {},
        }
    },
    methods: {
        setSchedule(schedule) {
            let vm = this;
            vm.schedule.title = "";
            vm.schedule.place = "";
            vm.schedule.start = vm.$c.formatDate(schedule.start._date);
            vm.schedule.end = vm.$c.formatDate(schedule.end._date);
        },
        open(mode, scheduleData, callback) {
            let vm = this;
            vm.mode = mode;
            // console.log("scheduleData:", scheduleData);
            vm.setSchedule(scheduleData);
            if(callback) { vm.callback = callback; }
            vm.isOpen = true;
        },

        onSave() {
            let vm = this;
            vm.callback(vm.schedule);
            vm.isOpen = false;
        },
    },
    mounted() {
    }
}
</script>
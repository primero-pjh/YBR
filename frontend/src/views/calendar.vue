<template>
    <div id="homeVue" style="height: 100%;">
        <div>
            <div id="calendar" style="height: 600px; border: 1px solid #eee;"></div>
        </div>
        <dialog_scheduled ref="dialog_scheduled" />
    </div>
</template>

<script>

import Calendar from 'tui-calendar';
import 'tui-calendar/dist/tui-calendar.css';
import 'tui-date-picker/dist/tui-date-picker.css';
import 'tui-time-picker/dist/tui-time-picker.css';
import dialog_scheduled from '@/components/dialog_scheduled.vue';

export default {
    name: 'homeVue',
    components: {
        dialog_scheduled,
    },
    data() {
        return {

        }
    },
    methods: {
        
    },
    mounted: function() {
        let vm = this;
        const calendar = new Calendar('#calendar', {
            defaultView: 'month',
            useCreationPopup: false,
            useDetailPopup: true,
            usageStatistics: false,
        });
        
        calendar.createSchedules([
            {
                id: '1',
                calendarId: 'Major Lecture',
                title: '소프트웨어 개론 레포트 제출',
                category: 'time', // 'task'로 지정합니다
                dueDateClass: '',
                start: '2023-06-20T10:30:00',
                end: '2023-06-20T11:30:00',
            },
            {
                id: '2',
                calendarId: 'General Lecture',
                title: '건강과 영양',
                category: 'time',
                dueDateClass: '',
                start: '2023-06-20T14:30:00',
                end: '2023-06-21T16:30:00',
                isReadOnly: true // schedule is read-only
            },
        ]);

        /* scheduled를 생성하기 전 */
        calendar.on('beforeCreateSchedule', scheduleData => {
            vm.$refs.dialog_scheduled.open('add', scheduleData, (schedule) => {
                console.log("schedule:", schedule);
                // schedule["calendarId"] = "123",
                // schedule["id"] = '3';
                // schedule["title"] = "123123123";
                schedule["category"] = "time";
                calendar.createSchedules([schedule]);
            });
            
        });
    },
}
</script>
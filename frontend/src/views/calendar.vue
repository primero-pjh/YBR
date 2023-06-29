<template>
    <div id="homeVue" style="height: 100%;">
        <div>
            <div id="calendar" style="height: 600px; border: 1px solid #eee;"></div>
        </div>
        <dialog_scheduled ref="dialog_scheduled" />
    </div>
</template>

<script>

import axios from "axios";
import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
import dialog_scheduled from '@/components/dialog_scheduled.vue';

export default {
    name: 'homeVue',
    components: {
        dialog_scheduled,
    },
    data() {
        return {
            calendar: null,
            schedule_list: [],
        }
    },
    methods: {
        loadScheduleList() {
            let vm = this;
            vm.$q.loading.show();
            let coupleInfoId = vm.$store.state.user.coupleInfoId;
            axios.get(`/api/schedules/couple/${coupleInfoId}`, {}).then((res) => {
                let data = res.data;
                if(data.success) {
                    let row = data.schedule_list;
                    row.map((x) => {
                        x.isAllday = x.isAllday ? true : false;
                        x.attendees = JSON.parse(x.attendees);
                    });
                    vm.calendar.createEvents(row);
                    vm.schedule_list = row;
                }
                vm.$q.loading.hide();
            });
            vm.calendar.render();
            vm.calendar.clearGridSelections();
        },
    },
    mounted: function() {
        let vm = this;

        const calendar = new Calendar('#calendar', {
            defaultView: 'month',
            // isReadOnly: false,
            useDetailPopup: false,
            usageStatistics: false,
            useFormPopup: false,
        });
        
        // 특정 날짜 혹은 시간을 드래그 앤 드랍했을 때 발생
        calendar.on('selectDateTime', (info) => {
            let schedule = {
                id: 0,                          //	일정 ID
                calendarId: '',    // 캘린더 ID
                title: '',             // 일정 제목
                body: '',                       // 일정 내용
                isAllday: false,                // 종일 일정 여부
                start: info.start,              // 일정이 시작하는 일시.
                end: info.end,                  // 일정이 끝나는 일시
                location: '',                   // 일정 장소
                attendees: [],                  // 일정 참석자 목록
                category: 'time',               // 일정 카테고리. milestone, task, allday, time 중 하나이다.
                dueDateClass: '',               // task 일정 카테고리. 어떤 문자열도 가능하다.
                isVisible: true,                // 일정 표시 여부
                isPending: false,	            // 미정인 일정 여부
                isFocused: false,	            // 일정 강조 여부
                isReadOnly: false,	            // 수정 가능한 일정 여부
                isPrivate: false,	            // 개인적인 일정 여부
                color:	'#000',	                // 일정 요소의 텍스트 색상
                backgroundColor:	'#a1b56c',	// 일정 요소의 배경 색상
                dragBackgroundColor:	'#a1b56c',	// 일정 요소를 드래그했을 때 배경 색상
                borderColor:	'#000',     	// 일정 요소의 좌측 테두리 색상
                // customStyle:	{},	            // 일정 요소에 적용할 스타일. CSS 카멜케이스 프로퍼티를 가진 자바스크립트 객체이다.
                // raw:	null,	                // 실제 일정 데이터
            };
            vm.$refs.dialog_scheduled.open('add', schedule, (schedule) => {
                if(schedule) {
                    vm.calendar.createEvents([schedule]);  // 한개 이상의 캘린더 이벤트를 생성한다.
                }
                vm.calendar.clearGridSelections();     // 현재 캘린더에 표시된 모든 날짜/시간 선택 엘리먼트를 제거한다
            });
        });

        // 기본 일정 생성/수정 팝업에서 저장(Save) 버튼을 누르거나 이벤트를 드래그 앤 드랍했을 때 발생
        calendar.on('beforeUpdateEvent', ( { event, changes }) => {
            vm.$q.loading.show();
            let start = vm.$c.formatDate(changes.start);
            let end = vm.$c.formatDate(changes.end);
            let schedule = vm.$c.tempObj(event);
            schedule.start = start;
            schedule.end = end;
            let scheduleId = event.id;
            axios.put(`/api/schedules/${scheduleId}`, {
                params: {
                    schedule,
                }
            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    alert(data.message);
                } else {
                    if(Object.prototype.hasOwnProperty.call(data, "error") == true) {
                        vm.$store.setError(vm.formError, data.error);
                    }
                    if(Object.prototype.hasOwnProperty.call(data, "message") == true) {
                        alert(data.message);
                    }
                }
                vm.$q.loading.hide();
            });
            vm.calendar.updateEvent(event.id, event.calendarId, changes);
        });
        
        // 이벤트를 클릭할 때 발생
        calendar.on('clickEvent', ({ event }) => {
            vm.$refs.dialog_scheduled.open('edit', event, (schedule, type) => {
                if(type == 'edit') {
                    vm.calendar.updateEvent(schedule.id, schedule.calendarId, schedule);
                } else if (type == 'delete') {
                    vm.calendar.deleteEvent(schedule.id, schedule.calendarId);
                }
                
            });
        });
        // 월간 뷰의 각 셀마다 이벤트 갯수가 초과되어 나타난 'More' 버튼을 클릭할 때 발생
        calendar.on('clickMoreEventsBtn', (event) => {
            console.log(event.date, event.target);
        });
        vm.calendar = calendar;
        vm.loadScheduleList();
    },
}
</script>
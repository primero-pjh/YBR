<template>
    <div id="homeVue" style="height: 100%;">
        <div>
            <div id="calendar" style="height: 600px; border: 1px solid #eee;"></div>
        </div>
        <dialog_scheduled ref="dialog_scheduled" />
    </div>
</template>

<script>

import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';
// import 'tui-calendar/dist/tui-calendar.css';
// import 'tui-date-picker/dist/tui-date-picker.css';
// import 'tui-time-picker/dist/tui-time-picker.css';
import dialog_scheduled from '@/components/dialog_scheduled.vue';

export default {
    name: 'homeVue',
    components: {
        dialog_scheduled,
    },
    data() {
        return {
            calendar: null,
        }
    },
    methods: {
        
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
                    calendar.createEvents([schedule]);  // 한개 이상의 캘린더 이벤트를 생성한다.
                }
                calendar.clearGridSelections();     // 현재 캘린더에 표시된 모든 날짜/시간 선택 엘리먼트를 제거한다
            });
        });

        // calendar.on('beforeUpdateEvent', event => {
        //     const {schedule, changes} = event;
        //     console.log("beforeUpdateEvent");
        //     console.log(schedule, changes);
        //     // calendar.updateSchedule(schedule.id, schedule.calendarId, changes);
        // });
        
        // 이벤트를 클릭할 때 발생
        calendar.on('clickEvent', ({ event }) => {
            vm.$refs.dialog_scheduled.open('edit', event, function() {

            });
        });
        // 월간 뷰의 각 셀마다 이벤트 갯수가 초과되어 나타난 'More' 버튼을 클릭할 때 발생
        calendar.on('clickMoreEventsBtn', (event) => {
            console.log(event.date, event.target);
        });
        
        //category : 일정 종류 ('time', 'allday', 'milestone', 'task')
        calendar.createEvents([
            {
                id: '1',
                calendarId: 'cal1',
                title: '가족 영양',
                category: 'time',
                start: '2023-06-20T10:30:00',
                end: '2023-06-20T11:30:00',
                color: 'black',
                bgColor: 'red',
                borderColor: 'red',
                // isVisible: true,
                isPrivate: true,
            },
            {
                id: '2',
                calendarId: 'cal1',
                category: 'time',
                title: '소프트웨어 개론 레포트 제출',
                start: '2023-06-20T14:30:00',
                end: '2023-06-21T16:30:00',
                isPrivate: true,
                // isReadOnly: true // schedule is read-only
            },
        ]);
        calendar.render();
        calendar.clearGridSelections();
        vm.calendar = calendar;
    },
}
</script>
<template>
    <div id="calendarVue" style="height: 100%;">
        <div style="display: flex; align-items: center; justify-content: start;" 
            class="q-pa-md shadow-2 q-my-md">
            <div class="q-mr-md">
                <q-btn-group>
                    <q-btn dense style="width: 50px;" label="월" 
                        :color="(view_type=='month')?'primary':'white'"
                        :text-color="(view_type=='month')?'white':'black'" 
                        @click="changeViewType('month')" />
                    <q-btn dense style="width: 50px;" label="주" 
                        :color="(view_type=='week')?'primary':''" 
                        :text-color="(view_type=='week')?'white':'black'" 
                        @click="changeViewType('week')" />
                    <q-btn dense style="width: 50px;" label="일" 
                        :color="(view_type=='day')?'primary':''" 
                        :text-color="(view_type=='day')?'white':'black'" 
                        @click="changeViewType('day')" />
                </q-btn-group>
            </div>
            <div class="q-mr-md">
                <q-btn dense icon="chevron_left" outline @click="move_date(-1)"></q-btn>
            </div>
            <div class="q-mr-md">
                <div class="fkB ft24 q-px-md">{{ standard_date }}</div>
            </div>
            <div class="q-mr-md">
                <q-btn dense icon="chevron_right" outline @click="move_date(1)"></q-btn>
            </div>
            <div>
                <q-btn dense label="오늘" outline color="primary" class="fkR" 
                    style="width: 50px;"
                    @click="move_date(0)" />
            </div>
        </div>
        <div style="display:flex; justify-content: center; width: 100%;">
            <div style="width: 100%;">
                <div id="calendar" style="height: 600px; border: 1px solid #eee;"></div>
            </div>
            <div style="min-width: 200px;">
                <div class="fkR" style="border: 1px solid #eee;">
                    <div class="text-h6 text-center">
                        <div class="row q-py-sm q-px-md">
                            <div><span>캘린더 필터</span></div>
                            <q-space></q-space>
                            <q-btn icon="add" color="positive" dense flat>
                                <q-menu>
                                    <div class="q-pa-md">
                                        <div>
                                            <q-input dense label="카테고리" outlined
                                                v-model="classification.title"
                                                :error="formError.title?true:false"
                                                :error-message="formError.title" />
                                        </div>
                                        <div>
                                            <q-color v-model="classification.color" />
                                        </div>
                                    </div>
                                    <q-separator></q-separator>
                                    <div style="display: flex; justify-content: end;" class="q-pa-sm">
                                        <q-btn label="추가" outline color="positive" 
                                            @click="onAddClassification" v-close-popup />
                                    </div>
                                </q-menu>
                            </q-btn>
                        </div>
                        <q-separator />
                    </div>
                    
                    <div>
                        <q-list >
                            <template v-for="row, idx in classification_list" :key="idx"> 
                            <q-item clickable>
                                <q-item-section @click="selectClassification(row)">
                                    <div style="display: flex; align-items: center;">
                                        <div class="q-mr-md">
                                            <div style="border: 1px solid grey; border-radius: 15px;
                                                width: 15px; height: 15px;"
                                                :style="{backgroundColor: row.isSelected ? row.color : 'white'}">
                                            </div>
                                        </div>
                                        <div class="ft16">
                                            {{ row.title }}
                                        </div>
                                    </div>
                                </q-item-section>
                                <q-item-section side>
                                    <q-btn icon="close" flat dense @click="onDeleteClassification(row)"/>
                                </q-item-section>
                            </q-item>
                            </template>
                        </q-list>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import axios from "axios";
import Calendar from '@toast-ui/calendar';
import '@toast-ui/calendar/dist/toastui-calendar.min.css';


export default {
    name: 'calendarVue',
    components: {
    },
    computed: {
        classification_list() {
            return this.$store.state.classification_list;
        },
        classification_dict() {
            return this.$store.state.classification_dict;
        },
        classification_id_dict() {
            return this.$store.state.classification_id_dict;
        },
    },
    data() {
        return {
            view_type: 'month', 
            standard_date: '',
            is_check: false,
            calendar: null,
            schedule_list: [],

            classification: {
                title: '',
                color: '',
            },
            formError: {
                title: '',
            },
        }
    },
    methods: {
        /* classification */
        onAddClassification() {
            let vm = this;
            vm.$q.loading.show();
            let coupleInfoId = vm.$store.state.user.coupleInfoId;
            vm.$store.state.clearError(vm.formError);
            axios.post(`/api/couple/${coupleInfoId}/schedules-classifications`, {
                title: vm.classification.title,
                color: vm.classification.color,
            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    vm.$q.notify({
                        icon: 'check',
                        color: 'positive',
                        message: data.message,
                    });
                    vm.loadScheduleClassificationList();
                } else {
                    if(Object.prototype.hasOwnProperty.call(data, "error") == true) {
                        vm.$store.state.setError(vm.formError, data.error);
                    }
                    if(Object.prototype.hasOwnProperty.call(data, "message") == true) {
                        vm.$q.notify({
                            icon: 'error',
                            color: 'negative',
                            message: data.message,
                        });
                    }
                }
                vm.$q.loading.hide();
            });
        },  
        onDeleteClassification(row) {
            let vm = this;
            let coupleInfoId = vm.$store.state.user.coupleInfoId;
            let coupleScheduleClassificationId = row.coupleScheduleClassificationId;
            axios.delete(`/api/couple/${coupleInfoId}/schedules-classifications/${coupleScheduleClassificationId}`).then((res) => {
                let data = res.data;
                if(data.success) {
                    vm.$q.notify({
                        icon: 'check',
                        color: 'positive',
                        message: data.message,
                    });
                    vm.loadScheduleClassificationList();
                } else {
                    vm.$q.notify({
                        icon: 'close',
                        color: 'negative',
                        message: data.message,
                    });
                }
            });
        },  

        /* select */
        selectClassification(row) {
            let vm = this;
            row.isSelected = !row.isSelected;
            vm.calendar.setCalendarVisibility(String(row.coupleScheduleClassificationId), row.isSelected);
        },  
        /* change */
        changeViewType(view_type) {
            let vm = this;
            vm.view_type = view_type;
            vm.calendar.changeView(view_type);
        },  

        /* function */
        move_date(num) {
            let vm = this;
            if(num == -1) {
                vm.calendar.prev();
            } else if (num == 0) {
                vm.calendar.today();
            } else if (num == 1) {
                vm.calendar.next();
            }
            let date = vm.$c.formatDate(vm.calendar.getDate(), "date");
            vm.standard_date = date.slice(0, 7);
        },

        /* load */
        loadScheduleList() {
            let vm = this;
            vm.$q.loading.show();
            let coupleInfoId = vm.$store.state.user.coupleInfoId;
            axios.get(`/api/couple/${coupleInfoId}/schedules`, {}).then((res) => {
                let data = res.data;
                if(data.success) {
                    let row = data.sche_list;
                    row.map((x) => {
                        x.isAllday = x.isAllday ? true : false;
                        x.attendees = JSON.parse(x.attendees);
                        x["backgroundColor"] = vm.classification_dict[x.classification]?.color;
                        x["dragBackgroundColor"] = vm.classification_dict[x.classification]?.color;
                    });
                    vm.calendar.createEvents(row);
                    vm.schedule_list = row;
                }
                vm.$q.loading.hide();
            });
            vm.calendar.render();
            vm.calendar.clearGridSelections();
        },
        loadSchedule(id) {
            let vm = this;
            let coupleInfoId = vm.$store.state.user.coupleInfoId;
            axios(`/api/couple/${coupleInfoId}/schedules/${id}`, {}).then((res) => {
                let data = res.data;
                if(data.success) {
                    let schedule = data.schedule;
                    schedule.isAllday = schedule.isAllday ? true : false;
                    vm.$root.$refs.dialog_scheduled.open('edit', schedule, (schedule, type) => {
                        if(type == 'edit') {
                            vm.calendar.updateEvent(schedule.id, schedule.calendarId, schedule);
                        } else if (type == 'delete') {
                            vm.calendar.deleteEvent(schedule.id, schedule.calendarId);
                        }
                    });
                }
            });
        },
    },
    created() {
        let vm = this;
    },  
    mounted: function() {
        let vm = this;
        let date = new Date();
        vm.standard_date = `${date.getFullYear()}-${(date.getMonth()+1)>=10?(date.getMonth()+1):'0'+(date.getMonth()+1)}`;
        const calendar = new Calendar('#calendar', {
            defaultView: 'month',
            isReadOnly: false,
            useDetailPopup: false,
            usageStatistics: false,
            useFormPopup: false,
            // gridSelection: false,
        });
        calendar.clearGridSelections();    
        // 특정 날짜 혹은 시간을 드래그 앤 드랍했을 때 발생
        calendar.on('selectDateTime', (info) => {
            let schedule = {
                id: 0,                          //	일정 ID
                calendarId: '100011',           // 캘린더 ID
                title: '',                      // 일정 제목
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
                backgroundColor: '#C10015',	    // 일정 요소의 배경 색상
                dragBackgroundColor: '#C10015',	// 일정 요소를 드래그했을 때 배경 색상
                borderColor:	'#000',     	// 일정 요소의 좌측 테두리 색상
                classification: '기념일',       // 일정의 분류(필터)
                // customStyle:	{},	            // 일정 요소에 적용할 스타일. CSS 카멜케이스 프로퍼티를 가진 자바스크립트 객체이다.
                // raw:	null,	                // 실제 일정 데이터
            };
            vm.$root.$refs.dialog_scheduled.open('add', schedule, (scheduleData) => {
                if(scheduleData) {
                    vm.schedule_list.push(scheduleData);
                    vm.calendar.createEvents([scheduleData]);  // 한개 이상의 캘린더 이벤트를 생성한다.
                }
                // 현재 캘린더에 표시된 모든 날짜/시간 선택 엘리먼트를 제거한다
                vm.calendar.clearGridSelections();    
            });
        });

        // 기본 일정 생성/수정 팝업에서 저장(Save) 버튼을 누르거나 이벤트를 드래그 앤 드랍했을 때 발생
        calendar.on('beforeUpdateEvent', ( { event, changes }) => {
            // vm.$q.loading.show();
            const { id, calendarId } = event;
            let end = vm.$c.formatDate(changes.end);
            let schedule = vm.$c.tempObj(event);
            let scheduleId = event.id;
            schedule["classification"] = vm.classification_id_dict[event.calendarId].title;
            // drag
            if(Object.keys(changes).length == 1) {
                let start = vm.$c.formatDate(event.start);
                schedule.start = start;
                schedule.end = end;
            } else {
                let start = vm.$c.formatDate(changes.start);
                schedule.start = start;
                schedule.end = end;
            }
            axios.put(`/api/schedules/${scheduleId}`, {
                params: {
                    schedule,
                }
            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    vm.$q.notify({
                        icon: 'check',
                        color: 'positive',
                        message: data.message
                    });
                } else {
                    if(Object.prototype.hasOwnProperty.call(data, "error") == true) {
                        vm.$store.setError(vm.formError, data.error);
                    }
                    if(Object.prototype.hasOwnProperty.call(data, "message") == true) {
                        vm.$q.notify({
                            icon: 'close',
                            color: 'negative',
                            message: data.message
                        });
                    }
                }
                vm.$q.loading.hide();
            });
            vm.calendar.updateEvent(event.id, event.calendarId, changes);
        });
        
        // 이벤트를 클릭할 때 발생
        calendar.on('clickEvent', ({ event }) => {
            const { id, calendarId } = event;
            console.log("event:", event);
            let temp = vm.schedule_list.find(x=>x.id == id);
            if(temp && temp.classification) {
                event["classification"] = temp.classification;
            }
            event["prevCalendarId"] = event.calendarId;
            vm.$root.$refs.dialog_scheduled.open('edit', event, (schedule, type) => {
                if(schedule && schedule.classification) {
                    schedule["backgroundColor"] = vm.classification_dict[schedule.classification].color;
                    schedule["dragBackgroundColor"] = vm.classification_dict[schedule.classification].color;
                }
                if(type == 'edit') {
                    vm.schedule_list.find(x=>x.id == id).classification = schedule.classification;
                    vm.calendar.updateEvent(schedule.id, schedule.prevCalendarId, schedule);
                } else if (type == 'delete') {
                    vm.calendar.deleteEvent(schedule.id, schedule.calendarId);
                }
            });
        });
        // 월간 뷰의 각 셀마다 이벤트 갯수가 초과되어 나타난 'More' 버튼을 클릭할 때 발생
        // calendar.on('clickMoreEventsBtn', (event) => {
        //     console.log(event.date, event.target);
        // });
        vm.calendar = calendar;
        if(Object.prototype.hasOwnProperty.call(vm.$router.currentRoute.value.params, "id")) {
            let id = vm.$router.currentRoute.value.params.id;
            if(id == 0) {
                vm.loadScheduleList();
            } else {
                vm.loadScheduleList();
                vm.loadSchedule(id);
            }
        }
    },
}
</script>
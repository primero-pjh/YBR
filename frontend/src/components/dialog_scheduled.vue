<template>
    <q-dialog v-model="isOpen" :position="position" full-height persistent>
        <q-card class="column full-height" style="min-width: 600px; height: calc(100% - 72px);" >
            <q-card-section>
                <div style="display: flex; justify-content: space-between;">
                    <q-btn dense icon="close" flat @click="onClose" />
                    <div class="text-h6 text-center">일정 {{ schedule.id > 0 ? '수정' : '생성'}}</div>
                    <div></div>
                </div>
                
            </q-card-section>
            <q-separator />
            <q-card-section class="col q-pt-none">
                <div style="width: 100%;">
                    <q-select dense v-model="schedule.classification" :options="classification_list" label="분류" />
                    <q-input dense label="일정 제목 *" v-model="schedule.title" label-color="red" @keyup.enter="onSave" />
                    <q-input v-if="isDetail" dense label="일정 내용" v-model="schedule.body" type="textarea" 
                        placeholder="500자 내로 작성하세요." />
                    
                    <q-input dense label="일정 장소" v-model="schedule.location" @keyup.enter="onSave" />
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <div style="display: flex;">
                            <template v-if="schedule.isAllday == false">
                                <q-input outline dense v-model="schedule.start" style="width: 200px;" class="q-mr-sm">
                                    <template v-slot:prepend>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="schedule.start" mask="YYYY-MM-DD HH:mm">
                                                    <div class="row items-center justify-end">
                                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                                    </div>
                                                </q-date>
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
        
                                    <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                <q-time v-model="schedule.start" mask="YYYY-MM-DD HH:mm" format24h>
                                                    <div class="row items-center justify-end">
                                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                                    </div>
                                                </q-time>
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                                <q-input outline dense v-model="schedule.end" style="width: 200px;">
                                    <template v-slot:prepend>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="schedule.end" mask="YYYY-MM-DD HH:mm">
                                                    <div class="row items-center justify-end">
                                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                                    </div>
                                                </q-date>
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
        
                                    <template v-slot:append>
                                        <q-icon name="access_time" class="cursor-pointer">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                <q-time v-model="schedule.end" mask="YYYY-MM-DD HH:mm" format24h>
                                                    <div class="row items-center justify-end">
                                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                                    </div>
                                                </q-time>
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </template>
                            <template v-else>
                                <q-input dense outline v-model="schedule.start" class="q-mr-sm">
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="schedule.start" mask="YYYY-MM-DD">
                                                    <div class="row items-center justify-end">
                                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                                    </div>
                                                </q-date>
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                                <q-input dense outline v-model="schedule.end">
                                    <template v-slot:append>
                                        <q-icon name="event" class="cursor-pointer">
                                            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                                                <q-date v-model="schedule.end" mask="YYYY-MM-DD">
                                                    <div class="row items-center justify-end">
                                                        <q-btn v-close-popup label="Close" color="primary" flat />
                                                    </div>
                                                </q-date>
                                            </q-popup-proxy>
                                        </q-icon>
                                    </template>
                                </q-input>
                            </template>
                        </div>
                        <div>
                            <q-checkbox v-model="schedule.isAllday" label="종일 여부" @update:model-value="onChangeAllDay" />
                        </div>
                    </div>
                    <div v-if="isDetail">
                        <q-input clearable  dense v-model="attend" label="참석자" @keyup.enter="onAddAttend" />
                        <q-list>
                            <q-item v-for="row,idx in schedule.attendees" :key="idx">
                                <q-item-section>
                                    <q-chip :label="row" removable @remove="onRemoveAttend(idx)" />            
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                </div>
            </q-card-section>
            <q-space></q-space>
            <q-card-section align="right">
                <q-btn outline :label="'옵션 ' + (isDetail?'닫기':'더보기')" class="q-mr-sm" @click="isDetail=!isDetail" />
                <q-btn outline color="negative" label="삭제" class="q-mr-sm" v-if="schedule.id > 0" @click="onDelete" />
                <q-btn outline color="positive" label="저장" v-if="schedule.id > 0" @click="onSave" />
                <q-btn outline color="positive" label="추가" v-else @click="onAdd" />
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<script>
import axios from 'axios';

export default {
    name: 'dialog_scheduled',
    data() {
        return {
            position: 'right',
            isOpen: false,
            isDetail: false,
            callback: null,
            attend: '',
            classification_list: [
                { label: '기본', value: 'default', color: 'black', },
                { label: '친구', value: 'friend', color: 'green', },
                { label: '가족', value: 'family', color: 'pink', },
            ],
            schedule: {
                id: 0,                          // 일정 ID
                calendarId: '',                 // 캘린더 ID
                classification: 'default',      // 분류
                title: '',                      // 일정 제목
                body: '',                       // 일정 내용
                isAllday: false,                // 종일 일정 여부
                start: '',                      // 일정이 시작하는 일시.
                end: '',                        // 일정이 끝나는 일시
                location: '',                   // 일정 장소
                attendees: [],                  // 일정 참석자 목록
                category: 'time',               // 일정 카테고리. milestone, task, allday, time 중 하나이다.
                dueDateClass: '',               // task 일정 카테고리. 어떤 문자열도 가능하다.
                isVisible: true,                // 일정 표시 여부
                isPending: false,	            // 미정인 일정 여부
                isFocused: false,	            // 일정 강조 여부
                isReadOnly: false,	            // 수정 가능한 일정 여부
                isPrivate: false,	            // 개인적인 일정 여부
                color: '#000',	                // 일정 요소의 텍스트 색상
                backgroundColor: '#a1b56c',	    // 일정 요소의 배경 색상
                dragBackgroundColor: '#a1b56c',	// 일정 요소를 드래그했을 때 배경 색상
                borderColor: '#000',     	    // 일정 요소의 좌측 테두리 색상
                // customStyle: {},	            // 일정 요소에 적용할 스타일. CSS 카멜케이스 프로퍼티를 가진 자바스크립트 객체이다.
            },
            formError: {},
        }
    },
    methods: {
        setSchedule(schedule) {
            let vm = this;
            vm.schedule = schedule;
            vm.schedule.classification = '기본';
            vm.schedule.start = vm.$c.formatDate(schedule.start);
            vm.schedule.end = vm.$c.formatDate(schedule.end);
        },

        onRemoveAttend(idx) {
            let vm = this;
            vm.schedule.attendees.splice(idx, 1);
        },
        onAddAttend() {
            let vm = this;
            let text = vm.attend;
            vm.schedule.attendees.push(text);
            vm.attend = '';
        },  
        onChangeAllDay(args) {
            let vm = this;
            vm.$nextTick(() => {
                // 종일 여부 체크 : YYYY-MM-DD
                if(args == true) {
                    vm.schedule.start = vm.schedule.start.slice(0, 11);
                    vm.schedule.end = vm.schedule.end.slice(0, 11);
                } 
                // 종일 여부 체크해제 : YYYY-MM-DD HH:mm:ss
                else {
                    vm.schedule.start = vm.schedule.start + " 00:00:00";
                    vm.schedule.end = vm.schedule.end + " 00:00:00";
                }
            });
        },
        onClose() {
            let vm = this;
            vm.isOpen = false;
            if(vm.callback) { vm.callback(); }
        },
        
        open(mode, scheduleData, callback) {
            let vm = this;
            vm.mode = mode;
            vm.setSchedule(scheduleData);
            if(callback) { vm.callback = callback; }
            vm.isOpen = true;
        },

        onAdd() {
            let vm = this;
            vm.$q.loading.show();
            axios.post(`/api/schedules`, {
                params: {
                    schedule: vm.schedule,
                }
            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    vm.callback(vm.schedule);
                }
                vm.$q.loading.hide();
                vm.isOpen = false;
            });
        },
        onSave() {
            let vm = this;
            vm.$q.loading.show();
            let scheduleId = vm.schedule.id;
            axios.put(`/api/schedules/${scheduleId}`, {
                params: {
                    schedule: vm.schedule,
                }
            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    vm.callback(vm.schedule, 'edit');
                } else {
                    if(Object.prototype.hasOwnProperty.call(data, "error") == true) {
                        vm.$store.setError(vm.formError, data.error);
                    }
                    if(Object.prototype.hasOwnProperty.call(data, "message") == true) {
                        alert(data.message);
                    }
                }
                vm.$q.loading.hide();
                vm.isOpen = false;
            });
        },
        onDelete() {
            let vm = this;
            vm.$q.loading.show();
            let scheduleId = vm.schedule.id;
            axios.delete(`/api/schedules/${scheduleId}`, {}).then((res) => {
                let data = res.data;
                if(data.success) {
                    vm.callback(vm.schedule, 'delete');
                } else {
                    if(Object.prototype.hasOwnProperty.call(data, "error") == true) {
                        vm.$store.setError(vm.formError, data.error);
                    }
                    if(Object.prototype.hasOwnProperty.call(data, "message") == true) {
                        alert(data.message);
                    }
                }
                vm.$q.loading.hide();
                vm.isOpen = false;
            });
        },
    },
    mounted() {
    }
}
</script>
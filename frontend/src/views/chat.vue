<template>
    <div id="chatVue" style="height: 100%;">
        <div>
            <div style="display: flex;" class="q-pa-md">
                <div style="min-width: 250px;" class="q-mr-md">
                    <q-input v-model="search" readonly filled dense placeholder="검색할 유저를 입력하세요.">
                        <template v-slot:append>
                            <q-icon name="search" />
                        </template>
                    </q-input>
                    <q-list bordered>
                        <q-item clickable v-ripple v-if="coupleChat">
                            <q-item-section>
                                <q-item-label>
                                    <div class="fkR ft20">
                                        <q-item dense>
                                            <q-item-section side>
                                                <q-avatar rounded size="48px">
                                                    <q-img :src="$store.state.host + couple.image" style="border-radius: 15px;"/>
                                                    <q-badge floating color="positive" rounded v-if="couple.socketId" />
                                                    <q-badge floating color="negative" rounded v-else />
                                                </q-avatar>
                                            </q-item-section>
                                            <q-item-section>
                                                <q-item-label>{{couple.userName}}</q-item-label>
                                            </q-item-section>
                                        </q-item>
                                    </div>
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
                <div style="width: 100%; " class="shadow-2">
                    <div>
                        <div class="q-pa-md" style="">
                            <q-scroll-area style="height: 500px; width: 100%;" 
                                :style="{height: $store.state.height - 280 + 'px'}"
                                class="q-px-md"
                                @scroll="onScroll"
                                ref="chat_scroll">
                                <div v-if="$store.state.user && couple && msg_list.length > 0">
                                    <template v-for="(row, idx) in msg_list" :key="idx">
                                        <template v-if="row.isSent">
                                            <q-chat-message 
                                                class="fkR"
                                                :avatar="$store.state.host + $store.state.user.image"
                                                :text="row.content"
                                                :stamp="row.timeView"
                                                sent
                                                bg-color="amber-7"
                                            />
                                        </template>
                                        <template v-else>
                                            <q-chat-message class="fkR"
                                                :name="couple.userName"
                                                :avatar="$store.state.host + couple.image"
                                                :text="row.content"
                                                :stamp="row.timeView"
                                                text-color="white" bg-color="primary">
                                            </q-chat-message>
                                        </template>
                                    </template>
                                    <q-chat-message class="fkR" v-if="isSending"
                                        :name="couple.userName"
                                        :avatar="$store.state.host + couple.image"
                                        text-color="white" bg-color="primary">
                                        <q-spinner-dots size="2rem" />
                                    </q-chat-message>
                                </div>
                                <div style="position: fixed; right: 5px; bottom: 5px;" v-if="isShowDownSRLBTN">
                                    <q-btn icon="expand_more" dense outline @click="onMoveChatScroll(1.0)"></q-btn>
                                </div>
                            </q-scroll-area>
                        </div>
                        <q-separator></q-separator>
                        <q-input v-model="form.content" filled class="fkR ft20"
                            placeholder="Send to Message..."
                            @focus="onFocusMessage"
                            @blur="onBlurMessage"
                            @keyup.enter="onSend">
                            <!-- <template v-slot:prepend>
                                <q-btn icon="add_circle_outline" flat size="lg"></q-btn>
                            </template> -->
                            <template v-slot:append>
                                <q-btn icon="send" flat class="cursor-pointer" 
                                    :disable="form.content?false:true"
                                    :color="form.content?'primary':'black'"
                                    @click="onSend"/>
                            </template>
                        </q-input>
                    </div>
                    
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>

import axios from 'axios';

export default {
    name: 'chatVue',
    components: {
    },
    data() {
        return {
            msg_dict: new Object(),

            coupleChat: null,
            selectChatInfo: null,
            selectChatMember: [],

            isSending: false,
            isShowDownSRLBTN: false,
            couple: null,
            search: '',
            msg_list: [],
            form: {
                content: '',
            }
        }
    },
    methods: {
        /* 입력에 따른 scroll percentage 변화 */
        onMoveChatScroll(num) {
            let vm = this;
            setTimeout(() => {
                // let chat_scroll = vm.$refs.chat_scroll.getScroll();
                // vm.$refs.chat_scroll.setScrollPosition('vertical', chat_scroll.verticalSize, 50);
                if(Object.prototype.hasOwnProperty.call(vm.$refs, "chat_scroll")) {
                    vm.$refs.chat_scroll.setScrollPercentage('vertical', num, 50);
                }
            }, 500);
        },

        onFocusMessage() {
            let vm = this;
            vm.$store.state.socket.emit(`/socket/chat/event/focus`, {
                socketId: vm.$store.state.couple.socketId,
            });
        },
        onBlurMessage() {
            let vm = this;
            vm.$store.state.socket.emit(`/socket/chat/event/blur`, {
                socketId: vm.$store.state.couple.socketId,
            });
        },

        /* scroll event */
        onScroll(args1) {
            let vm = this;
            vm.isShowDownSRLBTN = args1.verticalPercentage == 1 ? false : true;
        },
        /* send message */
        onSend() {
            let vm = this;
            if(!vm.form.content) { return; }
            vm.$store.state.socket.emit(`/socket/chat/message/send`, {
                chatInfoId: vm.selectChatInfo.chatInfoId,
                content: vm.form.content,
                UID: vm.$store.state.UID,
            }, (data) => {
                if(data.success) {
                    vm.form.content = '';
                    // data.message["isSent"] = true;
                    // data.message["timeView"] = vm.setTimeView(data.message.dateAdded);
                    // vm.msg_list.push(data.message);
                    vm.pushMessage(data.message, true);
                    vm.onMoveChatScroll(1.0);
                }
            });
        },

        /* load chat rooms */
        onLoadChatRooms() {
            let vm = this;
            axios.all([
                axios.get(`/api/user/chat/rooms`, {
                    params: {
                        type: 'couple',
                    }
                }),
                axios.get(`/api/user/chat/rooms`, {
                    params: {
                        type: 'groups',
                    }
                })
            ])
            .then(axios.spread((res1, res2) => {
                let data1 = res1.data;
                if(data1.success) {
                    vm.coupleChat = data1.room;
                    vm.selectChatInfo = vm.coupleChat;
                    vm.onLoadMessage(vm.coupleChat.chatInfoId);
                }
                let data2 = res2.data;
            }));
        },

        setDateView(date_time) {
            let date = new Date(date_time);
            return `${date.getFullYear()}${date.getMonth()}${date.getDate()} ${date.getHours()}${date.getMinutes()}`;
        },
        setTimeView(date_time) {
            let date = new Date(date_time);
            let hours = date.getHours();
            let min = date.getMinutes();
            let time = `${hours < 10 ? '0' + hours : hours}:${min < 10 ? '0' + min : min}`;
            return time;
        },

        /* msg log load */
        onLoadMessage(chatInfoId) {
            let vm = this;
            vm.$q.loading.show();
            axios.get(`/api/user/chat/${chatInfoId}`, {}).then((res) => {
                let data = res.data;
                if(data.success) {
                    let row = data.msg_list;
                    let dict = new Object();
                    let UID = vm.$store.state.UID;
                    let msg_list = new Array();
                    row.map((x) => {
                        x["dateView"] = vm.setDateView(x.dateAdded);
                        x["timeView"] = vm.setTimeView(x.dateAdded);
                        x["isSent"] = x.senderUID == UID ? true : false;
                    });
                    if(row.length > 0) {
                        msg_list.push({
                            dateView: row[0].dateView,
                            timeView: row[0].timeView,
                            isSent: row[0].isSent,
                            content: [row[0].content],
                        });
                        let prev_key = `${row[0].dateView}/${row[0].isSent}`;
                        for(let i=1; i<row.length; i++) {
                            let key = `${row[i].dateView}/${row[i].isSent}`;
                            if(prev_key == key) {
                                msg_list[msg_list.length - 1].content.push(row[i].content);
                            } else {
                                msg_list.push({
                                    dateView: row[i].dateView,
                                    timeView: row[i].timeView,
                                    isSent: row[i].isSent,
                                    content: [row[i].content],
                                });
                                prev_key = `${row[i].dateView}/${row[i].isSent}`;
                            }
                        }
                    }

                    vm.msg_list = msg_list;
                    vm.onMoveChatScroll(1.0);
                }
                vm.$q.loading.hide();
            });
        },

        pushMessage(message, isSent) {
            let vm = this;
            message["isSent"] = isSent;
            message["timeView"] = vm.setTimeView(message.dateAdded);
            message["dateView"] = vm.setDateView(message.dateAdded);
            let last_msg = vm.msg_list[vm.msg_list.length-1];
            let prev_key = `${last_msg.dateView}/${last_msg.isSent}`;
            let key = `${message.dateView}/${isSent}`;
            if(prev_key == key) {
                vm.msg_list[vm.msg_list.length-1].content.push(message.content);
            } else {
                vm.msg_list.push({
                    isSent,
                    timeView: message.timeView,
                    dateView: message.dateView,
                    content: [message.content],
                })
            }
        }
    },
    mounted: function() {
        let vm = this;
        vm.$store.commit("addChatCount", 0);
        vm.onLoadChatRooms();
        vm.couple = vm.$store.state.couple;
        // vm.$nextTick(() => {
        //     vm.onMoveChatScroll(1.0);
        // });
        vm.$store.state.socket.on(`/client/chat/event/focus`, (data) => {
            vm.isSending = true;
            vm.onMoveChatScroll(1.0);
        });
        vm.$store.state.socket.on(`/client/chat/event/blur`, (data) => {
            vm.isSending = false;
            vm.onMoveChatScroll(1.0);
        });
        vm.$store.state.socket.on(`/client/chat/message/send`, (data) => {
            vm.pushMessage(data.message, false);
            // data.message["isSent"] = false;
            // data.message["timeView"] = vm.setTimeView(data.message.dateAdded);
            // data.message["dateView"] = vm.setDateView(data.message.dateAdded);
            // vm.msg_list.push(data.message);
            vm.onMoveChatScroll(1.0);
        });
    },
    unmounted() {
        this.$store.state.socket.off(`/client/chat/event/focus`);
        this.$store.state.socket.off(`/client/chat/event/blur`);
        this.$store.state.socket.off(`/client/chat/message/send`);
    }
}
</script>
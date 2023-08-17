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
                        <q-item clickable v-ripple v-if="couple">
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
                            <q-scroll-area style="height: 500px; width: 100%;" :style="{height: $store.state.height - 280 + 'px'}"
                                visible
                                @scroll="onScroll"
                                ref="chat_scroll">
                                <div v-if="$store.state.user && couple">
                                    <q-chat-message v-for="row, idx in 50" :key="idx"
                                        :avatar="$store.state.host + $store.state.user.image"
                                        :text="['hey, how are you?', 'hey2hey2']"
                                        stamp="7분전"
                                        sent
                                        bg-color="amber-7"
                                    />
                                    <q-chat-message 
                                        :name="couple.userName"
                                        :avatar="$store.state.host + couple.image"
                                        :text="['doing fine, how r you?']"
                                        stamp="4분전" text-color="white" bg-color="primary">
                                        <q-spinner-dots size="2rem" />
                                    </q-chat-message>
                                </div>
                                <div style="position: fixed; right: 5px; bottom: 5px;" v-if="isShowDownSRLBTN">
                                    <q-btn icon="expand_more" dense outline @click="onMoveChatScroll(1.0)"></q-btn>
                                </div>
                            </q-scroll-area>
                            
                            
                        </div>
                        <q-separator></q-separator>
                        <q-input v-model="form.msg" filled class="fkR ft20"
                            @keyup.enter="onSend">
                            <!-- <template v-slot:prepend>
                                <q-btn icon="add_circle_outline" flat size="lg"></q-btn>
                            </template> -->
                            <template v-slot:append>
                                <q-icon name="send" class="cursor-pointer" @click="onSend"/>
                            </template>
                        </q-input>
                    </div>
                    
                    
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'chatVue',
    components: {
    },
    data() {
        return {
            isShowDownSRLBTN: false,
            couple: null,
            search: '',
            msg_list: [],
            form: {
                msg: '',
            }
        }
    },
    methods: {
        /* 입력에 따른 scroll percentage 변화 */
        onMoveChatScroll(num) {
            let vm = this;
            vm.$nextTick(() => {
                vm.$refs.chat_scroll.setScrollPercentage('vertical', num, 50);
            });
        },
        /* scroll event */
        onScroll(args1) {
            let vm = this;
            vm.isShowDownSRLBTN = args1.verticalPercentage == 1 ? false : true;
        },
        onSend() {
            let vm = this;
            vm.form.msg = '';
            vm.$store.state.socket.emit(`/socket/message/send`, {
                couple: vm.couple,
                msg: vm.form.msg,
            }, (data) => {
                console.log("data:", data);
            });
        },
        onLoad() {
            let vm = this;

        },
        
    },
    mounted: function() {
        let vm = this;
        vm.couple = vm.$store.state.couple;
        vm.$nextTick(() => {
            vm.onMoveChatScroll(1.0);
        });
    },
}
</script>
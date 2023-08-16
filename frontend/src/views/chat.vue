<template>
    <div id="chatVue" style="height: 100%;">
        <div>
            <div style="display: flex;">
                <div style="min-width: 250px;" class="q-pa-sm">
                    <q-input v-model="search" filled dense placeholder="검색할 유저를 입력하세요.">
                        <template v-slot:append>
                            <q-icon name="search"  />
                        </template>
                    </q-input>
                    <q-list bordered>
                        <q-item clickable v-ripple v-if="couple">
                            <q-item-section>
                                <q-item-label>
                                    <div class="fkR ft20" style="display: flex; justify-content: space-between;">
                                        <div>
                                            {{ couple.userName }}
                                        </div>
                                        <div>
                                            <q-badge color="positive" rounded v-if="couple.socketId" />
                                            <q-badge color="negative" rounded v-else />
                                        </div>
                                    </div>
                                </q-item-label>
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
                <div style="width: 100%;">
                    <q-chat-message
                        name="me"
                        avatar="https://cdn.quasar.dev/img/avatar1.jpg"
                        :text="['hey, how are you?', 'heyhey']"
                        stamp="7분전"
                        sent
                        bg-color="amber-7"
                    />
                    <q-chat-message name="Jane3"
                        avatar="https://cdn.quasar.dev/img/avatar5.jpg"
                        :text="['doing fine, how r you?']"
                        stamp="4분전"
                        text-color="white"
                        bg-color="primary"
                        >
                        <q-spinner-dots size="2rem" />
                    </q-chat-message>
                    <q-input dense v-model="form.msg"
                        @keyup.enter="onSend">
                        <template v-slot:append>
                            <q-icon name="send" class="cursor-pointer" @click="onSend"/>
                        </template>
                    </q-input>
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
            couple: null,
            search: '',
            msg_list: [],
            form: {
                msg: '',
            }
        }
    },
    methods: {
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
    },
    mounted: function() {
        let vm = this;
        vm.couple = vm.$store.state.couple;
    },
}
</script>
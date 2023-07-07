<template>
    <div id="homeVue" style="height: 100%;">
        <div>
            <div style="display: flex;">
                <div style="min-width: 250px;">
                    <q-item clickable v-ripple style="font-size: 24px;">
                        <q-item-section>
                            <q-item-label>Item with caption</q-item-label>
                            <q-item-label caption>Caption</q-item-label>
                        </q-item-section>
                    </q-item>
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
                    <q-input></q-input>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

export default {
    name: 'homeVue',
    components: {
    },
    data() {
        return {

        }
    },
    methods: {
        
    },
    mounted: function() {
        let vm = this;
    },
}
</script>
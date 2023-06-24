<template>
    <div id="homeVue" style="height: 100%;">
        <div>
            <div style="display: flex;">
                <div>
                    <q-item clickable v-ripple style="font-size: 24px;">
                        <q-item-section>
                            <q-item-label>Item with caption</q-item-label>
                            <q-item-label caption>Caption</q-item-label>
                        </q-item-section>
                    </q-item>
                </div>
                <div>
                    <q-chat-message
                        name="me"
                        avatar="https://cdn.quasar.dev/img/avatar1.jpg"
                        :text="['hey, how are you?']"
                        stamp="7 minutes ago"
                        sent
                        bg-color="amber-7"
                    />
                    <q-chat-message
                        name="Jane"
                        avatar="https://cdn.quasar.dev/img/avatar5.jpg"
                        :text="['doing fine, how r you?']"
                        stamp="4 minutes ago"
                        text-color="white"
                        bg-color="primary"
                    />
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
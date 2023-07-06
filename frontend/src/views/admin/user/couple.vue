<template>
    <div id="_coupleVue" style="height: 100%;">
        <div>
            <q-card>
                <q-card-section>
                    <div class="q-pa-md">
                        <p class="text-h5 fkR">커플</p>
                        <q-table class="my-sticky-header-table"
                            flat bordered
                            :rows="couple_list"
                            :columns="couple_columns"
                            row-key="UID"
                            v-model:pagination="pagination">
                            <template v-slot:body="props">
                                <q-tr :props="props">
                                    <q-td key="coupleInfoId" :props="props">
                                        {{ props.row.coupleInfoId }}
                                    </q-td>
                                    <q-td key="toUserName" :props="props">
                                        {{ props.row.toUserName }}
                                    </q-td>
                                    <q-td key="fromUserName" :props="props">
                                        {{ props.row.fromUserName }}
                                    </q-td>
                                    <q-td key="dateAdded" :props="props">
                                        {{ props.row.dateAdded }}
                                    </q-td>
                                    <q-td key="coupleInfoId" :props="props">
                                        <template v-if="props.row.coupleInfoId > 0">
                                            <q-badge color="green">O</q-badge>
                                        </template>
                                        <template v-else>
                                            <q-badge color="red">X</q-badge>
                                        </template>
                                    </q-td>
                                </q-tr>
                            </template>
                        </q-table>
                    </div>
                </q-card-section>
            </q-card>
        </div>
    </div>
</template>

<script>

import axios from "axios";
export default {
    name: '_coupleVue',
    components: {
    },
    data() {
        return {
            couple_columns: [
                { name: 'coupleInfoId', required: true, label: 'coupleInfoId', align: 'left' },
                { name: 'toUserName', label: '닉네임', field: 'toUserName', sortable: true },
                { name: 'fromUserName', label: '닉네임', field: 'fromUserName', sortable: true },
                { name: 'dateAdded', label: '등록일', field: 'dateAdded', sortable: true },
            ],
            couple_list: [],

            pagination: {
                sortBy: 'desc',
                descending: false,
                page: 1,
                rowsPerPage: 0,
            }
        }
    },
    methods: {
        load_user_list() {
            let vm = this;
            vm.$q.loading.show();
                axios.get(`/api/admin/couple`, {}).then((res) => {
                let data = res.data;
                if(data.success) {
                    let row = data.couple_list;
                    vm.couple_list = row;
                }
                vm.$q.loading.hide();
            });
        },
    },
    mounted: function() {
        let vm = this;
        vm.load_user_list();
    },
}
</script>
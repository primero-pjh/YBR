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
                                    <q-td key="btns" :props="props">
                                        <q-btn dense color="negative" @click="onClear(props.row)">
                                            등록해제
                                        </q-btn>
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
                { name: 'coupleInfoId', required: true, label: 'idx', align: 'left' },
                { name: 'toUserName', label: '닉네임', field: 'toUserName', sortable: true },
                { name: 'fromUserName', label: '닉네임', field: 'fromUserName', sortable: true },
                { name: 'dateAdded', label: '등록일', field: 'dateAdded', sortable: true },
                { name: 'btns', label: '버튼', field: 'btns', sortable: false },
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
        onClear(row) {
            let vm = this;
            let result =confirm("등록해제를 진행하시겠어요?");
            let coupleInfoId = row.coupleInfoId;
            if(result) {
                axios.delete(`/api/admin/couple/${coupleInfoId}`, {}).then((res) => {
                    let data = res.data;
                    if(data.success) {
                        vm.load_couple_list();
                        vm.$q.notify({
                            message: data.message,
                            position: 'bottom',
                            color: 'postive',
                        });
                    } else {
                        vm.$q.notify({
                            message: data.message,
                            position: 'bottom',
                            color: 'negative',
                        });
                    }
                })
            }
        },
        load_couple_list() {
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
        vm.load_couple_list();
    },
}
</script>
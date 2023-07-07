<template>
    <div id="_personVue" style="height: 100%;">
        <div>
            <q-card>
                <q-card-section>
                    <div class="q-pa-md">
                        <p class="text-h5 fkR">계정 확인</p>
                        <q-table class="my-sticky-header-table"
                            flat bordered
                            :rows="user_list"
                            :columns="user_columns"
                            row-key="UID"
                            v-model:pagination="pagination">
                            <template v-slot:body="props">
                                <q-tr :props="props">
                                    <q-td key="UID" :props="props">
                                        {{ props.row.UID }}
                                    </q-td>
                                    <q-td key="userId" :props="props">
                                        {{ props.row.userId }}
                                    </q-td>
                                    <q-td key="userName" :props="props">
                                        {{ props.row.userName }}
                                    </q-td>
                                    <q-td key="email" :props="props">
                                        {{ props.row.email }}
                                    </q-td>
                                    <q-td key="phoneNumber" :props="props">
                                        {{ props.row.phoneNumber }}
                                    </q-td>
                                    <q-td key="spousePhoneNumber" :props="props">
                                        {{ props.row.spousePhoneNumber }}
                                    </q-td>
                                    <q-td key="dateAdded" :props="props">
                                        {{ props.row.dateAdded }}
                                    </q-td>
                                    <q-td key="status" :props="props">
                                        {{ props.row.status }}
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
    name: '_personVue',
    components: {
    },
    data() {
        return {
            user_columns: [
                { name: 'UID', required: true, label: 'UID', align: 'left' },
                { name: 'userId', align: 'center', label: '아이디', field: 'userId', sortable: true },
                { name: 'userName', label: '닉네임', field: 'userName', sortable: true },
                { name: 'email', label: '이메일', field: 'email' },
                { name: 'phoneNumber', label: '휴대폰번호', field: 'phoneNumber' },
                { name: 'spousePhoneNumber', label: '커플번호', field: 'spousePhoneNumber' },
                { name: 'dateAdded', label: '등록일', field: 'dateAdded' },
                { name: 'status', label: '상태', field: 'status' },
                { name: 'coupleInfoId', label: 'coupleInfoId', field: 'coupleInfoId', },
            ],
            user_list: [],

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
                axios.get(`/api/admin/user`, {}).then((res) => {
                let data = res.data;
                if(data.success) {
                    let row = data.user_list;
                    vm.user_list = row;
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
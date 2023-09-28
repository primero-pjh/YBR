<template>
    <q-dialog v-model="isOpen" :position="position" full-height persistent>
        <q-card class="column full-height" style="min-width: 500px; height: calc(100% - 72px);" >
            <q-card-section>
                <div style="display: flex; justify-content: space-between;">
                    <q-btn dense icon="close" flat v-close-popup />
                    <div class="text-h6 text-center fkR">네이버 지도</div>
                    <div></div>
                </div>
            </q-card-section>
            <q-separator />
            <q-card-section class="col q-pt-none">
                <div>
                    <!-- <div class="q-mt-sm q-mb-md">
                        <q-input dense label="내 위치" filled readonly v-model="form.startAddress.location" />
                    </div> -->
                    <div class="q-mt-md q-mb-md">
                        <q-input dense label="도착위치" filled readonly v-model="form.endAddress.location" />
                    </div>
                    <div id="map" style="width:100%;height:400px;"></div>
                </div>
            </q-card-section>
            <q-separator />
            <q-card-section align="right">
                <q-btn outline label="닫기" class="q-mr-sm" v-close-popup />
            </q-card-section>
        </q-card>
        
    </q-dialog>
</template>

<script>

import axios from 'axios';

export default {
    name: 'dialog_naver_map',
    components: {
    },
    computed: {
    },
    data() {
        return {
            position: 'right',
            isOpen: false,
            callback: null,

            form: {
                startAddress: {
                    x: 0,
                    y: 0,
                    location: '',
                },
                endAddress: {
                    x: 0,
                    y: 0,
                    location: '',
                },
            },

            map: null,
            mapOptions: {
                center: null,
                zoom: 14,
                scaleControl: false,
                logoControl: false,
                mapDataControl: false,
                zoomControl: true,
                minZoom: 6
            }
        }
    },
    methods: {
        onClose() {
            let vm = this;
            vm.isOpen = false;
        },
        searchAddressToCoordinate() {
            let vm = this;

            let address = vm.form.endAddress.location;
            axios.get(`/api/naver/geocode`, {
                params: {
                    query: address,
                }
            }).then((res) => {
                let data = res.data;
                if(data.success) {
                    let row = data.address_list;
                    let x = row[0].x;
                    let y = row[0].y;
                    let mapOptions = {
                        /* eslint-disable */
                        center: new naver.maps.LatLng(y, x),
                        zoom: 14,
                        scaleControl: false,
                        logoControl: false,
                        mapDataControl: false,
                        zoomControl: true,
                        minZoom: 6
                    };
                    vm.$nextTick(() => {
                        let map = new naver.maps.Map("map", mapOptions);
                        vm.map = map;
                        let marker = new naver.maps.Marker({
                            position: new naver.maps.LatLng(y, x),
                            map: map
                        });
                        naver.maps.Event.addListener(map, 'click', function(e) {
                            // marker.setPosition(e.latlng);
                            // vm.marker.x = e.latlng.x;
                            // vm.marker.y = e.latlng.y;
                        });
                    });
                    vm.address_list = row;
                } else {
                    vm.$q.notify({
                        icon: 'error',
                        color: 'negative',
                        message: '검색 결과가 존재하지 않습니다.'
                    });
                }
            });

            // naver.maps.Service.geocode({
            //   query: address
            // }, function(status, response) {
            //   if (status === naver.maps.Service.Status.ERROR) {
            //     if (!address) {
            //       return alert('Geocode Error, Please check address');
            //     }
            //     return alert('Geocode Error, address:' + address);
            //   }

            //   if (response.v2.meta.totalCount === 0) {
            //     return alert('No result.');
            //   }
            //   console.log("response:", response);
            //   let item = response.v2.addresses[0];
            //   let point = new naver.maps.Point(item.x, item.y);
            //   vm.map.setCenter(point);
            //   console.log(item.x, item.y);
            //   vm.newmaker(item.x, item.y);
            // });
        },
        open(scheduleData, callback) {
            let vm = this;
            vm.form.endAddress.location = scheduleData.location;
            
            if(callback) { vm.callback = callback; }
            vm.isOpen = true;
            vm.searchAddressToCoordinate();
            // vm.getUserLocation();
        },
        getUserLocation() {
            let vm = this;
            if (!navigator.geolocation) {
                throw "위치 정보가 지원되지 않습니다.";
            }

            function success({ coords, timestamp }) {
                const latitude = coords.latitude;   // 위도
                const longitude = coords.longitude; // 경도
                
                // alert(`위도: ${latitude}, 경도: ${longitude}, 위치 반환 시간: ${timestamp}`);
                let x = longitude;
                let y = latitude;
                vm.mapOptions = {
                    /* eslint-disable */
                    center: new naver.maps.LatLng(y, x),
                    zoom: 14,
                    scaleControl: false,
                    logoControl: false,
                    mapDataControl: false,
                    zoomControl: true,
                    minZoom: 6
                };
                vm.$nextTick(() => {
                    let map = new naver.maps.Map('map', vm.mapOptions);
                    vm.map = map;
                    let marker = new naver.maps.Marker({
                        position: new naver.maps.LatLng(y, x),
                        map: map
                    });
                    vm.searchAddressToCoordinate();
                });
                
            }
            navigator.geolocation.getCurrentPosition(success);
        }
    },
    mounted() {
        let vm = this;
    }
}
</script>
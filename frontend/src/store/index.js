import { createStore } from "vuex";
import axios from "axios";

// state, getters, mutations, actions, modules
const store = createStore({
    state : {
        socket: null,
        host: process.env.VUE_APP_HOST,
        width: window.screen.width,
        height: window.innerHeight,
        UID: null,
        isSigned: false,
        
        catchErrorMessage: '예기치 못한 에러가 발생하였습니다. 관리자에게 문의하세요.',
        alarmList: [],
        alarmListCount: 0,
        chatCount: 0,

        menu_list: [
            { icon: 'calendar-o', label: '홈', url: '/home', name: 'home', isCustom: false, inCouple: true, },
            { icon: 'calendar-o', label: '캘린더', url: '/calendar/0', name: 'calendar', isCustom: false, inCouple: false, },
            { icon: 'chat-o', label: '채팅', url: '/chat', name: 'chat', isCustom: true, inCouple: false, },
            { icon: 'chat-o', label: '앨범', url: '/album', name: 'album', isCustom: false, inCouple: false, },
            // { icon: 'friends-o', label: '커뮤니티', url: '/community', name: 'community', isCustom: false, inCouple: false, },
            { icon: 'smile-o', label: '프로필', url: '/profile', name: 'profile', isCustom: true, inCouple: false, },
        ],

        kakao_account: {
            kakaoId: '',
            nickname: '',
            profile_image_url: '',
            email: '',
            memo: '',
            is_default_image: false,
        },
        user: {
            UID: '',
            coupleInfoId: 0,
            userId: '',
            userName: '',
            phoneNumber: '',
            image: '',
            isAdmin: '',
            code: '',
            spousePhoneNumber: '',
            memo: '',
            socketId: '',
        },

        couple: {
            UID: '',
            coupleInfoId: 0,
            userId: '',
            userName: '',
            phoneNumber: '',
            backgroundImageElement: '',
            backgroundImageUrl: '',
            image: '',
            socketId: '',
            memo: '',
        },

        classification_list: [],
        classification_dict: {},
        classification_id_dict: {},

        /* useful function */
        getCookie: function (name) {
            //APP_ACC_TKN
            let value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
            return value? value[2] : null;
        },
        setCookie: function (name, value, exp) {
            let date = new Date();
            date.setTime(date.getTime() + exp*24*60*60*1000);
            document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + ';path=/';
        },
        setError: function(obj, err) {
            for(let key in err) {
                if(Object.prototype.hasOwnProperty.call(obj, key)) { 
                    obj[key] = err[key];
                }
            }
        },
        clearError: function(obj) {
            for(let key in obj) {
                obj[key] = "";
            }
        },
        formatDate(date, type) {
            date = new Date(date);
            let month = date.getMonth() + 1;
            month = month >= 10 ? month : `0${month}`;
            let day = date.getDate();
            day = day >= 10 ? day : `0${day}`;
        
            let hours = date.getHours();
            hours = hours >= 10 ? hours : `0${hours}`;
            let min = date.getMinutes();
            min = min >= 10 ? min : `0${min}`;
            let sec = date.getSeconds();
            sec = sec >= 10 ? sec : `0${sec}`;
            if(type == 'date') {
                return `${date.getFullYear()}-${month}-${day}`; 
            } else if (type == 'date_ko') {
                return `${date.getFullYear()}년 ${month}월 ${day}일`; 
            } else if (type == 'date_2') {
                return `${month}.${day}`; 
            } else {
                return `${date.getFullYear()}-${month}-${day} ${hours}:${min}:${sec}`; 
            }
        }
    },
    getters: {
        getSocket(state) { return state.socket; },
        getUser(state) { return state.user; },
        getKakaoAccount(state) { return state.kakao_account; },
        getAlarmList(state) { return state.alarmList; },
        getMenuList(state) { return state.menu_list; },
    },
    mutations: {
        
        addChatCount(state, cnt) {
            if(cnt == 0) {
                state.chatCount = 0;
            } else {
                state.chatCount += cnt;
            }
        },
        pushAlarm(state, alarm) {
            state.alarmList.push(alarm);
            state.alarmListCount++;
        },
        deleteAlarm(state, idx) {
            state.alarmList.splice(idx, 1);
            state.alarmListCount--;
            if(state.alarmListCount <= 0) {
                state.alarmListCount = 0;
            }
        },
        setAlarmListCount(state, cnt) {
            state.alarmListCount = cnt;
        },
        setUserUID(state, UID) {
            state.UID = UID;
        },
        setSocket(state, socket) {
            state.socket = socket;
            socket.on('/client/couple/login', (data) => {
                let coupleSocketId = data.coupleSocketId;
                state.couple.socketId = coupleSocketId;
                this.commit("pushAlarm", {
                    message: `${state.couple.userName}님이 로그인 하셨습니다.`,
                    dateView: `${state.formatDate(new Date())}`,
                });
            });
            socket.on('/client/couple/logOut', (data) => {
                state.couple.socketId = "";
                this.commit("pushAlarm", {
                    message: `${state.couple.userName}님이 로그아웃 하셨습니다.`,
                    dateView: `${state.formatDate(new Date())}`,
                });
            });

            socket.on(`/client/router`, (data) => {
                state.menu_list.map((x) => {
                    x.inCouple = x.url === data.toPath ? true : false;
                });
            });
            
            socket.on(`/client/user/duplication/login`, (data) => {
                alert("다른 브라우저에서 로그인이 감지되었습니다.");
                window.location.reload();
            });

            socket.on(`/client/couple/delete`, () => {
                alert("커플 연결이 해제되었습니다. 로그인 화면으로 이동합니다.");
                window.location.reload();
            });
            socket.on(`/client/user/couple/put`, () => {
                alert("커플이 연결되었습니다.. 로그인 화면으로 이동합니다.");
                window.location.reload();
            });
        },
        setKakaoAccount(state, kakao_account) {
            if(!kakao_account) {
                state.kakao_account.kakaoId = "";
                state.kakao_account.email = "";
                state.kakao_account.nikcname = "";
                state.kakao_account.profile_image_url = "";
                state.kakao_account.memo = "";
                state.kakao_account.is_default_image = false;
            } else {
                state.kakao_account.kakaoId = kakao_account.kakaoId;
                state.kakao_account.email = kakao_account.email;
                state.kakao_account.profile_image_url = kakao_account.profile_image_url;
                state.kakao_account.nickname = kakao_account.nickname;
                state.kakao_account.is_default_image = kakao_account.is_default_image;
            }
        },
        /* user function */
        setUser(state, user) {
            if(!user) {
                state.user.coupleInfoId = 0;
                state.user.userId = "";
                state.user.userName = "";
                state.user.image = "";
                state.user.phoneNumber = "";
                state.user.spousePhoneNumber = "";
                state.user.isAdmin = "";
                state.user.code = "";
                state.user.memo = "";
                state.user.UID = "";
            } else {
                state.user.coupleInfoId = user.coupleInfoId;
                state.user.userId = user.userId;
                state.user.userName = user.userName;
                state.user.image = user.image;
                state.user.phoneNumber = user.phoneNumber;
                state.user.spousePhoneNumber = user.spousePhoneNumber;
                state.user.isAdmin = user.isAdmin;
                state.user.code = user.code;
                state.user.memo = user.memo;
                state.user.UID = user.UID;
            }
        },
        setSocketId(state, id) {
            state.user.socketId = id;
        },

        /* couple function */
        setCouple(state, couple) {
            if(!couple) {
                state.couple.coupleInfoId = 0;
                state.couple.userId = "";
                state.couple.userName = "";
                state.couple.image = "";
                state.couple.phoneNumber = "";
                state.couple.socketId = "";
                state.couple.backgroundImageElement = "";
                state.couple.backgroundImageUrl = "";
                state.couple.memo = "";
                state.couple.UID = "";
            } else {
                state.couple.coupleInfoId = couple.coupleInfoId;
                state.couple.userId = couple.userId;
                state.couple.userName = couple.userName;
                state.couple.image = couple.image;
                state.couple.phoneNumber = couple.phoneNumber;
                state.couple.socketId = couple.socketId;
                state.couple.backgroundImageElement = couple.backgroundImageElement;
                state.couple.backgroundImageUrl = state.host + couple.backgroundImageUrl;
                state.couple.memo = couple.memo;
                state.couple.UID = couple.UID;
            }
        },
        setCoupleSocketId(state, id) {
            state.couple.socketId = id;
        },
        logOut: function(state) {
            if(state.socket) {
                let socket = state.socket;
                socket.emit('/socket/user/logOut', {
                    user: state.user,
                    couple: state.couple,
                });
            }

            state.user.coupleInfoId = 0;
            state.user.userId = "";
            state.user.UID = "";
            state.user.userName = "";
            state.user.image = "";
            state.user.phoneNumber = "";
            state.user.spousePhoneNumber = "";
            state.user.isAdmin = "";
            state.user.code = "";
            state.user.memo = "";

            state.couple.coupleInfoId = 0;
            state.couple.userId = "";
            state.couple.UID = "";
            state.couple.userName = "";
            state.couple.image = "";
            state.couple.phoneNumber = "";
            state.couple.socketId = "";
            state.couple.backgroundImage = "";
            state.couple.memo = "";
            
            state.token = '';
            state.setCookie('token', '');
            
            window.location.reload();
        },

        /* load */
        onLoadScheduleClassificationList(state, coupleInfoId) {
            let vm = this;
            axios.get(`/api/couple/${coupleInfoId}/schedules-classifications`, {}).then((res) => {
                let data = res.data;
                if(data.success) {
                    let row = data.classification_list;
                    vm.classification_dict = new Object();
                    row.map((x) => {
                        x["isSelected"] = true;
                        state.classification_dict[x.title] = x;
                        state.classification_id_dict[x.coupleScheduleClassificationId] = x;
                    });
                    state.classification_list = row;
                }
            });
        },
        onReloadCoupleInfo(state, coupleInfoId) {
            axios.get(`/api/couple/${coupleInfoId}`, {}).then((res) => {
                let data = res.data;
                state.couple.backgroundImageElement = data.couple.backgroundImageElement;
                state.couple.backgroundImageUrl = data.couple.backgroundImageUrl;
            }).catch((err) => {
                console.error("err:", err);
            });
        }
    },
});

export default store;
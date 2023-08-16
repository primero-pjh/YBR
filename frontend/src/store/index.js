import { createStore } from "vuex";

// state, getters, mutations, actions, modules
const store = createStore({
    state : {
        socket: null,
        host: process.env.VUE_APP_HOST,
        width: window.screen.width,
        height: window.screen.height,
        UID: null,
        isSigned: false,

        kakao_account: {
            kakaoId: '',
            nickname: '',
            profile_image_url: '',
            email: '',
            memo: '',
            is_default_image: false,
        },
        user: {
            coupleInfoId: 0,
            userId: '',
            userName: '',
            phoneNumber: '',
            image: '',
            socketId: '',
            isAdmin: '',
            code: '',
            spousePhoneNumber: '',
            memo: '',
        },

        couple: {
            coupleInfoId: 0,
            userId: '',
            userName: '',
            phoneNumber: '',
            image: '',
            socketId: '',
            memo: '',
        },

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
    },
    getters: {
        getSocket(state) { return state.socket; },
        getUser(state) { return state.user; },
        getKakaoAccount(state) { return state.kakao_account; },
    },
    mutations: {
        setUserUID(state, UID) {
            state.UID = UID;
        },
        setSocket(state, socket) {
            state.socket = socket;
            socket.on('/client/couple/login', (data) => {
                let coupleSocketId = data.coupleSocketId;
                state.couple.socketId = coupleSocketId;
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
                state.couple.backgroundImage = "";
                state.couple.memo = "";
            } else {
                state.couple.coupleInfoId = couple.coupleInfoId;
                state.couple.userId = couple.userId;
                state.couple.userName = couple.userName;
                state.couple.image = couple.image;
                state.couple.phoneNumber = couple.phoneNumber;
                state.couple.socketId = couple.socketId;
                state.couple.backgroundImage = couple.backgroundImage;
                state.couple.memo = couple.memo;
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
            state.user.userName = "";
            state.user.image = "";
            state.user.phoneNumber = "";
            state.user.spousePhoneNumber = "";
            state.user.isAdmin = "";
            state.user.code = "";
            state.user.memo = "";

            state.couple.coupleInfoId = 0;
            state.couple.userId = "";
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
    },
});

export default store;
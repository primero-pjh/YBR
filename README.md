# YBR
커플앱

사용한 프레임 워크 및 라이브러리
Vue@3.0
Quasar@2.0
MySQL@5.6
SocketIO@4.5.4
axios
JWT
ToastUI/Calendar@2.3.1

# DEFAULT FONT
    > KakaoRegular || KakaoBold

# RESTAPI Organization
Login Authorization
- Axios: /api 요청을 담당한다.
    headers에 JWT Token을 포함하여 모든 RESTAPI 요청에 토큰을 검증한다.

- SocketIO
    headers.auth에 JWT Token을 포함하여 모든 SOCKET EMIT에 토큰을 검증한다.

검증되지 않은 TOKEN은 CODE 401을 반환하며, 로그인 페이지로 이동한다.

# AXIOS MIDDLEWARE

# SOCKETIO MIDDLEWARE

# LOGIN 
- YBR은 일반 로그인과 카카오 로그인을 제공한다.
    * 일반 로그인
        1. DB에 존재하지 않는 값이므로 FALSE를 리턴하여 로그인에 실패한다.

    * 카카오 로그인
        1. DB에 등록되어 있지 않는 계정이 로그인을 시도하면 회원가입 페이지로 이동한다.
        

* 로그인 LOGIC
    1. 커플이 등록 되어있는 경우
        JWT를 발급 후 URL(/home)으로 이동한다.
    2. 커플이 등록 되어있지 않는 경우 
        JWT를 발급 후 URL(/waiting)으로 이동한다.
    
* 중복 로그인
    """기본적으로 중복 로그인을 허용하지 않는다."""
    서버의 메모리 상에서 관리하는 'USER_DICT' 객체에 해당 유저의 UID가 등록되어 있다면  
    로그인 중인 브라우저의 socket에 disconnection을 요청한다. 

* 로그인 후 USER_DICT의 변화


# COUPLE REGISTER1
1. 커플 등록

2. 커플 해제

3. 커플 재등록
    DB에 저장되는 모든 데이터는 복구할 수 있는 가능성을 열어두고,  Status의 true, false로 관리한다.


    
# CHAT
chat logs 저장 방식
    @ crontab 사용
    1. 매일 밤 1시에 table[Chats]의 행 중 전날의 message들을 가져다 /logs/chats/:chatId/month에 저장한다.
    


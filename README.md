<div align="center">
    <h1> :couple: YBR - Couple Application</h1>
</div>

<div align="left">
    
## :camera: 프로젝트 미리보기

## :zap: YBR 실행

```
$ npm run build
$ npm start
```
    
## :hammer: 기술 스택
    
<img src="https://img.shields.io/badge/Vue-4FC08D?style=for-the-badge&logo=Vue.js&logoColor=white">    
<img src="https://img.shields.io/badge/Quasar-050A14?style=for-the-badge&logo=Quasar&logoColor=white"> 
<br>
<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/SocketIO-010101?style=for-the-badge&logo=socketdotio&logoColor=white"> 
<img src="https://img.shields.io/badge/redis-DC382D?style=for-the-badge&logo=redis&logoColor=white"> 
<br>
<img src="https://img.shields.io/badge/AXIOS-5A29E4?style=for-the-badge&logo=axios&logoColor=white">    
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=&logoColor=white">    
<img src="https://img.shields.io/badge/Toast-000000?style=for-the-badge&logo=&logoColor=white">    
<br>
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
<img src="https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=white"> 
<img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"> 
<br>
</div>

## :link: 링크
:one: &nbsp; <a href="https://ybr.pritras.com" target="_blank">사용자 페이지</a>
<br>
2️⃣ &nbsp; <a href="https://ybr.pritras.com/api-docs" target="_blank">Swagger</a>
<br>
3️⃣ &nbsp; <a href="https://ybr.pritras.com/admin" target="_blank">관리자 페이지</a>
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


# COUPLE REGISTER
1. 커플 등록

2. 커플 해제

3. 커플 재등록
    DB에 저장되는 모든 데이터는 복구할 수 있는 가능성을 열어두고,  Status의 true, false로 관리한다.


    
# CHAT
chat logs 저장 방식
    @ crontab 사용
    1. 매일 밤 1시에 table[Chats]의 행 중 전날의 message들을 가져다 /logs/chats/:chatId/month에 저장한다.
    


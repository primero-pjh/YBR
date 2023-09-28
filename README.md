<div align="center">
    <h1> :couple: YBR - Couple Application #Prototype</h1>
</div>

<div align="left">

## :bookmark_tabs: 목차
- 🔗 [링크](#-링크)
- 💏 [프로젝트설명](#-프로젝트-설명)
- 🛠 [기술 및 도구](#-기술-스택)
- 📜 [미리보기](#-미리보기)
- ⚡ [서버 실행](#-서버-실행)
- 📁 [ERD](#-erd)
- :rotating_light: [비즈니스 로직](#-비즈니스-로직)
- :ballot_box_with_check: [기능 소개](#-기능-소개)

## **🔗 링크**
### 1️⃣ &nbsp; 사용자 페이지 - <a href="https://ybr.pritras.com" target="_blank">바로가기</a>
### 2️⃣ &nbsp; Swagger - <a href="https://ybr.pritras.com/api-docs" target="_blank">바로가기</a>

## **✨ 프로젝트 설명**
```
보편적으로 사용되는 커플앱들의 기능을 구현한 웹 애플리케이션.
커플 간의 관계를 향상시키고 일상 생활을 더욱 즐겁게 만들어주는 웹 애플리케이션입니다.
이 서비스의 주요 기능으로 캘린더, 채팅, 앨범 그리고 프로필을 통해
각 커플들의 개성을 살려 자신의 배경 사진을 꾸밀 수 있는 기능을 제공하여 커플들이
간편하게 소통하고 협력할 수 있도록 도와줍니다.
```

## **🔍 미리보기**

<details>
<summary><h3>로그인 페이지</h3></summary>

![image](https://github.com/primero-pjh/ybr/assets/58695375/5ff903e6-0467-4192-8178-be7a05dfc9e7)
</details>
<details>
<summary><h3>홈 페이지</h3></summary>

![image](https://github.com/primero-pjh/ybr/assets/58695375/39999459-1de2-4e34-8f98-9535b5c7fd84)
</details>
<details>
<summary><h3>캘린더 페이지</h3></summary>

![image](https://github.com/primero-pjh/ybr/assets/58695375/dc7d1d16-50d2-4728-a63a-ff753420217f)
</details>
<details>
<summary><h3>채팅 페이지</h3></summary>

![image](https://github.com/primero-pjh/ybr/assets/58695375/caf433c0-c592-4492-96f6-f1e821e94068)
</details>
<details>
<summary><h3>앨범 페이지</h3></summary>

![image](https://github.com/primero-pjh/ybr/assets/58695375/3a66e4a3-f3b8-4803-ade9-159d2127a7d0)
</details>
<details>
<summary><h3>프로필 페이지</h3></summary>

![image](https://github.com/primero-pjh/ybr/assets/58695375/64abace4-c92f-42c7-bee3-d036aeed681d)
</details>

## **🛠 기술 스택**
    
<img src="https://img.shields.io/badge/Vue-4FC08D?style=for-the-badge&logo=Vue.js&logoColor=white">    
<img src="https://img.shields.io/badge/Quasar-050A14?style=for-the-badge&logo=Quasar&logoColor=white"> 
<img src="https://img.shields.io/badge/nodejs-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"> 
<br>
<img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/SocketIO-010101?style=for-the-badge&logo=socketdotio&logoColor=white"> 
<br>
<img src="https://img.shields.io/badge/AXIOS-5A29E4?style=for-the-badge&logo=axios&logoColor=white">    
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=&logoColor=white">    
<img src="https://img.shields.io/badge/Toast-000000?style=for-the-badge&logo=&logoColor=white">    
<br>
<img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=MySQL&logoColor=white">
<img src="https://img.shields.io/badge/Linux-FCC624?style=for-the-badge&logo=linux&logoColor=white"> 
<img src="https://img.shields.io/badge/nginx-009639?style=for-the-badge&logo=nginx&logoColor=white"> 
<img src="https://img.shields.io/badge/letsencrypt-003A70?style=for-the-badge&logo=letsencrypt&logoColor=white"> 

<br>
<img src="https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=white">
<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
<br>
<img src="https://img.shields.io/badge/kakao-FFCD00?style=for-the-badge&logo=kakao&logoColor=white">
<img src="https://img.shields.io/badge/naver-03C75A?style=for-the-badge&logo=NaverlogoColor=white">
</div>


## **⚡ 서버 실행**

### 1. 개발서버 
```
$ npm run build-dev // Frontend 데이터를 Backend로 build 합니다.
$ npm run start     // Backend 실행
```
### 2. 리얼서버
```
$ npm run build     // Frontend 데이터를 Backend로 build 합니다.
$ npm start         // Backend 실행
```

<details>
    <summary><h4>linux crontab 을 이용한 자동 업데이트</h4></summary>
    - crontab list
    - code
</details>
    
## ** 📦 ERD **

## ⚡ 시스템 아키텍


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
    


# YBR
커플앱

Vue 3.0

Quasar 2.0

MySQL

socket io 4.5.4

axios...

jwt

chat logs 저장 방식
1. 매일 밤 1시에 table[Chats]의 행 중 전날의 message들을 가져다 /logs/chats/:chatId/month에 저장한다.
- crontab 사용


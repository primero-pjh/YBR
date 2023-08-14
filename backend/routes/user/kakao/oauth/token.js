const express = require('express');
let appRoot = require("app-root-path");
let path = appRoot.path;
const router = express.Router();
const crypto = require('crypto');
const cfg = require(`${path}/config`);
const redis = require(`${path}/redis`);
const jwtFunc = require(`${path}/jwt`);
const jwt = require('jsonwebtoken');
const axios = require('axios');
let CRT_ERROR_CODE = require(`${path}/error_code`);

const formUrlEncoded = x =>
    Object.keys(x).reduce((p, c) => p + `&${c}=${encodeURIComponent(x[c])}`, '')

router.post('/user/kakao/oauth/token', async function(req, res, next) {
    const db = require(`${path}/mysql2`);
    let user_dict = require(`${path}/app`)["user_dict"];
    let code = req.body.code;
    axios.post(`https://kauth.kakao.com/oauth/token`, formUrlEncoded({
        grant_type: 'authorization_code',
        client_id: cfg['kakaoRestApiKey'],
        redirect_url: 'http://localhost:3000/user/kakao/login',
        code: code,
    }), {
        headers: {
            'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
            'Accept': '*/*'
        }
    }).then((response) => {
        let data = response.data;
        axios({
            method: 'post',
            url: 'https://kapi.kakao.com/v2/user/me',
            params: {},
            headers: {
                Authorization: `Bearer ${data.access_token}`,
                'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
                'Accept': '*/*'
            }
        }).then( async function(response2) {
            let kakaoId = response2.data.id;
            let kakao_account = response2.data.kakao_account.profile;
            kakao_account["kakaoId"] = kakaoId;
            kakao_account["email"] = response2.data.kakao_account.email;
            let [rows,fields] = await db.query(`
                select 
                    u.userId, u.UID, u.phoneNumber, u.image, u.userName, 
                    u.isAdmin, u.coupleInfoId, u.coupleUID, u.password, u.code
                from appUsers as u
                where u.kakaoId=?
            `, [kakaoId]);

            if(rows.length > 0) {
                let user = rows[0];

                let APP_ACC_TKN = jwt.sign({ 
                    kakaoId: user.kakaoId,
                    UID: user.UID
                }, cfg.jwtKey, {
                    expiresIn: "1 hours",
                });
                res.cookie('token', APP_ACC_TKN);

                if(user.coupleUID) {
                    let [couples,fields] = await db.query(`
                        select 
                            u.userId, u.UID, u.phoneNumber, u.image, u.userName, 
                            u.isAdmin, u.coupleInfoId, u.coupleUID, u.password, u.code
                        from appUsers as u
                        where u.UID=?
                    `, [user.coupleUID]);
                    let couple = couples[0];

                    return res.json({
                        success: 1,
                        couple: couple,
                        token: {
                            APP_ACC_TKN,
                        },
                        user,
                    });
                } else {
                    return res.json({
                        success: 1,
                        couple: null,
                        token: {
                            APP_ACC_TKN,
                        },
                        user,
                    });
                }
            } else {
                return res.json({
                    success: 1,
                    isSigned: 1,
                    kakao_account,
                    message: '회원가입을 진행합니다.',
                });
            }
        }).catch((err) => {
            return res.json({
                success: 0,
                code: err.code,
                message: '카카오 로그인에 실패하셨습니다. 다시 시도해주세요'
            });
        });
    }).catch((err) => {
        return res.json({
            success: 0,
            code: '/user/kakao/oauth/token',
            message: '카카오 로그인에 실패하셨습니다. 다시 시도해주세요'
        });
    });
    
});


module.exports = router;

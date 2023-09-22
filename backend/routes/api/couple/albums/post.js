const express = require('express');
let appRoot = require("app-root-path");
let path = appRoot.path;
const router = express.Router();
const cfg = require(`${path}/config`);
let CRT_ERROR_CODE = require(`${path}/error_code`);
const { v4 } = require('uuid');
const fs = require('fs');
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let coupleInfoId = req.params.coupleInfoId;
        let albumId = req.params.albumId;
        let dir = `${path}/wwwroot/images/${coupleInfoId}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        dir += '/albums';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        dir += `/${albumId}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        let ext = file.originalname.split(".")[1];
        let uuid = v4();
        cb(null, `${uuid}.${ext}`);
    },
});
  
const upload = multer({ storage: storage });

router.post('/api/couple/:coupleInfoId/albums', async (req, res, next) => {
    /*
        #swagger.description = '특정 커플의 앨범을 저장하는 API'
        #swagger.tags = ['/couple']
        #swagger.summary = 'token*'
        #swagger.parameters['params'] = {
            in: 'params',
            schema: {
                coupleInfoId: 0,
                backgroundImage: 0,
            }
        }
    */
    const db = require(`${path}/mysql2`);
    let user_dict = require(`${path}/app`)["user_dict"];

    let coupleInfoId = req.params.coupleInfoId;
    let title = req.body.title;
    let body = req.body.body;
    let imageCount = parseInt(req.body.imageCount);

    let error = new Object();

    if(!title) {
        error["title"] = "필수입력 항목입니다.";
    }
    if(imageCount == 0) {
        error["imageList"] = "최소한 1개의 이미지가 필요합니다.";
    } else if (imageCount > 10) {
        error["imageList"] = "이미지는 최대 10개까지 업로드가 가능합니다.";
    }

    if(Object.keys(error).length > 0) {
        return res.json({
            success: 0,
            error,
        });
    }

    let [results] = await db.query(`
        insert into coupleAlbums 
        (coupleInfoId, coverImageUrl, title, body, status, dateAdded)
        values (?, ?, ?, ?, ?, ?)
    `, [coupleInfoId, '', title, body, 1, new Date()]);
    let albumId = results.insertId;
    
    return res.json({
        success: 1,
        message: '앨범 추가 완료!',
        albumId,
    });
});

router.post('/api/couple/:coupleInfoId/albums/:albumId/images', upload.array('files', 10), async (req, res, next) => {
    /*
        #swagger.description = '특정 커플의 앨범을 저장하는 API'
        #swagger.tags = ['/couple']
        #swagger.summary = 'token*'
        #swagger.parameters['params'] = {
            in: 'params',
            schema: {
                coupleInfoId: 0,
                backgroundImage: 0,
            }
        }
    */
    const db = require(`${path}/mysql2`);
    let user_dict = require(`${path}/app`)["user_dict"];

    let coupleInfoId = req.params.coupleInfoId;
    let albumId = req.params.albumId;
    // 앨범 dir 생성
    let files = req.files;
    for(let i=0; i<files.length; i++) {
        let url = `/images/${coupleInfoId}/albums/${albumId}/${files[i].filename}`;
        if(i==0) {
            await db.query(`
                update coupleAlbums
                set coverImageUrl=?
                where coupleAlbumId=?
            `, [url, albumId]);
        } else {
            await db.query(`
                insert into albumImages (coupleAlbumId, imageUrl, body, status, sortOrder, dateAdded)
                values (?, ?, ?, ?, ?, ?)
            `, [albumId, url, '', 1, i+1, new Date()]);
        }
    }
    
    return res.json({
        success: 1,
        message: '앨범 추가 완료!',
    });
});

module.exports = router;

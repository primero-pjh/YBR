/* library */
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
const cors = require('cors');
const fs = require('fs');
const jwtFunc = require('./jwt');
let CRT_ERROR_CODE = require(`./error_code`);

const swaggerFile = require('./swagger/swagger-output.json');
const swaggerUi = require('swagger-ui-express');

let user_dict = new Object();
/* view engine setup */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

/* middle ware */
app.all('/api/*', async (req, res, next) => {
    let url = req.url;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With"); 

    /* 
        url의 요청이 login이 아니라면
        사용자가 추가한 authorization의 jwt token 값의 유효성을 검사한다.
    */
    if(url != '/api/user/login') {
        let token = req.headers.authorization;
        let resJwt = await jwtFunc.verify(token);
        if(!resJwt) {
            return res.json({
                success: 0,
                isLogged: false,
                message: CRT_ERROR_CODE["LOGIN_TOKEN"],
            });
        }
        req.self = resJwt;
    }
    
    next();
});
/* static variable */
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'wwwroot')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

/* router */
app.use('/', require('./routes/index'));
function dfs(dir) {
    fs.readdir(dir, (err, files) => {
        files.forEach(file => {
            let check = fs.statSync(`${dir}/${file}`).isDirectory();
            if(check) {
              dfs(`${dir}/${file}`);
            } else {
                let template = file.split(".")[0];
                let path = `${dir}/${file}`;
                // console.log("path:", path);
                app.use('/', require(path));
            }
        });
    });
}
// dfs('./routes/api');
app.use('/', require('./routes/api/user/login.js'));
app.use('/', require('./routes/api/user/check'));
app.use('/', require('./routes/api/user/couple/put'));
app.use('/', require('./routes/api/user/waiting/post'));
app.use('/', require('./routes/api/user/upload/image'));
app.use('/', require('./routes/api/user/upload/backImage'));
app.use('/', require('./routes/api/user/code'));
app.use('/', require('./routes/api/user/chat/rooms'));

app.use('/', require('./routes/api/couple/chat'));
app.use('/', require('./routes/api/couple/delete'));

app.use('/', require('./routes/api/waiting/get'));


app.use('/', require('./routes/api/admin/login'));
app.use('/', require('./routes/api/admin/redis'));

app.use('/', require('./routes/api/admin/user/get'));
app.use('/', require('./routes/api/admin/couple/get'));
app.use('/', require('./routes/api/admin/couple/delete'));

app.use('/', require('./routes/api/temp/upload/image'));

app.use('/', require('./routes/api/schedules/couple/post'));
app.use('/', require('./routes/api/schedules/put'));
app.use('/', require('./routes/api/schedules/delete'));
app.use('/', require('./routes/api/schedules/couple/get'));

app.use('/', require('./routes/user/upload/temp/image'));
app.use('/', require('./routes/user/kakao/oauth/token'));
app.use('/', require('./routes/user/kakao/signup'));

//Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, { explorer: true }));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = { app, user_dict, };

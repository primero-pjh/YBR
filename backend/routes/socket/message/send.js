let appRoot = require("app-root-path");
let path = appRoot.path;
let CRT_ERROR_CODE = require(`${path}/error_code`);
let knex = require(`${path}/db`);

module.exports = function(socket) {
    socket.on("/socket/message/send", async (data, callback) => {
        let user_dict = require(`${path}/app`)["user_dict"];
        let io = require(`${path}/bin/www`)["io"];
        // let redisCli = require(`${path}/bin/www`)["redisCli"];

        console.log("data:", data);        
        
        return callback({
            success: 1,
            message: '전송 완료'
        });
    });
};
let appRoot = require("app-root-path");
let path = appRoot.path;
let CRT_ERROR_CODE = require(`${path}/error_code`);

module.exports = function(socket) {
    socket.on("/socket/chat/message/send", async (data, callback) => {
        let user_dict = require(`${path}/app`)["user_dict"];
        let io = require(`${path}/bin/www`)["io"];
        const db = require(`${path}/mysql2`);
        // let redisCli = require(`${path}/bin/www`)["redisCli"];

        let error = new Object();
        if(!data.content) {
            error["contet"] = "필수입력 항목입니다.";
            return callback({
                success: 1,
                error,
            });
        }
        console.log("data:", data);
        let date = new Date();
        await db.query(`
            insert into chatLogs (chatInfoId, content, senderUID, dateAdded)
            values(?,?,?,?)
        `, [data.chatInfoId, data.content, data.UID, date]);

        let message = {
            chatInfoId: data.chatInfoId,
            content: data.content,
            senderUID: data.UID,
            dateAdded: date,
        };
        console.log("user_dict:", user_dict);
        // io.to(targetSocketId).emit(`/client/chat/message/send`, message);
        
        return callback({
            success: 1,
            message,
        });
    });
};
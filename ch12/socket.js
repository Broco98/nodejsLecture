// JSON -> String으로 자동변경(파싱 해준다고 함
const SocketIO = require('socket.io');

module.exports = (server) => {
    const io = SocketIO(server, { path: '/socket.io'}); //path는 프론트랑 일치시키면 됨

    io.on('connection', (socket) => { // 웹소켓 연결시
        const req = socket.request; // req는 socket안에 들어있음
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        console.log('새로운 클라이언트 접속!', ip, socket.id, req.id); // socket.id -> 고유한 아이디! 
        socket.on('disconnect', () => {
            console.log('클라이언트 접속 해제', ip, socket.id,);
            clearInterval(socket.interval);
        });
        socket.on('error', (error) => { // 에러시
            console.error(error);
        });
        socket.on('reply', (data) => { // 클라이언트로부터 메시지
            console.log(data);
        });
        socket.interval = setInterval(() => {
            socket.emit('news', 'Hello Socket.IO'); // 이벤트 이름, 메세지
        }, 3000);
    });
};




// socketio는 String을 보내는데 적합해서, String이 아니라면, 딱히 안써도 상관없다고 함.
// const WebSocket = require('ws');
//
// // express server를 입력받아서, webSocket 서버랑 연결하는 부분
// module.exports = (server) => {
//     const wss = new WebSocket.Server({server});
//
//     // 크롬 시크릿 탭을 띄우면 -> 새로운 사람으로 인식한다고 함
//     // front에서 websocket 생성시 실행된다고 함
//     wss.on('connection', (ws, req) => { // 웹소켓 연결시
//         const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // ip 파악, ipv6형태
//         console.log('새로운 클라이언트 접속', ip);
//         ws.on('message', (message) => { // 클라이언트로부터 메시지 websocket.send 했을떄
//             console.log(message.toString());
//         });
//         ws.on('error', (error) => { // error처리 handler
//             console.error(error);
//         })
//         ws.on('close', () => { // 연결 종료 시
//             console.log('클라이언트 접속 해제', ip);
//             clearInterval(ws.interval);
//         });
//
//         ws.interval = setInterval(() => { // 3초마다 클라이언트로 메세지 전송
//             if(ws.readyState === ws.OPEN){ // 연결상태일떄
//                 ws.send('서버에서 클라이언트로 메세지를 보냅니다.');
//             }
//         }, 3000);
//     });
//
// }
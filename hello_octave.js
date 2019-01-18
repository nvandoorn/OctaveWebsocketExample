const config = require('./config');
const https = require('https');
const WebSocket = require('ws');

function octave_requestWebsocketSessionId() {
    const options = {
        hostname: 'octave-ws.sierrawireless.io',
        port: 443,
        path: '/session',
        method: 'POST',
        headers: {
            'X-Auth-User':  config.octave.username,
            'X-Auth-Company': config.octave.company,
            'X-Auth-Token': config.octave.masterToken
        }
    };
    return new Promise(function(resolve, reject) {
        const req = https.request(options, (res) => {
            if (res.statusCode != 201) {
                resolve(new Error(`Unexpected status code (${res.statusCode})`));
            }

            const chunks = [];
            res.on('data', (d) => {
                chunks.push(d);
            });
            res.on('end', () => {
                const b = Buffer.concat(chunks);
                const s = b.toString();
                const j = JSON.parse(s);
                resolve(j.body.id);
            });
        });

        req.on('error', (e) => {
            reject(e);
        });
        req.end();
    });
}

octave_requestWebsocketSessionId().then(
    id => {
        console.log(id);
        const ws = new WebSocket(`wss://octave-ws.sierrawireless.io/session/${id}/ws`);
        ws.on('open', () => {
            console.log("Websocket established");
            const subReq = {
                "msgId": "my-path-request",
                "object": "event",
                "type": "subscribe",
                "path": `/${config.octave.company}/devices/${config.octave.device}/light`
            };
            ws.send(JSON.stringify(subReq));
        });
        ws.on('message', (data) => {
            console.log(data);
        });
    },
    error => console.log(error));

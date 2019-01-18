const process = require("process");
const fetch = require("node-fetch");
const WebSocket = require("ws");

const config = require("./config");

const HOSTNAME = config.octave.url || "octave-ws.sierrawireless.io";

function octave_requestWebsocketSessionId() {
  // I didn't inspect the fetch API that closely
  // but it should be mostly compatible with https from node
  const options = {
    port: 443,
    path: "/session",
    method: "POST",
    headers: {
      "X-Auth-User": config.octave.username,
      "X-Auth-Company": config.octave.company,
      "X-Auth-Token": config.octave.masterToken
    }
  };
  return fetch(HOSTNAME, options)
    .then(r => r.json())
    .then(
      p =>
        new Promise((resolve, reject) => {
          p.statusCode !== 201
            ? reject(new Error(`Unexpected status code (${res.statusCode})`))
            : resolve(p.body.id);
        })
    );
}

octave_requestWebsocketSessionId()
  .then(id => {
    console.log(id);
    const ws = new WebSocket(
      `wss://octave-ws.sierrawireless.io/session/${id}/ws`
    );
    ws.on("open", () => {
      console.log("Websocket established");
      const subReq = {
        msgId: "my-path-request",
        object: "event",
        type: "subscribe",
        path: `/${config.octave.company}/devices/${config.octave.device}/light`
      };
      ws.send(JSON.stringify(subReq));
    });
    ws.on("message", data => {
      console.log(data);
    });
  })
  .catch(e => console.log(e));

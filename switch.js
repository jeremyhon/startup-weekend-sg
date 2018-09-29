const START_VOICE_RECOGNITION = "START_VOICE_RECOGNITION";
const VOICE_RECOGNITION_STARTED = "VOICE_RECOGNITION_STARTED";
const END_VOICE_RECOGNITION = "END_VOICE_RECOGNITION";
const VOICE_RECOGNITION_ENDED = "VOICE_RECOGNITION_ENDED";

const initializeSwitch = app => {
  const server = require("http").Server(app);
  const io = require("socket.io")(server);

  server.listen(process.env.PORT || 5000, function() {
    console.log(`socket has started listening on ${process.env.PORT || 5000}`);
  });

  io.on("connection", function(socket) {
    console.log("The IoT device is connected");

    socket.on(START_VOICE_RECOGNITION, () => {
      console.log(`${START_VOICE_RECOGNITION}: START`);
    });

    socket.on(VOICE_RECOGNITION_STARTED, () => {
      console.log(`${VOICE_RECOGNITION_STARTED}: STARTED`);
    });

    socket.on(END_VOICE_RECOGNITION, () => {
      console.log(`${END_VOICE_RECOGNITION}: END`);
    });

    socket.on(VOICE_RECOGNITION_ENDED, () => {
      console.log(`${VOICE_RECOGNITION_ENDED}: ENDED`);
    });
  });

  app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
  });

  app.get("/mockapp", function(req, res) {
    res.sendFile(__dirname + "/mockapp.html");
  });
};

module.exports = {
  initializeSwitch
};

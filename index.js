require("dotenv").config();
var plivo = require("plivo");
var express = require("express");
var app = express();
var env = require("./app.json");
const { initializeSwitch } = require("./switch");

app.set("port", process.env.PORT || 5000);
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));

const getUrl = path => env.url + path + "/";

app.post("/demo", async (req, response) => {
  try {
    if (!req.query.responder_only) {
      console.log("calling conference");
      await p.calls.create("14849302136", "6588235544", getUrl("conference"));
      await p.calls.create("14849302136", "6596700794", getUrl("conference"));
    }
    if (!req.query.conference_only) {
      console.log("calling responder");
      await p.calls.create("14849302136", "6596686612", getUrl("responder"));
    }
    return response.sendStatus(200);
  } catch (error) {
    response.status(500);
    return response.send(err);
  }
});

// endpoint to return conference info
app.post("/conference/", (request, response) => {
  var r = plivo.Response();
  // r.addSpeak(
  //   "You are being connected to the emergency call. Please wait while the other party picks up."
  // );
  var params = {
    enterSound: "",
    startConferenceOnEnter: "true",
    endConferenceOnExit: "true"
  };

  var conference_name = "demo"; // Conference Room name
  r.addConference(conference_name, params);

  response.set({
    "Content-Type": "text/xml"
  });
  response.end(r.toXML());
});

app.post("/responder/", (request, response) => {
  var r = plivo.Response();
  r.addSpeak(
    "Your neighbour, Mr Lee is in an emergency situation, please dial 0 if you can respond to this"
  );
  r.addGetDigits({
    action: getUrl("responder_confirm"),
    timeout: 30,
    numDigits: 1
  });
  response.set({
    "Content-Type": "text/xml"
  });
  response.end(r.toXML());
});

app.post("/responder_confirm/", (request, response) => {
  const r = plivo.Response();
  r.addSpeak(
    "Thank you. Please check your SMS when you arrive. You can hang up now."
  );
  p.messages.create("14849302136", "6596686612", "Lee Kai Yi's PIN is 223144");
  response.set({
    "Content-Type": "text/xml"
  });
  response.end(r.toXML());
});

// Outbound Conference
var plivo = require("plivo");

var p = new plivo.Client(
  process.env.PLIVO_AUTH_ID,
  process.env.PLIVO_AUTH_TOKEN
);

initializeSwitch(app);

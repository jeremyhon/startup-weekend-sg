require("dotenv").config();
var plivo = require("plivo");
var express = require("express");
var app = express();
var env = require("./app.json");
const { initializeSwitch } = require("./switch");

app.set("port", process.env.PORT || 5000);
app.use(express.static(__dirname + "/public"));

const getUrl = path => env.url + path + "/";

app.post("/demo", function(request, response) {
  return Promise.all([
    p.calls.create("14849302202", "6588235544", getUrl("conference")),
    p.calls.create("14849302202", "6596700794", getUrl("conference")),
    p.calls.create("14849302202", "6596686612", getUrl("responder"))
  ])
    .then(() => {
      response.sendStatus(200);
    })
    .catch(err => {
      response.status(500);
      return response.send(err);
    });
});

// endpoint to return conference info
app.post("/conference/", function(request, response) {
  var r = plivo.Response();
  r.addSpeak(
    "You are being connected to the emergency call. Please wait while the other party picks up."
  );
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

app.post("/responder/", function(request, response) {
  var r = plivo.Response();
  r.addSpeak(
    "Your neighbour, Lee Kai Yi of #03-06 is in an emergency situation. Please dial 0 if you are able to respond"
  );
  r.addGetDigits({
    action: getUrl("responder-confirm"),
    timeout: 30,
    numDigits: 1
  });
  response.set({
    "Content-Type": "text/xml"
  });
  response.end(r.toXML());
});

app.post("/responder_confirm/", (req, res) => {
  const r = plivo.Response();
  r.addSpeak(
    "Thank you. Please check your SMS when you arrive. You can hang up now."
  );
  p.messages.create("14849302202", "6596686612", "Lee Kai Yi's PIN is 223144");
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

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
    p.calls.create("14849302202", "6596686612", getUrl("automated"))
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
app.all("/conference/", function(request, response) {
  var r = plivo.Response();
  r.addSpeak(
    "You are being connected to the emergency call. Please wait while the other party picks up."
  );
  var params = {
    enterSound: "beep:2", // Used to play a sound when a member enters the conference
    record: "true", // Option to record the call
    action: env.url + "conf_action/", // URL to which the API can send back parameters
    method: "GET", // method to invoke the action Url
    callbackUrl: env.url + "conf_callback/", // If specified, information is sent back to this URL
    callbackMethod: "GET" // Method used to notify callbackUrl
  };

  var conference_name = "demo"; // Conference Room name
  r.addConference(conference_name, params);
  console.log(r.toXML());

  response.set({
    "Content-Type": "text/xml"
  });
  response.end(r.toXML());
});

app.all("/automated/", function(request, response) {
  var r = plivo.Response();
  r.addSpeak(
    "Your neighbour mister tan at unit number 02-03 needs help. Please assist him."
  );
  response.set({
    "Content-Type": "text/xml"
  });
  response.end(r.toXML());
});

app.all("/conf_action/", function(request, response) {
  var conf_name = request.param("ConferenceName");
  var conf_uuid = request.param("ConferenceUUID");
  var conf_mem_id = request.param("ConferenceMemberID");
  var record_url = request.param("RecordUrl");
  var record_id = request.param("RecordingID");

  console.log(
    "Conference Name : " +
      conf_name +
      " Conference UUID  : " +
      conf_uuid +
      " Conference Member ID : " +
      conf_mem_id +
      " Record Url : " +
      record_url +
      " Record ID : " +
      record_id
  );
});

app.all("/conf_callback/", function(request, response) {
  var conf_action = request.param("ConferenceAction");
  var conf_name = request.param("ConferenceName");
  var conf_uuid = request.param("ConferenceUUID");
  var conf_mem_id = request.param("ConferenceMemberID");
  var call_uuid = request.param("CallUUID");
  var record_url = request.param("RecordUrl");
  var record_id = request.param("RecordingID");

  console.log(
    "Conference Action : " +
      conf_action +
      " Conference Name : " +
      conf_name +
      " Conference UUID  : " +
      conf_uuid +
      " Conference Member ID : " +
      conf_mem_id +
      " Call UUID : " +
      call_uuid +
      " Record Url : " +
      record_url +
      " Record ID : " +
      record_id
  );
});

// Outbound Conference
var plivo = require("plivo");

var p = new plivo.Client(
  process.env.PLIVO_AUTH_ID,
  process.env.PLIVO_AUTH_TOKEN
);

initializeSwitch(app);

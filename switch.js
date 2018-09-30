const START_VOICE_RECOGNITION = 'START_VOICE_RECOGNITION'
const VOICE_RECOGNITION_STARTED = 'VOICE_RECOGNITION_STARTED'
const END_VOICE_RECOGNITION = 'END_VOICE_RECOGNITION'
const VOICE_RECOGNITION_ENDED = 'VOICE_RECOGNITION_ENDED'
const RECEIVE_LOG = 'RECEIVE_LOG'
const CHANGE_LANGUAGE = 'CHANGE_LANGUAGE'
const SPEAK_CONFIRMATION = 'SPEAK_CONFIRMATION'

const initializeSwitch = app => {
  const server = require('http').Server(app)
  const io = require('socket.io')(server)

  server.listen(process.env.PORT || 5000, function () {
    console.log(`socket has started listening on ${process.env.PORT || 5000}`)
  })

  io.on('connection', function (socket) {
    console.log('The IoT device is connected')

    socket.on(START_VOICE_RECOGNITION, () => {
      io.emit(START_VOICE_RECOGNITION)
      console.log(`${START_VOICE_RECOGNITION}: START`)
    })

    socket.on(VOICE_RECOGNITION_STARTED, () => {
      io.emit(VOICE_RECOGNITION_STARTED)
      console.log(`${VOICE_RECOGNITION_STARTED}: STARTED`)
    })

    socket.on(END_VOICE_RECOGNITION, () => {
      io.emit(END_VOICE_RECOGNITION)
      console.log(`${END_VOICE_RECOGNITION}: END`)
    })

    socket.on(VOICE_RECOGNITION_ENDED, () => {
      io.emit(VOICE_RECOGNITION_ENDED)
      console.log(`${VOICE_RECOGNITION_ENDED}: ENDED`)
    })

    socket.on(RECEIVE_LOG, data => {
      console.log(`${RECEIVE_LOG} ${data}`)
      io.emit(RECEIVE_LOG, data)
    })

    socket.on(CHANGE_LANGUAGE, langCode => {
      let payload = { code: langCode }
      io.emit(CHANGE_LANGUAGE, JSON.stringify(payload))
    })

    socket.on(SPEAK_CONFIRMATION, () => {
      io.emit(SPEAK_CONFIRMATION)
      console.log(SPEAK_CONFIRMATION)
    })
  })

  app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
  })

  app.get('/mockapp', function (req, res) {
    res.sendFile(__dirname + '/mockapp.html')
  })
}

module.exports = {
  initializeSwitch
}

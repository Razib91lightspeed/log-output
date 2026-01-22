const express = require('express')
const app = express()

let pongs = 0


// Browser / ping endpoint
app.get('/pingpong', (req, res) => {
  pongs++
  res.send(`Pongs: ${pongs}`)
})


// INTERNAL endpoint for log-output
app.get('/pings', (req, res) => {
  res.send(`${pongs}`)
})

app.listen(3000, () => {
  console.log('Ping-pong running on port 3000')
})
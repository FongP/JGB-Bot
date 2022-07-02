import express from 'express';
import {
    int,
    er,
    warn,
    fb
} from "./logger.js"

const app = express()

app.get('/', function (req, res) {
  res.writeHead(200, { 'content-type': 'text/javascript' })
    res.end('Copyright © 2022 JustGonDev. All rights reserved.')
  })
app.listen(80, (err) => {
    if(err) {
      err('Something wrong when create server!')
      err('Force Exit...')
        process.exit()
    } else {
      int('Successfully Create Server')
      warn('Server Listen To Port ' + 80)
    }

})
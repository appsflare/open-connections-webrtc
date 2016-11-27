var express = require('express')
var app = express()

app.use('/scripts', express.static('scripts'));

app.use(express.static('scripts'));

app.listen(3000, function () {
  console.log('Open Connections running on port 3000!')
});


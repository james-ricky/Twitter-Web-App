var express = require('express');
var port = process.env.PORT || 3001;
var app = express();

app.use(express.static(__dirname + '/build'));
app.get('*', function(req, res) {
    res.sendFile('index.html', { root: __dirname + '/build' })
});

app.listen(port);

require('dotenv').config()
const express = require('express');
const app = express();

let service = require('./service')
const PORT = parseInt(process.env.PORT) || 3000

service.connectMongoose();

app.use(express.static('./public')); 
app.use((req, res, next) => {
    if(req.headers['x-forwarded-proto'] === 'https'){
      res.redirect('http://' + req.hostname + req.url);
    }else{
        next();
    }
})
require('./controller')(app)
app.listen(PORT, () => {
    console.log('Express server is up on port ' + PORT )
});
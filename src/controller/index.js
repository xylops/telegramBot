const pageController = require('./pageController')

module.exports = function(app){
    app.use('/', pageController)
}
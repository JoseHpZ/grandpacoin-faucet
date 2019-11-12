const Faucet = require('./Faucet.js');
const faucet = new Faucet();

module.exports = (app) => {

    app.post('/faucet', faucet.newRequest)
    app.get('/', function (req, res) {
    })
    app.post('/', function (req, res) {
    })
    app.post('/', function (req, res) {
    })

    // Default route
    app.get('*', function (req, res) {
        res.status(404).json({ message: 'This route does not exists.' })
    })
}



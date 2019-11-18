const Faucet = require('./Faucet.js');
const faucet = new Faucet();

module.exports = (app) => {
    app.post('/faucet', faucet.newRequest)
}



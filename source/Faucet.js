const moment = require('moment');
const globalConfigs = require('../global');
const Transaction = require('./Transaction');
const Request = require('../utils/Request');
const Url = require('url');

class Faucet {
    constructor() {
        this.value = 1;
        this.blackList = {};
        this.newRequest = this.newRequest.bind(this);
        this.address = "0xFe711fa35F0A060dAc55feDB68D52F610532bBC7";
    }


    newRequest(req, response) {
        let { toAddress, url } = req.body

        if (this.blackList[toAddress] && (moment().diff(moment(this.blackList[toAddress]), "seconds") < globalConfigs.time)) {
            return response.status(400).json({ message: "Have to wait an hour to request again" });
        }
        if (this.blackList[toAddress])
            delete this.blackList[toAddress];


        this.blackList[toAddress] = new Date().toISOString();
        url = Url.parse(url);
        let body = (new Transaction(toAddress)).getData();
        /* let txHash = (new Transaction(toAddress)).getTransactionHash(); */

        Request.post(`/transactions/send`, {
            body
        }).then(res => {
            return response.status(200).send(res.message)
        }).catch(err => {
            return response.status(400).json(err.message)
        });
    }
}
module.exports = Faucet;
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
    }


    newRequest(req, response) {
        let { toAddress, url } = req.body

        if (this.blackList[toAddress] && (moment().diff(moment(this.blackList[toAddress]), "hours") < globalConfigs.time)) {
            return response.status(400).json("Have to wait an hour to request again");
        }
        if (this.blackList[toAddress])
            delete this.blackList[toAddress];


        this.blackList[toAddress] = new Date().toISOString();
        url = Url.parse(url);
        let body = (new Transaction(toAddress)).getData();
        let txHash = (new Transaction(toAddress)).signTransaction();

        Request.post(`/transactions/send`, {
            body
        }).then(res => {
            return response.status(200).send(res)
        }).catch(err => {
            return response.status(400).send(err)
        });
    }
}
module.exports = Faucet;
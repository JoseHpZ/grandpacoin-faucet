const moment = require('moment');
/* const ethers = require('ethers'); */
const { isValidAddress, signTransaction } = require('../utils/functions');
const globalConfigs = require('../global');

class Faucet {
    constructor() {
        this.value = 1;
        this.blackList = {};
        this.newRequest = this.newRequest.bind(this);
        this.signTransacction = this.signTransacction.bind(this);
        this.address = "0xFe711fa35F0A060dAc55feDB68D52F610532bBC7";
        this.compressedPublicKey = "0x029b6be40dacf9e23ea413cc5d9007abc0e78118cc3b790cd34bcc8989601ad01f";
    }

    signTransacction(req, response) {
        const { toAddress } = req.body

        let transaction = {
            from: this.address,
            to: toAddress,
            value: this.value,
            fee: globalConfigs.mininumTransactionFee,
            data: 'Faucet tx',
            senderPubKey: this.compressedPublicKey,
            transferSuccessful: true
        }

        return response.json(signTransaction(JSON.stringify(transaction), globalConfigs.privKey));
    }

    sendTransaction(toAddress) {

        toAddress = isValidAddress(toAddress);

        if (!toAddress) return { message: "Invalid 'to' address" }


        return { message: "transaction successfull" }
    }

    newRequest(req, response) {
        const { toAddress } = req.body;
        console.log(req.body);
        if (!this.blackList[toAddress]) {
            this.blackList[toAddress] = new Date().toISOString();

            return response.json({ send: this.sendTransaction(toAddress), blackList: this.blackList })
        }

        let diffTime = moment().diff(moment(this.blackList[toAddress]), "minutes");

        if (diffTime > globalConfigs.time) {
            delete this.blackList[toAddress];

            return response.json({ send: this.sendTransaction(toAddress), blackList: this.blackList })
        }

        return response.json({ message: "Have to wait an hour to request again" });

    }
}
module.exports = Faucet;
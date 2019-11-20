const { sha256 } = require('../utils/hashes');
const globalConfigs = require('../global');
const { senderSignature } = require('../utils/function');

class Transaction {
    constructor(to) {
        this.to = to.replace('0x', '');
        this.dateCreated = new Date().toISOString();
        this.signTransaction = this.signTransaction.bind(this);
        this.getTransactionHash = this.getTransactionHash.bind(this);
    }

    getData() {
        return {
            from: globalConfigs.faucetAddress,
            to: this.to,
            value: globalConfigs.value,
            fee: globalConfigs.mininumTransactionFee,
            dateCreated: this.dateCreated,
            data: 'Faucet tx',
            senderPubKey: globalConfigs.compressedPublicKey,
            transactionDataHash: Transaction.getTransactionDataHash(this.to, this.dateCreated),
            senderSignature: this.signTransaction(this.to)
        }
    }

    getTransactionHash() {
        return Transaction.getTransactionDataHash(this.to, this.dateCreated);
    }

    static getTransactionDataHash(to, dateCreated) {
        return sha256(JSON.stringify({
            from: globalConfigs.faucetAddress,
            to,
            value: globalConfigs.value,
            fee: globalConfigs.mininumTransactionFee,
            dateCreated: dateCreated,
            data: 'Faucet tx',
            senderPubKey: globalConfigs.compressedPublicKey,
        }))
    }

    signTransaction(to) {
        return (senderSignature(JSON.stringify({
            from: globalConfigs.faucetAddress,
            to,
            value: globalConfigs.value,
            fee: globalConfigs.mininumTransactionFee,
            dateCreated: this.dateCreated,
            data: 'Faucet tx',
            senderPubKey: globalConfigs.compressedPublicKey,
        }), globalConfigs.privKey));
    }
}

module.exports = Transaction;
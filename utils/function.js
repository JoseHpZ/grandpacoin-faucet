const { sha256 } = require('./hashes');
const EC = require('elliptic').ec;
const secp256k1 = new EC('secp256k1');

function senderSignature(transaction, privateKey) {
    const transactionHash = sha256(transaction)
    const keypair = secp256k1.keyFromPrivate(privateKey)
    const signature = keypair.sign(transactionHash)
    return [signature.r.toString(16), signature.s.toString(16)]
}

function setCorsHeadersMiddleware(request, response, next) {
    response.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST',
        'Access-Control-Allow-Headers': 'Accept,Content-Type'
    });
    next();
}

module.exports = {
    senderSignature,
    setCorsHeadersMiddleware
};
require('dotenv').config()

const { Observable } = require('rxjs');
const Web3 = require('web3');

const web3 = new Web3(process.env.WEB3_PROVIDER);

const blockStream = new Observable(function (observer) {
  web3.eth.subscribe('newBlockHeaders')
    .on('data', block => observer.next(block))
    .on('error', err => observer.error(err))
});

let subscriber = blockStream.subscribe({
  next(block) {
    console.log(block.number, block.hash)
  }
})
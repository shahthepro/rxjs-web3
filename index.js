require('dotenv').config()

const { Observable } = require('rxjs');
const { scan } = require('rxjs/operators');
const Web3 = require('web3');

const web3 = new Web3(process.env.WEB3_PROVIDER);

const blockStream = new Observable(function (observer) {
  web3.eth.subscribe('newBlockHeaders')
    .on('data', block => observer.next(block))
    .on('error', err => observer.error(err))
});

let subscriber = blockStream
  .pipe(
    scan((blocks, newBlock) => [...blocks, newBlock].slice(-10), [])
  )
  .subscribe({
    next(recentBlocks) {
      const latestBlock = recentBlocks[recentBlocks.length - 1];
      console.log(recentBlocks.length)
      console.log(latestBlock.number, latestBlock.hash)
    }
  })
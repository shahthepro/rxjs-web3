require('dotenv').config()

const { Observable, ReplaySubject, concat } = require('rxjs');
const { scan } = require('rxjs/operators');
const Web3 = require('web3');

const web3 = new Web3(process.env.WEB3_PROVIDER);

const minedBlockStream = new Observable(async observer => {
  try {
    const latestBlockNumber = await web3.eth.getBlockNumber();
    
    for (let i = 0; i < 10; i++) {
      let block = await web3.eth.getBlock(latestBlockNumber - 9 + i, true);
      observer.next(block);
    }

    observer.complete();
  
  } catch (e) {
    observer.error(e);
  }
})

const newBlockStream = new Observable(observer => {
  web3.eth.subscribe('newBlockHeaders')
    .on('data', block => observer.next(block))
    .on('error', err => observer.error(err))
});

const replayNewBlocksSubject = new ReplaySubject(10);
newBlockStream.subscribe(replayNewBlocksSubject);

const recentBlocksStream = concat(minedBlockStream, replayNewBlocksSubject)
  .pipe(
    scan((blocks, newBlock) => [...blocks, newBlock].slice(-10), [])
  );

recentBlocksStream.subscribe({
  next(recentBlocks) {
    const latestBlock = recentBlocks[recentBlocks.length - 1];
    console.log(recentBlocks.length)
    console.log(latestBlock.number, latestBlock.hash)
  }
})

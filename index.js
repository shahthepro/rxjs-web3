require('dotenv').config()

const { Observable } = require('rxjs');
const Web3 = require('web3');

const web3 = new Web3(process.env.WEB3_PROVIDER);

web3.eth.getBlock(0)
  .then(block => {
    console.log(`Got block ${block.hash}`)
  })

console.log('Hello!!!')
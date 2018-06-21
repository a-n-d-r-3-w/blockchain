const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(index, timestamp, data, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.data = data;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.index +
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.data) +
      this.nonce
    ).toString();
  }

  mineBlock(difficulty) {
    while(this.hash.substring(0, difficulty) !== Array(difficulty+1).join("0")) {
      this.nonce += 1;
      this.hash = this.calculateHash();
    }
    console.log("Block mined! " + this.hash);
  }
}

class Blockchain {
  constructor() {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
  }

  createGenesisBlock() {
    return new Block(0, "2018-01-01", "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  addBlock(newBlock) {
    newBlock.previousHash = this.getLatestBlock().hash;
    // newBlock.hash = newBlock.calculateHash();
    newBlock.mineBlock(this.difficulty);
    this.chain.push(newBlock);
  }

  isChainValid() {
    const chain = this.chain;
    for (let i = 1; i < chain.length; i++) {
      const currentBlock = chain[i];
      const previousBlock = chain[i - 1];

      if (currentBlock.hash !== currentBlock.calculateHash()) {
        return false;
      }

      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}

// Create blockchain
let andrewCoin = new Blockchain();
console.log(JSON.stringify(andrewCoin, null, 2));

// Mine blocks
console.log("Mining block 1...");
andrewCoin.addBlock(new Block(1, "2018-02-01", { amount: 100 }));
console.log("Mining block 2...");
andrewCoin.addBlock(new Block(2, "2018-03-01", { amount: 200 }));
console.log(JSON.stringify(andrewCoin, null, 2));

// Tamper with data
console.log('Is blockchain valid?', andrewCoin.isChainValid());
console.log("Tamper with blockchain.");
andrewCoin.chain[1].data = { amount: 150 };
console.log('Is blockchain valid?', andrewCoin.isChainValid());

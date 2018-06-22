const SHA256 = require('crypto-js/sha256');

class Transaction {
  constructor(fromAddress, toAddress, amount) {
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
  }
}

class Block {
  constructor(timestamp, transactions, previousHash = '') {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = this.calculateHash();
    this.nonce = 0;
  }

  calculateHash() {
    return SHA256(
      this.previousHash +
      this.timestamp +
      JSON.stringify(this.transactions) +
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
    this.pendingTransactions = [];
    this.miningRewards = 100;
  }

  createGenesisBlock() {
    return new Block("2018-01-01", "Genesis block", "0");
  }

  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  createTransaction(transaction) {
    // TODO: Perform validation

    this.pendingTransactions.push(transaction);
  }

  minePendingTransactions(miningRewardAddress) {
    const block = new Block(Date.now(), this.pendingTransactions);
    block.mineBlock(this.difficulty);
    this.chain.push(block);
    this.pendingTransactions = [
      new Transaction(null, miningRewardAddress, this.miningRewards),
    ];
  }

  getBalanceOfAddress(address) {
    let balance = 0;
    for (const block of this.chain) {
      for (const transaction of block.transactions) {
        if (transaction.fromAddress === address) {
          balance -= transaction.amount;
        }
        if (transaction.toAddress === address) {
          balance += transaction.amount;
        }
      }
    }
    return balance;
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

console.info('Creating some transactions...');
andrewCoin.createTransaction(new Transaction('address1', 'address2', 100));
andrewCoin.createTransaction(new Transaction('address2', 'address1', 50));

console.info('Starting the miner...');
andrewCoin.minePendingTransactions('andrews-address');

console.info(
  'Balance of Andrew\'s address is',
  andrewCoin.getBalanceOfAddress('andrews-address'),
);

console.info('Starting the miner again!');
andrewCoin.minePendingTransactions('andrews-address');

console.info(
  'Balance of Andrew\'s address is',
  andrewCoin.getBalanceOfAddress('andrews-address'),
);
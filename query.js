var bitcoin = require('../bitcoin');
var Util = require('../util');
var Step = require('step');
var Bignum = bitcoin.bignum;

function getOutpoints(blockChain, txStore, txs, callback) {
  if (!Array.isArray(txs)) {
    txs = [txs];
  }

  Step(
    function fetchTxInputsStep() {
      var group = this.group();
      txs.forEach(function (tx) {
        if (tx.isCoinBase()) return;

        var callback = group();
        tx.cacheInputs(blockChain, txStore, false, function (err, cache) {
          if (err) {
            callback(err);
            return;
          }

          tx.ins.forEach(function (txin) {
            var prevTx = cache.txIndex[txin.getOutpointHash().toString('base64')];

            txin.source = prevTx[txin.getOutpointIndex()];
          });
          callback();
        });
      });
    },
    function calculateStep(err) {
      if (err) throw err;

      txs.forEach(function (tx, i) {
        tx.totalIn = Bignum(0);
        tx.totalOut = Bignum(0);
        tx.ins.forEach(function (txin, j) {
          if (txin.isCoinBase()) return;

          tx.totalIn = tx.totalIn.add(Util.valueToBigInt(txin.source.v));
        });
        // TODO: Add block value to totalIn for coinbase
        tx.outs.forEach(function (txout, j) {
          tx.totalOut = tx.totalOut.add(Util.valueToBigInt(txout.v));
        });

        if (!tx.isCoinBase()) tx.fee = tx.totalIn.sub(tx.totalOut);
      });
      this(null, txs);
    },
    callback
  );
};

function formatTx(tx) {
  var standard = tx.getStandardizedObject();
  var data =
    { 'hash' : standard.hash
    , 'totalIn': Util.formatValue(tx.totalIn)
    , 'totalOut': Util.formatValue(tx.totalOut)
    , 'fee': (tx.fee) ? Util.formatValue(tx.fee) : "0.0"
    , 'in' : []
    , 'out' : []
    }

  tx.ins.forEach(function (txin, j) {
    if (txin.isCoinBase()) {
      console.log(txin);
      data.in.push(
        { type : 'coinBase'
        }
      )
      return;
    }
    if (txin.source) {
      data.in.push(
        { sourceAddr : Util.pubKeyHashToAddress(txin.source.getScript().simpleOutPubKeyHash())
        , value : Util.formatValue(txin.source.v)
        , prev_tx : standard.in[j].prev_out.hash
        }
      )
    }
  })

  tx.outs.forEach(function (txout, j) {
    data.out.push(
      { toAddr : Util.pubKeyHashToAddress(txout.getScript().simpleOutPubKeyHash())
      , value : Util.formatValue(txout.v)
      }
    )
  })

  return data;
}

exports.txquery = function (args, opt, callback) {
  var hash64 = args[0];
  var hash = new Buffer(hash64, 'base64');

  var storage = this.node.getStorage();
  var blockChain = this.node.getBlockChain();
  var txStore = this.node.getTxStore();

  var result = {};

  Step(
    function getMemTxStep() {
      txStore.get(hash, this);
    },
    function getChainTxStep(err, tx) {
      if (tx) {
        // We already found the transaction, just store it
        result.tx = tx;
        // And then skip to fetchOutpointsStep
        throw 'fetchop';
      } else {
        // The transaction isn't in the memory pool, check the database
        storage.getTransactionByHash(hash, this);
      }
    },
    function getBlockHashStep(err, tx) {
      if (err) throw err;

      if (tx) {
        // We found the transaction, store it
        result.tx = tx;
      } else {
        // We still couldn't find the transaction, return undefined
        callback(null, undefined);
        return;
      }

      // Get the containing block
      storage.getContainingBlock(hash, this);
    },
    function getBlockStep(err, blockHash) {
      if (err) throw err;

      if (!blockHash) {
        // TODO: Strange orphan (corrupt db)
        callback(null, new Error('Block containing transaction not indexed, '
                                 + 'db corrupt.'));
        return;
      }

      // Get the containing block
      storage.getBlockByHash(blockHash, this);
    },
    function storeBlockStep(err, block) {
      if (err) throw err;

      if (!block) {
        // TODO: Strange orphan (corrupt db)
        callback(null, new Error('Block containing transaction not found, '
                                 + 'db corrupt.'));
        return;
      }
      result.block = block.getStandardizedObject();
      this(null);
    },
    function fetchOutpointsStep(err) {
      if (err && err !== 'fetchop') throw err;
      getOutpoints(blockChain, txStore, result.tx, this);
    },
    function returnResultStep(err) {
      if (err) throw err;

      result.tx = formatTx(result.tx);

      this(null, result);
    },
    callback
  );
};

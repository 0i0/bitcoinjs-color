var express = require('express');
var bitcoin = require('bitcoinjs');
var RpcClient = require('jsonrpc2').Client;
var Util = module.exports = require('bitcoinjs').Util;

var fs = require('fs');
var init = require('bitcoinjs/daemon/init');
var config = init.getConfig();

var app = module.exports = express();

var rpcClient = new RpcClient(config.jsonrpc.port, config.jsonrpc.host,
                              config.jsonrpc.username, config.jsonrpc.password);

var rpc = rpcClient.connectSocket();

rpc.on('connect', function () {
  var moduleSrc = fs.readFileSync(__dirname + '/query.js', 'utf8');
  rpc.call('definerpcmodule', ['explorer', moduleSrc], function (err) {
    if (err) {
      console.error('Error registering query module: '+err.toString());
    }
  });
});

/*var vm = require('vm')
var str = fs.readFileSync(__dirname + '/color.js', 'utf8');
this.console = console
vm.runInNewContext(str, this);
*/

// Configuration

app.configure(function(){
  app.set('views',__dirname + '/views')
  app.set('view engine', 'jade')
  app.set('view options', { layout: false })
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

// Routes
app.get('/',function(req, res){
  res.render('home.jade',{})
})

app.get('/json/tx/:txHash', function(req, res, next){
  hash = Util.decodeHex(req.params.txHash).reverse();
  var hash64 = hash.toString('base64');
  rpc.call('explorer.txquery', [hash64], function (err, tx) {
    if (err) return next(err);
    res.write(JSON.stringify(tx.tx));
    res.end();
  });
});

app.get('/tx/:txHash', function(req, res, next){
  hash = Util.decodeHex(req.params.txHash).reverse();
  var hash64 = hash.toString('base64');
  rpc.call('explorer.txquery', [hash64], function (err, tx) {
    if (err) return next(err);
    res.render('tx.jade',
      { tx : tx.tx
      }
    )
  });
});

if (!module.parent) {
  app.listen(3333);
  console.info("Express server listening on port " + 3333);
}

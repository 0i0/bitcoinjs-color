bitcoinjs-color
===============

Tool to check colored bitcoin on bitcoinjs

Installation in Ubuntu:

after fresh install

    sudo apt-get update

Dependencies

    sudo apt-get install build-essential python2.7 pkg-config libssl-dev git

Node v0.8.8

    git clone git://github.com/joyent/node.git
    cd node
    git checkout v0.8.8
    ./configure
    make
    sudo make install

Install bitcoinJS:

    sudo npm install -g bitcoinjs --unsafe-perm

    mkdir /home/ubuntu/.bitcoinjs
    cp /usr/local/lib/node_modules/bitcoinjs/daemon/settings.example.js /home/ubuntu/.bitcoinjs/settings.js

Install bitcoinJS-color:

    cd ~

    git clone https://github.com/0i0/bitcoinjs-color.git

    cd bitcoinjs-color/
    sudo npm link bitcoinjs
    sudo npm install

    cp ~/bitcoinjs-color/node_modules/bitcoinjs/daemon/settings.example.js ~/bitcoinjs-color/node_modules/bitcoinjs/daemon/settings.js

Edit ~/bitcoinjs-color/node_modules/bitcoinjs/daemon/settings.js
Change the following:

    cfg.jsonrpc.enable = true;
    cfg.jsonrpc.password = "admin";

This is for Amazon AWS to work on port 80

    sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-ports 3000

Running

    bitcoinjs start
    node app.js
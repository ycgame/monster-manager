
Manager = function(){

    var _this = this;
    
    var WebSocket = require('websocket').client;

    this.ws = new WebSocket();

    this.monsters = [];
    
    this.ws.on('connectFailed', function(error){
	_this.log('Connect Failed ... '+error.toString());
    });

    this.ws.on('connect', function(connection){
	
	_this.connection = connection;

	_this.log('WebSocket Connect!');

	_this.connection.on('error', function(error){
	    _this.log('Error: '+error.toString());
	});

	_this.connection.on('message', function(msg){
	    data = JSON.parse(msg.utf8Data);
	    msg  = data['message'];
	});

    });

    this.log('Start');

}

Manager.prototype.log = function(msg){
    console.log('[Manager] '+msg);
}

Manager.prototype._channel = function(){
    res = {};
    res['channel'] = 'DungeonChannel';
    return JSON.stringify(res);
}

Manager.prototype._subscribe = function(){
    command = {};
    command['command'] = 'subscribe';
    command['identifier'] = this._channel();
    return JSON.stringify(command);
}

Manager.prototype._auth = function(){
    
    data = {};
    data['action'] = 'mm_auth';
    data['stoken'] = 'aaa';
    
    command = {};
    command['command'] = 'message';
    command['identifier'] = this._channel();
    command['data'] = JSON.stringify(data);

    return JSON.stringify(command);
}

Manager.prototype.subscribe = function(){

    var _this = this;
    
    setTimeout(function(){
	_this.log('Subscribe');
	_this.connection.sendUTF(_this._subscribe());
	_this.auth();
    }, 1000);
}

Manager.prototype.auth = function(){
    
    var _this = this;

    setTimeout(function(){

	_this.log('MM Authentication');
	_this.connection.sendUTF(_this._auth());

	var Monster = require('./monster');

	_this.monsters.push(new Monster(1));

    }, 1000);
};

Manager.prototype.run = function(){

    var _this = this;

    this.ws.connect('ws://localhost:3000/cable');
    
    setTimeout(function(){
	_this.subscribe();
    }, 1000);
}

monster = new Manager();
monster.run();


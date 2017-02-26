
/**
*  This is a cometd library to support the websocket, long-polling connection

*  @Filename: usermedia.js
*  @Version : 3.0
*  @Author  : Zhao Guoshuai
*  @Date    : 2012-12-24
*/

/*
 * to ensure that the "this" pointer doesn't change in the callback function 
 */
Function.prototype.Apply = function(thisObj){
	var _method = this;
	return function(data){
		return _method.apply(thisObj, [data]);
	};
}

/*
 * the cometd connection class
 */
var CometdConnection = function(host, userName){
	var self = this;
	this.host = host;
	this.userName = userName;
	this.disconnecting = false;
	this.connected = false;
	this.webrtcSubscription = null;

	this.onLoginSuccess = null;
    this.onLoginFail = null;
	this.onLogoutFinish = null;
    this.onHandleMessage = null;
    this.onConnectionError = null ;
    this.onConnectionOpened = null ;
	
	// $.cometd.websocketEnabled = false;
    $.cometd.addListener('/meta/handshake', this.metaHandshake.Apply(this));
    $.cometd.addListener('/meta/connect', this.metaConnect.Apply(this));  	
    $.cometd.addListener('/meta/disconnect',this.metaDisconnect.Apply(this));
}


CometdConnection.prototype.connect = function()
{   
	this.disconnecting = false;
	
	$.cometd.configure({
        url: this.host,
        logLevel: 'warn',
        backoffIncrement: 10000,
        maxConnections: 6
    });
    $.cometd.handshake();
}

CometdConnection.prototype.metaDisconnect = function(message)
{   
	this.disconnecting = true;
	this.connected = false;
    // com.webrtc.disconnect();
}

/*
 * the function to handle the meta channel
 */
CometdConnection.prototype.metaConnect = function(message)
{
	/*
	 * connect callback，if success call the connectionEstablished to register with the server
	 * if failed call the connectionBroken
	 */
    if (this.disconnecting)
    {
    	this.connected = false;
    	this.connectionClosed();
    }
    else
    {
    	//if the status change from false to true，then the connection is established
    	//if the status change from true to false, then the connection is broken
        var wasConnected = this.connected;
        this.connected = message.successful === true;
        if (!wasConnected && this.connected)
        {
        	this.connectionEstablished();
        }
        else if (wasConnected && !this.connected)
        {
        	this.connectionBroken();
        }
    }
}

/*
 * the function to handshake with the server
 */
CometdConnection.prototype.metaHandshake = function(message)
{
	/*
	 * handshake successfully
	 */
    if (message.successful)
    {
    	this.connectionInitialized();
    }
}

/*
 * set the host address
 */
CometdConnection.prototype.setHostAddress = function(host)
{
	this.host = host;
}

/*
 * set the user name
 */
CometdConnection.prototype.setUserName = function(userName)
{
	this.userName = userName;
}

/*
 * connection initialized function, subscribe broadcast channel
 */
CometdConnection.prototype.connectionInitialized = function()
{
    // first time connection for this client, so subscribe tell everybody.
    /*$.cometd.batch(function()
    {
    	
    });*/
	$.cometd.batch(this.subscribe.Apply(this));
}

/*
 * connection established function, register with the server through /service/members channel
 */
CometdConnection.prototype.connectionEstablished = function()
{
    // connection establish (maybe not for first time), so just
    // tell local user and update membership
	
	this.onConnectionOpened();
    //console.log("connectionEstablished!");
    $.cometd.publish('/service/members', {
        user: this.userName,
        room: '/room/webrtc'
    });
    //this.onLoginSuccess();

}

/*
 * define the connectionClosed function of cometd connection
 */
CometdConnection.prototype.connectionClosed = function()
{
	//com.webrtc.onConnectionClosed();
	console.log("connectionClosed");
	this.onLogoutFinish();
}

/*
 * define the connectionBroken function of cometd connection
 */
CometdConnection.prototype.connectionBroken = function()
{
	//com.webrtc.onConnectionError();
	this.onConnectionError();
	this.onLoginFail();
}

/*
*  Func : define the onMessage function of cometd connection
*  params : message - message received from cometd server
*/
CometdConnection.prototype.onMessage = function(message){
    var fromUser = message.data.user;
    var text = message.data;
	//com.webrtc.handleMessage(text);
	this.onHandleMessage(text);
}

/*
 * subscribe the broadcast channel
 */
CometdConnection.prototype.subscribe = function(){
	this.webrtcSubscription = $.cometd.subscribe('/room/webrtc', this.onMessage.Apply(this));
}

/*
 * unsubscribe the broadcast channel
 */
CometdConnection.prototype.unsubscribe = function(){
    if (this.webrtcSubscription)
    {
        $.cometd.unsubscribe(this.webrtcSubscription);
    }
    this.webrtcSubscription = null;
}

/*
*  Func : define the sending message function of WebSocket
*		  called by WebSocket
*  params : message - message need to send
*/
CometdConnection.prototype.sendMessage = function(message){
	try{
		var msgString = JSON.stringify(message);
	    $.cometd.batch(function()
	    {
	        $.cometd.publish('/service/privatechat', {
	            room: '/room/webrtc',
	            data: msgString,
	        });	    	
	    });
	}catch(err){
		console.log(err);
	}
}

CometdConnection.prototype.readyState = {
	"connecting" : 0,
	"open"       : 1,
	"closing"    : 2,
	"closed"     : 3
}

/*
 * return the status of connection
 */
CometdConnection.prototype.getStatus = function(){
	if(this.connected == true){
		return 1;
	} else{
		return 3;
	}
}

/*
*  Func : close the cometd connection
*/
CometdConnection.prototype.close = function(){
	console.log("Cometd connection close!");
	//recycle the resource
    $.cometd.batch(this.unsubscribe.Apply(this));
    $.cometd.disconnect();
    this.disconnecting = true;
}

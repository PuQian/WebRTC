<!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML//EN">
<html>
<head>
  <meta http-equiv="content-type" content="text/html;charset=utf-8">
  <title>WebRTC Demo</title>
  <script type="text/javascript" src="../js/plugin_video/main.js"></script>
  <script type="text/javascript" src="../js/plugin_video/util.js"></script>
  <script type="text/javascript" src="../js/plugin_video/rtcprotocol.js"></script>
  <script type="text/javascript" src="../js/plugin_video/usermedia.js"></script>
  <script type="text/javascript" src="../js/plugin_video/peerconnection.js"></script>
  <script type="text/javascript" src="../js/plugin_video/websocket.js"></script>
</head>
<body>
  <table border="0">
    <tr>
      <td>Local  Video</td>
      <td>Remote Video</td>
    </tr>
    <tr>
      <td><video width="320" height="240" id="local_media"
          autoplay="autoplay"></video></td>
      <td><video width="320" height="240" id="remote_media"
          autoplay="autoplay"></video></td>
      <td><canvas id="frame_buffer" style="visibility:hidden"></canvas></td>
    </tr>
  </table>
  <hr>
  <div id="config">
	Server:<input type="text" id="server" value="ws://10.108.119.42:8888"/><br>
	Name&nbsp;&nbsp;:<input type="text" id="clientid"><br>
	<!--input type="button" id="connect" value="connect" onClick="connectToServer()"/-->
	<input type="button" id="start" value="connect" onClick="com.webrtc.connect()"/>
	<!--input type="button" id="captureLocalMedia" value="getUserMedia" onClick="com.webrtc.captureLocalMedia()"/-->
	<input type="button" id="call" value="call" onClick="com.webrtc.call(true,true)"/>
	<input type="button" id="hangup" value="hangUp" onClick="com.webrtc.hangUp()"/>
	<!--input type="button" id="disconnect" value="disconnect" onClick="disconnect()"-->
  </div>
</body>
</html>
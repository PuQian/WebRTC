<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>WebRTC XMPP Lib</title>
  <script type='text/javascript' src='../js/plugin_im/flXHR.js'></script>
 <!--  <script type='text/javascript' src='../js/plugin_im/jquery-1.8.2.min.js'></script> -->
  <script type='text/javascript' src='../js/plugin_im/jquery.flXHRproxy.js'></script>
  <script type='text/javascript' src='../js/plugin_im/strophe.min.js'></script>
  <script type='text/javascript' src='../js/plugin_im/strophe.flxhr.js'></script>
  <script type='text/javascript' src='../js/plugin_im/webrtc_xmpp-1.2.js'></script>
  <script type='text/javascript' src='../js/plugin_im/test.js'></script>
</head>
<body>
  <h2>Login Area</h2>
  <div id='login' style='text-align: center;'>
	<form>
	  <label for='url'>BOSH Url:</label>
	  <input type='text' id='url' value='http://mysparkweb.free4lab.com/http-bind/' size='80'/>
	</form>
	<form>
      <label for='jid'>JID:</label>
      <input type='text' id='jid' />
      <label for='pass'>Password:</label>
      <input type='password' id='pass' />
      <input type='button' id='connect' value='connect' />
    </form>
  </div>
  <hr />
  
  <h2>Roster Area</h2>
  <div id='presence-test'></div>
  <hr />
  
  <h2>Message Area</h2>
  <div id='message-test' style='text-align: center;'>
	<form>
      <label for='receiver'>Receiver JID:</label>
      <input type='text' id='receiver-jid' />
      <label for='msg'>Message:</label>
      <input type='text' id='msg-content' />
      <input type='button' id='send-msg' value='send' />
    </form>
	<form>
      <label for='friend'>Friend JID:</label>
      <input type='text' id='friend-jid' />
      <input type='button' id='add-friend' value='Add' />
    </form>
  </div>
  <hr />
  
  <h2>Logs Area</h2>
  <div id='log'></div>
  
</body>
</html>

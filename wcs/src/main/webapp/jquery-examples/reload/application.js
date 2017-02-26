require({
    baseUrl: '../../jquery',
    paths: {
        jquery: 'jquery-1.8.2',
        org: '../org'
    }
},
['jquery', 'jquery.cometd', 'jquery.cometd-reload'],
function($, cometd)
{
    $(document).ready(function()
    {
      cometd.getExtension('reload').configure({cookieMaxAge:10});

      /* handshake listener to report client IDs */
      cometd.addListener('/meta/handshake', function(message)
      {
          if (message.successful)
          {
              $('#previous').html(org.cometd.COOKIE.get('demoLastCometdID'));
              $('#current').html(message.clientId);
              org.cometd.COOKIE.set('demoLastCometdID', message.clientId, {
                  'max-age': 300,
                  path : '/',
                  expires: new Date(new Date().getTime() + 300 * 1000)
              });
          }
          else
          {
              $('#previous').html('Handshake Failed');
              $('#current').html('Handshake Failed');
          }
      });

      /* connect listener to report advice */
      cometd.addListener('/meta/connect', function(message)
      {
          if (message.advice)
          {
              $('#advice').html(org.cometd.JSON.toJSON(message.advice));
          }
      });

      /* Initialize CometD */
      var cometURL = new String(document.location).replace(/\/jquery-examples\/.*$/, '') + '/cometd';
      cometd.init({
          url: cometURL,
          logLevel: 'debug'
      });

      /* Setup reload extension */
      $(window).unload(function()
      {
          cometd.reload({
              cookieMaxAge: 8
          });
      });
    });
});

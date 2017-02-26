/*
 * WebRTC XMPP��ʾ��
 * @Date: 2012/10/17
 * @Author: Feng Kai
 * ע����������Ŀǰ��δʵ�����еĹ��ܣ�ֻ�Ǽ򵥵�չʾ
 */

 //�����������
function log(msg) {
    $('#log').append('<div></div>').append(document.createTextNode(msg));
}

//��ʾ�����б�ĺ���
function roster_log(msg) {
	$('#presence-test').append('<div></div>').append(document.createTextNode(msg));
}

$(document).ready(function() {
	//�ص�����onRoster����WebApp���յ������б�󣬻���øú���
	//����Ĳ���ΪArray<Object>���ͣ�ÿ��Object����String���͵�jid��name�����ֶ�
	//�û���ȡ�ĺ����б���Ĭ��״̬�������û���״̬����offline
	com.xmpp.onRoster = function(user_list) {
		if (user_list.length > 0) {
			for(var i = 0; i < user_list.length; i++){
				roster_log(user_list[i].jid);
			}
		}
	};
	
	//�ص�����onPresenceStatusChanged����WebApp��ĳ���û���״̬�ı�ʱ������øú���
	//����Ĳ���ΪObject���ͣ�����String���͵�jid��status������status����online��offline��away����״̬
	com.xmpp.onPresenceStatusChanged = function(data) {
		roster_log('jid === ' + data.jid + ' status === ' + data.status);
	};
	
	//�ص�����onRosterItemRemoved����WebApp�����б���ĳ���û����Ƴ�ʱ������øú���
	//����Ĳ���ΪString���͵�jid
	com.xmpp.onRosterItemRemoved = function(jid) {
		roster_log('jid === ' + data.jid + ' has removed me from his roster!!!');
	};
	
	//�ص�����onChatMessage����WebApp�յ���ʱ��Ϣʱ������øú���
	//����Ĳ���ΪObject���ͣ�����String���͵�jid��message����
	com.xmpp.onChatMessage = function(data) {
		log('Receive message from ' + data.jid + ': ' + data.message);
	};
	
	com.xmpp.onPresenceUnsubscribe = function(jid) {
		log('User ' + jid + ' delete you from his roster');
	};
	
/*
	//�ص�����onPresenceSubscribe����WebApp���յ���Ӻ��ѵ�����ʱ������øú���
	//����Ĳ���ΪString���͵�jid�����붩����״̬������Ϊ���ѣ����û�jid
	com.xmpp.onPresenceSubscribe = function(jid) {
		log('jid === ' + jid + ' wants to subscripe your status, the default operation is yes');
		//����approveSubscribe��ͬ��Է�����Լ�Ϊ���ѣ�����Ϊ�Է��û���jid
		com.xmpp.approveSubscribe(jid);
		//����subscribeFriend��������Ӻ�����������ӶԷ�Ϊ���ѣ�����ΪString���͵ĶԷ�jid��name���ؼ���jid��
		//ע�����������뵥�������Ӻ��ѣ���ͬ������󣬲���Ҫ�ٵ��øú���
		com.xmpp.subscribeFriend(jid, 'Feng Kai');
	};
*/
	
	//�ص�����onConnected����WebApp��Openfire֮���BOSH���ӽ����ɹ��󣬵��øú���
	com.xmpp.onConnected = function() {
		log('Connected');
	};
	
	//�ص�����onConnectFail����WebApp��Openfire֮���BOSH���ӽ���ʧ�ܺ󣬵��øú���
	com.xmpp.onConnectFail = function() {
		log('Connect failed');
	};
	
	//�ص�����onConnectAuthFail����WebApp����BOSH����ʱ����Ȩ��֤ʧ�ܺ󣬵��øú���
	com.xmpp.onConnectAuthFail = function() {
		alert('Auth failed because your JID or Password is wrong');
	};
	
	//�ص�����onDisconnected����WebApp��Openfire֮���BOSH���ӶϿ��󣬵��øú���
	com.xmpp.onDisconnected = function() {
		log('Disconnected');
	};
	
    $('#connect').bind('click', function (){
		var button = $('#connect').get(0);
		if (button.value == 'connect') {
			button.value = 'disconnect';
			var username = $('#jid').get(0).value;
			var url = $('#url').get(0).value;
			//������������Ҫʹ�õĻص�����󣬵���initialize��������BOSH���ӵ�����
			//����Ĳ���ΪString���͵�URL���û���ʶ�����룬����URLΪOpenfire������BOSH�˿ڵĵ�ַ
			com.xmpp.initialize(url, username, $('#pass').get(0).value);
			console.log('url: ' + url + ' username: ' + username + ' password: ' + $('#pass').get(0).value);
		} 
		else {
			button.value = 'connect';
			//����close���ر�WebApp��Openfire֮���BOSH���ӣ��û��˳�WebApp
			com.xmpp.close();
		}
    });
	
	$('#send-msg').bind('click', function() {
		var jid = $('#receiver-jid').get(0).value;
		var content = $('#msg-content').get(0).value;
		//����ֱ�ӳ�����Ϣ̽��Է�״̬��Ŀǰδ����ȷ���������ڵ��Թ����
		//��Ϊ�û�״̬��������ʵʱ���£������ݲ���Ҫ�ú���
		//com.xmpp.sendDirectPresence(jid);
		
		//����sendChatMessage�����øú��������ĳһ���ѣ�����İ���ˣ����ͼ�ʱ��Ϣ
		//����Ĳ���ΪString���͵ĶԷ�jid�ͼ�ʱ��Ϣ����
		com.xmpp.sendChatMessage(jid, content);
		log('Send message to ' + jid + ': ' + content);
	});
	
	$('#add-friend').bind('click', function() {
		var jid = $('#friend-jid').get(0).value;
		//����subscribeFriend��������Ӻ�����������ӶԷ�Ϊ����
		//����Ĳ���ΪString���͵ĶԷ�jid��name���ؼ���jid��
		com.xmpp.subscribeFriend(jid, 'Qie Pei');
		//com.xmpp.addRosterItem(jid, 'Qie Pei');
	});
});
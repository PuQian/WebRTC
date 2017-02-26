/**
 * This is a Strophe based XMPP library for WebRTC system
 * Before using this XMPP library, you need to prepare:
 * 1) strophe_webrtc.js, modified by fengk
 * 2) jQuery.js
 * 3) jQuery plug-in cookies
 * 4) flXHR related scripts and flash files
 *
 * @Version: 1.6
 * @Date: 2012/11/16
 * @Author: Feng Kai
 * 
 * Update:
 * 1) Make add friends as two directions
 * 
 * Problems:
 * 1) How to get the real name of the one who wants to add you as his or her friend?
 */

/**
 * WARNING: all the JIDs are used as e-mail, the '@' in e-mail will be replaced by '#'
 * Example: e-mail ID like fengkai@gmail.com, JID like fengkai#gmail.com@openfire
 */
 
if (typeof com == 'undefined') {
    var com = new Object();
}

var openfire_url;

var wcs_url;

/**
 * com.servers has the IP address or domain of WebRTC servers
 * In the future, the server list can be got from the login web server by Ajax
 */

//用ajax获取wcs,openfire以及stun的地址


$.ajax({
	url:"/WCLnew/serverAdd",
    type:"post",
    async:false,
    data:{},
    dataType:"json",
    success:function(data){
    	console.log(data);
    	openfire_url = data.openfire_add;
    	console.log("openfire_url:"+openfire_url);
    	wcs_url = data.wcs_add;
    	console.log("wcs_url:"+wcs_url);
    	stun_url = data.stun_add;
          }
	
        } 
      )

//     $.ajax({
//	url:"/hb/address/select_dynamic.hb",
//    type:"post",
//    async:false,
//    data:{"addressUrl":$('.pub_banner').attr("user")},
//    dataType:"json",
//    success:function(data){
//    
//    	wcs_url = data.addressUrl;
//    	console.log("!!!wcs_url:"+wcs_url);
//          }
//	
//        } 
//      )







com.servers = new Array(
    "webrtc"
);
 




/**
 * com.urls has the URLs of WebRTC(Openfire) servers
 */ 
com.urls = new Array(
		openfire_url,
		"http://messageofadmin.free4lab.com"     // 9090
);

/**
 * com.webrtcUrl has the URLs of WebRTC(WebSocket) servers
 */
com.websockets = new Array(		
		wcs_url
);

/**
 * A series of functions to set server domain and url
 * server domain is used by jid, url is used to construct BOSH connection
 */
com.addServerAndUrl = function(domain, url) {
    if (typeof domain === 'string' && typeof url === 'string') {
        com.servers.push(domain);
        com.urls.push(url);
    }
}

/**
 * com.groups has groups information
 * root group is Friends
 */
com.root_group = "我的好友";
 
com.groups = new Array(com.root_group);

/**
 * com.rooms stores the room the user has joined.
 */

com.rooms = new Array();
  
/**
 * com.domain has the algorithm to calculate the domain user belongs to
 */
com.domain = {
    calculatePos: function(email_id) {
        /** 
         * The domain algorithm
         * JavaScript method charCodeAt() can get the UNICODE value of char, the return value(positive integer) is between 0 - 65535
         * Example: StringObject.charCodeAt(index)
         */
        var sum = new Number(0);
        for (var i = 0; i < email_id.length; i++) {
            sum += email_id.charCodeAt(i);
        }
        var pos = sum % com.servers.length;
        return pos;
    },
    
    calculateDomain: function(email_id) {
        var pos = com.domain.calculatePos(email_id);
        return com.servers[pos];
    },
    
    getServerUrl: function(domain) {
        var pos = new Number(-1);
        for (var i = 0; i < com.servers.length; i++) {
            if (com.servers[i] == domain) {
                pos = i;
                break;
            }
        }
        if (pos < 0) 
            return null;
        else
            return com.urls[pos];
    }
};
 
/**
 * com.util has some basic utils
 */
com.util = {
    isFunction: function(handler) {
        return !!handler && (typeof handler) == 'function';
    },
    
    isStringEmpty: function(str) {
        if (str == null || (typeof str) == 'undefined')
            return true;
        if (str.length > 0)
            return false;
        else
            return true;
    },
    
    isEmailId: function(id) {
        if (id.indexOf('@') != -1)
            return false;
        else
            return true;
    },
    
    modifyEmailId: function(email_id) {
        return email_id.replace('@', '#');
    },
    
    usernameToEmailId: function(username) {
        return username.replace('#', '@');
    },
    
    jidToEmail: function(jid) {
        var bare_jid = Strophe.getBareJidFromJid(jid);
        // Bare JID is like fengkai#gmail.com@openfire
        var domain_pos = bare_jid.indexOf('@');
        return bare_jid.substr(0, domain_pos).replace('#', '@');
    },
    
    emailToJid: function(email_id) {
        var domain = com.domain.calculateDomain(email_id);
        return email_id.replace('@', '#') + '@' + domain;
    }
};

/**
 * com.user stores user's basic information
 */
com.user = {
    // The email ID is like fengkai@bupt.edu.cn
    email_id: null,
    
    // The node ID is like fengkai#bupt.edu.cn
    node_id: null,
    
    resource: 'webrtc',
    
    separator: '/',
    
    // Used for JID 
    domain: null,
    
    // Used for BOSH connection
    server_url: null,
    
    getBareJid: function() {
        return com.user.node_id + '@' + com.user.domain;
    },
    
    getFullJid: function() {
        return com.user.node_id + '@' + com.user.domain + com.user.separator + com.user.resource;
    }
};

/**
 * com.discovery used to get the service provided by XMPP server
 */
com.discovery = {
    features_list: null,

    getDiscoveryItems: function(to_jid) {
        var iq = $iq({type: 'get', to: to_jid}).c('query', {xmlns: 'http://jabber.org/protocol/disco#items'});
        com.xmpp.connection.sendIQ(iq, com.discovery.discoveryItemsHandler, com.discovery.iqErrorHandler);
    },
    
    discoveryItemsHandler: function(iq) {
        if (com.discovery.features_list == null) {
            com.discovery.features_list = new Array();
        }
        /**
         * The response is like this:
         * <iq type="result", id="query_18", from="openfire", to="fengkai#163.com@openfire">
         *   <query xmlns="http://jabber.org/protocol/disco#items">
         *     <item jid="search.openfire" name="User Search"/>
         *     <item jid="proxy.openfire" name="Sock 5 Bytestreams Proxy"/>
         *     <item jid="pubsub.openfire" name="Publish-Subscribe service"/>
         *   </query>
         * </iq>
         */
        $(iq).find('item').each(function() {
            var jid = $(this).attr('jid');
            var name = $(this).attr('name') | jid;
            var itemInfo = new Object();
            itemInfo.jid = jid;
            itemInfo.name = name;
            com.discovery.features_list.push(itemInfo);
        });
        
        $(document).trigger('search_discovery', {domain: $(iq).attr('from')});
    },
    
    /**
     * Find whether support the functions
     * @param Service name
     * @return JID of service
     */
    findServiceItems: function(name) {
        if (com.discovery.features_list == null || name == null)
            return null;
        
        for (var i = 0; i < com.discovery.features_list.length; i++) {
            if (com.discovery.features_list[i].jid.search(name) != -1) {
                return com.discovery.features_list[i].jid;
            }
        }
        return null;
    },
    
    /**
     * Query details of the service
     * @param JID of service
     * @param Callback function for details
     */
    queryDetailsInfo: function(service_jid, successCallback) {
        var iq = $iq({type: 'get', to: service_jid}).c('query', {xmlns: 'http://jabber.org/protocol/disco#info'});
        com.xmpp.connection.sendIQ(iq, successCallback, com.discovery.iqErrorHandler);
    },
    
    iqErrorHandler: function(iq) {
        console.log("Discovery or Query Details IQ Error: " + Strophe.serialize(iq))
    }
};

/**
 * Bind an event to show the discovery for one XMPP server is ready
 */
$(document).bind('search_discovery', function(event, data) {
    com.search.domain = data.domain;
    var jid = com.discovery.findServiceItems("search");
    if (jid != null) {
        com.search.supported = true;
    }
    else {
        com.search.supported = false;
    }
    com.search.search_service_jid = jid;
    com.search.getSearchFields();
    /**
     * Judge whether there are waiting search users
     */
    var waiting_search_id = com.search.getWaitingEmailId();
    if (waiting_search_id != null) {
        com.search.sendSearchForm(waiting_search_id,'user');
    }
});

/**
 * com.search use the XEP-0055:http://xmpp.org/extensions/xep-0055 specification to search users on XMPP server
 */
com.search = {
    // The server which we are querying
    domain: null,
    // Whether the server support user searching
    supported: null,
    
    search_service_jid: null,
    // When the domain value is not right, the user's ID who wants to be searched will be stored
    waiting_email_id: null,
    
    initialize: function(domain) {
        /**
         * Get the service items this server supported
         */
        com.discovery.getDiscoveryItems(domain);
    },
    
    isSuppportedSearch: function(domain) {
        if (com.search.supported == null || com.search.domain == null || domain == null) {
            return false;
        }
        if (com.search.domain != domain) {
            // Should call the initialize(domain) again to test
            com.search.initialize(domain);
            return false;
        }
        return com.search.supported;
    },
    
    setWaitingEmailId: function(email_id) {
        com.search.waiting_email_id = email_id;
    },
    
    getWaitingEmailId: function() {
        return com.search.waiting_email_id;
    },
    
    clearWaitingEmailId: function() {
        com.search.waiting_email_id = null;
    },
    
    getSearchFields: function() {
        var iq = $iq({type: 'get', to: com.search.search_service_jid}).c('query', {xmlns: 'jabber:iq:search'});
        com.xmpp.connection.sendIQ(iq, com.search.searchFieldHandler , com.search.iqErrorHandler);
    },
    
    /**
     * The response is like this:
     * <iq type="result" id="query_20" from="search.openfire" to="fengkai#163.com@openfire">
     *   <query xmlns="jabber:iq:search">
     *     <instructions>
     *       The following fields are available for searching. Wildcard (*) characters are allowed as part the of query.
     *     </instructions>
     *     <first/>
     *     <last/>
     *     <nick/>
     *     <email/>
     *     <x xmlns="jabber:x:data" type="form">
     *       <title>Advanced User Search</title>
     *       <instructions>
     *         The following fields are available for searching. Wildcard (*) characters are allowed as part the of query.
     *       </instructions>
     *       <field var="FORM_TYPE" type="hidden">
     *         <value>jabber:iq:search</value>
     *       </field>
     *       <field var="search" type="text-single" label="Search">
     *         <required/>
     *       </field>
     *       <field var="Username" type="boolean" label="Username">
     *         <value>1</value>
     *       </field>
     *       <field var="Name" type="boolean" label="Name">
     *         <value>1</value>
     *       </field>
     *       <field var="Email" type="boolean" label="Email">
     *         <value>1</value>
     *       </field>
     *     </x>
     *   </query>
     * </iq>
     */
    searchFieldHandler: function(iq) {
        console.log("Search Form Details: " + Strophe.serialize(iq));
    },
    
    /**
     * Just query users by username (fk187andhk#gmail.com)
     * The send search form is like this:
     * <iq type="set" id="query_22" from="fengkai#163.com@openfire" to="search.openfire">
     *   <query xmlns="jabber:iq:search">
     *     <x xmlns="jabber:x:data" type="submit">
     *       <field var="Username">
     *         <value>1</value>
     *       </field>
     *       <field var="search">
     *         <value>fk187andhk#gmail.com</value>
     *       </field>
     *       <field var="FORM_TYPE" type="hidden">
     *         <value>jabber:iq:search</value>
     *       </field>
     *     </x>
     *   </query>
     * </iq>
     */
    sendSearchForm: function(email_id, type) {
    	var search_service_jid, search_field;
    	if (type == 'user') {
    		search_service_jid = com.search.search_service_jid;
    		search_field = 'Username';
    	}
    	else if (type == 'room') {
    		search_service_jid = 'chat.webrtc';
    		search_field = 'Name';
    	}
        var form_iq = 
            $iq({type: 'set', to: search_service_jid})
            .c('query', {xmlns: 'jabber:iq:search'})
            .c('x', {xmlns: 'jabber:x:data', type: 'submit'})
            .c('field', {'var': search_field})
            .c('value')
            .t('1')
            .up().up()
            .c('field', {'var': 'search'})
            .c('value')
            .t(email_id)
            .up().up()
            .c('field', {'var': 'FORM_TYPE', type: 'hidden'})
            .c('value')
            .t('jabber:iq:search');
        console.log(Strophe.serialize(form_iq));
        com.xmpp.connection.sendIQ(form_iq, com.search.searchResultHandler, com.search.iqErrorHandler);
    },
    
    /**
     * The response is like this:
     * <iq type="result" id="query_22" from="search.openfire" to="fengkai#163.com@openfire">
     *   <query xmlns="jabber:iq:search">
     *     <x xmlns="jabber:x:data">
     *       <field var="FORM_TYPE" type="hidden"/>
     *       <reported>
     *         <field var="jid" type="jid-single" label="JID"/>
     *         <field var="Username" type="text-single" label="Username"/>
     *         <field var="Name" type="text-single" label="Name"/>
     *         <field var="Email" type="text-single" label="Email"/>
     *       </reported>
     *       <item>
     *         <field var="Name">
     *           <value>Feng Kai</value>
     *         </field>
     *         <field var="Email">
     *           <value>fk187andhk#gmail.com</value>
     *         </field>
     *         <field var="Username">
     *           <value>fk187andhk#gmail.com</value>
     *         </field>
     *         <field var="jid">
     *           <value>fk187andhk#gmail.com@openfire</value>
     *         </field>
     *       </item>
     *     </x>
     *   </query>
     * </iq>
     */
    searchResultHandler: function(iq) {
        console.log("Search result: " + Strophe.serialize(iq));
        var result_list = new Array();
        
        $(iq).find('item').each(function() {
            var user_info = new Object();
            $(this).find('field').each(function() {
                var mark = $(this).attr('var').toLowerCase();
                if (mark == "name") {
                    var name = $(this).get(0);
                    user_info.name = $(name).text();
                }
//                else if (mark == "email") {
//                    var email = $(this).get(0);
//                    user_info.email = $(email).text();
//                }
//                else if (mark == "username") {
//                    var email_id = $(this).get(0);
//                    user_info.email_id = com.util.usernameToEmailId($(email_id).text());
//                }
                else if (mark == "jid") {
                    var jid = $(this).get(0);
                    user_info.jid = $(jid).text();
                    user_info.email_id = com.util.usernameToEmailId(Strophe.getNodeFromJid($(jid).text()));
                }
                else {
                    console.log("Get unknown field from search result: " + mark);
                }
            });
            result_list.push(user_info);
        });
        
        // Clear the waiting user because we have searched the result
        com.search.clearWaitingEmailId();
        if (com.util.isFunction(com.xmpp.onSearchFriendResult)) {
            com.xmpp.onSearchFriendResult(result_list);
        }
    },
    
    iqErrorHandler: function(iq) {
        console.log("Search IQ Error: " + Strophe.serialize(iq))
    }
};

/**
 * com.roster stores user's friend list and group information
 */
com.roster = {
    /**
     * Store friend list in an Array with Object
     *    Object.email_id
     *    Object.name
     *    Object.group
     *    Object.status
     */
    friend_list: null,
    
    STATUS_ONLINE: "online",
    
    STATUS_OFFLINE: "offline",
    
    STATUS_AWAY: "away",
    
    /**
     * Store the user list you want to add,
     * if they want to subscribe your status,
     * it doesn't need to be approvted,
     * and appoved default
     * The friend waiting list is stored in cookie
     */
    waiting_list: null,
    
    WAITING_COOKIE_NAME: "WAITING_LIST",
    
    COOKIE_NAME: null,
    
    addWaitingFriend: function(email_id) {
        /*
            if (com.roster.waiting_list == null || typeof com.roster.waiting_list == 'undefined') {
                com.roster.waiting_list = new Array();
            }
            com.roster.waiting_list.push(email_id);
            com.roster.printWaitingList();
        */
        
        var pos = com.roster.findWaitingFriend(email_id);
        if (pos >= 0) {
            /*
             * The user email_id has stored in the cookie
             */
            return;
        }
        
        var waiting_friend_list = $.cookie(com.roster.COOKIE_NAME);
        if (waiting_friend_list == null || typeof waiting_friend_list == 'undefined' || waiting_friend_list.length == 0) {
            waiting_friend_list = email_id;
        }
        else {
            waiting_friend_list = waiting_friend_list + "," + email_id;
        }
        $.cookie(
            com.roster.COOKIE_NAME,
            waiting_friend_list, {
                expires: 10000,
                path: '/'
            });
    },
    
    printWaitingList: function() {
        /*
            for (var i = 0; i < com.roster.waiting_list.length; i++) {
                console.log("Waiting List[" + i + "]: " + com.roster.waiting_list[i]);
            }
        */
        var waiting_friend_list = $.cookie(com.roster.COOKIE_NAME);
        console.log("Waiting Friend List: " + waiting_friend_list);
    },
    
    findWaitingFriend: function(email_id) {
        /*
            if (com.roster.waiting_list == null || typeof com.roster.waiting_list == 'undefined') {
                return -1;
            }
            for (var i = 0; i < com.roster.waiting_list.length; i++) {
                if (com.roster.waiting_list[i] == email_id) {
                    return i;
                }
            }
            return -1;
        */
        var waiting_friend_list = $.cookie(com.roster.COOKIE_NAME);
        if (waiting_friend_list == null || typeof waiting_friend_list == 'undefined') {
            return -1;
        }
        var list = waiting_friend_list.split(",");
        for (var i = 0; i < list.length; i++) {
            if (list[i] == email_id) {
                return i;
            }
        }
        return -1;
    },
    
    removeWaitingFriend: function(email_id) {
        /*
            if (com.roster.waiting_list == null || typeof com.roster.waiting_list == 'undefined') {
                return;
            }
        */
        var pos = com.roster.findWaitingFriend(email_id);
        if (pos >= 0) {
            var waiting_friend_list = $.cookie(com.roster.COOKIE_NAME);
            var list = waiting_friend_list.split(",");
            var new_waiting_friend_list = "";
            for (var i = 0; i < list.length; i++) {
                if (list[i] != email_id) {
                    if (new_waiting_friend_list != "") {
                        new_waiting_friend_list = new_waiting_friend_list + "," + list[i];
                    }
                    else {
                        new_waiting_friend_list = list[i];
                    }
                }
            }
            $.cookie(
                com.roster.COOKIE_NAME, 
                new_waiting_friend_list, {
                    expires: 10000,
                    path: '/'
                });
        }
    },
    
    /**
     * Group related methods
     */
    getDefaultGroup: function() {
        return com.root_group;
    },
    
    isInGroupList: function(group_name) {
        if (com.roster.friend_list == null)
            return false;
        for (var i = 0; i < com.groups.length; i++) {
            if (com.groups[i] === group_name)
                return true;
        }
        return false;
    },
    
    findGroup: function(group_name) {
        for (var i = 0; i < com.groups.length; i++) {
            if (com.groups[i] === group_name)
                return i;
        }
        return -1;
    },
    
    getGroupId: function(group_name) {
        for (var i = 0; i < com.groups.length; i++) {
            if (com.groups[i] === group_name)
                return i;
        }
        return -1;
    },
    
    getGroupList: function() {
        var list = new Array();
        for (var i = 0; i < com.groups.length; i++) {
            list.push(com.groups[i]);
        }
        return list;
    },
    
    getGroupFriendList: function(group_name) {
        var list = new Array();
        for (var i = 0; i < com.roster.friend_list.length; i++) {
            if (com.roster.friend_list[i].group == group_name) {
                list.push(com.roster.friend_list[i]);
            }
        }
        return list;
    },
    
    /**
     * WARNING: The methods of group have influences on Openfire
     * Should add XMPP IQs to set or modify the group information
     */
    
    addGroup: function(group_name) {
        if (!com.roster.isInGroupList(group_name)) {
            com.groups.push(group_name);
        }
    },
    
    renameGroup: function(old_group_name, new_group_name) {
        if (!com.roster.isInGroupList(new_group_name)) {
            var pos = com.roster.findGroup(old_group_name);
            // Cannot rename the root group
            if (pos > 0) {
                com.roster.addGroup(new_group_name);
                for (var i = 0; i < com.roster.friend_list.length; i++) {
                    if (com.roster.friend_list[i].group == old_group_name) {
                        com.roster.friend_list[i].group = new_group_name;
                        // Update server side
                        com.xmpp.setFriendGroupByIq(com.roster.friend_list[i]);
                    }
                }
            }
        }
    },
    
    /**
     * Just remove the group record in the lib, not the server side, 
     * if you want to delete one group, please call deleteGroupById or deleteGroupByName
     */
    removeGroup: function(group_name) {
        var pos = com.roster.findGroup(group_name);
        // Cannot remove the root group, so pos != 0
        if (pos > 0) {
            com.groups.splice(pos, 1);
        }
    },
    
    removeEmptyGroup: function() {
        var friend_group_list = com.roster.getFriendListWithGroup();
        for (var i = 0; i < friend_group_list.length; i++) {
            if (friend_group_list[i].group_member.length == 0 && friend_group_list[i].group_name != com.root_group) {
                // If there is an empty group and it is not the root group, then delete it
                console.log("The removed group is " + friend_group_list[i].group_name);
                com.roster.removeGroup(friend_group_list[i].group_name);
            }
        }
    },
    
    deleteGroupById: function(group_id) {
        // Whether group ID or group name is OK
        // Cannot delete the root group
        if (group_id <= 0 || group_id == null)
            return;
        
        // Change its memebers' group to the root
        var group_name = com.groups[group_id];
        for (var i = 0; i < com.roster.friend_list.length; i++) {
            if (com.roster.friend_list[i].group == group_name) {
                com.roster.friend_list[i].group = com.root_group;
                // Update server side
                com.xmpp.setFriendGroupByIq(com.roster.friend_list[i]);
            }
        }
        com.roster.removeGroup(group_name);
    },
    
    deleteGroupByName: function(group_name) {
        if (group_name == com.root_group || group_name == null)
            return;
        
        // Change its memebers' group to the root
        for (var i = 0; i < com.roster.friend_list.length; i++) {
            if (com.roster.friend_list[i].group == group_name) {
                com.roster.friend_list[i].group = com.root_group;
                // Update server side
                com.xmpp.setFriendGroupByIq(com.roster.friend_list[i]);
            }
        }
        com.roster.removeGroup(group_name);
    },
    
    /**
     * Refresh the group list by friend list
     */
    refreshGroupListByFriendList: function() {
        com.groups.length = 0;
        com.groups.push('General');
        for (var i = 0; i < com.roster.friend_list.length; i++) {
            var group_name = com.roster.friend_list[i].group;
            if (!com.roster.isInGroupList(group_name)) {
                com.groups.push(group_name);
            }
        }
    },
    
    moveFriendToOtherGroup: function(email_id, group_name) {
        com.roster.modifyFriendGroup(email_id, group_name);
    },
    
    findFriend: function(email_id) {
        for (var i = 0; i < com.roster.friend_list.length; i++) {
            if (com.roster.friend_list[i].email_id == email_id) {
                return i;
            }
        }
        return -1;
    },
    
    getFriendName: function(email_id) {
        var pos = com.roster.findFriend(email_id);
        if (pos >= 0) {
            return com.roster.friend_list[pos].name;
        }
        return '';
    },
    
    getFriendGroup: function(email_id) {
        var pos = com.roster.findFriend(email_id);
        if (pos >= 0) {
            return com.roster.friend_list[pos].group;
        }
        return '';
    },
    
    removeFriendFromList: function(email_id) {
        var pos = com.roster.findFriend(email_id);
        if (pos >= 0) {
            com.roster.friend_list.splice(pos, 1);
        }
    },
    
    addFriendToList: function(friend_info) {
        if (friend_info == null || typeof friend_info == 'undefined')
            return;
        else
            com.roster.friend_list.push(friend_info);
    },
    
    modifyFriend: function(friend_info) {
        if (friend_info == null || typeof friend_info == 'undefined')
            return;
        
        var pos = com.roster.findFriend(friend_info.email_id);
        if (pos >= 0) {
            /**
             * The status cannot be changed, the status just can be modified by PRESENCE message
             */
            friend_info.status = com.roster.friend_list[pos].status;
            com.roster.friend_list[pos] = friend_info;
        }
    },
    
    modifyFriendName: function(email_id, name) {
        var pos = com.roster.findFriend(email_id);
        if (pos >= 0) {
            com.roster.friend_list[pos].name = name;
            com.xmpp.setFriendGroupByIq({
                email_id: email_id,
                name: name,
                group: com.roster.friend_list[pos].group
            });
        }
    },

    modifyFriendGroup: function(email_id, group_name) {
        var pos = com.roster.findFriend(email_id);
        if (pos >= 0) {
            com.roster.friend_list[pos].group_name = group_name;
            com.xmpp.setFriendGroupByIq({
                email_id: email_id,
                name: com.roster.friend_list[pos].name,
                group: group_name
            });
        }
    },
    
    modifyFriendStatus: function(email_id, new_status) {
        var pos = com.roster.findFriend(email_id);
        if (pos >= 0) {
            com.roster.friend_list[pos].status = new_status;
        }
    },
    
    getFriendList: function() {
        return com.roster.friend_list;
    },
    
    getFriendListWithGroup: function() {
        var group_friend_list = new Array();
        for (var i = 0; i < com.groups.length; i++) {
            var group_info = new Object();
            // Group id is its position in com.groups
            group_info.group_id = i;
            group_info.group_name = com.groups[i];
            if (group_info.group_name === com.root_group) {
                group_info.is_root = true;
            }
            else {
                group_info.is_root = false;
            }
            group_info.group_member = new Array();
            for (var j = 0; j < com.roster.friend_list.length; j++) {
                if (com.roster.friend_list[j].group === com.groups[i]) {
                    group_info.group_member.push(com.roster.friend_list[j]);
                }
            }
            group_friend_list.push(group_info);
        }
        return group_friend_list;
    }   
};

/**
 * com.http is the object to provide APIs for sending a http request 
 */
com.http = {
	
	sendHttpRequ: function(sendMethod,url,data,callbackFn){
		
		var sendData = Strophe.xmlElement(data);
		var req = new Strophe.Request(sendData, function() {
			if(xhr.readyState == 4){
				if(xhr.status == 200){
					//alert("Http request success ");
					console.log("Http request success ");
					if(callbackFn) {
						callbackFn(true);
					}
				}
				else{
					alert("Http request failed ");
					console.log("Http request failed ");
					if(callbackFn) {
						callbackFn(false);
					}
				}
			}
		});
        var xhr = req._newXHR();
		 try {
			 xhr.open(sendMethod,url,true);
		 } catch (e2) {
            Strophe.error("XHR open failed.");
            return;
         }
		 
		 xhr.send();		 
	}
	
};

/**
 * com.groupChat uses the XEP-0045 to provide groupChat features
 */
com.groupChat = {	
	joinRoom: function(roomJID, nickname) {
		for (var i = 0; i < com.rooms.length; i++) {
			if (roomJID === com.rooms[i].roomJID && com.rooms[i].joined){
				console.log("you are already in the room");
				return;
			}
		}
		var room_info = new Object();
		room_info.roomJID = roomJID;
		room_info.nickname = nickname;
		room_info.participants = {};
		room_info.joined = false;
		room_info.participantsList = new Array();
		room_info.roomMember = new Array();
		com.rooms.push(room_info);
		//send presence to room
		com.xmpp.connection.send(
			$pres({to:room_info.roomJID + "/" + room_info.nickname})
				.c('x', {xmlns: 'http://jabber.org/protocol/muc'}).c('history', {maxchars: '0'}));
		com.groupChat.showRoomList();
	},
	
	leaveRoom: function(roomJID) {
		for (var i = 0; i < com.rooms.length; i++){
			if (com.rooms[i].roomJID === roomJID){
				com.xmpp.connection.send(
					$pres({to: roomJID + "/" + com.rooms[i].nickname,
					type: "unavailable"}));
				com.rooms.splice(i, 1);
			}
		}
		com.groupChat.showRoomList();
	},
	
	sendRoomChatMessage: function (roomJID, content) {
		var roomJID = roomJID;
	    var message = $msg({to: roomJID, 'type': 'groupchat'})
	        .c('body').t(content);
	    console.log(Strophe.serialize(message));
	    com.xmpp.connection.send(message);
	    
	},
	
	/**
	 * send iq to room to get the room member
	 * the iq stanza is like this:
	 * <iq to='roomname@chat.server', type='get'>
	 * 		<query xmlns='jabber:iq:member'/>
	 * </iq>
	 */
	queryRoomMember: function (roomJID) {
		var roomname = roomJID.split('@');
		var chatroom = roomname[0] + "@chat.webrtc";
		var iq = $iq({to: chatroom, type: 'get'})
					.c('query', {xmlns: 'jabber:iq:member'});
		com.xmpp.connection.sendIQ(iq, com.groupChat.queryRoomMemberHandler, com.groupChat.iqErrorHandler);
		console.log("send iq: " + iq);
	},	
	
	queryRoomMemberHandler: function (iq) {
		console.log("queryRoomMemberHandler: " + Strophe.serialize(iq));
		var from = $(iq).attr('from');
		var roomname = from.split('@');
		var room = roomname[0] + "@conference.webrtc";
		for (var i = 0; i < com.rooms.length; i++) {
			if(room === com.rooms[i].roomJID) {
				$(iq).find('item').each(function () {
					var member_info = new Object();
					var isonline = $(this).attr('isonline');
					var status = null;
					if (isonline === 'true')
						status = 'online';
					else
						status = 'offline';
					member_info.jid = $(this).attr('jid').replace('#', '@');
					member_info.affiliation = $(this).attr('affiliation');
					member_info.status = status;
					com.rooms[i].roomMember.push(member_info);	
					
					if (com.util.isFunction(com.xmpp.onParticipantsChanged)) {
						com.xmpp.onParticipantsChanged({
							roomJID: room, 
							nickname: member_info.jid,
							affiliation: member_info.affiliation,
							status: member_info.status
						});
					}
				});
				
				console.log(com.rooms[i].roomJID + " member list: ");
				for (var j = 0; j < com.rooms[i].roomMember.length; j++) {
					console.log(com.rooms[i].roomMember[j]);
				}
			}
		}		
	},	
		
	getRoomMemberList: function (roomJID) {
		var roomMemberList = new Array();
		for (var i = 0; i < com.rooms.length; i++)
		{
			if (com.rooms[i].roomJID === roomJID)
			{
				for (var j = 0; j < com.rooms[i].roomMember.length; j++)
				{
					roomMemberList.push(com.rooms[i].roomMember[j]);
				}
				break;
			}
		}
		return roomMemberList;
	},
	
	getParticipantsList: function (roomJID) {
		var participantsList = new Array();
		for (var i = 0; i < com.rooms.length; i++)
		{
			if (com.rooms[i].roomJID === roomJID)
			{
				for (var j = 0; j < com.rooms[i].participantsList.length; j++)
				{
					participantsList.push(com.rooms[i].participantsList[j]);
				}
				break;
			}
		}
		return participantsList;		
	},
	
	participantsChangedHandler: function (roomJID) {
		for (var i = 0; i < com.rooms.length; i++)
		{
			if (com.rooms[i].roomJID === roomJID)
			{
				console.log(roomJID + " participants list:");
				for (var j = 0; j < com.rooms[i].participantsList.length; j++)
				{
					console.log(com.rooms[i].participantsList[j]);
				}
				break;
			}
		}
		return true;
	},
	
	roomJoinInvite: function (roomJID, userJID, inviteReason) {
		var invitemsg = $msg({to: roomJID})
					.c('x', {xmlns: "http://jabber.org/protocol/muc#user"})
					.c('invite', {to: userJID})
					.c('reason').t(inviteReason);
		com.xmpp.connection.send(invitemsg);
		console.log(Strophe.serialize(invitemsg));
	},
	
	roomJoinDecline: function (roomJID, userJID, declineReason) {
		var declinemsg = $msg({to: roomJID})
					.c('x', {xmlns: "http://jabber.org/protocol/muc#user"})
					.c('decline', {to: userJID})
					.c('reason').t(declineReason);
		com.xmpp.connection.send(declinemsg);
		console.log(Strophe.serialize(declinemsg));
	},
	
	//when user joins a room which is not exist,the back presence will include a status code 201
	//if the back presence has a status code 201, create reserved room.
	createInstantRoom: function (roomJID, nickname) {
		var iq = $iq({to: roomJID, type: 'set'})
					.c('query', {xmlns: "http://jabber.org/protocol/muc#owner"})
					.c('x', {xmlns: 'jabber:x:data', type: 'submit'});
		com.xmpp.connection.sendIQ(iq);
		console.log("send iq: " + Strophe.serialize(iq));
	},
	
	createReservedRoom: function (roomJID, nickname) {
		var iq = $iq({to: roomJID, type: 'get'})
					.c('query', {xmlns: "http://jabber.org/protocol/muc#owner"});
		com.xmpp.connection.sendIQ(iq, com.groupChat.iqCreatRoomHandler, com.groupChat.iqErrorHandler);
		console.log("send iq: " + Strophe.serialize(iq));
	},
	
	changeAffiliationForOwner: function (roomJID, userJID, toAffiliation) {
		var iq = $iq({to: roomJID, type: 'set'})
				.c('query', {xmlns: 'http://jabber.org/protocol/muc#owner'})
				.c('item', {affiliation: toAffiliation, jid: userJID});
		com.xmpp.connection.sendIQ(iq, com.groupChat.iqChangeAffHandler, com.groupChat.iqErrorHandler);
		console.log("change affiliation " + Strophe.serialize(iq));
		
		userJID = userJID.replace('#','@');
		for(var i = 0; i < com.rooms.length; i++) {
			if (roomJID === com.rooms[i].roomJID) {
				for (var j = 0; j < com.rooms[i].roomMember.length; j++) {
					if (userJID === com.rooms[i].roomMember[j].jid) {
						com.rooms[i].roomMember[j].affiliation = toAffiliation;
					}
				}
			}
		}
		
	},
	
	changeAffiliationForAdmin: function (roomJID, userJID, toAffiliation) {
		var iq = $iq({to: roomJID, type: 'set'})
				.c('query', {xmlns: 'http://jabber.org/protocol/muc#admin'})
				.c('item', {affiliation: toAffiliation, jid: userJID});
		com.xmpp.connection.sendIQ(iq, com.groupChat.iqChangeAffHandler, com.groupChat.iqErrorHandler);
		console.log("change affiliation " + Strophe.serialize(iq));
		
		userJID = userJID.replace('#','@');
		for(var i = 0; i < com.rooms.length; i++) {
			if (roomJID === com.rooms[i].roomJID) {
				for (var j = 0; j < com.rooms[i].roomMember.length; j++) {
					if (userJID === com.rooms[i].roomMember[j].jid) {
						com.rooms[i].roomMember[j].affiliation = toAffiliation;
					}
				}
			}
		}
	},
		
	sendDefaultConfig: function (roomJID) {
		var iq = $iq({to: roomJID, type: 'set'})
				.c('query', {xmlns: "http://jabber.org/protocol/muc#owner"})
				.c('x', {xmlns: "jabber:x:data", type: 'submit'})
				.c('field', {'var': 'FORM_TYPE'})
				.c('value')
				.t("http://jabber.org/protocol/muc#roomconfig")
				.up().up()
				.c('field', {'var': 'muc#roomconfig_changesubject'})
				.c('value')
				.t('1')
				.up().up()
				.c('field', {'var': 'muc#roomconfig_maxusers'})
				.c('value')
				.t('30')
				.up().up()
				.c('field', {'var': 'muc#roomconfig_persistentroom'})
				.c('value')
				.t('1')
				.up().up()
				.c('field', {'var': 'muc#roomconfig_allowinvites'})
				.c('value')
				.t('1')
				.up().up()
				.c('field', {'var': 'x-muc#roomconfig_canchangenick'})
				.c('value')
				.t('0');		
				
		com.xmpp.connection.sendIQ(iq, com.groupChat.iqRoomConfigHandler, com.groupChat.iqErrorHandler);
		console.log("send iq: " + Strophe.serialize(iq));
	},
	
	iqCreatRoomHandler: function (iq) {
		var from = $(iq).attr('from');
		com.groupChat.sendDefaultConfig(from);
		return true;
	},
	
	iqRoomConfigHandler: function (iq) {
		console.log("room config handler: " + Strophe.serialize(iq));
		if ($(iq).attr('type') == 'result')
		{
			console.log("Create reserved room!")
		}
		return true;
	},
	
	iqChangeAffHandler: function (iq) {
		console.log("change affliation handler: " + Strophe.serialize(iq));
		if ($(iq).attr('type') == 'result')
		{
			console.log("change affliation successful!");
		}
		return true;
	},
	
	
	iqErrorHandler: function (iq) {
		console.log("iq error: " + Strophe.serialize(iq));
		return true;
	},
	
	iqSuccessHandler: function (iq) {
		console.log("iq success: " + Strophe.serialize(iq));
		return true;
	},
	
	showRoomList: function () {
		console.log("room list: ");
		for (var i = 0; i < com.rooms.length; i++) {
			console.log(com.rooms[i].roomJID);
		}
	}
};


/**
 * com.xmpp is the main object to provide APIs for other applications
 */
com.xmpp = {
    /**
     * Login and connection related callbacks
     */
    onConnected: null,
    
    onDisconnected: null, 
    
    onConnectAuthFail: null,
    
    onConnectFail: null,
    
    onConnectError: null,
    
    /**
     * Roster related callbacks
     */
    onRoster: null,
    
    /**
     * Presence related callbacks
     */
    onPresenceSubscribe: null,
    
    onPresenceDenySubscribe: null,
    
    onPresenceUnsubscribe: null,
    
    onPresenceSubscribed: null,
    
    onPresenceUnsubscribed: null,
    
    onPresenceStatusChanged: null,
    
    /**
     * Instant Message related callbacks
     */
    onChatMessage: null,

    onRoomChatMessage: null,
    
    /**
     * Search friend result handler
     */
    onSearchFriendResult: null,
    
    /**
     * Friend and Group related callbacks
     */
    onAddFriendSucceed: null,
    
    onAddFriendFailed: null,
    
    onDeleteFriendSucceed: null,
    
    onDeleteFriendFailed: null,
    
    onModifyFriendNameSucceed: null,
    
    onModifyFriendNameFailed: null,
    
    onChangeFriendGroupSucceed: null,
    
    onChangeFriendGroupFailed: null,
    
    onRenameGroupSucceed: null,
    
    onRenameGroupFailed: null,
    
    onDeleteGroupSucceed: null,
    
    onDeleteGroupFailed: null,
    
    /**
     * group chat related callbacks
     */
    onRoomJoined: null,
    
    onRoomNotExist: null,
    
    onRoomMember: null,
    
    onUserJoined: null,
    
    onNickExist: null,
    
    onRoomJoinError: null,
    
    onUserLeft: null,
    
//    onRoomchatMessage: null,
    
    onRoomInvite: null,
    
    onRoomDecline: null,     
    
    /**
     * Get the address of websocket server
     */
    getWebSocketUrl: function() {
        var email_id = com.user.email_id;
        if (email_id == null) {
            return com.websockets[0];
        }
        
        var pos = com.domain.calculatePos(email_id);
        return com.websockets[pos];
    },
    
    /**
     * A list of calling functions
     */
    getRoster: function() {
        return com.roster.getFriendList();
    },
    
    getRosterWithGroup: function() {
        return com.roster.getFriendListWithGroup();
    },
    
    deleteGroupById: function(group_id) {
        com.roster.deleteGroupById(group_id);
    },
    
    deleteGroupByName: function(group_name) {
        com.roster.deleteGroupByName(group_name);
    },
    
    renameGroup: function(old_group_name, new_group_name) {
        com.roster.renameGroup(old_group_name, new_group_name);
    },
    
    getGroupList: function() {
        return com.roster.getGroupList();
    },
    
    getGroupFriendList: function(group_name) {
        return com.roster.getGroupFriendList(group_name);
    },
    
    setFriendGroupByIq: function(friend_info) {
        if (friend_info == null || typeof friend_info == 'undefined')
            return;
        
        var jid = com.util.emailToJid(friend_info.email_id);
        if (com.util.isStringEmpty(friend_info.name)) {
            var name = com.roster.getFriendName(friend_info.email_id);
            friend_info.name = name;
        }
        if (com.util.isStringEmpty(friend_info.group)) {
            var group_name = com.roster.getFriendGroup(friend_info.email_id);
            if (com.util.isStringEmpty(group_name)) {
                friend_info.group = com.root_group;
            }
            else {
                friend_info.group = group_name;
            }
        }
        /**
         * The XMPP IQ message is like this:
         * <iq id="0Z2YH-23" type="set">
         *   <query xmlns="jabber:iq:roster">
         *     <item jid="fengkai#bupt.edu.cn@openfire" name="Feng Kai">
         *       <group>Friends</group>
         *     </item>
         *   </query>
         * </iq>
         */
        var iq = $iq({type: 'set'})
            .c('query', {xmlns: 'jabber:iq:roster'})
            .c('item', {jid: jid, name: friend_info.name})
            .c('group')
            .t(friend_info.group);
        
        com.xmpp.connection.sendIQ(iq, com.xmpp.iqSuccessHandler, com.xmpp.iqErrorHandler);
    },
    
    /**
     * Judge whether a friend is in Roster
     */
    isFriendInRoster: function(email_id) {
        var result = false;
        var pos = com.roster.findFriend(email_id);
        if (pos < 0) {
            result = false;
        } else {
            result = true;
        }
        return result;
    },
    
    /**
     * Judge whether a group name is in the Group List
     */
    isGroupExist: function(group_name) {
        var result = false;
        var pos = com.roster.findGroup(group_name);
        if (pos < 0) {
            result = false;
        } else {
            result = true;
        }
        return result;
    },
    
    
    /**
     * Judge whether a room name is used in the server
     */
    isRoomExist: function(roomJID) {
        var iq = $iq({to: roomJID, type: 'get'})
            .c('query', {xmlns: 'http://jabber.org/protocol/disco#info'});
        console.log(Strophe.serialize(iq));
        com.xmpp.connection.sendIQ(iq, com.xmpp.roomExistHandler, com.xmpp.roomNotExistHandler);
    },
    
    roomExistHandler: function(iq) {
    	console.log('1');
        var roomname = $(iq).attr('from');
        console.log(roomname + 'is already used!');
        return false;
    },

    roomNotExistHandler: function(iq) {
    	console.log(Strophe.serialize(iq));
        var roomJID = $(iq).attr('from');
        if($(iq).find("error[code='404']").length > 0) {
            com.xmpp.joinRoom(roomJID);
            return true;
        }
        return false;
    },

    
    /**
     * Add/Delete friend related functions
     */
     
    addFriend: function(friend_info) {
        if (friend_info == null || typeof friend_info == 'undefined')
            return;
        
        var jid = com.util.emailToJid(friend_info.email_id);
        if (com.util.isStringEmpty(friend_info.group)) {
            friend_info.group = com.root_group;
        }
        
        /**
         * The XMPP IQ message is like this:
         * <iq id="0Z2YH-23" type="set">
         *   <query xmlns="jabber:iq:roster">
         *     <item jid="fengkai#bupt.edu.cn@openfire" name="Feng Kai">
         *       <group>root</group>
         *     </item>
         *   </query>
         * </iq>
         */
        var iq = $iq({type: 'set'})
            .c('query', {xmlns: 'jabber:iq:roster'})
            .c('item', {jid: jid, name: friend_info.name})
            .c('group')
            .t(friend_info.group);
        
        com.xmpp.connection.sendIQ(iq, com.xmpp.addFriendSuccessHandler, com.xmpp.iqErrorHandler);
        
        // Add friend to waiting list, which means that I want to be subscribed by him
        com.roster.addWaitingFriend(friend_info.email_id);
        
        // Then send the presence subscribe message
        var sub = $pres({to: jid, 'type': 'subscribe'});
        com.xmpp.connection.send(sub);
    },
    
    /**
     * Approve him to be your friend, and you add him again
     */
    approveAddFriend: function(friend_info) {
        if (friend_info == null || typeof friend_info == 'undefined')
            return;
        
        var jid = com.util.emailToJid(friend_info.email_id);
        if (com.util.isStringEmpty(friend_info.group)) {
            friend_info.group = com.root_group;
        }
        
        /**
         * The XMPP IQ message is like this:
         * <iq id="0Z2YH-23" type="set">
         *   <query xmlns="jabber:iq:roster">
         *     <item jid="fengkai#bupt.edu.cn@openfire" name="Feng Kai">
         *       <group>root</group>
         *     </item>
         *   </query>
         * </iq>
         */
        var iq = $iq({type: 'set'})
            .c('query', {xmlns: 'jabber:iq:roster'})
            .c('item', {jid: jid, name: friend_info.name})
            .c('group')
            .t(friend_info.group);
        
        com.xmpp.connection.sendIQ(iq, com.xmpp.addFriendSuccessHandler, com.xmpp.iqErrorHandler);
        
        // Then send the presence subscribe message
        var sub = $pres({to: jid, 'type': 'subscribe'});
        com.xmpp.connection.send(sub);
    },
    
    addFriendSuccessHandler: function(iq) {
        console.log('IQ Success: ' + Strophe.serialize(iq));
    },
    
    setBlackList: function(email_id){
    	var jid = com.util.emailToJid(email_id);
    	 var form_iq = 
             $iq({type: 'set', id:'blackList'})
             .c('query', {xmlns: 'jabber:iq:privacy'})
             .c('list', {name:'listName'})
             .c('item', {type: 'jid', value:jid, action:'deny',order:'7' });
                    
         com.xmpp.connection.sendIQ(form_iq, com.xmpp.setBlackListSuccessHandler, com.xmpp.iqErrorHandler);/* */
    },
    
    setBlackListSuccessHandler: function(iq){
    	 console.log('Set black list IQ Success: ' + Strophe.serialize(iq));
    	 
    	 var form_iq = 
             $iq({type: 'set', id:'active1'})
             .c('query', {xmlns: 'jabber:iq:privacy'})
             .c('active', {name:'listName'});
                    
         com.xmpp.connection.sendIQ(form_iq, com.xmpp.iqSuccessHandler, com.xmpp.iqErrorHandler);
    },
    
    deleteFriend: function(email_id) {
        var jid = com.util.emailToJid(email_id);
        
        // First send the presence unsubscribe message
        var sub = $pres({to: jid, 'type': 'unsubscribe'});
        com.xmpp.connection.send(sub);
        
        /**
         * The XMPP IQ message is like this:
         * <iq id="0Z2YH-23" type="set">
         *   <query xmlns="jabber:iq:roster">
         *     <item jid="fengkai#bupt.edu.cn@openfire" subscription="remove"/>
         *   </query>
         * </iq>
         */
        var iq = $iq({type: 'set'})
            .c('query', {xmlns: 'jabber:iq:roster'})
            .c('item', {jid: jid, subscription: 'remove'});
        
        // The success function should be com.xmpp.rosterChangedHandler 
        com.xmpp.connection.sendIQ(iq, com.xmpp.deleteFriendSuccessHandler, com.xmpp.iqErrorHandler);
    },
    
    deleteFriendSuccessHandler: function(iq) {
        console.log('IQ Success: ' + Strophe.serialize(iq));
    },
    
    modifyFriendName: function(email_id, name) {
        com.roster.modifyFriendName(email_id, name);
    },
    
    modifyFriendGroup: function(email_id, group_name) {
        com.roster.modifyFriendGroup(email_id, group_name);
    },
    
    moveFriendToOtherGroup: function(email_id, group_name) {
        com.roster.moveFriendToOtherGroup(email_id, group_name);
    },
    
    /**
     * Refresh the friend list and group information
     */
    refreshRosterFromServer: function() {
        com.groups.length = 0;
        com.groups.push(com.root_group);
        com.xmpp.queryRoster();
    },
    
    approveSubscribeById: function(email_id) {
        var jid = com.util.emailToJid(email_id);
        com.xmpp.approveSubscribe(jid);
    },
    
    approveSubscribe: function(jid) {
        com.xmpp.connection.send($pres({
            to: jid,
            type: 'subscribed'
        }));
    },
    
    denySubscribeById: function(email_id) {
        var jid = com.util.emailToJid(email_id);
        com.xmpp.denySubscribe(jid);
    },
    
    denySubscribe: function(jid) {
        com.xmpp.connection.send($pres({
            to: jid,
            type: 'unsubscribed'
        }));
    },
    
    approveUnsubscribe:function(jid) {
        com.xmpp.connection.send($pres({
            to: jid,
            type: 'unsubscribed'
        }));
    } ,
    
    sendChatMessage: function(email_id, content) {
        var jid = com.util.emailToJid(email_id);
        var message = $msg({to: jid, 'type': 'chat'})
            .c('body')
            .t(content)
            .up()
            .c('active', {xmlns: 'http://jabber.org/protocol/chatstates'});
        
        com.xmpp.connection.send(message);
    },
    
    /**
     * Search whether one user is on the server
     * @returns if the server doesn't support search function, it will return false, or will return true
     * The details information of searched result will be showed in the callback function "onSearchFriendResult"
     */
    searchFriendsOnServer: function(email_id) {
        var domain = com.domain.calculateDomain(email_id);
        var changed_email_id = com.util.modifyEmailId(email_id);
        if (com.search.isSuppportedSearch(domain)) {
            com.search.sendSearchForm(changed_email_id,'user');
            return true;
        }
        else {
            // If the server now didn't support search function or the domain is not right, write it into waiting list
            com.search.setWaitingEmailId(changed_email_id);
            return false;
        }    
    },

        searchRoomsOnServer: function(room_name) {
        // var domain = com.domain.calculateDomain(room_name);
        // if (com.search.isSuppportedSearch(domain)) {
            com.search.sendSearchForm(room_name,'room');
            return true;
        // }
        // else {
        //     // If the server now didn't support search function or the domain is not right, write it into waiting list
        //     com.search.setWaitingEmailId(changed_email_id);
        //     return false;
        // }    
    },
    
    /**
     * the interface for group chat feature
     */
    joinRoom: function(roomJID) {
    	com.groupChat.joinRoom(roomJID, com.user.email_id);
    },
    
    leaveRoom: function(roomJID) {
    	com.groupChat.leaveRoom(roomJID);
    },
    
    sendRoomChatMessage: function (roomJID, content) {
    	com.groupChat.sendRoomChatMessage(roomJID, content);
    },
    
    roomJoinInvite: function (roomJID, userJID, inviteReason) {
    	com.groupChat.roomJoinInvite(roomJID, userJID, inviteReason);
    },
    
    roomJoinDecline: function (roomJID, userJID, declineReason) {
    	com.groupChat.roomJoinDecline(roomJID, userJID, declineReason);
    },
    
    roomJoinApprove: function (roomJID) {
    	com.groupChat.joinRoom(roomJID, com.user.email_id);
    },
    
    /**
     * Basic properties and functions for xmpp library
     */
    connection: null, 
     
    boshConnected: function() {
        console.log('BOSH is connected');
        // Bind some basic functions for presence, message and roster
        com.xmpp.queryRoster();
        com.xmpp.queryRoom();
        // Only when other client change the roster configuration, this kind of messages are coming
        com.xmpp.connection.addHandler(com.xmpp.presenceHandler, null, 'presence');
        com.xmpp.connection.addHandler(com.xmpp.rosterChangedHandler, Strophe.NS.ROSTER, 'iq', 'set');
        com.xmpp.connection.addHandler(com.xmpp.chatMessageHandler, null, 'message', 'chat');
        com.xmpp.connection.addHandler(com.xmpp.groupChatMessageHandler, null, 'message', 'groupchat');
		//com.xmpp.connection.addHandler(com.xmpp.roomInviteHandler, null, 'message');
		
        com.roster.COOKIE_NAME = com.user.email_id + "_" + com.roster.WAITING_COOKIE_NAME;
        // Initialize the search function
        com.search.initialize(com.user.domain);
        if (com.util.isFunction(com.xmpp.onConnected)) {
            com.xmpp.onConnected();
        }
    },
    
    boshDisconnected: function() {
        console.log('BOSH is disconnected');
        // Call the user defined function
        if (com.util.isFunction(com.xmpp.onDisconnected)) {
            com.xmpp.onDisconnected();
        }
    },
    
    boshConnectAuthFail: function() {
        console.log('BOSH auth fail');
        // Call the user defined function
        if (com.util.isFunction(com.xmpp.onConnectAuthFail)) {
            com.xmpp.onConnectAuthFail();
        }
    },
    
    boshConnectFail: function() {
        console.log('BOSH connects failed');
        // Call the user defined function
        if (com.util.isFunction(com.xmpp.onConnectFail)) {
            com.xmpp.onConnectFail();
        }
    },
    
    boshConnectError: function() {
        console.log('BOSH connects error');
        // Call the user defined function
        if (com.util.isFunction(com.xmpp.onConnectError)) {
            com.xmpp.onConnectError();
        }
    },
    
    initialize: function(email_id, password) {
        com.user.email_id = email_id;
        com.user.node_id = com.util.modifyEmailId(email_id);
        com.user.domain = com.domain.calculateDomain(email_id);
        
        var url = com.domain.getServerUrl(com.user.domain);
        com.user.server_url = url;
        var conn = new Strophe.Connection(url);
        // var jid = com.user.getFullJid();
        // using the bare JID to replace the full JID in order to login on many pages
        var jid = com.user.getBareJid();
        
        com.xmpp.connection = conn;
        conn.connect(jid, password, function(status) {
            console.log('BOSH Connection Status: ' + status);
            if (status === Strophe.Status.CONNECTED) {
                com.xmpp.boshConnected();
            }
            else if (status === Strophe.Status.DISCONNECTED) {
                com.xmpp.boshDisconnected();
            }
            else if (status === Strophe.Status.AUTHFAIL) {
                com.xmpp.boshConnectAuthFail();
            }
            else if (status === Strophe.Status.CONNFAIL) {
                com.xmpp.boshConnectFail();
            }
            else if (status === Strophe.Status.ERROR) {
                com.xmpp.boshConnectError();
            }
        });
    },
    
    clearInformation: function() {
        com.groups.length = 0;
        com.groups.push(com.root_group);
        com.roster.friend_list.length = 0;
    },
    
    close: function() {
        // The Strophe.js lib will send 'unavailable' presence to server when called disconnect()
        console.log("Disconnecting with server...");
        com.xmpp.connection.send($pres({type: 'unavailable'}));
        com.xmpp.connection.disconnect();
        com.xmpp.clearInformation();
        com.xmpp.connection = null;
    },
    
    queryRoster: function() {
        var iq = $iq({type: 'get'}).c('query', {xmlns: 'jabber:iq:roster'});
        com.xmpp.connection.sendIQ(iq, com.xmpp.queryRosterHandler, com.xmpp.iqErrorHandler);
    },
    
    queryRosterHandler: function(iq) {
        if (com.roster.friend_list == null) {
            com.roster.friend_list = new Array();
        }
        
        $(iq).find('item').each(function() {
            var jid = $(this).attr('jid');
            var name = $(this).attr('name') || jid;
            var sub = $(this).attr('subscription');
            var group = $(this).get(0);
            var group_name = com.root_group;
            
            /**
             * In jQuery, 
             * $(this).html() can get the HTML file, but cannot used in XML file
             * $(this).text() can get the HTML and XML file content
             */
            
            if (sub === 'both' || sub === 'to') {
                if (!com.util.isStringEmpty($(group).text())) {
                    group_name = $(group).text();
                    var pos = com.roster.findGroup(group_name);
                    // If server has this group, then add it into our group list
                    if (pos < 0) {
                        com.groups.push(group_name);
                    }
                }
                var email_id = com.util.jidToEmail(jid);
                var pos = com.roster.findFriend(email_id);
                if (pos < 0) {
                    com.roster.addFriendToList({
                        email_id: email_id,
                        name: name,
                        group: group_name,
                        status: com.roster.STATUS_OFFLINE
                    });
                }
            }
        });
        
        // Call the user defined function
        if (com.util.isFunction(com.xmpp.onRoster)) {
            com.xmpp.onRoster(com.roster.getFriendListWithGroup());
        }
            
        // Set up presence handler and send initial presence
        com.xmpp.connection.send($pres());
    },
    
    queryRoom: function () {
		var iq = $iq({type: 'get'})
					.c('query', {xmlns: 'jabber:iq:room'});
		com.xmpp.connection.sendIQ(iq, com.xmpp.queryRoomHandler, com.xmpp.iqErrorHandler);
		console.log("send iq: " + iq);
	},
	
	queryRoomHandler: function (iq) {
		console.log("queryRoomHandler: " + Strophe.serialize(iq));
		$(iq).find('item').each(function () {
			var roomname = $(this).attr('roomname');
			var roomJID = roomname + "@conference.webrtc";
			com.xmpp.joinRoom(roomJID);
		});
		
		if (com.util.isFunction(com.xmpp.onRoom)) {
            com.xmpp.onRoom(com.rooms);
        }
		
	},
	    
    iqSuccessHandler: function(iq) {
        console.log('IQ Success: ' + Strophe.serialize(iq));
    },
    
    iqErrorHandler: function(iq) {
        com.roster.removeEmptyGroup();
        console.log('IQ Error: ' + Strophe.serialize(iq));
    },
    
    rosterChangedHandler: function(iq) {
        var iq_id = $(iq).attr('id');
        console.log('Roster Change: ' + Strophe.serialize(iq));
        $(iq).find('item').each(function() {
            var sub = $(this).attr('subscription') || 'none';
            var jid = $(this).attr('jid');
            var email_id = com.util.jidToEmail(jid);
            var name = $(this).attr('name') || email_id;
            var group = $(this).get(0);
            var group_name = com.root_group;
            
            var ask = $(this).attr('ask');
            
            if (!com.util.isStringEmpty($(group).text())) {
                group_name = $(group).text();
            }
            
            if(ask = 'unsubscribe' && sub == 'from'){
            
            	 com.roster.removeFriendFromList(email_id);
            }
            
            else if (sub == 'remove') {
                // Remove one roster item (In order to support delete friend one direction, so do not use this)
                com.roster.removeFriendFromList(email_id);
            }
            else if (sub == 'none') {
                // If it is none, means the server still unknow whether you can add this one
                com.roster.removeFriendFromList(email_id);
            }
            else if (sub == 'both') {
                // If it is both, means the relationship of the two has been admitted, the info should be updated
                // The name info, it is absolutly right, so just update it
                var group_pos = com.roster.findGroup(group_name);
                if (group_pos < 0) {
                    com.roster.addGroup(group_name);
                }
                var pos = com.roster.findFriend(email_id);
                if (pos >= 0) {
                    com.roster.modifyFriend({
                        email_id: email_id,
                        name: name,
                        group: group_name
                    });
                }
                else {
                    // If the user is not in the roster, then add it into the roster
                    com.roster.addFriendToList({
                        email_id: email_id,
                        name: name,
                        group: group_name,
                        status: com.roster.STATUS_OFFLINE
                    });
                }
            }
            else {
                var group_pos = com.roster.findGroup(group_name);
                if (group_pos < 0) {
                    com.roster.addGroup(group_name);
                }
                
                var pos = com.roster.findFriend(email_id);
                console.log("Result of find friend " + email_id + ": " + pos);
                if (pos < 0) {
                    // Add one roster item
                    com.roster.addFriendToList({
                        email_id: email_id,
                        name: name,
                        group: group_name,
                        status: com.roster.STATUS_OFFLINE
                    });
                    
                    if (com.util.isFunction(com.xmpp.onAddFriendSucceed)) {
                        com.xmpp.onAddFriendSucceed(email_id);
                    }
                }
                else {
                    // Modify one roster item
                    var temp = com.roster.getFriendName(email_id);
                    if (temp != "" || temp != null) {
                        name = temp;
                    }
                    com.roster.modifyFriend({
                        email_id: email_id,
                        name: name,
                        group: group_name
                    });
                }
                // Refresh group list
                // com.roster.refreshGroupListByFriendList();
            }
            // Acknowledge the roster change message
            com.xmpp.connection.send($iq({type: 'result', id: iq_id}));
        });
        // Remove empty groups
        com.roster.removeEmptyGroup();
        // Call the user defined function to update roster in the page
        if (com.util.isFunction(com.xmpp.onRoster)) {
            com.xmpp.onRoster(com.roster.getFriendListWithGroup());
        }
        
        return true;
    },
    
    /**
     * Pay much attention on the Presence, it may have some problems
     */
    presenceHandler: function(presence) {
    	//Debug
    	console.log('Presence: ' + Strophe.serialize(presence));

		if (presence.hasChildNodes()) {
			com.xmpp.public_presenceHandler(presence);
		}
		else {
			com.xmpp.private_presenceHandler(presence);
		}
		return true;
    },
    
    /**
     * To handle the presence from some group chat room
     */
    public_presenceHandler: function(presence) {
    	var from = $(presence).attr('from');
		var room = Strophe.getBareJidFromJid(from);
		for (var i = 0; i < com.rooms.length; i++) {
			if(room === com.rooms[i].roomJID) {
				var nick = Strophe.getResourceFromJid(from);
				var affiliation = $(presence).find('item').attr('affiliation');
				var jid = $(presence).find('item').attr('jid');
				//join room error
				if ($(presence).attr('type') === 'error') {
					var errorCode = $(presence).find('error').attr('code');
					switch (errorCode) {
						case '407':
							console.log("you are not the member of the room!!");
							break;
						case '401':
							console.log("you need a password to join the room!!");
							break;
						case '503':
							console.log("the room has the max member!!");
							break;
						case '406':
							console.log("you can't change your nickame!!");
							break;
						case '409':
							console.log("nickname is already used!!");
							break;
					}
					console.log("join room error!");
					com.rooms.splice(i, 1);
					//join room error callback
					if (com.util.isFunction(com.xmpp.onRoomJoinError)) {
						com.xmpp.onRoomJoinError({
							roomJID: room, 
							nickname: nick
						});
					}
				}
				
				else if (!com.rooms[i].joined) {
					//when join a room which is not exist yet,the presence will have
					//the status with code 201					
					if ($(presence).find("status[code='201']").length > 0) {
						console.log("Do you want to creat the " + room + "?");
						
						com.groupChat.createReservedRoom(room, nick);
						
						if (com.util.isFunction(com.xmpp.onRoomNotExist)) {
							com.xmpp.onRoomNotExist({
								roomJID: room,
								nickname: nick
							});
						}
					}
										
					//the presence for user himself
					if (com.rooms[i].nickname === nick) {
						com.rooms[i].joined = true;
						console.log("you have already join the " + room + " as " + affiliation);
						com.rooms[i].participantsList.push(nick);
						//com.groupChat.participantsChangedHandler(room);
						com.groupChat.queryRoomMember(room);
						
						if (com.util.isFunction(com.xmpp.onRoomJoined)) {
							com.xmpp.onRoomJoined({
								roomJID: room, 
								nickname: nick,
							});
						}					
					}
					//the presence comes from some user already in the room
					else if (com.rooms[i].nickname !== nick) {
						console.log("user " + nick + " is already in the " + room + " as " + affiliation);
						com.rooms[i].participantsList.push(nick);
						//com.groupChat.participantsChangedHandler(room);
						
						if (com.util.isFunction(com.xmpp.onParticipantsChanged)) {
							com.xmpp.onParticipantsChanged({
								roomJID: room, 
								nickname: nick,
								affiliation: affiliation,
								status: "online"
							});
						}
					}					
				}
				
				//some person join room after the user joined
				else if (!com.rooms[i].participants[nick] 
							&& $(presence).attr('type') !== 'unavailable') {
					com.rooms[i].participants[nick] = true;
					if (com.rooms[i].joined) {
						console.log("user " + nick + " join the room" + " as " + affiliation);
						com.rooms[i].participantsList.push(nick);
						//com.groupChat.participantsChangedHandler(room);
						
						if (com.util.isFunction(com.xmpp.onParticipantsChanged)) {
							com.xmpp.onParticipantsChanged({
								roomJID: room, 
								nickname: nick,
								affiliation: affiliation,
								status: "online"
							});
						}
					}
				}
				
				//affiliation changed
				else if (com.rooms[i].participants[nick] 
							&& $(presence).attr('type') !== 'unavailable') {
					if (com.rooms[i].joined) {
						console.log("user " + nick + " join the room" + " as " + affiliation);
						
						if (com.util.isFunction(com.xmpp.onParticipantsChanged)) {
							com.xmpp.onParticipantsChanged({
								roomJID: room, 
								nickname: nick,
								affiliation: affiliation,
								status: "online"
							});
						}
					}
				}
	
				//some room member leave the room
				else if (com.rooms[i].participants[nick]
							&& $(presence).attr('type') === 'unavailable') {
					console.log("user " + nick + " leave the room")
					for (var j = 0; j < com.rooms[i].participantsList.length; j++) {
						if (com.rooms[i].participantsList[j] === nick) {
							com.rooms[i].participantsList.splice(j, 1);
							//com.groupChat.participantsChangedHandler(room);
								
							if (com.util.isFunction(com.xmpp.onParticipantsChanged)) {
								com.xmpp.onParticipantsChanged({
									roomJID: room, 
									nickname: nick,
									affiliation: affiliation,
									status: "offline"
								});
							}
						}
					}
				}
			}
		}
		return true;
    },    
    
    /**
     * To handle the presence from some person
     */
    private_presenceHandler: function(presence) {
        var type = $(presence).attr('type') || 'available';
        var from = $(presence).attr('from');
        var email_id = com.util.jidToEmail(from);
        
        if (type == 'subscribe') {
            // Someone wants to subscribe your status, it is a adding friend request
            
            var pos = com.roster.findWaitingFriend(email_id);
            console.log("Find waiting friend "+ email_id + " result: " + pos);
            if (pos >= 0) {
                // You want to add him as your friend before, so approve it directly
                com.xmpp.approveSubscribe(from);
                // Remove him or her from our waiting list
                com.roster.removeWaitingFriend(email_id);
            }
            else {
                // Notify our user, someone wants to add him as friend
                if (com.util.isFunction(com.xmpp.onPresenceSubscribe)) {
                    com.xmpp.onPresenceSubscribe(email_id);
                }
                
            }
        }
        else if (type == 'subscribed') {
            // You subscribe someone success
            if (com.util.isFunction(com.xmpp.onPresenceSubscribed)) {
                com.xmpp.onPresenceSubscribed(email_id);
            }
            // Add friend succeed
            if (com.util.isFunction(com.xmpp.onAddFriendSucceed)) {
                com.xmpp.onAddFriendSucceed(email_id);
            }
        }
        else if (type == 'unsubscribe') {
            // Someone wants to delete subscribing your status or wants to delete you from his friend list
            
            com.xmpp.approveUnsubscribe(from);
            if (com.util.isFunction(com.xmpp.onPresenceUnsubscribe)) {
                com.xmpp.onPresenceUnsubscribe(email_id);
            }
        }
        else if (type == 'unsubscribed') {
            // You delete subscribing someone success or someone has refused your adding friend request
            var pos = com.roster.findWaitingFriend(email_id);
            if (pos >= 0) {
                console.log(email_id + " has refused to add him or her as your friend");
                if (com.util.isFunction(com.xmpp.onPresenceDenySubscribe)) {
                    com.xmpp.onPresenceDenySubscribe(email_id);
                }
                // Remove him or her from our waiting list
                com.roster.removeWaitingFriend(email_id);
            }
            else {
                // You delete someone succeed
                if (com.util.isFunction(com.xmpp.onDeleteFriendSucceed)) {
                    com.xmpp.onDeleteFriendSucceed(email_id);
                }
            }
            if (com.util.isFunction(com.xmpp.onPresenceUnsubscribed)) {
                com.xmpp.onPresenceUnsubscribed(email_id);
            }
        }
        else {
            // Some one is changing status
            var status;
            if (type == 'unavailable') {
                status = com.roster.STATUS_OFFLINE;
            }
            else {
                var show = $(presence).find('show').text();
                if (show == '' || show == 'chat') {
                    status = com.roster.STATUS_ONLINE;
                }
                else {
                    status = com.roster.STATUS_AWAY;
                }
            }
            
            com.roster.modifyFriendStatus(email_id, status);
            
            if (com.util.isFunction(com.xmpp.onPresenceStatusChanged)) {
                com.xmpp.onPresenceStatusChanged({
                    email_id: email_id,
                    status: status
                });
            }
//            if(email_id == com.user.email_id)
//            {
//            	com.xmpp.connection.send($pres());
//            }	  
            
        }
        return true;
    },
    
    chatMessageHandler: function(message) {
        var full_jid = $(message).attr('from');
        var jid = Strophe.getBareJidFromJid(full_jid);
        var email_id = com.util.jidToEmail(jid);
        var composing = $(message).find('composing');
        if (composing.length > 0) {
            // Reserved this interface to notify that your friend is typing...
            // This is like a notification
        }
        var body = $(message).find('html > body');
        if (body.length === 0) {
            body = $(message).find('body');
            if (body.length > 0) {
                body = body.text();
            }
            else {
                body = null;
            }
        }
        else {
            body = body.contents();
            var span = $('<span></span>');
            body.each(function() {
                if (document.importNode) {
                    $(document.importNode(this, true)).appendTo(span);
                }
                else {
                    // IE work around
                    span.append(this.xml);
                }
            });
            body = span;
        }
        var name = com.roster.getFriendName(email_id)
        if (com.util.isFunction(com.xmpp.onChatMessage)) {
            com.xmpp.onChatMessage({
                email_id: email_id,
                name: name,
                message: body
            });
        }
        return true;
    },
    
    groupChatMessageHandler: function(message) {
		var from = $(message).attr('from');
		var room = Strophe.getBareJidFromJid(from);
		var nick = Strophe.getResourceFromJid(from) || room;
		console.log("a");
		for (var i = 0; i < com.rooms.length; i++)
		{
			if(com.rooms[i].roomJID === room) {
				var body = $(message).children('body').text();
				
				console.log("b");
				if (com.util.isFunction(com.xmpp.onRoomChatMessage)) {
					com.xmpp.onRoomChatMessage({
						roomJID: room,
						nickname: nick,
						roomMessage: body
					});
					console.log("c");
				
				}
				console.log(room + " " + nick + " sending " + body);
			}
		}
		return true;
	},

	roomInviteHandler: function (msg) {
		console.log(Strophe.serialize(msg));
		var type = $(msg).attr('type');
		if (type === 'error')
		{
			console.log("msg error: " + Strophe.serialize(msg));
		}
		if ($(msg).find('invite').length > 0)
		{
			console.log("invite msg: " + Strophe.serialize(msg));
			var inviteRoom = $(msg).attr('from');
			var inviteUser = $(msg).find('invite').attr('from');
			var inviteReason = $(msg).find('reason').text();
			console.log(inviteUser + " invite you to join " + inviteRoom);
			//com.xmpp.roomJoinDecline(inviteRoom, inviteUser, "nonono");
			com.xmpp.roomJoinApprove(inviteRoom);
			
			if (com.util.isFunction(com.xmpp.onRoomInvite)) {
				com.xmpp.onRoomInvite({
                    inviteRoom: inviteRoom,
                    inviteUser: inviteUser,
                    inviteReason: inviteReason
                });
			}
		}
		else if ($(msg).find('decline').length > 0)
		{
			console.log("decline msg: " + Strophe.serialize(msg));
			var declineRoom = $(msg).attr('from');
			var declineUser = $(msg).find('decline').attr('from');
			var declineReason = $(msg).find('reason').text();
			console.log(declineUser + " refuse to join " + declineRoom);
			
			//delete user from member list
			var iq = $pres({to: declineRoom, type: 'set'})
						.c('query', {xmlns: 'http://jabber.org/protocol/muc#admin'})
						.c('item', {affiliation: 'none', jid: declineUser});
			com.xmpp.connection.sendIQ(iq, com.groupChat.iqDeleteMemberHandler, com.groupChat.iqErrorHandler);
			
			if (com.util.isFunction(com.xmpp.onRoomDecline)) {
				com.xmpp.onRoomDecline({
                    declineRoom: declineRoom,
                    declineUser: declineUser,
                    declineReason: declineReason
                });
			}
		}
		return true;
	},
	
	setNameID: function (userid) {
//		 var iq = $iq({type: 'set'})
//         .c('query', {xmlns: 'jabber:iq:user'})
//         .c('item', {jid: jid, name: friend_info.name})
//         .c('name')
//         .t(userid); 
//		com.xmpp.connection.sendIQ(iq, com.xmpp.queryRoomHandler, com.xmpp.iqErrorHandler);
//		console.log("send iq: " + iq);
	}
	
};
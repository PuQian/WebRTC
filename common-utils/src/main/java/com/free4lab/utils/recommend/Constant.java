package com.free4lab.utils.recommend;

public class Constant {
    static public Integer ITEM_TYPE_USER = 1;
    
    static public Integer ITEM_TYPE_GROUP = 2;
    static public Integer ITEM_TYPE_LIST = 4;
    
    static public Integer ITEM_TYPE_DOC = 8;
    static public Integer ITEM_TYPE_URL = 16;
    static public Integer ITEM_TYPE_VIDEO_UR = 32;
    static public Integer ITEM_TYPE_TEXT = 64;
    static public Integer ITEM_TYPE_RESOURCE = 120;
    
    static public Integer ITEM_TYPE_UNKOWN = 128;
    
    static public Integer ITEM_TYPE_MASK = 255;

     
    static public String BEHAVIOR_TYPE_EDIT = "EDIT";
    static public String BEHAVIOR_TYPE_BROWSE = "BROWSE";
    static public String BEHAVIOR_TYPE_COMMENT = "COMMENT";
    static public String BEHAVIOR_TYPE_LIKE = "LIKE";
    static public String BEHAVIOR_TYPE_DISLIKE = "DISLIKE";
    static public String BEHAVIOR_TYPE_SHARE = "SHARE";
    static public String BEHAVIOR_TYPE_BELONG = "BELONG";
    static public String BEHAVIOR_TYPE_ACCEPT = "ACCEPT";
    static public String BEHAVIOR_TYPE_DENY = "DENY";
    static public String BEHAVIOR_TYPE_UNKOWN = "UNKOWN";
    
    public static Boolean QUERY_TYPE_USER = true;
    public static Boolean QUERY_TYPE_ITEM = false;
    
    public static Long DEFAULT_ID = ( Constant.ITEM_TYPE_UNKOWN.longValue()<<32 ) | 0;
}

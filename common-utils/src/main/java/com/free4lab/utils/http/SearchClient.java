package com.free4lab.utils.http;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;

import org.apache.commons.httpclient.HttpClient;
import org.apache.commons.httpclient.methods.GetMethod;
import org.apache.commons.httpclient.methods.PostMethod;
import org.apache.commons.httpclient.params.HttpMethodParams;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


/**
 * @author wenchaoz361
 *
 */
public class SearchClient {
    String host = "";

    // final String searchUrl = host+"/search";
    // final String addDocUrl = host+"/index/add";
    // final String updateDocUrl = host+"/index/update";
    // final String deleteDocUrl = host+"/index/clear";
    // final String addTagUrl = host+"/index/addTag";
    // final String clearTagUrl = host+"/index/clearTag";
    // final String valueTagUrl = host+"/index/valueTag";
    // final String docContentUrl = host+"/docContent";
    // final String wordTipUrl = host+"/index/wordTip";

    public static final String URL_PARA = "url";
    public static final String TITLE_PARA = "title";
    public static final String CONTENT_PARA = "content";
    public static final String Q_PARA = "q";
    public static final String TAG_PARA = "tag";
    public static final String TAG_VALUE = "value";

    public static final String MARK_PARA = "mark";
    public static final String TYPE_PARA = "type";
    public static final String PAGE_PARA = "page";
    public static final String SIZE_PARA = "size";
    public static final String WORD_PARA = "word";
    public static final String TRUNC_PARA = "truncedTag";
    
    public static final String PARA_SORT_MODE = "sortmode";
    public static final String PARA_NEED_INDEXED = "needIndexed";
    public static final String PARA_CREATE_TIME = "createTime";
    public static final String PARA_LAST_MODIFYED_TIME = "lastModifiedTime";
    public static final String REQUEST_PARA = "docRequest";

    public SearchClient(String host) {
        this.host = host;
    }

    /**
     * 根据一个词获取其提示列表
     * 
     * @param word
     * @param maxSize
     *            获取前maxSize组结果
     * @return
     * @throws IOException
     * @throws JSONException
     */
    public List<String> getWordTip(String word, int maxSize) throws Exception {
        HttpClient client = new HttpClient();
        String params = "?" + SIZE_PARA + "=" + maxSize;
        params += "&" + WORD_PARA + "=" + URLEncoder.encode(word, "UTF-8");
        String requestUrl = getWordTipUrl() + params;
        GetMethod method = new GetMethod(requestUrl);
        client.executeMethod(method);

        String result = method.getResponseBodyAsString();
        JSONObject json = new JSONObject(result);

        JSONArray words = json.getJSONArray("wordList");

        List<String> ret = new LinkedList<String>();
        for (int i = 0; i < words.length(); i++) {
            ret.add(words.getString(i));
        }
        return ret;
    }

    /**
     * 获取前n组结果
     * 
     * @param word
     * @return
     * @throws HttpException
     * @throws IOException
     * @throws JSONException
     */
    public List<String> getWordTip(String word) throws Exception {
        return getWordTip(word, Integer.MAX_VALUE);
    }

    /**
     * 根据url获取doc的
     * 
     * @param url
     *            文档的url
     * @return null -- 如果文档不存在 doc的json串 -- 如果文档存在
     */
    public String getDoc(String url) throws Exception {
        HttpClient client = new HttpClient();

        String params = "?" + URL_PARA + "=" + URLEncoder.encode(url, "UTF-8");
        String requestUrl = getDocContentUrl() + params;
        System.out.println(requestUrl);
        GetMethod method = new GetMethod(requestUrl);
        client.executeMethod(method);
        String result = method.getResponseBodyAsString();
        JSONObject json = new JSONObject(result);

        String status = json.getString("status");
        if ("OK".equals(status)) {
            return json.get("doc").toString();
        } else {
            return null;
        }
    }

    /**
     * 按照key和value来修改doc的内容
     * 
     * @param url
     * @param req
     *            <String, String> key,value key "a:b:c" {a:{b:{c:123, d:345},
     *            e:123}, f:456} value string
     * @return null -- 如果修改失败 doc的json串 -- 如果修改成功，返回修改之后的内容
     * @throws HttpException
     * @throws IOException
     * @throws JSONException
     */
    public String changeDocContent(String url, Map<String, Object> req) throws Exception {
        HttpClient client = new HttpClient();
        PostMethod method = new PostMethod(getDocContentUrl());
        method.getParams().setParameter(HttpMethodParams.HTTP_CONTENT_CHARSET, "utf-8");
        method.addRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        method.addParameter(URL_PARA, url);
        for (Entry<String, Object> r : req.entrySet()) {
            method.addParameter(REQUEST_PARA, r.getKey() + "=" + r.getValue().toString());
        }
        client.executeMethod(method);

        String result = method.getResponseBodyAsString();
        JSONObject json = new JSONObject(result);
        String status = json.getString("status");
        if ("OK".equals(status)) {
            return json.get("doc").toString();
        } else {
            return null;
        }
    }

    /**
     * 给搜索内增加一份doc
     * 
     * @param url
     *            文档的url
     * @param title
     *            文档的标题
     * @param content
     *            文档的内容
     * @param tags
     *            文档的tags，若不存在则传入一个长度为0的数组
     * @throws IOException
     *             , HttpException
     */
    public void addDoc(String url, String title, String content, List<String> tags)
            throws Exception {
        HttpClient client = new HttpClient();
        PostMethod method = new PostMethod(getAddDocUrl());
        method.getParams().setParameter(HttpMethodParams.HTTP_CONTENT_CHARSET, "utf-8");
        method.addRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        if (url == null || "".equals(url)) {
            url = UUID.randomUUID().toString();
        }
        method.addParameter(URL_PARA, url);
        method.addParameter(TITLE_PARA, title);
        method.addParameter(CONTENT_PARA, content);
        for (String tag : tags) {
            method.addParameter(TAG_PARA, tag);
        }

        client.executeMethod(method);

    }

    /**
     * 给搜索内增加一份doc
     * 
     * @param url
     *            文档的url
     * @param title
     *            文档的标题
     * @param content
     *            文档的内容
     * @param tags
     *            文档的tags，若不存在则传入一个长度为0的数组
     * @throws IOException
     *             , HttpException
     */
    public void addDoc(String url,
                       String title,
                       String content,
                       List<String> tags,
                       List<String> needIndexedItems,
                       String createdTime,
                       String lastModifiedTime) throws Exception {
        HttpClient client = new HttpClient();
        PostMethod method = new PostMethod(getAddDocUrl());
        method.getParams().setParameter(HttpMethodParams.HTTP_CONTENT_CHARSET, "utf-8");
        method.addRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        if (url == null || "".equals(url)) {
            url = UUID.randomUUID().toString();
        }
        method.addParameter(URL_PARA, url);
        method.addParameter(TITLE_PARA, title);
        method.addParameter(CONTENT_PARA, content);
        if (createdTime != null) {
            method.addParameter(PARA_CREATE_TIME, createdTime);
        }
        if (lastModifiedTime != null) {
            method.addParameter(PARA_LAST_MODIFYED_TIME, lastModifiedTime);
        }

        if (needIndexedItems != null) {
            for (String needIndexItem : needIndexedItems) {
                method.addParameter(PARA_NEED_INDEXED, needIndexItem);
            }
        }
        if (tags != null) {
            for (String tag : tags) {
                method.addParameter(TAG_PARA, tag);
            }
        }
        client.executeMethod(method);

    }

    /**
     * 删除一个url的所有tag标签
     * 
     * @param url
     * @return 返回请求的返回值
     * @throws HttpException
     * @throws IOException
     */
    public void delDoc(String url) throws Exception {
        HttpClient client = new HttpClient();
        String params = "?" + URL_PARA + "=" + URLEncoder.encode(url, "UTF-8");
        String requestUrl = getDeleteDocUrl() + params;
        GetMethod method = new GetMethod(requestUrl);
        client.executeMethod(method);
    }

    /**
     * 更新一个doc的内容
     * 
     * @param url
     * @param title
     * @param content
     * @param tags
     * @return 返回请求的返回值
     * @throws IOException
     * @throws HttpException
     */
    public void updateDoc(String url,
                          String title,
                          String content,
                          List<String> tags,
                          List<String> needIndexedItems,
                          String createdTime,
                          String lastModifiedTime) throws Exception {
        HttpClient client = new HttpClient();
        PostMethod method = new PostMethod(getUpdateDocUrl());
        method.getParams().setParameter(HttpMethodParams.HTTP_CONTENT_CHARSET, "utf-8");
        method.addRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=utf-8");
        method.addParameter(URL_PARA, url);
        method.addParameter(TITLE_PARA, title);
        method.addParameter(CONTENT_PARA, content);
        if (createdTime != null) {
            method.addParameter(PARA_CREATE_TIME, createdTime);
        }
        if (lastModifiedTime != null) {
            method.addParameter(PARA_LAST_MODIFYED_TIME, lastModifiedTime);
        }

        if (needIndexedItems != null) {
            for (String needIndexItem : needIndexedItems) {
                method.addParameter(PARA_NEED_INDEXED, needIndexItem);
            }
        }
        if (tags != null) {
            for (String tag : tags) {
                method.addParameter(TAG_PARA, tag);
            }
        }
        client.executeMethod(method);
    }

    /**
     * 给文档增加一些标签
     * 
     * @param url
     * @param tags
     * @return
     * @throws HttpException
     * @throws IOException
     */
    public void addTags(String url, List<String> tags) throws Exception {
        HttpClient client = new HttpClient();
        String params = "?" + URL_PARA + "=" + URLEncoder.encode(url, "UTF-8");
        for (String tag : tags) {
            params += "&" + TAG_PARA + "=" + URLEncoder.encode(tag, "UTF-8");
        }

        String requestUrl = getAddTagUrl() + params;
        GetMethod method = new GetMethod(requestUrl);

        client.executeMethod(method);
    }

    /**
     * 清除一个doc的标签，原标签不存在也并不会抛出异常
     * 
     * @param url
     * @param tags
     * @return
     * @throws HttpException
     * @throws IOException
     */
    public void delTags(String url, List<String> tags) throws Exception {
        HttpClient client = new HttpClient();
        String params = "?" + URL_PARA + "=" + URLEncoder.encode(url, "UTF-8");
        for (String tag : tags) {
            params += "&" + TAG_PARA + "=" + URLEncoder.encode(tag, "UTF-8");
        }

        String requestUrl = getClearTagUrl() + params;
        GetMethod method = new GetMethod(requestUrl);

        client.executeMethod(method);
    }

    /**
     * 设置一个url和标签的标签值
     * 
     * @param url
     * @param tag
     * @param value
     * @return 如果一切正常返回修改之前的值
     * @throws Exception
     *             出错
     */
    public long setTagValue(String url, String tag, long value) throws Exception {
        HttpClient client = new HttpClient();
        String params = "?"
                        + URL_PARA
                        + "="
                        + URLEncoder.encode(url, "UTF-8")
                        + "&"
                        + TAG_PARA
                        + "="
                        + URLEncoder.encode(tag, "UTF-8")
                        + "&"
                        + TAG_VALUE
                        + "="
                        + value;

        String requestUrl = getValueTagUrl() + params;
        GetMethod method = new GetMethod(requestUrl);
        client.executeMethod(method);
        String result = method.getResponseBodyAsString();

        System.out.println(result);
        try {
            JSONObject json = new JSONObject(result);
            Long oriValue = json.getLong("oriValue");
            String state = json.getString("status");
            if (state != null && "ok".equals(state.toLowerCase())) {
                return oriValue;
            } else {
                throw new Exception("state is wrong");
            }
        }
        catch (Exception e) {
            throw new IllegalArgumentException(url + e.getMessage());
        }

    }

    /**
     * 设置一个url和标签的标签值，url或者tag值不存在会扔出异常
     * 
     * @param url
     * @param tag
     * @param value
     * @return 如果一切正常返回原值
     * @throws Exception
     *             出错
     */
    public long getTagValue(String url, String tag) throws Exception {
        HttpClient client = new HttpClient();
        String params = "?"
                        + URL_PARA
                        + "="
                        + URLEncoder.encode(url, "UTF-8")
                        + "&"
                        + TAG_PARA
                        + "="
                        + URLEncoder.encode(tag, "UTF-8");

        String requestUrl = getValueTagUrl() + params;

        GetMethod method = new GetMethod(requestUrl);
        client.executeMethod(method);
        String result = method.getResponseBodyAsString();
        System.out.println(result);
        try {
            JSONObject json = new JSONObject(result);
            Long oriValue = json.getLong("oriValue");
            String state = json.getString("status");
            if ("ok".endsWith(state)) {
                return oriValue;
            } else {
                throw new Exception("state is wrong");
            }
        }
        catch (Exception e) {
            throw new IllegalArgumentException(url);
        }
    }
    
    /**
     * 
    * @Title: getContent
    * @Description: TODO
    * @param url
    * @return
     * @throws Exception 
     */
    public String getContent(String url) throws Exception {
        HttpClient client = new HttpClient();
        String params = "?"
                + URL_PARA
                + "="
                + URLEncoder.encode(url, "UTF-8");
        String requestUrl = getDocContentUrl() + params;
        GetMethod method = new GetMethod(requestUrl);
        client.executeMethod(method);
        String result = method.getResponseBodyAsString();
        
        return result;
    }
    /**
     * 提供给搜索的接口，搜索结果会被生成摘要
     * 
     * @param query
     *            查询语句，完全不需要这个参数时，请传入null
     * @param tag
     *            标签的组合，完全不需要这个参数时，请传入null
     * @param page
     *            请求的页码数，完全不需要这个参数时，请传入0，服务器会默认按首页处理
     * @param size
     *            单个页面的大小，完全不需要这个参数时，请传入0，服务器会默认按20处理
     * @param sortmode
     *            排序模式，"升序/降序:排序标准:XX",这三个参数请以:隔开，而且完整必须写三个参数
     *            第一个参数为ASC或DESC之一，其余的字符串会被默认解释为降序
     *            第二个参数为tagValue或time之一，其余的字符会被解释为time
     *            第三个参数完全没用，但作为扩展项也被保留下来，请随便传入一个字符串,建议用XX
     *            完全不需要sortmode这个参数时，请传入null.默认按照
     * 
     * @param type
     *            返回结果的类型，请传入"json"或者null,会返回json类型。其余的字符串服务器都会返回一个页面 。
     * @return 返回搜索返回的字符串
     * @throws HttpException
     * @throws IOException
     */
    public String search(String query,
                         String tag,
                         String sortmode,
                         Integer page,
                         Integer size,
                         String type) throws Exception {
        return search(query, tag, sortmode, page, size, type, true);
    }

    /**
     * @param query
     *            查询语句，完全不需要这个参数时，请传入null
     * @param tag
     *            标签的组合，完全不需要这个参数时，请传入null
     * @param page
     *            请求的页码数，完全不需要这个参数时，请传入0，服务器会默认按首页处理
     * @param size
     *            单个页面的大小，完全不需要这个参数时，请传入0，服务器会默认按20处理
     * @param sortmode
     *            排序模式，"升序/降序:排序标准:XX",这三个参数请以:隔开，而且完整必须写三个参数
     *            第一个参数为ASC或DESC之一，其余的字符串会被默认解释为降序
     *            第二个参数为tagValue或time之一，其余的字符会被解释为time
     *            第三个参数完全没用，但作为扩展项也被保留下来，请随便传入一个字符串,建议用XX
     *            完全不需要sortmode这个参数时，请传入null.默认按照
     * @param truncResult
     *            如果参数为false，可以控制 返回结果全文，而结果摘要
     * @return
     * @throws Exception
     */
    public String search(String query,
                         String tag,
                         String sortmode,
                         Integer page,
                         Integer size,
                         String type,
                         boolean truncResult) throws Exception {
        HttpClient client = new HttpClient();
        String params = "";
        if (query != null) {
            params += "?" + Q_PARA + "=" + URLEncoder.encode(query, "UTF-8");
        }

        if (tag != null) {
            if (query != null) {
                params += "&" + TAG_PARA + "=" + URLEncoder.encode(tag, "UTF-8");
            } else {
                params += "?" + TAG_PARA + "=" + URLEncoder.encode(tag, "UTF-8");
            }
        }

        if (page != 0) {
            params += "&" + PAGE_PARA + "=" + page;
        }
        if (size != 0) {
            params += "&" + SIZE_PARA + "=" + size;
        }
        if (sortmode != null) {
            params += "&" + PARA_SORT_MODE + "=" + URLEncoder.encode(sortmode, "UTF-8");
        }
        if (type == null) {
            params += "&" + TYPE_PARA + "=json";
        } else {
            params += "&" + TYPE_PARA + "=" + URLEncoder.encode(type, "UTF-8");
        }
        if (truncResult == false) {
            params += "&" + MARK_PARA + "=false";
        }

        String requestUrl = getSearchUrl() + params;
        System.out.println("search url is " + requestUrl);
        GetMethod method = new GetMethod(requestUrl);
        client.executeMethod(method);
        return method.getResponseBodyAsString();
    }

    public String search(String query,
                         String tag,
                         String sortmode,
                         Integer page,
                         Integer size,
                         String type,
                         List<String> truncTags) throws Exception {
        HttpClient client = new HttpClient();
        String params = "";
        if (query != null) {
            params += "?" + Q_PARA + "=" + URLEncoder.encode(query, "UTF-8");
        }

        if (tag != null) {
            if (query != null) {
                params += "&" + TAG_PARA + "=" + URLEncoder.encode(tag, "UTF-8");
            } else {
                params += "?" + TAG_PARA + "=" + URLEncoder.encode(tag, "UTF-8");
            }
        }

        if (page != 0) {
            params += "&" + PAGE_PARA + "=" + page;
        }
        if (size != 0) {
            params += "&" + SIZE_PARA + "=" + size;
        }
        if (sortmode != null) {
            params += "&" + PARA_SORT_MODE + "=" + URLEncoder.encode(sortmode, "UTF-8");
        }
        if (type == null) {
            params += "&" + TYPE_PARA + "=json";
        } else {
            params += "&" + TYPE_PARA + "=" + URLEncoder.encode(type, "UTF-8");
        }
        
        params += "&" + MARK_PARA + "=false";
        for (String truncTag : truncTags) {
            params += "&" + TRUNC_PARA + "=" + URLEncoder.encode(truncTag, "UTF-8");
        }

        String requestUrl = getSearchUrl() + params;
        System.out.println("search url is " + requestUrl);
        GetMethod method = new GetMethod(requestUrl);
        client.executeMethod(method);
        return method.getResponseBodyAsString();
    }
    
    public String getSearchUrl() {
        return host + "/search";
    }

    public String getAddDocUrl() {
        return host + "/index/add";
    }

    public String getUpdateDocUrl() {
        return host + "/index/update";
    }

    public String getDeleteDocUrl() {
        return host + "/index/clear";
    }

    public String getAddTagUrl() {
        return host + "/index/addTag";
    }

    public String getClearTagUrl() {
        return host + "/index/clearTag";
    }

    public String getValueTagUrl() {
        return host + "/index/valueTag";
    }

    public String getDocContentUrl() {
        return host + "/docContent";
    }

    public String getWordTipUrl() {
        return host + "/index/wordTip";
    }

}

package com.free4lab.utils.recommend;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;


public class RecommendResults {
    static String RESUTLS = "Results";
    
	public static Integer DEFAULT_REC_NUM = 10;
    Map<Long,RecommendResult> results = new HashMap<Long, RecommendResult>();
//    Integer K = DEFAULT_REC_NUM;
    
 
    
    /**
     * 合并两个结果
     * @param recommend
     */
//    public void merge(RecommendResults others) {
//        for (Entry<Long, RecommendResult> e : others.getResults().entrySet()) {
//             addResult(e.getValue());
//        }
//    }
    
    /**
     * 合并两个结果
     * 归一化并加权
     * @param others
     */
    public void merge(RecommendResults others,Double weight) {
        //归一化并加权
        others.normalize(weight);
        //合并
        for (Entry<Long, RecommendResult> e : others.getResults().entrySet()) {
            addResult(e.getValue());
        }
    }
    
    public void normalize(Double weight){
        Double maxweight = 0.0;
        for (Entry<Long, RecommendResult> e : results.entrySet()) {
            Double tmp = e.getValue().getScore();
            maxweight = tmp>maxweight? tmp : maxweight;
        }
        weight/= maxweight;
        for (Entry<Long, RecommendResult> e : results.entrySet()) {
            e.getValue().multiply(weight);
        }
    }
    
    
    
    
    
    public void addResult(RecommendResult r1){
        Long id = r1.getRecommendObject().getId();
        RecommendResult r = results.get(id);
        if(r==null){
            results.put(id, r1);
        }
        else{
            r.merge(r1);
        }
    }
    
    
    /**
     * 
     * @return
     */
    public List<RecommendResult> getResultList(){
      List<RecommendResult> resultlist = new ArrayList<RecommendResult>(results.values());
      Collections.sort(resultlist,RecommendResult.dc);
      return resultlist;
    }
    
    /**
     * 
     * @param K
     * @return
     * @throws JSONException 
     */
    public String toJSON(Integer K) throws JSONException{
        List<RecommendResult> resultlist = getResultList();
        JSONArray arr = new JSONArray();
        for (int i = 0 ;i <resultlist.size() && i<K;i++){
            arr.put(i,resultlist.get(i).getJSON());
        }
        JSONObject obj = new JSONObject();
        obj.put(RESUTLS, arr);
        return obj.toString();
    }
    
    public static RecommendResults fromJSON(String json,Integer K) throws JSONException{
        RecommendResults results= new RecommendResults();
        JSONObject obj = new JSONObject(json);
        JSONObject jsonObject = obj.getJSONObject("json");
        JSONArray arr = jsonObject.getJSONArray(RESUTLS);
        for ( int i=0; i < arr.length(); i++) {
            results.addResult(RecommendResult.fromJSON(arr.getString(i)));
        }
        return results;
    }

    public static RecommendResults fromJSON(String json) throws JSONException{
        RecommendResults results= new RecommendResults();
        System.out.println(json);
        JSONObject obj = new JSONObject(json);
        JSONObject jsonObj = new JSONObject(obj.getString("json"));
        JSONArray arr = jsonObj.getJSONArray(RESUTLS);
        for ( int i=0; i < arr.length(); i++) {
            results.addResult(RecommendResult.fromJSON(arr.getString(i)));
        }
        return results;
    }
    
    
    public Map<Long, RecommendResult> getResults() {
        return results;
    }

    public void setResults(Map<Long, RecommendResult> results) {
        this.results = results;
    }
    
    
}

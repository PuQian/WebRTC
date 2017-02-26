package com.free4lab.account.api.action.WMSAuth;



import java.io.UnsupportedEncodingException;
import java.security.Key;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

import sun.misc.BASE64Decoder;
import sun.misc.BASE64Encoder;
 
 
/**
11  * SecretUtils {3DES加密解密的工具类 }
12  * @author William
13  * @date 2013-04-19
14  */
public class ThreeDES {
    private Key key;        //密钥  
    
    /** 
     * 根据参数生成KEY 
     * 
     * @param strKey 密钥字符串 
     */  
    public void getKey(String strKey) throws NoSuchAlgorithmException{  
        try {  
            KeyGenerator _generator = KeyGenerator.getInstance("DES");
            
            SecureRandom secureRandom = SecureRandom.getInstance("SHA1PRNG");  
            secureRandom.setSeed(strKey.getBytes());             
//            _generator.init(new SecureRandom(strKey.getBytes()));  
          _generator.init(secureRandom);  
 
            
            this.key = _generator.generateKey();  
            _generator = null;  
        } catch (Exception e) {  
            e.printStackTrace();  
        }  
    }  
  
    /** 
     * 加密String明文输入,String密文输出 
     * 
     * @param strMing String明文 
     * @return String密文 
     */  
    public String getEncString(String strMing) {  
        byte[] byteMi = null;  
        byte[] byteMing = null;  
        String strMi = "";  
        BASE64Encoder base64en = new BASE64Encoder();  
        try {  
            byteMing = strMing.getBytes("UTF8");  
            byteMi = this.getEncCode(byteMing);  
            strMi = base64en.encode(byteMi);  
        } catch (Exception e) {  
            e.printStackTrace();  
        } finally {  
            base64en = null;  
            byteMing = null;  
            byteMi = null;  
        }  
        return strMi;  
    }  
  
    /** 
     * 解密 以String密文输入,String明文输出 
     * 
     * @param strMi String密文 
     * @return String明文 
     */  
    public String getDesString(String strMi) {  
        BASE64Decoder base64De = new BASE64Decoder();  
        byte[] byteMing = null;  
        byte[] byteMi = null;  
        String strMing = "";  
        try {  
            byteMi = base64De.decodeBuffer(strMi);  
            byteMing = this.getDesCode(byteMi);  
            strMing = new String(byteMing, "UTF8");  
        } catch (Exception e) {  
            e.printStackTrace();  
        } finally {  
            base64De = null;  
            byteMing = null;  
            byteMi = null;  
        }  
        return strMing;  
    }  
  
    /** 
     * 加密以byte[]明文输入,byte[]密文输出 
     * 
     * @param byteS byte[]明文 
     * @return byte[]密文 
     */  
    private byte[] getEncCode(byte[] byteS) {  
        byte[] byteFina = null;  
        Cipher cipher;  
        try {  
            cipher = Cipher.getInstance("DES");  
            cipher.init(Cipher.ENCRYPT_MODE, key);  
            byteFina = cipher.doFinal(byteS);  
        } catch (Exception e) {  
            e.printStackTrace();  
        } finally {  
            cipher = null;  
        }  
        return byteFina;  
    }  
  
    /** 
     * 解密以byte[]密文输入,以byte[]明文输出 
     * 
     * @param byteD byte[]密文 
     * @return byte[]明文 
     */  
    private byte[] getDesCode(byte[] byteD) {  
        Cipher cipher;  
        byte[] byteFina = null;  
        try {  
            cipher = Cipher.getInstance("DES");  
            cipher.init(Cipher.DECRYPT_MODE, key);  
            byteFina = cipher.doFinal(byteD);  
        } catch (Exception e) {  
            e.printStackTrace();  
        } finally {  
            cipher = null;  
        }  
        return byteFina;  
    }  
  
    //16进制字符串转数组  
    private static byte[] hexStr2ByteArr(String strIn) throws Exception {  
        byte[] arrB = strIn.getBytes();  
        int iLen = arrB.length;  
  
        // 两个字符表示一个字节，所以字节数组长度是字符串长度除以2  
        byte[] arrOut = new byte[iLen / 2];  
        for (int i = 0; i < iLen; i = i + 2) {  
            String strTmp = new String(arrB, i, 2);  
            arrOut[i / 2] = (byte) Integer.parseInt(strTmp, 16);  
        }  
        return arrOut;  
    }  
      
    //数组转16进制字符串  
    private static String byteArr2HexStr(byte[] arrB) throws Exception {   
        int iLen = arrB.length;  
        // 每个byte用两个字符才能表示，所以字符串的长度是数组长度的两倍  
        StringBuffer sb = new StringBuffer(iLen * 2);  
        for (int i = 0; i < iLen; i++) {  
            int intTmp = arrB[i];  
            // 把负数转换为正数  
            while (intTmp < 0) {  
                intTmp = intTmp + 256;  
            }  
            // 小于0F的数需要在前面补0  
            if (intTmp < 16) {  
                sb.append("0");  
            }  
            sb.append(Integer.toString(intTmp, 16));  
        }  
        // 最大128位  
        String result = sb.toString();  
//      if(result.length()>128){  
//          result = result.substring(0,result.length()-1);  
//      }  
        return result;  
    }  
//    public static void main(String[] args) throws Exception {  
//    	ThreeDES des = new ThreeDES();  // 实例化一个对像  
//        des.getKey("sortec2008");  // 生成密匙  
//  
//        String strEnc = des.getEncString("abc");// 加密字符串,返回String的密文  
//        System.out.println("密文： "+ThreeDES.byteArr2HexStr(strEnc.getBytes()));  
////        ThreeDes2.byteArr2HexStr(strEnc.getBytes())  
//        String strDes = des.getDesString(strEnc);// 把String 类型的密文解密  
//        System.out.println(strDes);  
//    }  
  
//    //定义加密算法，有DES、DESede(即3DES)、Blowfish
//     private static final String Algorithm = "DESede";    
//     private static final String PASSWORD_CRYPT_KEY = "2012PinganVitality075522628888ForShenZhenBelter075561869839";
//     
//     
//     /**
//23      * 加密方法
//24      * @param src 源数据的字节数组
//25      * @return 
//26      */
//     public static byte[] encryptMode(byte[] src) {
//        try {
//             SecretKey deskey = new SecretKeySpec(build3DesKey(PASSWORD_CRYPT_KEY), Algorithm);    //生成密钥
//              Cipher c1 = Cipher.getInstance(Algorithm);    //实例化负责加密/解密的Cipher工具类
//              c1.init(Cipher.ENCRYPT_MODE, deskey);    //初始化为加密模式
//             return c1.doFinal(src);
//         } catch (java.security.NoSuchAlgorithmException e1) {
//              e1.printStackTrace();
//          } catch (javax.crypto.NoSuchPaddingException e2) {
//              e2.printStackTrace();
//          } catch (java.lang.Exception e3) {
//              e3.printStackTrace();
//          }
//          return null;
//      }
//          
//     /**
//45      * 解密函数
//46      * @param src 密文的字节数组
//47      * @return
//48      */
//     public static byte[] decryptMode(byte[] src) {      
//         try {
//             SecretKey deskey = new SecretKeySpec(build3DesKey(PASSWORD_CRYPT_KEY), Algorithm);
//             Cipher c1 = Cipher.getInstance(Algorithm);
//             c1.init(Cipher.DECRYPT_MODE, deskey);    //初始化为解密模式
//             return c1.doFinal(src);
//         } catch (java.security.NoSuchAlgorithmException e1) {
//             e1.printStackTrace();
//         } catch (javax.crypto.NoSuchPaddingException e2) {
//             e2.printStackTrace();
//        } catch (java.lang.Exception e3) {
//             e3.printStackTrace();
//         }
//         return null;
//      }
//          
//     /*
//67      * 根据字符串生成密钥字节数组 
//68      * @param keyStr 密钥字符串
//69      * @return 
//70      * @throws UnsupportedEncodingException
//71      */
//     public static byte[] build3DesKey(String keyStr) throws UnsupportedEncodingException{
//         byte[] key = new byte[24];    //声明一个24位的字节数组，默认里面都是0
//         byte[] temp = keyStr.getBytes("UTF-8");    //将字符串转成字节数组        
//         /*
//77          * 执行数组拷贝
//78          * System.arraycopy(源数组，从源数组哪里开始拷贝，目标数组，拷贝多少位)
//79          */
//        if(key.length > temp.length){
//             //如果temp不够24位，则拷贝temp数组整个长度的内容到key数组中
//             System.arraycopy(temp, 0, key, 0, temp.length);
//         }else{
//             //如果temp大于24位，则拷贝temp数组24个长度的内容到key数组中
//             System.arraycopy(temp, 0, key, 0, key.length);
//         }
//        return key;
//     } 
 }
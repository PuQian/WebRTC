<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN"
    "http://www.w3.org/TR/html4/loose.dtd">
<%@page import="com.free4lab.account.common.Constants"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%@page import="com.free4lab.account.manager.ClientManager"%>
<%@page import="java.util.*"%>
<%--@page import="com.free4lab.freeaccount.manager.CustomManager.CustomResult" --%>
<%@taglib prefix="s" uri="/struts-tags"%>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>WebRTC统一登录</title>
</head>

<body>
	<div class="login" id="FreeInputLogo">
		<form
			action="oauth2/logincheck?client_id=<s:property value="client_id" />&redirect_uri=<s:property value="redirect_uri" />&random=<s:property value="random" />"
			method="post" onsubmit="return loginCheck();">
			<table cellpadding="4px" id="account" width="95%">
				<tr>
					<td colspan="3"><img src="images/freelogin.png" border="0"
						alt="使用WebRTC账号登录" class="leftmargin_5"> <br /></td>
				</tr>
				<tr>
					<td class="middlesize rightalign" width="50px">邮箱名</td>
					<td colspan="2"><input type="text" name="email" id="txemail"
						class="editline topmargin_5" value="" /></td>
				</tr>
				<tr>
					<td class="middlesize rightalign">密码</td>
					<td colspan="2"><input type="password" name="epsw"
						class="editline topmargin_5" value="" id="txpwd" /> <input
						type="hidden" name="passwordmd5" id="txpasswordMd5" value=""></input>
						<input type="hidden" id="state" name="state"
						value="<s:property value="state" />" /></td>
				</tr>
				<tr>
					<td></td>
					<td width="104px"><label><input type="checkbox"
							id="rmbUser" />记住此用户名</label></td>
					<td class="rightalign"><a href="retrieve/pwdretrieve.jsp"
						target="_blank" class="blackletter rightmargin_10">找回密码</a></td>
					<td></td>
				</tr>
				<tr>
					<td></td>
					<td class="leftalign">
						<button type="submit" class="button">登录</button>
					</td>
					<td class="leftalign"><span class="redletter" id="error"><s:property
								value="message" /><br /></span></td>
				</tr>
				<tr>
					<td width="50px"></td>
					<td class="leftalign bottomveralign" width="110px"><span
						class="middlesize">还没有WebRTC账号？</span></td>
					<td class="rightalign"><a id="signupLink" class="orangebutton"
						onclick="gotoRegister();">免费注册</a></td>
				</tr>
			</table>
		</form>
		<form id="signupForm">
			<table cellpadding="3px" id="reg" width="95%">
				<tr>
					<td colspan="3"><img src="images/freereg.png" border="0"
						alt="注册FREE账号" class="leftmargin_5">
						<div class="reg_state rightalign">
							<span class="current"><span class="impor">1</span>帐号信息</span> <span
								class="greyletter"><span class="impor">2</span>邮箱验证</span> <span
								class="greyletter"><span class="impor">3</span>完成注册</span>
						</div></td>
				</tr>
				<tr>
					<td class="middlesize rightalign" width="50px">邮箱名</td>
					<td colspan="2"><input type="text" name="email"
						class="editline" onblur="email_isValid()" value="" /></td>
				</tr>
				<tr>
					<td class="middlesize rightalign">密码</td>
					<td colspan="2"><input type="password" name="epsw"
						onblur="epsw_isValid()" class="editline" value="" /></td>
				</tr>
				<tr>
					<td class="middlesize rightalign">确认密码</td>
					<td colspan="2"><input type="password" name="cepsw"
						class="editline" onblur="cepsw_isValid()" value="" /></td>
				</tr>
				<tbody id=insert_here></tbody>
			</table>
		</form>
		<table cellpadding="3px" width="95%" id="emailconfirming"
			style="margin-top: 5px">
			<tr>
				<td><img src="images/freereg.png" border="0" alt="注册FREE账号"
					class="leftmargin_5" />
					<div class="reg_state rightalign">
						<span class="greyletter"><span class="impor">1</span>帐号信息</span> <span
							class="current"><span class="impor">2</span>邮箱验证</span> <span
							class="greyletter"><span class="impor">3</span>完成注册</span>
					</div> <br /> <br /></td>
			</tr>
			<tr>
				<td class="textindent">一封激活邮件已经发送至email@free4lab.com,请点击邮件中的链接以完成用户注册！
					<br />
				</td>
			</tr>
			<tr>
				<td class="textindent">如果您半个小时内仍未收到邮件，请点击"<b><a
						class='blackletter'>再次发送</a></b>" <br /> <br /> <br /> <br /> <br /></td>
			</tr>
		</table>
	</div>
	<input type="hidden" id="random" value="<s:property value="random" />" />
	<input type="hidden" id="hiddenUrl"
		value="<s:property value="#session.url" />" />
	<input type="hidden" id="hiddenResult"
		value="<s:property value="result" />" />

</body>
</html>
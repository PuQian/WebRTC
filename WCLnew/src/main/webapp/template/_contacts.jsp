<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
	import="java.util.*"%>

<div class="modal fade" id="contactGroupModal" tabindex="-1"
	role="dialog" aria-labelledby="contactGroupModalLabel"
	aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal"
					aria-hidden="true">×</button>
				<h4 class="modal-title"></h4>
				<input class="modal-group-id hidden">
			</div>
			<div class="modal-body">
				<button type="button" class="btn btn-default"
					onclick="showModContactGroupPage();" data-dismiss="modal">修改分组
				</button>
				<button type="button" class="btn btn-default"
					onclick="startDelContactGroup();" data-dismiss="modal">删除分组</button>
				<button type="button" class="btn btn-default"
					onclick="showAddGroupContactPage();" data-dismiss="modal">添加联系人</button>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-default" data-dismiss="modal">关闭
				</button>
			</div>
		</div>
		<!-- /.modal-content -->
	</div>
	<!-- /.modal-dialog -->
</div>
<!-- /.modal -->

<!-- <div id="modcontactgroup" style="display:none">
	<div class="panel panel-default">
		<div class="panel-heading">
			<a class="btn btn-default" onclick="">修改分组 </a>
		</div>
		<div style="position: absolute; top: 1.5em; right: 4em;">
			<span class="glyphicon glyphicon-remove"
				onclick="closeModContactGroupPage();"> </span>
		</div>
		<div class="panel-body">
			<div style="overflow: auto;">

				<input type="hidden" name="groupId" id="contactgroupId" value="" />
				<label for="contactgroupName" class="left_item">分组名称：</label> <input
					type="text" name="fzmc" id="contactgroupName" class="mod_input"
					value="" /> <span id="groupName_error" class="redletter"></span> <br>

				<input type="button" class="btn btn-default " value="确定"
					onclick="startModContactGroup()" />
				<button class="graybutton" onclick="return false;">取消</button>
				<input type="button" class="btn btn-default " value="取消"
					onclick="closeModContactGroupPage()" />
			</div>
		</div>
	</div>
</div> -->



<div id="modGroupContactInfo" style="display:none">
	<div class="panel panel-default">
		<div class="panel-heading">
			<a class="btn btn-default" onclick="">修改联系人信息</a>
		</div>
		<div style="position: absolute; top: 1.5em; right: 4em;">
			<span class="glyphicon glyphicon-remove"
				onclick="closeModGroupContactInfoPage();"> </span>
		</div>
		<div class="panel-body">
			<div style="overflow: auto;">
				<input type="hidden" name="modcontactId" id="modcontact_contactId" value="" /> 					
				<input type="hidden" name="modcontactgroupId" id="modcontact_groupId" value="" />
				<table>
					<tr>
						<td class="left_item_td"><label for="modcontactlname" class="mod_left_item">姓：</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="modcontactlname" id="modcontactlname" class="mod_right_input"
					value="" /> <span id="modcontactlname_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="modcontactfname" class="mod_left_item">名：</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="modcontactfname" id="modcontactfname" class="mod_right_input"
					value="" /> <span id="modcontactfname_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="modcontactsex" class="mod_left_item">性别:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="modcontactsex" id="modcontactsex" class="mod_right_input"
					value="" /> <span id="modcontactsex_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="modcontactnc" class="mod_left_item">昵称:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="modcontactnc" id="modcontactnc" class="mod_right_input"
					value="" /> <span id="modcontactnc_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="modcontactbirth" class="mod_left_item">生日:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="modcontactbirth" id="modcontactbirth" class="mod_right_input"
					value="" /> <span id="modcontactbirth_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="modcontactzw" class="mod_left_item">职务:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="modcontactzw" id="modcontactzw" class="mod_right_input"
					value="" /> <span id="modcontactzw_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="modcontactbm" class="mod_left_item">部门:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="modcontactbm" id="modcontactbm" class="mod_right_input"
					value="" /> <span id="modcontactbm_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="modcontacttelp" class="mod_left_item">办公电话:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="modcontacttelp" id="modcontacttelp" class="mod_right_input"
					value="" /> <span id="modcontacttelp_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="modcontactmobp" class="mod_left_item">手机:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="modcontactmobp" id="modcontactmobp" class="mod_right_input"
					value="" /> <span id="modcontactmobp_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="modcontactemails" class="mod_left_item">邮箱:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="modcontactemails" id="modcontactemails" class="mod_right_input"
					value="" /> <span id="modcontactemails_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="modcontactaddress" class="mod_left_item">通信地址:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="modcontactaddress" id="modcontactaddress" class="mod_right_input"
					value="" /> <span id="modcontactaddress_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="modcontactpostcode" class="mod_left_item">邮政编码:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="modcontactpostcode" id="modcontactpostcode" class="mod_right_input"
					value="" /> <span id="modcontactpostcode_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="modcontactbz" class="mod_left_item">备注:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="modcontactbz" id="modcontactbz" class="mod_right_input"
					value="" /> <span id="modcontactbz_error" class="redletter"></span></td>
					</tr>
					
					
				</table>
					 <br> <input type="button"
					class="btn btn-default " value="修改信息"
					onclick="startModGroupContact()" />
				<!-- <button class="graybutton" onclick="return false;">取消</button> -->
				<input type="button" class="btn btn-default " value="关闭"
					onclick="closeModGroupContactInfoPage()" />
			</div>
		</div>
	</div>
</div>
<div id="addGroupContactInfo" style="display:none">
	<div class="panel panel-default">
		<div class="panel-heading">
			<a class="btn btn-default" onclick="">添加联系人信息</a>
		</div>
		<div style="position: absolute; top: 1.5em; right: 4em;">
			<span class="glyphicon glyphicon-remove"
				onclick="closeAddGroupContactInfoPage();"> </span>
		</div>
		<div class="panel-body">
			<div style="overflow: auto;">
				<input type="hidden" name="addcontactId" id="addcontact_contactId" value="" /> 					
				<input type="hidden" name="addcontactgroupId" id="addcontact_groupId" value="" />
				<table>
					<tr>
						<td class="left_item_td"><label for="addcontactlname" class="mod_left_item">姓：</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="addcontactlname" id="addcontactlname" class="mod_right_input"
					value="" /> <span id="addcontactlname_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="addcontactfname" class="mod_left_item">名：</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="addcontactfname" id="addcontactfname" class="mod_right_input"
					value="" /> <span id="addcontactfname_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="addcontactsex" class="mod_left_item">性别:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="addcontactsex" id="addcontactsex" class="mod_right_input"
					value="" /> <span id="addcontactsex_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="addcontactnc" class="mod_left_item">昵称:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="addcontactnc" id="addcontactnc" class="mod_right_input"
					value="" /> <span id="addcontactnc_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="addcontactbirth" class="mod_left_item">生日:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="addcontactbirth" id="addcontactbirth" class="mod_right_input"
					value="" /> <span id="addcontactbirth_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="addcontactzw" class="mod_left_item">职务:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="addcontactzw" id="addcontactzw" class="mod_right_input"
					value="" /> <span id="addcontactzw_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="addcontactbm" class="add_left_item">部门:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="addcontactbm" id="addcontactbm" class="mod_right_input"
					value="" /> <span id="addcontactbm_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="addcontacttelp" class="mod_left_item">办公电话:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="addcontacttelp" id="addcontacttelp" class="mod_right_input"
					value="" /> <span id="addcontacttelp_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="addcontactmobp" class="mod_left_item">手机:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="addcontactmobp" id="addcontactmobp" class="mod_right_input"
					value="" /> <span id="addcontactmobp_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="addcontactemails" class="mod_left_item">邮箱:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="addcontactemails" id="addcontactemails" class="mod_right_input"
					value="" /> <span id="addcontactemails_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="addcontactaddress" class="mod_left_item">通信地址:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="addcontactaddress" id="addcontactaddress" class="mod_right_input"
					value="" /> <span id="addcontactaddress_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="addcontactpostcode" class="mod_left_item">邮政编码:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="addcontactpostcode" id="addcontactpostcode" class="mod_right_input"
					value="" /> <span id="addcontactpostcode_error" class="redletter"></span></td>
					</tr>
					<tr>
						<td class="left_item_td"><label for="addcontactbz" class="mod_left_item">备注:</label></td>
						<td class="mod_right_item_td"><input
					type="text" name="addcontactbz" id="addcontactbz" class="mod_right_input"
					value="" /> <span id="addcontactbz_error" class="redletter"></span></td>
					</tr>
					
					
				</table>
					 <br> <input type="button"
					class="btn btn-default " value="添加"
					onclick="startAddGroupContact()" />
				<!-- <button class="graybutton" onclick="return false;">取消</button> -->
				<input type="button" class="btn btn-default " value="关闭"
					onclick="closeAddGroupContactInfoPage()" />
			</div>
		</div>
	</div>
</div>
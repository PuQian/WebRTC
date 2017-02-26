<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"
	import="java.util.*"%>
<!--好友列表选择业务操作模态框-->	
<!-- <div class="modal fade" id="myModal" tabindex="-1" role="dialog"
		aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
				<div class="modal-header">
					<button type="button" class="close" data-dismiss="modal"
						aria-hidden="true">×</button>
					<h4 class="modal-title" id="myModalLabel"></h4>
				</div>
				<div class="modal-body">
					<button type="button" class="btn btn-default"
						onclick="ModalCreateVideoBefore();" data-dismiss="modal">视频
					</button>
					<button type="button" class="btn btn-default"
						onclick="ModalCreateAudioBefore();" data-dismiss="modal">音频</button>
					<button type="button" class="btn btn-default"
						onclick="ModalChat();" data-dismiss="modal">聊天</button>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-default" data-dismiss="modal">关闭
					</button>
				</div>
		</div>
		/.modal-content
	</div>
	/.modal-dialog
</div>
/.modal -->

<!--会议超时选择延期模态框-->
<div class="modal fade" id="timeoutModal" tabindex="-1" role="dialog" 
   aria-labelledby="timeoutLabel" aria-hidden="true">
   <div class="modal-dialog">
      <div class="modal-content">
         <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" 
               aria-hidden="true">×
            </button>
            <h4 class="modal-title" id="timeoutLabel" style="display:inline;"></h4>
            <h4 style="display:inline;">会议超时！</h4>
         </div>
         <div class="modal-body">
           输入延时时间（分钟为单位）：<input type="text" name="delaytime">
         </div>
         <div class="modal-footer">
            <button type="button" class="btn btn-default" onclick="ModaltimeOut()"
               data-dismiss="modal">提交
            </button>
            <button type="button" class="btn btn-default" 
               data-dismiss="modal">关闭
            </button>
         </div>
      </div><!-- /.modal-content -->
   </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<!--会议邀请联系人模态框-->
<div class="modal fade" id="inviteMemberModal" tabindex="-1" role="dialog" 
   aria-labelledby="inviteMemberLabel" aria-hidden="true">
   <div class="modal-dialog">
      <div class="modal-content">
         <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" 
               aria-hidden="true">×
            </button>
            <h4 class="modal-title" id="inviteMemberLabel" style="display:inline;"></h4>
            <h4 style="display:inline;">会议邀请联系人</h4>
         </div>
         <div class="modal-body">
           输入邀请与会者username：<input type="text" name="invitedName">
         </div>
         <div class="modal-footer">
            <button type="button" class="btn btn-default" onclick="ModalInviteMember()"
               data-dismiss="modal">邀请
            </button>
            <button type="button" class="btn btn-default" 
               data-dismiss="modal">关闭
            </button>
         </div>
      </div><!-- /.modal-content -->
   </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<!--会议删除联系人模态框-->
<div class="modal fade" id="deleteMemberModal" tabindex="-1" role="dialog" 
   aria-labelledby="deleteMemberLabel" aria-hidden="true">
   <div class="modal-dialog">
      <div class="modal-content">
         <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" 
               aria-hidden="true">×
            </button>
            <h4 class="modal-title" id="deleteMemberLabel" style="display:inline;"></h4>
            <h4 style="display:inline;">删除联系人</h4>
         </div>
         <div class="modal-body">
           输入删除人username：<input type="text" name="deleteName">
         </div>
         <div class="modal-footer">
            <button type="button" class="btn btn-default" onclick="ModalDeleteMember()"
               data-dismiss="modal">删除
            </button>
            <button type="button" class="btn btn-default" 
               data-dismiss="modal">关闭
            </button>
         </div>
      </div><!-- /.modal-content -->
   </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<!--判断是否加入会议模态框-->
<div class="modal fade" id="JudgeJoinModal" tabindex="-1" role="dialog" 
   aria-labelledby="JudgeJoinLabel" aria-hidden="true">
   <div class="modal-dialog">
      <div class="modal-content">
         <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" 
               aria-hidden="true">×
            </button>
            <h4 class="modal-title" id="JudgeJoinLabel" style="display:inline;"></h4>
            <h4 style="display:inline;">加入会议</h4>
         </div>
         <div class="modal-body">
            <button type="button" class="btn btn-default" onclick="ModalJudgeJoin()"
               data-dismiss="modal">加入
            </button>
            <button type="button" class="btn btn-default" 
               data-dismiss="modal">拒绝
            </button>
         </div>
      </div><!-- /.modal-content -->
   </div><!-- /.modal-dialog -->
</div><!-- /.modal -->

<!--判断(预约或者周期会议)是否创建会议模态框-->
<div class="modal fade" id="JudgeCreateModal" tabindex="-1" role="dialog" 
   aria-labelledby="JudgeCreateLabel" aria-hidden="true">
   <div class="modal-dialog">
      <div class="modal-content">
         <div class="modal-header">
            <button type="button" class="close" data-dismiss="modal" 
               aria-hidden="true">×
            </button>
            <h4 class="modal-title" id="JudgeCreateLabel" style="display:inline;"></h4>
            <h4 style="display:inline;">创建会议</h4>
         </div>
         <div class="modal-body">
            <button type="button" class="btn btn-default" onclick="ModalJudgeCreate();"
               data-dismiss="modal">创建
            </button>
            <button type="button" class="btn btn-default" 
               data-dismiss="modal">取消
            </button>
         </div>
      </div><!-- /.modal-content -->
   </div><!-- /.modal-dialog -->
</div><!-- /.modal -->
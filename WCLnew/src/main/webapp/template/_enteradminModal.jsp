<!DOCTYPE html>
<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>	

<div id="sendEmailModal" class="modal fade" role="dialog" aria-hidden="true" data-backdrop="static">
	<div class="modal-dialog">
		<div class="modal-content modal_content_width">
			<div class="modal-header modal_header">
				<button type="button" class="close modal_header_close" data-dismiss="modal" aria-hidden="true">&times;</button>
				<h3 class="modal_header_h">发送邮箱</h3>
			</div>
			<div class="modal-body modal_body">
				<input class="modal_input" id="sendEmailId" onfocus='clearInputValue("sendEmailId")' />
				<div id="sendemail-warning"></div>
			</div>
			<div class="modal-footer modal_footer">
				<button id="sendEmailBtn" class="btn btn-primary" onclick="sendEmail()">发送</button>
				<button id="cancelSendEmail" class="btn" data-dismiss="modal">取消</button>
			</div>
		</div>
	</div>
</div>
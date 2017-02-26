// 单个离线文件
com.webrtc.offlineFile = function(file, fromUid, token, toUid) {
	this.file = file;
	this.fromUid = fromUid;
	this.token = token;
	this.toUid = toUid;
	this.uploadedSize = 0;
};

com.webrtc.offlineFile.prototype = {

	getFileSize: function() {
	    var fileName = this.file.name,
	        tmpArr = fileName.split('.'),
	        fileSize = this.file.size,
	        fileType = this.file.type || tmpArr[tmpArr.length - 1] || 'unknown',
	        fileid = (this.file.lastModifiedDate + '').replace(/\W/g, '') + fileSize + fileType.replace(/\W/g, '');

	    var K = 1024,
	        M = K * K;

	    if (fileName.length > 50) {
	      fileName = fileName.slice(0, 20) + '...' + fileName.slice(-20);
	    }
	    
	    var fileSizeText = fileSize;

	    if (fileSizeText > M) {
	      fileSizeText = Math.round(fileSizeText / M * 10) / 10 + 'MB';
	    } else if (fileSizeText > K) {
	        fileSizeText = Math.round(fileSizeText / K * 10) / 10 + 'KB';
	    } else {
	      fileSizeText += 'Bytes';
	    }

	    var self = this;

	    $.ajax({
			url : ofs_url + '/filesize/' + fileid,
			type : "GET",
			dataType : "json",
			success : function(data) {
				var succ = data.succ,
		          	size = data.size;

				if (succ && size && size > 0 && size < fileSize) {
					this.uploadedSize = size;

					var text = size;

					if (text > M) {
					  text = Math.round(text / M * 10) / 10 + 'MB';
					} else if (text > K) {
					    text = Math.round(text / K * 10) / 10 + 'KB';
					} else {
					  text += 'Bytes';
					}
					alert(`该文件已上传了${text} - ${fileSizeText} - ${(size / fileSize * 100).toFixed(2)}%，下面开始断点续传...`);
				}

				// 开始上传
				self._sendFile();
			},
			error: function(err) {
				console.log(err);
			},
		});
	},

	_sendFile: function() {
		var fd = new FormData(),
			fileName = this.file.name,
	        tmpArr = fileName.split('.'),
	        fileSize = this.file.size,
	        fileType = this.file.type || tmpArr[tmpArr.length - 1] || 'unknown',
	        fileid = (this.file.lastModifiedDate + '').replace(/\W/g, '') +
	        	fileSize + fileType.replace(/\W/g, '');

		fd.append('offlineFile', this.file.slice(this.uploadedSize), fileName);

		$.ajax({
			url : ofs_url + '/upload?' +
		    	'from=' + this.fromUid +
		    	'&to=' + this.toUid +
		    	'&token=' + this.token +
		    	'&fileid=' + fileid,
			type : "POST",
			data: fd,
			processData: false,
			contentType: false,
			xhr: function() {
		        var xhr = $.ajaxSettings.xhr();

		        //绑定上传进度的回调函数
		        xhr.upload.addEventListener('progress', function(e) {
		        	if (e.lengthComputable) {
		    	        var percent = Math.round(e.loaded * 100 / e.total);

		    	        console.log('%d%', percent);
		    	      }
		        }, false);

		        return xhr; //一定要返回，不然jQ没有XHR对象用了
		    },
			success : function() {
				console.log('upload success!');
				alert('上传文件至离线文件服务器成功！');
			},
			error: function(err) {
				console.log(err);
			},
		});
	},
};

var CallOfflineFilesBefore = function(files, fromUid, token, toUid) {
	alert('该用户不在线，正在上传文件至离线文件服务器...');
	
	for (var i = 0; i < files.length; i++) {
		var offlineFile = new com.webrtc.offlineFile(files[i], fromUid, token, toUid);
		offlineFile.getFileSize();
    }
};

var CallGetOfflineFIles = function() {
	var $pub_banner = $('.pub_banner'),
		fromUid = $pub_banner.attr('userid'),
    	token = $pub_banner.attr('thirdpartytoken');

    $.ajax({
		url : ofs_url + '/getfiles/' + fromUid,
		data: { token: token },
		type : "GET",
		dataType : "json",
		success : function(data) {
			console.log(data);
			data.forEach(f => console.log(`${ofs_url}/download/${f._id}`));
		},
		error: function(err) {
			console.log(err);
		},
	});
};


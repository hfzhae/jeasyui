<% @debug = on
var upload = {
	stdout: '',
	conn:[],
	stdout: {},
	size: 0,
	maxlength: 5000000,//最大上传5M文件
	fso: [],
	file: [],
	filename: '',
	id: 0,
	billtype: 0,
	filepath: '',
	Folder: '',
	Initialize:function(){
		this.conn = Server.CreateObject('ADODB.Connection');
		this.conn.open(Application('DateBase.ConnectString'));
		String.prototype.replaceAll = function(s1,s2){ 
			return(this.replace(new RegExp(s1,"gm"),s2)); 
		}
	},
	init: function(t){//参数：t：1代表校验文件大小
		if(t){
			this.size = Request.TotalBytes;
			if(this.size > this.maxlength){
				throw '文件大小不能超过：' + this.bytesToSize(this.maxlength) + '，当前文件大小：'+ this.bytesToSize(this.size) +'。';
			}
			this.filename = this.sqlStringEncode(unescape(Request.form('filename').Item));
			this.id = this.validInt(Request.form('id').Item);
			this.billtype = this.validInt(Request.form('billtype').Item);
			if(this.id == 0 || this.billtype == 0){
				throw '上传信息有误！';
			}
			if(this.filename.length == 0){
				throw '上传信息有误！';
			}
		}else{
			this.filename = this.sqlStringEncode(unescape(Request('filename')));
			this.id = this.validInt(Request('id'));
			this.billtype = this.validInt(Request('billtype'));
			if(this.id == 0 || this.billtype == 0){
				throw '上传信息有误！';
			}
			if(this.filename.length == 0){
				throw '上传信息有误！';
			}
		}
		this.fso = Server.CreateObject('Scripting.FileSystemObject');
		this.file = Server.CreateObject('NetBOX.File');
		this.Folder = NetBox.MapPath('\\jeasyui\\attaches\\');
		
		if(!this.fso.FolderExists(this.Folder)){
			this.fso.CreateFolder(this.Folder);
		}
		
		this.Folder += NetBox.MapPath('\\jeasyui\\attaches\\') + this.billtype + '\\' + this.id + '\\';
		
		if(!this.fso.FolderExists(this.Folder)){
			this.fso.CreateFolder(this.Folder);
		}
		this.filepath = this.Folder + this.filename;
	},
	del: function(){
		this.conn.BeginTrans;
		try{
			this.init(0);
			this.deldata();
			this.delfile();
			this.conn.CommitTrans;
			this.stdout = '{"result":true}';
		}catch(e){
			this.conn.RollbackTrans;
			this.stdout = '{"result":false, "msg":"'+e+'"}';
		}
	},
	delfile: function(){
		if(this.fso.FileExists(this.filepath))this.fso.DeleteFile(this.filepath, true);
	},
	deldata: function(){
		var sql = 'select FileName from NPAttaches where BillID=' + this.id + ' and billtype=' + this.billtype,
			rs = Server.CreateObject('ADODB.RecordSet');
		rs.CursorLocation = 3;
		rs.CacheSize = 16;
		rs.open(sql, this.conn, 3, 3);
		if(!rs.eof){
			var filename = rs('filename').value,
				filearr = '',
				s = '';
			if(filename){
				if(filename.length > 0){
					filearr = filename.toString().split(',');
					for(var i in filearr){
						if(filearr[i] != this.filename){
							s += filearr[i] + ',';
						}
					}
					s = s.substr(0, s.length - 1);
					if(s.length == 0){
						this.conn.execute('delete NPAttaches where BillID=' + this.id + ' and billtype=' + this.billtype);
						//this.fso.DeleteFOLDER(this.Folder);
					}else{
						rs('filename') = s;
						rs.Update();
					}
				}
			}
			rs = null;
		}
	},
	save:function(){
		this.conn.BeginTrans;
		try{
			this.init(1);
			this.savedata();
			this.savefile();
			this.conn.CommitTrans;
			this.stdout = '{"result":true}';
		}catch(e){
			this.conn.RollbackTrans;
			var message = ''
			if(e.message == undefined){
				message = e;
			}else{
				message = e.message;
			}
			this.stdout = '{"result":false, "msg":"'+message+'"}';
		}
	},
	savefile:function(){
		this.file.Create(this.filepath, true);
		this.file.Write(Request.form("file").Item);
		this.file.close();
	},
	savedata: function(){
		var sql = 'select BillType,BillID,FileName from NPAttaches where BillID=' + this.id + ' and billtype=' + this.billtype,
			rs = Server.CreateObject('ADODB.RecordSet');
		rs.CursorLocation = 3;
		rs.CacheSize = 16;
		rs.open(sql, this.conn, 3, 3);
		if(rs.eof){
			rs.AddNew();
			rs('billtype') = this.billtype;
			rs('billid') = this.id;
			rs('filename') = this.filename;
		}else{
			var filename = rs('filename').value;
			if(filename.indexOf(this.filename) < 0){
				rs('filename') += ',' + this.filename;
			}
		}
		rs.Update();
		rs = null;
	},
	validInt: function (i, def){//整形格式化
		var n = parseInt(i);
		if (isNaN(n)){
			return((def==undefined)?0:def);
		}else{
			return(n);
		}
	},
	sqlStringEncode: function (s){
		if(s == undefined) return('');
		return(s.replaceAll("'", "''"));
	},
	bytesToSize: function(bytes) {
		if (bytes === 0)return '0 B';
		var k = 1000, // or 1024
			sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
			i = Math.floor(Math.log(bytes) / Math.log(k));
	    return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
	},
	OnPageEnd: function(Response){//页面结束处理函数
		Response.Clear();
		Response.ContentType="text/HTML;charset=GB2312" 
		Response.ContentEncoding = 'gzip';
		Response.Write(this.stdout);
		this.CleanData();
	},
	CleanData: function(){//清除对象函数
		this.conn = null;
		this.fso = null;
		this.file = null;
	}
}
upload.Initialize()
function OnScriptEnd(){upload.OnPageEnd(Response);}

 %>

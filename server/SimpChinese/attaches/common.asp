<% @debug = on
var upload = {
	stdOut: '',
	conn:[],
	stdOut: {},
	size: 0,
	maxlength: 5000000,//����ϴ�5M�ļ�
	fso: [],
	file: [],
	filename: '',
	id: 0,
	billType: 0,
	filepath: '',
	Folder: '',
	Initialize:function(){
		this.conn = Server.CreateObject('ADODB.Connection');
		this.conn.open(Application('DateBase.ConnectString'));
		String.prototype.replaceAll = function(s1,s2){ 
			return(this.replace(new RegExp(s1,"gm"),s2)); 
		}
	},
	init: function(t){//������t��1����У���ļ���С
		if(t){
			this.size = Request.TotalBytes;
			if(this.size > this.maxlength){
				throw '�ļ���С���ܳ�����' + this.bytesToSize(this.maxlength) + '����ǰ�ļ���С��'+ this.bytesToSize(this.size) +'��';
			}
			this.filename = this.sqlStringEncode(unescape(Request.form('filename').Item));
			this.id = this.validInt(Request.form('id').Item);
			this.billType = this.validInt(Request.form('billType').Item);
			if(this.id == 0 || this.billType == 0){
				throw '�ϴ���Ϣ����';
			}
			if(this.filename.length == 0){
				throw '�ϴ���Ϣ����';
			}
		}else{
			this.filename = this.sqlStringEncode(unescape(Request('filename')));
			this.id = this.validInt(Request('id'));
			this.billType = this.validInt(Request('billType'));
			if(this.id == 0 || this.billType == 0){
				throw '�ϴ���Ϣ����';
			}
			if(this.filename.length == 0){
				throw '�ϴ���Ϣ����';
			}
		}
		this.fso = Server.CreateObject('Scripting.FileSystemObject');
		this.file = Server.CreateObject('NetBOX.File');
		this.Folder = NetBox.MapPath('\\wwwroot\\attaches\\');
		
		if(!this.fso.FolderExists(this.Folder)){
			this.fso.CreateFolder(this.Folder);
		}
		
		if(!this.fso.FolderExists(this.Folder + this.billType + '\\')){
			this.fso.CreateFolder(this.Folder + this.billType + '\\');
		}
		
		this.Folder = NetBox.MapPath('\\wwwroot\\attaches\\') + this.billType + '\\' + this.id + '\\';
		
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
			this.stdOut = '{"result":true}';
		}catch(e){
			this.conn.RollbackTrans;
			this.stdOut = '{"result":false, "msg":"'+e+'"}';
		}
	},
	delfile: function(){
		if(this.fso.FileExists(this.filepath))this.fso.DeleteFile(this.filepath, true);
	},
	deldata: function(){
		var sql = 'select FileName from NPAttaches where BillID=' + this.id + ' and billType=' + this.billType,
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
						this.conn.execute('delete NPAttaches where BillID=' + this.id + ' and billType=' + this.billType);
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
			this.stdOut = '{"result":true}';
		}catch(e){
			this.conn.RollbackTrans;
			var message = ''
			if(e.message == undefined){
				message = e;
			}else{
				message = e.message;
			}
			this.stdOut = '{"result":false, "msg":"'+message+'"}';
		}
	},
	savefile:function(){
		this.file.Create(this.filepath, true);
		this.file.Write(Request.form("file").Item);
		this.file.close();
	},
	savedata: function(){
		var sql = 'select BillType,BillID,FileName from NPAttaches where BillID=' + this.id + ' and billType=' + this.billType,
			rs = Server.CreateObject('ADODB.RecordSet');
		rs.CursorLocation = 3;
		rs.CacheSize = 16;
		rs.open(sql, this.conn, 3, 3);
		if(rs.eof){
			rs.AddNew();
			rs('billType') = this.billType;
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
	validInt: function (i, def){//���θ�ʽ��
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
	onPageEnd: function(Response){//ҳ�����������
		Response.Clear();
		Response.ContentType="text/HTML;charset=GB2312" 
		Response.ContentEncoding = 'gzip';
		Response.Write(this.stdOut);
		this.cleanData();
	},
	cleanData: function(){//���������
		this.conn = null;
		this.fso = null;
		this.file = null;
	}
}
upload.Initialize()
function OnScriptEnd(){upload.onPageEnd(Response);}

 %>

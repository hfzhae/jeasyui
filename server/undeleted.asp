<%
/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/7/13
恢复处理对象
*****************************************************************/
ebx.undeleted = {
	ID: 0,
	TableName:'',
	init:function(TableName){
		this.ID = ebx.validInt(ebx.stdIn['id']),
		this.TableName = ebx.sqlStringEncode(TableName);
	},
	deleted: function(){
		ebx.conn.begintrans
		try{
			this._del();
			ebx.conn.commitTrans;
			ebx.stdOut['result'] = 1;
			ebx.stdOut['id'] = this.ID;
		}catch(e){
			ebx.conn.RollbackTrans;
			ebx.stdOut['result'] = 0;
			ebx.stdOut['msg'] = e;
		}
		this.cleanData();
	},
	_del: function(){
		if(this.ID > 0){
			var rs = ebx.dbx.open('select IsDeleted,updatedate,owner from ' + this.TableName + ' where id=' + this.ID);
			if(!rs.eof){
				if(rs('IsDeleted').value == 0) throw {message: '记录未删除！'};
				rs('IsDeleted') = 0;
				rs('updatedate') = new Date().Format('yyyy-MM-dd hh:mm:ss');
				rs("owner") = ebx.owner;
				rs.update;
			}else{
				throw '记录不存在！';
			}
			rs = null
		}else{
			throw '记录不存在！';
		}
	},
	cleanData: function(){
		this.ID = null;
		this.TableName = null;
		this.ModType = null;
	}
};
%>

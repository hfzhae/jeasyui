<!-- #include virtual="/server/func.asp" -->
<%
/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/7/13
基本信息保存对象
*****************************************************************/
ebx.savebi = {
	ID:0,
	ParentId:0,
	bi:[],
	TableName:'',
	ModType:'',
	IGID: '',
	init: function(TableName, ModType, IGID){//初始化对象，获取客户端发送得bd、bdList、ID、ParentId、TableName、ModType参数
		this.bi = ebx.convertJsonToRs(eval('(' + ebx.stdIn['bi'] + ')')),
		this.ID = ebx.validInt(ebx.stdIn['id']),
		this.ParentId = ebx.validInt(ebx.stdIn['parentid']);
		this.TableName = ebx.sqlStringEncode(TableName);
		this.ModType = ebx.validInt(ModType);
		this.IGID = ebx.validInt(IGID);
	},
	save: function(){
		ebx.conn.begintrans
		try{
			this._savebi();
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
	_savebi: function(){
		if(this.ID == 0 || this.ParentId > 0){//ID为0或者ParentId>0(另存)时新建记录
			var rsBI = ebx.dbx.open('select * from ' + this.TableName + ' where 1=2');
				
			this.ID = ebx.IdGen.CTIdGen(this.IGID);
			rsBI.AddNew();
			rsBI('RootID') = this.ID;
			rsBI('ParentId') = this.ParentId;
			rsBI('CreateDate') = new Date().Format('yyyy-MM-dd hh:mm:ss');
			rsBI("Infotype") = this.ModType;
			rsBI("AccountID") = ebx.accountId;
			rsBI("owner") = ebx.owner;
			rsBI("IsDeleted") = 0,
			rsBIFields = rsBI.Fields;
		}else{
			var rsBI = ebx.dbx.open('select * from ' + this.TableName + ' where id=' + this.ID),
				rsBIFields = rsBI.Fields;
		}
		
		this.bi.MoveFirst();
		while(!this.bi.eof){
			for(var i = 0; i < rsBIFields.Count; i++){
			    if(this.bi("field").value!=undefined){
				    if(rsBIFields(i).name.toLowerCase() == this.bi("field").value.toLowerCase()){
					    var _parament = {//回调函数用参数对象
							    id: this.ID,
							    field: this.bi("field").value, 
							    rs: this.bi, 
							    rslist: {}, 
							    TableName: this.TableName,
							    ModType: 'Infotype=' + this.ModType,
							    rsBI: rsBI
						    }
						    //debugger;
					    rsBI(this.bi("field").value) = ebx.func.callBack(this.bi("func").value, this.bi("value").value, _parament);
				    }
				}
			}
			//if(this.bi("field").value == 'id'){
			//	this.bi("value").value = this.ID;
			//}
			this.bi.MoveNext();
		}
		rsBI('ID') = this.ID;
		rsBI('UpdateDate') = new Date().Format('yyyy-MM-dd hh:mm:ss');
		rsBI('UpdateCount') = ebx.validInt(rsBI('UpdateCount').value) + 1;
		rsBI.Update();
		rsBI = null;
	},
	cleanData: function(){
		this.ID = null;
		this.ParentId = null;
		this.bi = null;
		this.TableName = null;
		this.ModType = null;
	}
};
%>

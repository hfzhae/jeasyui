<!-- #include virtual="/server/func.asp" -->
<%
/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/7/13
基本信息保存对象
*****************************************************************/
ebx.savebi = {
	ID:0,
	ParentID:0,
	bi:[],
	TableName:'',
	ModType:'',
	IGID: '',
	init: function(TableName, ModType, IGID){//初始化对象，获取客户端发送得bd、bdlist、ID、ParentID、TableName、ModType参数
		this.bi = ebx.convertJsonToRs(eval('(' + ebx.stdin['bi'] + ')')),
		this.ID = ebx.validInt(ebx.stdin['id']),
		this.ParentID = ebx.validInt(ebx.stdin['parentid']);
		this.TableName = ebx.sqlStringEncode(TableName);
		this.ModType = ebx.validInt(ModType);
		this.IGID = ebx.validInt(IGID);
	},
	save: function(){
		ebx.conn.begintrans
		try{
			this._savebi();
			ebx.conn.commitTrans;
			ebx.stdout['result'] = 1;
			ebx.stdout['id'] = this.ID;
		}catch(e){
			ebx.conn.RollbackTrans;
			ebx.stdout['result'] = 0;
			ebx.stdout['msg'] = e;
		}
		this.CleanData();
	},
	_savebi: function(){
		if(this.ID == 0 || this.ParentID > 0){//ID为0或者ParentID>0(另存)时新建记录
			var rsBI = ebx.dbx.open('select * from ' + this.TableName + ' where 1=2');
				
			this.ID = ebx.IDGen.CTIDGen(this.IGID);
			rsBI.AddNew();
			rsBI('RootID') = this.ID;
			rsBI('ParentID') = this.ParentID;
			rsBI('CreateDate') = new Date().Format('yyyy-MM-dd hh:mm:ss');
			rsBI("Infotype") = this.ModType;
			rsBI("AccountID") = ebx.accountid;
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
					    var _Parament = {//回调函数用参数对象
							    id: this.ID,
							    field: this.bi("field").value, 
							    rs: this.bi, 
							    rslist: {}, 
							    TableName: this.TableName,
							    ModType: 'Infotype=' + this.ModType,
							    rsBI: rsBI
						    }
						    //debugger;
					    rsBI(this.bi("field").value) = ebx.func.callback(this.bi("func").value, this.bi("value").value, _Parament);
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
	CleanData: function(){
		this.ID = null;
		this.ParentID = null;
		this.bi = null;
		this.TableName = null;
		this.ModType = null;
	}
};
%>

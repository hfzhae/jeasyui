<!-- #include virtual="/server/func.asp" -->
<%
/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/7/6
单据保存对象
*****************************************************************/
ebx.savebd = {
	ID:0,
	ParentId:0,
	bd:[],
	bdList:[],
	columns:[],
	TableName:'',
	ModType:'',
	IGID:'',
	init: function(TableName, ModType, IGID){//初始化对象，获取客户端发送得bd、bdList、ID、ParentId、TableName、ModType、IGID参数
		this.bd = ebx.convertJsonToRs(eval('(' + ebx.stdIn['bd'] + ')'));
		this.bdList = ebx.convertJsonToRs(eval('(' + ebx.stdIn['bdList'] + ')'));
		this.columns = eval('(' + ebx.stdIn['columns'] + ')');
		this.ID = ebx.validInt(ebx.stdIn['id']);
		this.ParentId = ebx.validInt(ebx.stdIn['parentid']);
		this.TableName = ebx.sqlStringEncode(TableName);
		this.ModType = ebx.validInt(ModType);
		this.IGID = ebx.validInt(IGID);
	},
	save: function(begincallBack, endcallBack){
		ebx.conn.begintrans
		try{
			this.savebd(begincallBack, endcallBack);
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
	savebd: function(begincallBack, endcallBack){
		if(this.ID == 0 || this.ParentId > 0){//ID为0或者ParentId>0(另存)时新建记录
			var rsBD = ebx.dbx.open('select * from ' + this.TableName + ' where 1=2'),
				rsBDList = ebx.dbx.open('select * from ' + this.TableName + 'list where 1=2'),
				rsBDFields = rsBD.Fields,
				rsBDListFields = rsBDList.Fields;
				
			this.ID = ebx.IdGen.CTIdGen(this.IGID);
			rsBD.AddNew();
			rsBD('RootID') = this.ID;
			rsBD('ParentId') = this.ParentId;
			rsBD('CreateDate') = new Date().Format('yyyy-MM-dd hh:mm:ss');
			rsBD("BillType") = this.ModType;
			rsBD("AccountID") = ebx.accountId;
			rsBD("owner") = ebx.owner;
			rsBD("IsDeleted") = 0
			rsBD("AuditID") = 0
		}else{
			var rsBD = ebx.dbx.open('select * from ' + this.TableName + ' where id=' + this.ID),
				rsBDList = ebx.dbx.open('select * from ' + this.TableName + 'list where 1=2'),
				rsBDFields = rsBD.Fields,
				rsBDListFields = rsBDList.Fields;
		}
		if(begincallBack)begincallBack(rsBD, rsBDList)
		this.bd.MoveFirst();
		while(!this.bd.eof){
			if(this.bd("field").value){
				for(var i = 0; i < rsBDFields.Count; i++){
					if(rsBDFields(i).name.toLowerCase() == this.bd("field").value.toLowerCase()){
						var _parament = {//回调函数用参数对象
								id: this.ID,
								field: this.bd("field").value, 
								rs: this.bd, 
								rslist: {}, 
								TableName: this.TableName,
								ModType: 'BillType=' + this.ModType
							}
						rsBD(this.bd("field").value) = ebx.func.callBack(this.bd("func").value, this.bd("value").value, _parament);
					}
				}
				//if(this.bd("field").value == 'id'){
				//	this.bd("value").value = this.ID;
				//}
			}
			this.bd.MoveNext();
		}
		rsBD('ID') = this.ID;
		rsBD('UpdateDate') = new Date().Format('yyyy-MM-dd hh:mm:ss');
		rsBD('UpdateCount') = ebx.validInt(rsBD('UpdateCount').value) + 1;

		ebx.dbx.open('delete ' + this.TableName + 'list where id=' + this.ID);
		
		this.bdList.MoveFirst();
		var serial = 0;

		while(!this.bdList.eof){
			rsBDList.AddNew();
			var fields = this.bdList.Fields,
				fieldsName = '';
			for(var i = 0; i < fields.Count; i++){
				fieldsName = fields(i).name;
				for(var j = 0; j < rsBDListFields.Count; j++){//判断字段与rsBDList相吻合的，执行写库操作 2018-7-11 zz
					if(rsBDListFields(j).name.toLowerCase() == fieldsName.toLowerCase()){
						if(typeof(this.bdList(fieldsName).value) != 'undefined'){
							var funcField = 0;
							for(var k in this.columns[0]){
								if(this.columns[0][k].field.toLowerCase() == fieldsName.toLowerCase()){
									if(this.columns[0][k].func){
										var _parament = {//回调函数用参数对象
												id: this.ID,
												field: fieldsName, 
												rs: this.bd, 
												rslist: this.bdList, 
												TableName: this.TableName + 'list'
											}
										rsBDList(fieldsName) = ebx.func.callBack(this.columns[0][k].func, this.bdList(fieldsName).value, _parament);
										funcField = 1;
									}
								}
							}
							if(funcField == 0){
								rsBDList(fieldsName) = this.bdList(fieldsName).value
							}
						}
					}
				}
			}
			serial++;
			rsBDList('serial') = serial;
			rsBDList('ID') = this.ID;
			this.bdList.MoveNext();
		}
		if(endcallBack)endcallBack(rsBD, rsBDList);
		rsBDList.MoveFirst();
		rsBD.Update();
		rsBDList.Update();
		rsBD = null;
		rsBDList = null;
	},
	cleanData: function(){
		this.ID = null;
		this.ParentId = null;
		this.bd = null;
		this.bdList = null;
		this.TableName = null;
		this.ModType = null;
	}
};
%>

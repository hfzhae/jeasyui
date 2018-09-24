<!-- #include virtual="/server/func.asp" -->
<%
/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/7/6
单据保存对象
*****************************************************************/
ebx.savebd = {
	ID:0,
	ParentID:0,
	bd:[],
	bdlist:[],
	columns:[],
	TableName:'',
	ModType:'',
	IGID:'',
	init: function(TableName, ModType, IGID){//初始化对象，获取客户端发送得bd、bdlist、ID、ParentID、TableName、ModType、IGID参数
		this.bd = ebx.convertJsonToRs(eval('(' + ebx.stdin['bd'] + ')'));
		this.bdlist = ebx.convertJsonToRs(eval('(' + ebx.stdin['bdlist'] + ')'));
		this.columns = eval('(' + ebx.stdin['columns'] + ')');
		this.ID = ebx.validInt(ebx.stdin['id']);
		this.ParentID = ebx.validInt(ebx.stdin['parentid']);
		this.TableName = ebx.sqlStringEncode(TableName);
		this.ModType = ebx.validInt(ModType);
		this.IGID = ebx.validInt(IGID);
	},
	save: function(begincallback, endcallback){
		ebx.conn.begintrans
		try{
			this.savebd(begincallback, endcallback);
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
	savebd: function(begincallback, endcallback){
		if(this.ID == 0 || this.ParentID > 0){//ID为0或者ParentID>0(另存)时新建记录
			var rsBD = ebx.dbx.open('select * from ' + this.TableName + ' where 1=2'),
				rsBDList = ebx.dbx.open('select * from ' + this.TableName + 'list where 1=2'),
				rsBDFields = rsBD.Fields,
				rsBDListFields = rsBDList.Fields;
				
			this.ID = ebx.IDGen.CTIDGen(this.IGID);
			rsBD.AddNew();
			rsBD('RootID') = this.ID;
			rsBD('ParentID') = this.ParentID;
			rsBD('CreateDate') = new Date().Format('yyyy-MM-dd hh:mm:ss');
			rsBD("BillType") = this.ModType;
			rsBD("AccountID") = ebx.accountid;
			rsBD("owner") = ebx.owner;
			rsBD("IsDeleted") = 0
			rsBD("AuditID") = 0
		}else{
			var rsBD = ebx.dbx.open('select * from ' + this.TableName + ' where id=' + this.ID),
				rsBDList = ebx.dbx.open('select * from ' + this.TableName + 'list where 1=2'),
				rsBDFields = rsBD.Fields,
				rsBDListFields = rsBDList.Fields;
		}
		if(begincallback)begincallback(rsBD, rsBDList)
		this.bd.MoveFirst();
		while(!this.bd.eof){
			if(this.bd("field").value){
				for(var i = 0; i < rsBDFields.Count; i++){
					if(rsBDFields(i).name.toLowerCase() == this.bd("field").value.toLowerCase()){
						var _Parament = {//回调函数用参数对象
								id: this.ID,
								field: this.bd("field").value, 
								rs: this.bd, 
								rslist: {}, 
								TableName: this.TableName,
								ModType: 'BillType=' + this.ModType
							}
						rsBD(this.bd("field").value) = ebx.func.callback(this.bd("func").value, this.bd("value").value, _Parament);
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
		
		this.bdlist.MoveFirst();
		var serial = 0;

		while(!this.bdlist.eof){
			rsBDList.AddNew();
			var fields = this.bdlist.Fields,
				fieldsName = '';
			for(var i = 0; i < fields.Count; i++){
				fieldsName = fields(i).name;
				for(var j = 0; j < rsBDListFields.Count; j++){//判断字段与rsBDList相吻合的，执行写库操作 2018-7-11 zz
					if(rsBDListFields(j).name.toLowerCase() == fieldsName.toLowerCase()){
						if(typeof(this.bdlist(fieldsName).value) != 'undefined'){
							var funcField = 0;
							for(var k in this.columns[0]){
								if(this.columns[0][k].field.toLowerCase() == fieldsName.toLowerCase()){
									if(this.columns[0][k].func){
										var _Parament = {//回调函数用参数对象
												id: this.ID,
												field: fieldsName, 
												rs: this.bd, 
												rslist: this.bdlist, 
												TableName: this.TableName + 'list'
											}
										rsBDList(fieldsName) = ebx.func.callback(this.columns[0][k].func, this.bdlist(fieldsName).value, _Parament);
										funcField = 1;
									}
								}
							}
							if(funcField == 0){
								rsBDList(fieldsName) = this.bdlist(fieldsName).value
							}
						}
					}
				}
			}
			serial++;
			rsBDList('serial') = serial;
			rsBDList('ID') = this.ID;
			this.bdlist.MoveNext();
		}
		if(endcallback)endcallback(rsBD, rsBDList);
		rsBDList.MoveFirst();
		rsBD.Update();
		rsBDList.Update();
		rsBD = null;
		rsBDList = null;
	},
	CleanData: function(){
		this.ID = null;
		this.ParentID = null;
		this.bd = null;
		this.bdlist = null;
		this.TableName = null;
		this.ModType = null;
	}
};
%>

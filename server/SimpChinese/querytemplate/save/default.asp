<!-- #include file="../Common.asp" -->
<%
(function(){
	var save = {
		ID:0,
		ParentID:0,
		bd:[],
		bdlist: [], 
		TableName:'',
		ModType:'',
		IGID:'',
		init: function(TableName, ModType, IGID){
			this.bd = ebx.convertJsonToRs(eval('(' + ebx.stdin['bd'] + ')'));
			this.bdlist = ebx.convertJsonToRs(eval('(' + ebx.stdin['bdlist'] + ')'));
			this.ID = ebx.validInt(ebx.stdin['id']);
			this.ParentID = ebx.validInt(ebx.stdin['parentid']);
			this.TableName = ebx.sqlStringEncode(TableName);
			this.ModType = ebx.validInt(ModType);
			this.IGID = ebx.validInt(IGID);
		},
		save: function(){
			ebx.conn.begintrans
			try{
				this._save();
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
		_save: function(){
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
			
			this.bd.MoveFirst();
			while(!this.bd.eof){
				for(var i = 0; i < rsBIFields.Count; i++){
				    if(this.bd("field").value!=undefined){
					    if(rsBIFields(i).name.toLowerCase() == this.bd("field").value.toLowerCase()){
						    var _Parament = {//回调函数用参数对象
								    id: this.ID,
								    field: this.bd("field").value, 
								    rs: this.bd, 
								    rslist: {}, 
								    TableName: this.TableName,
								    ModType: 'Infotype=' + this.ModType,
								    rsBI: rsBI
							    }
							    //debugger;
						    rsBI(this.bd("field").value) = ebx.func.callback(this.bd("func").value, this.bd("value").value, _Parament);
					    }
					}
				}
				this.bd.MoveNext();
			}
			rsBI('ID') = this.ID;
			rsBI('Columns') = ebx.convertRsToBin(this.bdlist);
			rsBI('UpdateDate') = new Date().Format('yyyy-MM-dd hh:mm:ss');
			rsBI('UpdateCount') = ebx.validInt(rsBI('UpdateCount').value) + 1;
			rsBI.Update();
			rsBI = null;
		},
		CleanData: function(){
			this.ID = null;
			this.ParentID = null;
			this.bd = null;
			this.bdlist = null;
			this.TableName = null;
			this.ModType = null;
		}
	}
	save.init(TableName, ModType, IGID);
	save.save();
})();
%>
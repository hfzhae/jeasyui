<!-- #include file="../Common.asp" -->
<!-- #include virtual="/server/func.asp" -->
<%
(function(){
	var save = {
		ID:0,
		ParentId:0,
		bd:[],
		bdList: [], 
		TableName:'',
		ModType:'',
		IGID:'',
		init: function(TableName, ModType, IGID){
			this.bd = ebx.convertJsonToRs(eval('(' + ebx.stdIn['bd'] + ')'));
			this.bdList = ebx.convertJsonToRs(eval('(' + ebx.stdIn['bdList'] + ')'));
			this.ID = ebx.validInt(ebx.stdIn['id']);
			this.ParentId = ebx.validInt(ebx.stdIn['parentid']);
			this.TableName = ebx.sqlStringEncode(TableName);
			this.ModType = ebx.validInt(ModType);
			this.IGID = ebx.validInt(IGID);
		},
		save: function(){
			ebx.conn.begintrans
			try{
				this._save();
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
		_save: function(){
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
			
			this.bd.MoveFirst();
			while(!this.bd.eof){
				for(var i = 0; i < rsBIFields.Count; i++){
				    if(this.bd("field").value!=undefined){
					    if(rsBIFields(i).name.toLowerCase() == this.bd("field").value.toLowerCase()){
						    var _parament = {//回调函数用参数对象
								    id: this.ID,
								    field: this.bd("field").value, 
								    rs: this.bd, 
								    rslist: {}, 
								    TableName: this.TableName,
								    ModType: 'Infotype=' + this.ModType,
								    rsBI: rsBI
							    }
							    //debugger;
						    rsBI(this.bd("field").value) = ebx.func.callBack(this.bd("func").value, this.bd("value").value, _parament);
					    }
					}
				}
				this.bd.MoveNext();
			}
			rsBI('ID') = this.ID;
			rsBI('Columns') = ebx.convertRsToBin(this.bdList);
			rsBI('UpdateDate') = new Date().Format('yyyy-MM-dd hh:mm:ss');
			rsBI('UpdateCount') = ebx.validInt(rsBI('UpdateCount').value) + 1;
			rsBI.Update();
			rsBI = null;
		},
		cleanData: function(){
			this.ID = null;
			this.ParentId = null;
			this.bd = null;
			this.bdList = null;
			this.TableName = null;
			this.ModType = null;
		}
	}
	save.init(TableName, ModType, IGID);
	save.save();
})();
%>
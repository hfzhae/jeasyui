<!-- #include file="../Common.asp" -->
<%
(function(){
	var bd = ebx.convertJsonToRs(eval('(' + ebx.stdin['bd'] + ')')),
		bdlist = ebx.convertJsonToRs(eval('(' + ebx.stdin['bdlist'] + ')')),
		ID
	
	bd.MoveFirst();
	while(!bd.eof){
		if(bd('field').value == 'id')
		ID = ebx.validInt(bd('value').value);
		bd.MoveNext();
	}
	ebx.conn.begintrans

	try{
		saveBD(ID);
		ebx.conn.commitTrans;
		ebx.stdout['result'] = 1;
		ebx.stdout['bd'] = {total: bd.RecordCount, rows: bd};
		ebx.stdout['bdlist'] = {total: bdlist.RecordCount, rows: bdlist};
	}catch(e){
		ebx.conn.RollbackTrans;
		ebx.stdout['result'] = 0;
		ebx.stdout['msg'] = e;
	}
	
	function saveBD(id){
		if(ebx.validInt(id) == 0){
			return(false);
		}else{
			var rsBD = ebx.dbx.open('select * from ' + TableName + ' where id=' + id),
				rsBDList = ebx.dbx.open('select * from ' + TableName + 'list where 1=2');
		}
		bd.MoveFirst();
		while(!bd.eof){
			rsBD(bd("field").value) = bd("value").value
			bd.MoveNext();
		}
		
		rsBD('UpdateDate') = new Date().Format('yyyy-MM-dd hh:mm:ss');
		rsBD('UpdateCount') += 1;
		rsBD.Update();

		ebx.dbx.open('delete bdstylelist where id=' + id);
		bdlist.MoveFirst();
		while(!bdlist.eof){
			rsBDList.AddNew();
			var fields = bdlist.Fields,
				fieldsName = '';
			for(var i = 0; i < fields.Count; i++){
				fieldsName = fields(i).name;
				rsBDList(fieldsName) = bdlist(fieldsName).value
			}
			bdlist.MoveNext();
		}
		rsBDList.Update();
	}
})();
%>
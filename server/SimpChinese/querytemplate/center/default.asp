<!-- #include file="../Common.asp" -->
<%
(function(){
	if(!ebx.stdin['id']){ 
		ebx.stdout = {total:0, rows:[]};
		return;
	}
	var id = ebx.validInt(ebx.stdin['id']),
		data = ebx.dbx.open('select null where 0 is null',1,1);
		sql = 'select [Columns] from ' + TableName + ' where id=' + id,
		rs = ebx.dbx.open(sql, 1, 1);
		
	if(!rs.eof){
		data = ebx.convertBinToRs(rs('Columns').value);
		while(!data.eof){
			data('criteria') = '';
			data.MoveNext();
		}
	}
	ebx.stdout = data;
})();
%>
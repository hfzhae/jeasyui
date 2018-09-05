<!-- #include file="../Common.asp" -->
<%
(function(){
	if(!ebx.stdin['id']){ 
		ebx.stdout = {
			tables:{total:0, rows:[]},
			columns:{total:0, rows:[]},
			relates:{total:0, rows:[]},
			filter:''
		};
		return;
	}
	var id = ebx.validInt(ebx.stdin['id']),
		data = {
			tables: ebx.dbx.open('select null where 0 is null',1,1),
			columns: ebx.dbx.open('select null where 0 is null',1,1),
			relates: ebx.dbx.open('select null where 0 is null',1,1),
			filter:''
		};
		sql = 'select [Tables],[Relates],[Columns],[Filter] from ' + TableName + ' where id=' + id,
		rs = ebx.dbx.open(sql, 1, 1);
		
	if(!rs.eof){
		data.tables = ebx.convertBinToRs(rs('Tables').value);
		data.columns = ebx.convertBinToRs(rs('Columns').value);
		data.relates = ebx.convertBinToRs(rs('Relates').value);
		data.filter = rs('Filter').value;
	}
	ebx.stdout = data;
})();
%>
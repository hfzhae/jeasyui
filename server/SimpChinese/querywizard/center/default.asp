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
			tables:{total:0, rows:[]},
			columns:{total:0, rows:[]},
			relates:{total:0, rows:[]},
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
	//data["total"] = rs.recordcount;
	//data["rows"] = eval('('+ebx.convertRsToJson(rs, 1)+')');
	//data["footer"] = [{}]
	ebx.stdout = data;
})();
%>
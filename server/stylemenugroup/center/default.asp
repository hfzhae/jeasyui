<!-- #include file="../Common.asp" -->
<%
(function(){
	if(!ebx.stdin['id']){ 
		ebx.stdout = {total:0, rows:[]};
		return;
	}
	var data = new Array(),
		sql = 'select * from ' + TableName + 'List where id=' + ebx.stdin['id'],
		rs = ebx.dbx.open(sql, 1, 1);
		
	data["total"] = rs.recordcount;
	data["rows"] = rs;
	data["footer"] = [{}]
	ebx.stdout = data;
})();
%>
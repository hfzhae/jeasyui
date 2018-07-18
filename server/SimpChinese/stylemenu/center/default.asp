<!-- #include file="../Common.asp" -->
<%
(function(){
	if(!ebx.stdin['id']){ 
		ebx.stdout = {total:0, rows:[]};
		return;
	}
	var data = new Array(),
		sql = 'select l.*,mg.MenuGroupName,mg.MenuGroupTitle from ' + TableName + 'List l,bdStyleMenuGroup mg where l.MenuGroupID=mg.id and l.id=' + ebx.stdin['id'] +' order by Serial',
		rs = ebx.dbx.open(sql, 1, 1);
		
	data["total"] = rs.recordcount;
	data["rows"] = rs;
	data["footer"] = [{}]
	ebx.stdout = data;
})();
%>
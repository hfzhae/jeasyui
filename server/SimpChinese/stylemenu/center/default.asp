<!-- #include file="../Common.asp" -->
<%
(function(){
	if(!ebx.stdin['id']){ 
		ebx.stdout = {total:0, rows:[]};
		return;
	}
	var id = ebx.validInt(ebx.stdin['id']),
		data = new Array(),
		sql = 'select l.*,mg.MenuGroupName,mg.MenuGroupTitle from ' + TableName + 'List l,bdStyleMenuGroup mg where l.MenuGroupID=mg.id and l.id=' + id +' order by Serial',
		rs = ebx.dbx.open(sql, 1, 1);
		
	//data["total"] = rs.recordcount;
	//data["rows"] = eval('('+ebx.convertRsToJson(rs, 1)+')');
	//data["footer"] = [{}]
	ebx.stdout = rs;
})();
%>
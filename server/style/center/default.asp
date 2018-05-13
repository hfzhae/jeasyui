<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdin['id']){ 
		ebx.stdout = [{}];
		return;
	}
	
	var data = new Array(),
		sql = "select Serial as dispSerial,* from bdStyleList where id=" + ebx.stdin['id'],
		rs = ebx.dbx.open(sql, 1, 1);
		
	data["total"] = rs.recordcount;
	data["rows"] = rs;
	data["footer"] = [{}]
	ebx.stdout = data;
})();
%>
<!-- #include file="../Common.asp" -->
<%
(function(){
	var sql = 'select id,title,memo from NPPrivileges where isdeleted=0',
		rs = ebx.dbx.open(sql, 1, 1);
	
	if(rs.eof){
		ebx.stdout = {total:0, rows:[]};
		return;
	}
	ebx.stdout = rs;
})();
%>
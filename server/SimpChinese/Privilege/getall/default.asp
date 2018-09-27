<!-- #include file="../Common.asp" -->
<%
(function(){
	var sql = 'select id,title,memo from NPPrivileges where isDeleted=0',
		rs = ebx.dbx.open(sql, 1, 1);
	
	if(rs.eof){
		ebx.stdOut = {total:0, rows:[]};
		return;
	}
	ebx.stdOut = rs;
})();
%>
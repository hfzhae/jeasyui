<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdin['template']) return([]);
	var rs = Server.CreateObject("Adodb.Recordset");
	rs.open(ebx.getTemplateSQL(ebx.stdin['template']), ebx.conn, 1, 1);//通过查询模板获取sql语句
	var data = new Array();
	data["total"] = rs.RecordCount;
	data["rows"] = rs;
	ebx.stdout = data;
})();
%>
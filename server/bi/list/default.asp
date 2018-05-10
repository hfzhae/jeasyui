<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdin['template']) return([]);
	var page = {//iStart：起始行数，iLength：每页行数，iTotalLength：总行数（回调用）
			iStart: ebx.validInt(ebx.stdin['page']>1?((ebx.stdin['page'] - 1) * ebx.stdin['rows']) + 1: 1), 
			iLength: ebx.validInt(ebx.stdin['rows']), 
			iTotalLength: 0
		};
	
	var rs = ebx.dbx.openpage(ebx.getTemplateSQL(ebx.validInt(ebx.stdin['template'])), page);//通过查询模板获取sql语句
	var data = new Array();
	data["total"] = page.iTotalLength;
	data["rows"] = rs;
	ebx.stdout = data;
})();
%>
<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdin['template']) return([]);

	var page = {//iStart：起始行数，iLength：每页行数，iTotalLength：总行数（回调用）
			iStart: ebx.validInt(ebx.stdin['page']>1?((ebx.stdin['page'] - 1) * ebx.stdin['rows']) + 1: 1), 
			iLength: ebx.validInt(ebx.stdin['rows']), 
			iTotalLength: 0
		};

	var data = new Array();
	if(ebx.validInt(ebx.stdin['exportdata'], 0) == 0){
		var rs = ebx.dbx.openpage(ebx.getTemplateSQL(ebx.validInt(ebx.stdin['template'])), page);//分页查询语句
		data["total"] = page.iTotalLength;
		data["rows"] = eval('('+ebx.convertRsToJson(rs, 1)+')');//为了分页提供总行数，所以处理了这里只传递rows内容
		data["footer"] = [{}];
		ebx.stdout = data;
	}else{
		var rs = ebx.dbx.open(ebx.getTemplateSQL(ebx.validInt(ebx.stdin['template'])), 1, 1);//全部导出用语句，参数exportdata=1
		ebx.stdout = rs;
	}
})();
%>
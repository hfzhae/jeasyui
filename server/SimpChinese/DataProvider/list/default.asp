<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdIn['template']){
		ebx.stdOut = {"total": 0, "rows": []}; 
		return
	};

	var page = {//iStart：起始行数，iLength：每页行数，iTotalLength：总行数（回调用）
			iStart: ebx.validInt(ebx.stdIn['page']>1?((ebx.stdIn['page'] - 1) * ebx.stdIn['rows']) + 1: 1), 
			iLength: ebx.validInt(ebx.stdIn['rows']), 
			iTotalLength: 0
		};

	var data = {"total": 0, "rows": []}//new Array();
	if(ebx.validInt(ebx.stdIn['exportdata'], 0) == 0){
		var rs = ebx.dbx.openPage(ebx.getTemplateSQL(ebx.validInt(ebx.stdIn['template'])), page);//分页查询语句
		data["total"] = page.iTotalLength;
		data["rows"] = eval('('+ebx.convertRsToJson(rs, 1)+')');//为了分页提供总行数，所以处理了这里只传递rows内容
		data["footer"] = [{}];
		ebx.stdOut = data;
	}else{
		var rs = ebx.dbx.open(ebx.getTemplateSQL(ebx.validInt(ebx.stdIn['template'])), 1, 1);//全部导出用语句，参数exportdata=1
		ebx.stdOut = rs;
	}
})();
%>
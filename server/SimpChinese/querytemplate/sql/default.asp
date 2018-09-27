<!-- #include file="../Common.asp" -->
<%
(function(){
	if(!ebx.stdIn['id']){
		ebx.stdOut = {result:0, msg: '缺少参数：id。'};
		return;
	}
	var id = ebx.validInt(ebx.stdIn['id']);
	if(id == 0){
		ebx.stdOut = {result:0, msg:'缺少参数：id。'};
		return;
	}
	ebx.stdOut = {result:1, sql:escape(ebx.getTemplateSQL(id))};
})();
%>
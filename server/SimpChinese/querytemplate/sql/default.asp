<!-- #include file="../Common.asp" -->
<%
(function(){
	if(!ebx.stdin['id']){
		ebx.stdout = {result:0, msg: '缺少参数：id。'};
		return;
	}
	var id = ebx.validInt(ebx.stdin['id']);
	if(id == 0){
		ebx.stdout = {result:0, msg:'缺少参数：id。'};
		return;
	}
	ebx.stdout = {result:1, sql:escape(ebx.getTemplateSQL(id))};
})();
%>
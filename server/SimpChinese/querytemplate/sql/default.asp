<!-- #include file="../Common.asp" -->
<%
(function(){
	if(!ebx.stdIn['id']){
		ebx.stdOut = {result:0, msg: 'ȱ�ٲ�����id��'};
		return;
	}
	var id = ebx.validInt(ebx.stdIn['id']);
	if(id == 0){
		ebx.stdOut = {result:0, msg:'ȱ�ٲ�����id��'};
		return;
	}
	ebx.stdOut = {result:1, sql:escape(ebx.getTemplateSQL(id))};
})();
%>
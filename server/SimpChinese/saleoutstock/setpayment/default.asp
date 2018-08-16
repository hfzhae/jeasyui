<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdin['id'] || !ebx.stdin['bd']){
		ebx.stdout['result'] = 0;
		ebx.stdout['msg'] = '提交的信息不完整。'; 
		return
	};
	ebx.stdout['result'] = 1;
})();
%>
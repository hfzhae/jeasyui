<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdin['id'] || !ebx.stdin['bd']){
		ebx.stdout['result'] = 0;
		ebx.stdout['msg'] = '�ύ����Ϣ��������'; 
		return
	};
	ebx.stdout['result'] = 1;
})();
%>
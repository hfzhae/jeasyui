<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdin['id']){ 
		ebx.stdout = [{}];
		return;
	}
	var id = ebx.validInt(ebx.stdin['id']),
		sql = "select title,[type],FieldStyle,HeaderStyle,FooterStyle,Border,Header,Footer,Height,Width from bdStyle where id=" + id,
		rs = ebx.dbx.open(sql, 1, 1),
		data = [];
	
	if(rs.eof){
		data = [{}];
	}else{
		data = {"total":10,"rows":[
			{"name":"����","value":rs('title').value,"group":"������Ϣ","editor":"text","field":"title"},
			{"name":"����","value":rs('type').value,"group":"����","editor":"text","field":"type"},
			{"name":"��Ԫ����ʽ_","value":rs('FieldStyle').value,"group":"����","editor":"text","field":"FieldStyle"},
			{"name":"��ͷ��ʽ","value":rs('HeaderStyle').value,"group":"����","editor":"text","field":"HeaderStyle"},
			{"name":"��β��ʽ","value":rs('FooterStyle').value,"group":"����","editor":"text","field":"FooterStyle"},
			{"name":"�߿�","value":rs('Border').value,"group":"����","editor":"text","field":"Border","render":"boolRender"},
			{"name":"��ͷ","value":rs('Header').value,"group":"����","editor":"text","field":"Header","render":"boolRender"},
			{"name":"��β","value":rs('Footer').value,"group":"����","editor":"text","field":"Footer","render":"boolRender"},
			{"name":"�߶�","value":rs('Height').value,"group":"����","editor":"text","field":"Height"},
			{"name":"���","value":rs('Width').value,"group":"����","editor":"text","field":"Width"}
		]};
	}
	ebx.stdout = data;
})();
%>
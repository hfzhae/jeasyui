<!--# include virtual="server/public.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = "select title,[type],FieldStyle,HeaderStyle,FooterStyle,Border,Header,Footer,Height,Width from bdStyle where id=" + id,
		rs = ebx.dbx.open(sql, 1, 1),
		data = [],
		title = '', type = '', FieldStyle = '', HeaderStyle = '', FooterStyle = '', Border = 0, Header = 0, Footer = 0, Height = '', Width = '';
	
	if(!rs.eof){
		title = rs('title').value;
		type = rs('type').value;
		FieldStyle = rs('FieldStyle').value;
		HeaderStyle = rs('HeaderStyle').value;
		FooterStyle = rs('FooterStyle').value;
		Border = rs('Border').value;
		Header = rs('Header').value;
		Footer = rs('Footer').value;
		Height = rs('Height').value;
		Width = rs('Width').value;
	}
	
	data = {"total":10,"rows":[
		{"name":"����","value":title,"group":"������Ϣ","editor":"text","field":"title"},
		{"name":"����","value":type,"group":"����","editor":"text","field":"type"},
		{"name":"��Ԫ����ʽ_","value":FieldStyle,"group":"����","editor":"text","field":"FieldStyle"},
		{"name":"��ͷ��ʽ","value":HeaderStyle,"group":"����","editor":"text","field":"HeaderStyle"},
		{"name":"��β��ʽ","value":FooterStyle,"group":"����","editor":"text","field":"FooterStyle"},
		{"name":"�߿�","value":Border,"group":"����","editor":"text","field":"Border","render":"boolRender"},
		{"name":"��ͷ","value":Header,"group":"����","editor":"text","field":"Header","render":"boolRender"},
		{"name":"��β","value":Footer,"group":"����","editor":"text","field":"Footer","render":"boolRender"},
		{"name":"�߶�","value":Height,"group":"����","editor":"text","field":"Height"},
		{"name":"���","value":Width,"group":"����","editor":"text","field":"Width"}
	]};
	ebx.stdout = data;
})();
%>
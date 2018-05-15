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
		{"name":"名称","value":title,"group":"必填信息","editor":"text","field":"title"},
		{"name":"类型","value":type,"group":"其他","editor":"text","field":"type"},
		{"name":"单元格样式_","value":FieldStyle,"group":"其他","editor":"text","field":"FieldStyle"},
		{"name":"表头样式","value":HeaderStyle,"group":"其他","editor":"text","field":"HeaderStyle"},
		{"name":"表尾样式","value":FooterStyle,"group":"其他","editor":"text","field":"FooterStyle"},
		{"name":"边框","value":Border,"group":"其他","editor":"text","field":"Border","render":"boolRender"},
		{"name":"表头","value":Header,"group":"其他","editor":"text","field":"Header","render":"boolRender"},
		{"name":"表尾","value":Footer,"group":"其他","editor":"text","field":"Footer","render":"boolRender"},
		{"name":"高度","value":Height,"group":"其他","editor":"text","field":"Height"},
		{"name":"宽度","value":Width,"group":"其他","editor":"text","field":"Width"}
	]};
	ebx.stdout = data;
})();
%>
<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select id,title,[type],FieldStyle,HeaderStyle,FooterStyle,Border,Header,Footer,Height,Width from ' + TableName + ' where id=' + id,
		rs = ebx.dbx.open(sql, 1, 1),
		data = [],
		id = 0, title = '', type = '', FieldStyle = '', HeaderStyle = '', FooterStyle = '', Border = 0, Header = 0, Footer = 0, Height = '', Width = '';
	
	if(!rs.eof){
		id = rs('id').value
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
	
	data = {"total":11,"rows":[
		{"name":"ID","value":id,"group":"ϵͳ����","field":"id"},
		{"name":"����","value":title,"group":"������Ϣ","editor":{"type":"validatebox", "options":{"required":true,"validType":"LetterInteger"}},"field":"title"},//validateboxУ��¼��ֵ�Ϸ��Ե�֧�ַ���
		{"name":"����","value":type,"group":"����","editor":"text","field":"type"},
		{"name":"��Ԫ����ʽ","value":FieldStyle,"group":"����","editor":"text","field":"FieldStyle"},
		{"name":"��ͷ��ʽ","value":HeaderStyle,"group":"����","editor":"text","field":"HeaderStyle"},
		{"name":"��β��ʽ","value":FooterStyle,"group":"����","editor":"text","field":"FooterStyle"},
		{"name":"�߿�","value":Border,"group":"����","editor":{"type":"validatebox", "options":{"required":false,"validType":"ZeroOrOne"}},"field":"Border","render":"boolRender"},
		{"name":"��ͷ","value":Header,"group":"����","editor":{"type":"validatebox", "options":{"required":false,"validType":"ZeroOrOne"}},"field":"Header","render":"boolRender"},
		{"name":"��β","value":Footer,"group":"����","editor":{"type":"validatebox", "options":{"required":false,"validType":"ZeroOrOne"}},"field":"Footer","render":"boolRender"},
		{"name":"�߶�","value":Height,"group":"����","editor":{"type":"validatebox", "options":{"required":false,"validType":"String"}},"field":"Height"},
		{"name":"���","value":Width,"group":"����","editor":{"type":"validatebox", "options":{"required":false,"validType":"String"}},"field":"Width"}
	]};
	ebx.stdout = data;
})();
%>
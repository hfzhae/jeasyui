<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select id,MenuModule from ' + TableName + ' where id=' + id,
		rs = ebx.dbx.open(sql, 1, 1),
		data = [],
		id = 0, title = '';
	
	if(!rs.eof){
		id = rs('id').value
		title = rs('MenuModule').value;
	}
	data = {"total":11,"rows":[
		{"name":"ID","value":id,"group":"ϵͳ����","field":"id"},
		{"name":"ģ������","value":title,"group":"������Ϣ","editor":{"type":"validatebox", "options":{"required":true,"validType":"LetterInteger"}},"field":"MenuModule"},//validateboxУ��¼��ֵ�Ϸ��Ե�֧�ַ���
	]};
	ebx.stdout = data;
})();
%>
<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select id,MenuModule,isdeleted from ' + TableName + ' where id=' + id,
		rs,
		data = [],
		title = '', isdeleted = 0;
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			id = rs('id').value
			title = rs('MenuModule').value;
			isdeleted = rs('isdeleted').value;
		}
	}
	data = {"total":11,"rows":[
		{"name":"ID","value":id,"group":"ϵͳ����","field":"id"},
		{"name":"ɾ��","value":isdeleted,"group":"ϵͳ����","field":"isdeleted","hidden":true,"render":"boolRender"},
		{"name":"ģ������","value":title,"group":"������Ϣ","editor":{"type":"validatebox", "options":{"required":true,"validType":"LetterInteger"}},"field":"MenuModule"},//validateboxУ��¼��ֵ�Ϸ��Ե�֧�ַ���
	]};
	ebx.stdout = data;
})();
%>
<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select id,MenuGroupName,MenuGroupTitle,isdeleted from ' + TableName + ' where id=' + id,
		rs,
		data = [],
		title = '', type = '', isdeleted = 0;
	
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1);
		if(!rs.eof){
			id = rs('id').value
			title = rs('MenuGroupName').value;
			type = rs('MenuGroupTitle').value;
			isdeleted = rs('isdeleted').value;
		}
	}
	data = {"total":11,"rows":[
		{"name":"ID","value":id,"group":"ϵͳ����","field":"id"},
		{"name":"ɾ��","value":isdeleted,"group":"ϵͳ����","field":"isdeleted","hidden":true,"render":"boolRender"},
		{"name":"�˵���","value":title,"group":"������Ϣ","editor":{"type":"validatebox", "options":{"required":true,"validType":"LetterInteger"}},"field":"MenuGroupName"},//validateboxУ��¼��ֵ�Ϸ��Ե�֧�ַ���
		{"name":"��ʾ����","value":type,"group":"������Ϣ","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"MenuGroupTitle"}
	]};
	ebx.stdout = data;
})();
%>
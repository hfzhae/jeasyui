<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select id,code,title,isdeleted from ' + TableName + ' where id=' + id,
		rs,
		data = [],
		code = '', title = '', isdeleted = 0;
		
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			id = rs('id').value
			code = rs('code').value;
			title = rs('title').value;
			isdeleted = rs('isdeleted').value;
		}
	}
	data = {"total":3,"rows":[
		{"name":"ID","value":id,"group":"ϵͳ����","field":"id"},
		{"name":"ɾ��","value":isdeleted,"group":"ϵͳ����","field":"isdeleted","hidden":true,"render":"boolRender"},
		{"name":"���","value":code,"group":"������Ϣ","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"code"},//validateboxУ��¼��ֵ�Ϸ��Ե�֧�ַ���
		{"name":"����","value":title,"group":"������Ϣ","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"title"},//validateboxУ��¼��ֵ�Ϸ��Ե�֧�ַ���
	]};
	ebx.stdout = data;
})();
%>
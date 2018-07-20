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
		{"name":"ID","value":id,"group":"系统生成","field":"id"},
		{"name":"删除","value":isdeleted,"group":"系统生成","field":"isdeleted","hidden":true,"render":"boolRender"},
		{"name":"菜单组","value":title,"group":"必填信息","editor":{"type":"validatebox", "options":{"required":true,"validType":"LetterInteger"}},"field":"MenuGroupName"},//validatebox校验录入值合法性的支持方法
		{"name":"显示名称","value":type,"group":"必填信息","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"MenuGroupTitle"}
	]};
	ebx.stdout = data;
})();
%>
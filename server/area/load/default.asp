<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select id,code,title from ' + TableName + ' where id=' + id,
		rs = ebx.dbx.open(sql, 1, 1),
		data = [],
		id = 0, code = '', title = '';
	
	if(!rs.eof){
		id = rs('id').value
		code = rs('code').value;
		title = rs('title').value;
	}
	data = {"total":3,"rows":[
		{"name":"ID","value":id,"group":"系统生成","field":"id"},
		{"name":"编号","value":code,"group":"必填信息","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"code"},//validatebox校验录入值合法性的支持方法
		{"name":"名称","value":title,"group":"必填信息","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"title"},//validatebox校验录入值合法性的支持方法
	]};
	ebx.stdout = data;
})();
%>
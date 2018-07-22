<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select a.id,a.code,a.title,a.isdeleted,a.updatedate,a.createdate,u.title as owner from ' + TableName + ' a,biuser u where a.owner=u.id and a.id=' + id,
		rs,
		data = [],
		code = '', title = '', isdeleted = 0, updatedate = new Date(), createdate = new Date(), owner = '';
	
	
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1);
		if(!rs.eof){
			id = rs('id').value
			code = rs('code').value;
			title = rs('title').value;
			isdeleted = rs('isdeleted').value;
			updatedate = rs('updatedate').value;
			createdate = rs('createdate').value;
			owner = rs('owner').value
		}
	}

	data = {"total":3,"rows":[
		{"name":"ID","value":id,"group":"系统生成","field":"id"},
		{"name":"删除","value":isdeleted,"group":"系统生成","field":"_isdeleted","render":"boolRender"},
		{"name":"创建时间","value":"'" + createdate + "'","group":"系统生成","field":"_createdate","render":"datetimeRender"},
		{"name":"更新时间","value":"'" + updatedate + "'","group":"系统生成","field":"_updatedate","render":"datetimeRender"},
		{"name":"操作员","value":owner,"group":"系统生成","field":"_owner"},
		{"name":"编号","value":code,"group":"必填信息","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"code"},//validatebox校验录入值合法性的支持方法
		{"name":"名称","value":title,"group":"必填信息","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"title"},//validatebox校验录入值合法性的支持方法
	]};
	ebx.stdout = data;
})();
%>
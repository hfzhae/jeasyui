<!-- #include file='../Common.asp' -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select a.id,a.title,a.Memo,a.isdeleted,a.updatedate,a.createdate,u.title as owner from ' + TableName + ' a, biuser u where a.owner=u.id and a.id=' + id,
		rs,
		data = [],
		code = '', title = '', Memo = '', isdeleted = 0, updatedate = new Date(), createdate =  new Date(), owner = '';
		
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			id = rs('id').value
			title = rs('title').value;
			Memo = rs('Memo').value;
			isdeleted = rs('isdeleted').value;
			updatedate = rs('updatedate').value;
			createdate = rs('createdate').value;
			owner = rs('owner').value
		}
	}
	
	data = {"total":3,"rows":[
		{'name':'ID','value':id,'group':'系统生成','field':'id'},
		{"name":"删除","value":isdeleted,"group":"系统生成","field":"_isdeleted","hidden":true,"render":"boolRender"},
		{"name":"创建时间","value":"'" + createdate + "'","group":"系统生成","field":"_createdate","hidden":true,"render":"datetimeRender"},
		{"name":"更新时间","value":"'" + updatedate + "'","group":"系统生成","field":"_updatedate","hidden":true,"render":"datetimeRender"},
		{"name":"操作员","value":owner,"group":"系统生成","field":"_owner"},
		{'name':'说明','value':Memo,'group':'必填信息','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'memo'},
		{'name':'名称','value':title,'group':'必填信息','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'title'}
	]};

	ebx.stdout = data;
})();
%>
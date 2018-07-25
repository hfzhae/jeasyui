<!-- #include file='../Common.asp' -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select a.title,a.Memo,a.isdeleted,a.updatedate,a.createdate,u.title as owner from ' + TableName + ' a, biuser u where a.owner=u.id and a.id=' + id,
		rs,
		data = [],
		code = '', title = '', Memo = '', isdeleted = 0, updatedate = new Date(), createdate =  new Date(), owner = '';
		
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			title = rs('title').value;
			Memo = rs('Memo').value;
			isdeleted = rs('isdeleted').value;
			updatedate = rs('updatedate').value;
			createdate = rs('createdate').value;
			owner = rs('owner').value
		}
	}
	
	data = {"total":3,"rows":[
		{"name":"删除","value":isdeleted,"group":"系统生成","field":"_isdeleted","render":"boolRender","func":"",'rowstyle':'color:#999;','fieldstyle':'color:#f00;'},
		{"name":"创建时间","value":"'" + createdate + "'","group":"系统生成","field":"_createdate","render":"datetimeRender",'rowstyle':'color:#999;'},
		{"name":"更新时间","value":"'" + updatedate + "'","group":"系统生成","field":"_updatedate","render":"datetimeRender",'rowstyle':'color:#999;'},
		{"name":"操作员","value":owner,"group":"系统生成","field":"_owner",'rowstyle':'color:#999;'},
		{'name':'说明','value':Memo,'group':'必填信息','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'memo','func':'cbRSNotNullAndNotRepeatCheck'},
		{'name':'名称','value':title,'group':'必填信息','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'title','func':'cbRSNotNullAndNotRepeatCheck'}
	]};

	ebx.stdout = data;
})();
%>
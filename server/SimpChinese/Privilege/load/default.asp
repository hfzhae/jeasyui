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
		{'name':'ID','value':id,'group':'ϵͳ����','field':'id'},
		{"name":"ɾ��","value":isdeleted,"group":"ϵͳ����","field":"_isdeleted","hidden":true,"render":"boolRender"},
		{"name":"����ʱ��","value":"'" + createdate + "'","group":"ϵͳ����","field":"_createdate","hidden":true,"render":"datetimeRender"},
		{"name":"����ʱ��","value":"'" + updatedate + "'","group":"ϵͳ����","field":"_updatedate","hidden":true,"render":"datetimeRender"},
		{"name":"����Ա","value":owner,"group":"ϵͳ����","field":"_owner"},
		{'name':'˵��','value':Memo,'group':'������Ϣ','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'memo'},
		{'name':'����','value':title,'group':'������Ϣ','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'title'}
	]};

	ebx.stdout = data;
})();
%>
<!-- #include file='../Common.asp' -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select id,title,Memo,isdeleted from ' + TableName + ' where id=' + id,
		rs,
		data = [],
		code = '', title = '', Memo = '', isdeleted = 0;
		
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			id = rs('id').value
			title = rs('title').value;
			Memo = rs('Memo').value;
			isdeleted = rs('isdeleted').value;
		}
	}
	
	data = {"total":3,"rows":[
		{'name':'ID','value':id,'group':'ϵͳ����','field':'id'},
		{"name":"ɾ��","value":isdeleted,"group":"ϵͳ����","field":"isdeleted","hidden":true,"render":"boolRender"},
		{'name':'˵��','value':Memo,'group':'������Ϣ','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'Memo'},
		{'name':'����','value':title,'group':'������Ϣ','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'title'}
	]};

	ebx.stdout = data;
})();
%>
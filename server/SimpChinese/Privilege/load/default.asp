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
		{"name":"ɾ��","value":isdeleted,"group":"ϵͳ����","field":"_isdeleted","render":"boolRender","func":"",'rowstyle':'color:#999;','fieldstyle':'color:#f00;'},
		{"name":"����ʱ��","value":"'" + createdate + "'","group":"ϵͳ����","field":"_createdate","render":"datetimeRender",'rowstyle':'color:#999;'},
		{"name":"����ʱ��","value":"'" + updatedate + "'","group":"ϵͳ����","field":"_updatedate","render":"datetimeRender",'rowstyle':'color:#999;'},
		{"name":"����Ա","value":owner,"group":"ϵͳ����","field":"_owner",'rowstyle':'color:#999;'},
		{'name':'˵��','value':Memo,'group':'������Ϣ','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'memo','func':'cbRSNotNullAndNotRepeatCheck'},
		{'name':'����','value':title,'group':'������Ϣ','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'title','func':'cbRSNotNullAndNotRepeatCheck'}
	]};

	ebx.stdout = data;
})();
%>
<!-- #include file='../Common.asp' -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select id,title,Memo from ' + TableName + ' where id=' + id,
		rs,
		data = [],
		code = '', title = '', Memo = '', VIPDateFrom = new Date(), VIPDateTo = new Date(), VIPPoints = 0, VIPCoefficient = 0;
		
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			id = rs('id').value
			title = rs('title').value;
			Memo = rs('Memo').value;
		}
	}
	
	data = {"total":3,"rows":[
		{'name':'ID','value':id,'group':'ϵͳ����','field':'id'},
		{'name':'˵��','value':Memo,'group':'������Ϣ','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'Memo'},
		{'name':'����','value':title,'group':'������Ϣ','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'title'}
	]};

	ebx.stdout = data;
})();
%>
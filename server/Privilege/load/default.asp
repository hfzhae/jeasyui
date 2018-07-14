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
		{'name':'ID','value':id,'group':'系统生成','field':'id'},
		{'name':'说明','value':Memo,'group':'必填信息','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'Memo'},
		{'name':'名称','value':title,'group':'必填信息','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'title'}
	]};

	ebx.stdout = data;
})();
%>
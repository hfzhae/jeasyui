<!-- #include file='../Common.asp' -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select id,code,title,MemoInfo,VIPDateFrom,VIPDateTo,VIPPoints,VIPCoefficient,isdeleted from ' + TableName + ' where id=' + id,
		rs,
		data = [],
		code = '', title = '', MemoInfo = '', VIPDateFrom = new Date(), VIPDateTo = new Date(), VIPPoints = 0, VIPCoefficient = 0, isdeleted = 0;
		
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			id = rs('id').value
			code = rs('code').value;
			title = rs('title').value;
			MemoInfo = rs('MemoInfo').value;
			VIPDateFrom = rs('VIPDateFrom').value;
			VIPDateTo = rs('VIPDateTo').value;
			VIPPoints = rs('VIPPoints').value;
			VIPCoefficient = rs('VIPCoefficient').value;
			isdeleted = rs('isdeleted').value;
		}
	}
	
	data = {"total":8,"rows":[
		{'name':'ID','value':id,'group':'ϵͳ����','field':'id'},
		{"name":"ɾ��","value":isdeleted,"group":"ϵͳ����","field":"isdeleted","hidden":true,"render":"boolRender"},
		{'name':'���','value':code,'group':'������Ϣ','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'code'},
		{'name':'����','value':title,'group':'������Ϣ','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'title'},
		{'name':'��ע','value':MemoInfo,'group':'����','editor':'text','field':'MemoInfo'},
		{'name':'������ʼʱ��','value':new Date(VIPDateFrom).Format('yyyy-MM-dd hh:mm:ss'),'group':'��Ա���','editor':'datetimebox','field':'VIPDateFrom'},
		{'name':'���ֽ���ʱ��','value':new Date(VIPDateTo).Format('yyyy-MM-dd hh:mm:ss'),'group':'��Ա���','editor':'datetimebox','field':'VIPDateTo'},
		{'name':'���ֱ���','value':VIPPoints,'group':'��Ա���','editor':{'type':'validatebox', 'options':{'required':true,'validType':'Number'}},'field':'VIPPoints'},
		{'name':'��������','value':VIPCoefficient,'group':'��Ա���','editor':{'type':'validatebox', 'options':{'required':true,'validType':'Number'}},'field':'VIPCoefficient'}
	]};

	ebx.stdout = data;
})();
%>
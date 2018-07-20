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
		{'name':'ID','value':id,'group':'系统生成','field':'id'},
		{"name":"删除","value":isdeleted,"group":"系统生成","field":"isdeleted","hidden":true,"render":"boolRender"},
		{'name':'编号','value':code,'group':'必填信息','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'code'},
		{'name':'名称','value':title,'group':'必填信息','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'title'},
		{'name':'备注','value':MemoInfo,'group':'其他','editor':'text','field':'MemoInfo'},
		{'name':'积分起始时间','value':new Date(VIPDateFrom).Format('yyyy-MM-dd hh:mm:ss'),'group':'会员相关','editor':'datetimebox','field':'VIPDateFrom'},
		{'name':'积分结束时间','value':new Date(VIPDateTo).Format('yyyy-MM-dd hh:mm:ss'),'group':'会员相关','editor':'datetimebox','field':'VIPDateTo'},
		{'name':'积分倍数','value':VIPPoints,'group':'会员相关','editor':{'type':'validatebox', 'options':{'required':true,'validType':'Number'}},'field':'VIPPoints'},
		{'name':'积分赠送','value':VIPCoefficient,'group':'会员相关','editor':{'type':'validatebox', 'options':{'required':true,'validType':'Number'}},'field':'VIPCoefficient'}
	]};

	ebx.stdout = data;
})();
%>
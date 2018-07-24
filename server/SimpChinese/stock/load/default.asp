<!-- #include file='../Common.asp' -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select a.id,a.code,a.title,a.searchcode1,a.MemoInfo,a.VIPDateFrom,a.VIPDateTo,a.VIPPoints,a.VIPCoefficient,a.isdeleted,a.int1,a.updatedate,a.createdate,u.title as owner  from ' + TableName + ' a,biuser u where a.owner=u.id and a.id=' + id,
		rs,
		data = [],
		code = '', title = '', MemoInfo = '', VIPDateFrom = new Date(), VIPDateTo = new Date(), VIPPoints = 0, VIPCoefficient = 0, isdeleted = 0, searchcode1 = '', int1 = 0, updatedate = new Date(), createdate = new Date(), owner = '';
		
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			id = rs('id').value
			code = rs('code').value;
			title = rs('title').value;
			searchcode1 = rs('searchcode1').value;
			MemoInfo = rs('MemoInfo').value;
			VIPDateFrom = rs('VIPDateFrom').value;
			VIPDateTo = rs('VIPDateTo').value;
			VIPPoints = rs('VIPPoints').value;
			VIPCoefficient = rs('VIPCoefficient').value;
			isdeleted = rs('isdeleted').value;
			int1 = rs('int1').value;
			updatedate = rs('updatedate').value;
			createdate = rs('createdate').value;
			owner = rs('owner').value
		}
	}
	
	data = {"total":8,"rows":[
		{'name':'ID','value':id,'group':'ϵͳ����','field':'_id','func':'','rowstyle':'color:#999;'},
		{'name':'int1','value':int1,'group':'ϵͳ����','field':'int1','hidden':true},
		{"name":"ɾ��","value":isdeleted,"group":"ϵͳ����","field":"_isdeleted","render":"boolRender",'rowstyle':'color:#999;','fieldstyle':'color:#f00;'},
		{"name":"����ʱ��","value":"'" + createdate + "'","group":"ϵͳ����","field":"_createdate","render":"datetimeRender",'rowstyle':'color:#999;'},
		{"name":"����ʱ��","value":"'" + updatedate + "'","group":"ϵͳ����","field":"_updatedate","render":"datetimeRender",'rowstyle':'color:#999;'},
		{"name":"����Ա","value":owner,"group":"ϵͳ����","field":"_owner",'rowstyle':'color:#999;'},
		{"name":"ƴ����","value":searchcode1,"group":"ϵͳ����","field":"searchcode1",'rowstyle':'color:#999;'},
		{'name':'���','value':code,'group':'������Ϣ','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'code',"func":"cbRSNotNullAndNotRepeatCheck"},
		{'name':'����','value':title,'group':'������Ϣ','editor':{'type':'validatebox', 'options':{'required':true,'validType':'String'}},'field':'title',"func":"cbRSDirectPy"},
		{'name':'��ע','value':MemoInfo,'group':'����','editor':'text','field':'MemoInfo'},
		{'name':'������ʼʱ��','value':new Date(VIPDateFrom).Format('yyyy-MM-dd hh:mm:ss'),'group':'��Ա���','editor':'datetimebox','field':'VIPDateFrom'},
		{'name':'���ֽ���ʱ��','value':new Date(VIPDateTo).Format('yyyy-MM-dd hh:mm:ss'),'group':'��Ա���','editor':'datetimebox','field':'VIPDateTo'},
		{'name':'���ֱ���','value':VIPPoints,'group':'��Ա���','editor':{'type':'validatebox', 'options':{'required':true,'validType':'Number'}},'field':'VIPPoints'},
		{'name':'��������','value':VIPCoefficient,'group':'��Ա���','editor':{'type':'validatebox', 'options':{'required':true,'validType':'Number'}},'field':'VIPCoefficient'}
	]};

	ebx.stdout = data;
})();
%>
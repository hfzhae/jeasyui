<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select a.title,a.isdeleted,a.updatedate,a.createdate,u.title as owner from ' + TableName + ' a,biuser u where a.owner=u.id and a.id=' + id,
		rs,
		data = [],
		title = '', 
		isdeleted = 0, 
		updatedate = new Date(), 
		createdate = new Date(), 
		owner = '';
		
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			title = rs('title').value;
			isdeleted = rs('isdeleted').value;
			updatedate = rs('updatedate').value;
			createdate = rs('createdate').value;
			owner = rs('owner').value
		}
	}
	
	data = {total:6,rows:[
		{name:"ID",value:id,group:"ϵͳ����",field:"",render:"",func:"",rowstyle:'color:#999',fieldstyle:''},
		{name:"ɾ��",value:isdeleted,group:"ϵͳ����",field:"_isdeleted",render:"boolRender",func:"",rowstyle:'color:#999;',fieldstyle:'color:#f00;'},
		{name:"����ʱ��",value:new Date(createdate).Format('yyyy-MM-dd hh:mm:ss'),group:"ϵͳ����",rowstyle:'color:#999;'},
		{name:"����ʱ��",value: new Date(updatedate).Format('yyyy-MM-dd hh:mm:ss'),group:"ϵͳ����",rowstyle:'color:#999;'},
		{name:"����Ա",value:owner,group:"ϵͳ����",rowstyle:'color:#999;'},
		{name:"����",value:title,group:"������Ϣ",editor:{type:"validatebox", options:{required:true,validType:"string"}},field:"title"}//validateboxУ��¼��ֵ�Ϸ��Ե�֧�ַ���
	]};
	ebx.stdout = data;
})();
%>
<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select a.MenuModule,a.isdeleted,a.updatedate,a.createdate,u.title as owner from bdStyleMenu a left join biuser u on a.owner=u.id where a.id=' + id,
		rs,
		data = [],
		title = '', isdeleted = 0, updatedate = new Date(), createdate = new Date(), owner = '';
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			title = rs('MenuModule').value;
			isdeleted = rs('isdeleted').value;
			updatedate = rs('updatedate').value;
			createdate = rs('createdate').value;
			owner = rs('owner').value
		}
	}
	data = {"total":11,"rows":[
		{"name":"ɾ��","value":isdeleted,"group":"ϵͳ����","field":"_isdeleted","render":"boolRender","func":"",'rowstyle':'color:#999;','fieldstyle':'color:#f00;'},
		{"name":"����ʱ��","value":new Date(createdate).Format('yyyy-MM-dd hh:mm:ss'),"group":"ϵͳ����","field":"_createdate",'rowstyle':'color:#999;'},
		{"name":"����ʱ��","value": new Date(updatedate).Format('yyyy-MM-dd hh:mm:ss'),"group":"ϵͳ����","field":"_updatedate",'rowstyle':'color:#999;'},
		{"name":"����Ա","value":owner,"group":"ϵͳ����","field":"_owner",'rowstyle':'color:#999;'},
		{"name":"ģ������","value":title,"group":"������Ϣ","editor":{"type":"validatebox", "options":{"required":true,"validType":"LetterInteger"}},"field":"MenuModule"},//validateboxУ��¼��ֵ�Ϸ��Ե�֧�ַ���
	]};
	ebx.stdout = data;
})();
%>
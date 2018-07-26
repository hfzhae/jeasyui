<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select a.title,a.[type],a.FieldStyle,a.HeaderStyle,a.FooterStyle,a.Border,a.Header,a.Footer,a.Height,a.Width,a.isdeleted,a.updatedate,a.createdate,u.title as owner from ' + TableName + ' a,biuser u where a.owner=u.id and a.id=' + id,
		rs,
		data = [],
		title = '', type = '', FieldStyle = '', HeaderStyle = '', FooterStyle = '', Border = 0, Header = 0, Footer = 0, Height = '', Width = '', isdeleted = 0, updatedate = new Date(), createdate = new Date(), owner = '';
	
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			title = rs('title').value;
			type = rs('type').value;
			FieldStyle = rs('FieldStyle').value;
			HeaderStyle = rs('HeaderStyle').value;
			FooterStyle = rs('FooterStyle').value;
			Border = rs('Border').value;
			Header = rs('Header').value;
			Footer = rs('Footer').value;
			Height = rs('Height').value;
			Width = rs('Width').value;
			isdeleted = rs('isdeleted').value;
			updatedate = rs('updatedate').value;
			createdate = rs('createdate').value;
			owner = rs('owner').value
		}
	}
	data = {"total":11,"rows":[
		{"name":"ɾ��","value":isdeleted,"group":"ϵͳ����","field":"_isdeleted","render":"boolRender","func":"",'rowstyle':'color:#999;','fieldstyle':'color:#f00;'},
		{"name":"����ʱ��","value":new Date(createdate).Format('yyyy-MM-dd hh:mm:ss'),"group":"ϵͳ����","field":"_createdate",'rowstyle':'color:#999;'},
		{"name":"����ʱ��","value":new Date(updatedate).Format('yyyy-MM-dd hh:mm:ss'),"group":"ϵͳ����","field":"_updatedate",'rowstyle':'color:#999;'},
		{"name":"����Ա","value":owner,"group":"ϵͳ����","field":"_owner",'rowstyle':'color:#999;'},
		{"name":"����","value":title,"group":"������Ϣ","editor":{"type":"validatebox", "options":{"required":true,"validType":"LetterInteger"}},"field":"title","func":"cbRSNotNullAndNotRepeatCheck"},//validateboxУ��¼��ֵ�Ϸ��Ե�֧�ַ���
		{"name":"����","value":type,"group":"����","editor":"text","field":"type"},
		{"name":"��Ԫ����ʽ","value":FieldStyle,"group":"����","editor":"text","field":"FieldStyle"},
		{"name":"��ͷ��ʽ","value":HeaderStyle,"group":"����","editor":"text","field":"HeaderStyle"},
		{"name":"��β��ʽ","value":FooterStyle,"group":"����","editor":"text","field":"FooterStyle"},
		{"name":"�߿�","value":Border,"group":"����","editor":{"type":"validatebox", "options":{"required":false,"validType":"ZeroOrOne"}},"field":"Border","render":"boolRender"},
		{"name":"��ͷ","value":Header,"group":"����","editor":{"type":"validatebox", "options":{"required":false,"validType":"ZeroOrOne"}},"field":"Header","render":"boolRender"},
		{"name":"��β","value":Footer,"group":"����","editor":{"type":"validatebox", "options":{"required":false,"validType":"ZeroOrOne"}},"field":"Footer","render":"boolRender"},
		{"name":"�߶�","value":Height,"group":"����","editor":{"type":"validatebox", "options":{"required":false,"validType":"String"}},"field":"Height"},
		{"name":"���","value":Width,"group":"����","editor":{"type":"validatebox", "options":{"required":false,"validType":"String"}},"field":"Width"}
	]};
	ebx.stdout = data;
})();
%>
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
		{"name":"删除","value":isdeleted,"group":"系统生成","field":"_isdeleted","render":"boolRender","func":"",'rowstyle':'color:#999;','fieldstyle':'color:#f00;'},
		{"name":"创建时间","value":new Date(createdate).Format('yyyy-MM-dd hh:mm:ss'),"group":"系统生成","field":"_createdate",'rowstyle':'color:#999;'},
		{"name":"更新时间","value":new Date(updatedate).Format('yyyy-MM-dd hh:mm:ss'),"group":"系统生成","field":"_updatedate",'rowstyle':'color:#999;'},
		{"name":"操作员","value":owner,"group":"系统生成","field":"_owner",'rowstyle':'color:#999;'},
		{"name":"名称","value":title,"group":"必填信息","editor":{"type":"validatebox", "options":{"required":true,"validType":"LetterInteger"}},"field":"title","func":"cbRSNotNullAndNotRepeatCheck"},//validatebox校验录入值合法性的支持方法
		{"name":"类型","value":type,"group":"其他","editor":"text","field":"type"},
		{"name":"单元格样式","value":FieldStyle,"group":"其他","editor":"text","field":"FieldStyle"},
		{"name":"表头样式","value":HeaderStyle,"group":"其他","editor":"text","field":"HeaderStyle"},
		{"name":"表尾样式","value":FooterStyle,"group":"其他","editor":"text","field":"FooterStyle"},
		{"name":"边框","value":Border,"group":"其他","editor":{"type":"validatebox", "options":{"required":false,"validType":"ZeroOrOne"}},"field":"Border","render":"boolRender"},
		{"name":"表头","value":Header,"group":"其他","editor":{"type":"validatebox", "options":{"required":false,"validType":"ZeroOrOne"}},"field":"Header","render":"boolRender"},
		{"name":"表尾","value":Footer,"group":"其他","editor":{"type":"validatebox", "options":{"required":false,"validType":"ZeroOrOne"}},"field":"Footer","render":"boolRender"},
		{"name":"高度","value":Height,"group":"其他","editor":{"type":"validatebox", "options":{"required":false,"validType":"String"}},"field":"Height"},
		{"name":"宽度","value":Width,"group":"其他","editor":{"type":"validatebox", "options":{"required":false,"validType":"String"}},"field":"Width"}
	]};
	ebx.stdout = data;
})();
%>
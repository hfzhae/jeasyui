<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdin['id']){ 
		ebx.stdout = [{}];
		return;
	}
	var id = ebx.validInt(ebx.stdin['id']),
		sql = "select title,[type],FieldStyle,HeaderStyle,FooterStyle,Border,Header,Footer,Height,Width from bdStyle where id=" + id,
		rs = ebx.dbx.open(sql, 1, 1),
		data = [];
	
	if(rs.eof){
		data = [{}];
	}else{
		data = {"total":10,"rows":[
			{"name":"名称","value":rs('title').value,"group":"必填信息","editor":"text","field":"title"},
			{"name":"类型","value":rs('type').value,"group":"其他","editor":"text","field":"type"},
			{"name":"单元格样式_","value":rs('FieldStyle').value,"group":"其他","editor":"text","field":"FieldStyle"},
			{"name":"表头样式","value":rs('HeaderStyle').value,"group":"其他","editor":"text","field":"HeaderStyle"},
			{"name":"表尾样式","value":rs('FooterStyle').value,"group":"其他","editor":"text","field":"FooterStyle"},
			{"name":"边框","value":rs('Border').value,"group":"其他","editor":"text","field":"Border","render":"boolRender"},
			{"name":"表头","value":rs('Header').value,"group":"其他","editor":"text","field":"Header","render":"boolRender"},
			{"name":"表尾","value":rs('Footer').value,"group":"其他","editor":"text","field":"Footer","render":"boolRender"},
			{"name":"高度","value":rs('Height').value,"group":"其他","editor":"text","field":"Height"},
			{"name":"宽度","value":rs('Width').value,"group":"其他","editor":"text","field":"Width"}
		]};
	}
	ebx.stdout = data;
})();
%>
<!--# include virtual="server/public.asp" -->
<%
(function(){
	ebx.stdout = {"total":10,"rows":[
		{"name":"名称","value":"stylelist","group":"必填信息","editor":"text","field":"title"},
		{"name":"类型","value":"bdBrowser","group":"其他","editor":"text","field":"type"},
		{"name":"单元格样式_","value":"","group":"其他","editor":"text","field":"FieldStyle"},
		{"name":"表头样式","value":"","group":"其他","editor":"text","field":"HeaderStyle"},
		{"name":"表尾样式","value":"","group":"其他","editor":"text","field":"FooterStyle"},
		{"name":"边框","value":"1","group":"其他","editor":"text","field":"Border","render":"boolRender"},
		{"name":"表头","value":"1","group":"其他","editor":"text","field":"Header","render":"boolRender"},
		{"name":"表尾","value":"","group":"其他","editor":"text","field":"Footer","render":"boolRender"},
		{"name":"高度","value":"","group":"其他","editor":"text","field":"Height"},
		{"name":"宽度","value":"","group":"其他","editor":"text","field":"Width"}
	]};
})();
%>
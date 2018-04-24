<%
dim template
template = request("template")

select case template
Case "product"
%>
[[
	{"field":"itemid","title":"编号","width":80,"sortable":true},
	{"field":"productname","title":"名称","width":100,"sortable":true},
	{"field":"nvarchae1","title":"规格","width":100,"sortable":true},
	{"field":"productClass","title":"产品类型","width":100,"sortable":true},
	{"field":"date","title":"日期","width":100,"sortable":true},
	{"field":"status","title":"删除","width":60,"align":"center","sortable":true,"render":"boolRender"}
]]
<%
Case "stock"
%>
[[
	{"field":"itemid","title":"编号","width":80,"sortable":true},
	{"field":"productname","title":"名称","width":200,"sortable":true},
	{"field":"date","title":"更新日期","width":100,"sortable":true},
	{"field":"status","title":"删除","width":60,"align":"center","sortable":true,"render":"boolRender","fieldstyle":"background-color:#789;color:#ffffff;"}
]]
<%
Case Else
%>
[[
	{"field":"itemid","title":"编号","width":80,"sortable":true},
	{"field":"productname","title":"名称","width":100,"sortable":true},
	{"field":"status","title":"删除","width":60,"align":"center","sortable":true,"render":"boolRender"}
]]
<%
end select
%>
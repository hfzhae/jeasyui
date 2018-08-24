<!--# include virtual="server/public.asp" -->
<%
(function(){
	ebx.stdout = {"total":29,"rows":[
		{"name":"编号","value":"","group":"必填信息","editor":"text","field":"code"},
		{"name":"名称","value":"","group":"必填信息","editor":"text","field":"title"},
		{"name":"产品类型","value":"","group":"必填信息","editor":{"type":"combogrid","options":{"style":"biOpen2","validType":"combogridValue","required":true,"idField":"id","textField":"title","rownumbers":true,"panelWidth":250,"template":84}},"field":"productclass"},
		{"name":"规格","value":"","group":"基本信息","editor":"text","field":"memo"},
		{"name":"单位","value":"","group":"基本信息","editor":"text","field":"memo"},
		{"name":"材质","value":"","group":"基本信息","editor":"text","field":"memo"},
		{"name":"条码","value":"","group":"基本信息","editor":"text","field":"memo"},
		{"name":"产地","value":"","group":"基本信息","editor":"text","field":"memo"},
		{"name":"原产地","value":"","group":"基本信息","editor":"text","field":"memo"},
		{"name":"参考进价","value":"0","group":"价格","editor":"text","field":"memo"},
		{"name":"零售价","value":"0","group":"价格","editor":"text","field":"memo"},
		{"name":"优惠价","value":"0","group":"价格","editor":"text","field":"memo"},
		{"name":"代理价","value":"0","group":"价格","editor":"text","field":"memo"},
		{"name":"VIP价","value":"0","group":"价格","editor":"text","field":"memo"},
		{"name":"批发价一","value":"0","group":"价格","editor":"text","field":"memo"},
		{"name":"批发价二","value":"0","group":"价格","editor":"text","field":"memo"},
		{"name":"考核价","value":"0","group":"价格","editor":"text","field":"memo"},
		{"name":"税率","value":"0.17","group":"价格","editor":"text","field":"memo","render":"percentRender"},
		{"name":"串号长度","value":"0","group":"串号","editor":"text","field":"memo"},
		{"name":"网上发布","value":"on","group":"其他","editor":{"type":"checkbox","options":{"on":"on","off":""}},"field":"memo","render":"boolRender","fieldstyle":"background-color:#ffee00;color:red;"},
		{"name":"无形商品","value":"","group":"其他","editor":{"type":"checkbox","options":{"on":"on","off":""}},"field":"memo","render":"boolRender"},
		{"name":"套装产品","value":"3","group":"其他","editor":{"type":"checkbox","options":{"on":"on","off":""}},"field":"memo","render":"boolRender"},
		{"name":"设置批次","value":"1","group":"其他","editor":{"type":"checkbox","options":{"on":"on","off":""}},"field":"memo","render":"boolRender"},
		{"name":"备注","value":"备注","group":"价格","editor":"text","field":"memo","render":"boolRender"},
		{"name":"备注","value":"","group":"其他","editor":"text","field":"memo"},
		{"name":"积分起始时间","value":"2018-04-19 16:49:26","group":"会员积分规则","editor":"datetimebox","field":"datefrom"},
		{"name":"积分结束时间","value":"2018-04-19 16:49:26","group":"会员积分规则","editor":"datetimebox","field":"dateto"},
		{"name":"积分倍数","value":"1","group":"会员积分规则","editor":"numberbox","field":"inv"},
		{"name":"积分赠送","value":"0","group":"会员积分规则","editor":"numberbox","field":"num"},
		{"name":"兑换规则","value":"1","group":"会员兑换规则","editor":"numberbox","field":"num"}
	]};
})();
%>
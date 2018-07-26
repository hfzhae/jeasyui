<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select a.isdeleted,a.updatedate,a.createdate,u.title as owner,c.title as custom,a.Organization,a.billdate,s.title as stockname,a.stock, o.title as operatorname,a.operator,i.title as InvoiceTypename,a.InvoiceType,a.InvoiceNum,a.InvoiceMemo,v.title as VIPCustomname,a.VIPCustomID,a.UUID from ' + TableName + ' a,biuser u,bicustom c,bistock s,biuser o,biInvoiceType i, biVIPCustom v where a.VIPCustomID=v.id and a.InvoiceType=i.id and a.Operator=o.id and a.Stock=s.id and a.Organization=c.id and a.owner=u.id and a.id=' + id,
		rs,
		data = [],
		isdeleted = 0, 
		updatedate = new Date(), 
		createdate = new Date(), 
		billdate = new Date(), 
		owner = '', 
		custom = '',
		Organization = 0,
		stockname = '',
		stock = 0,
		operatorname = ''
		operator = 0,
		InvoiceTypename = '',
		InvoiceType = 0,
		InvoiceNum = '',
		InvoiceMemo = '',
		VIPCustomname = '',
		VIPCustomID = 0,
		UUID = '',
		Payment = {};
	
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			isdeleted = rs('isdeleted').value;
			updatedate = rs('updatedate').value;
			billdate = rs('billdate').value;
			createdate = rs('createdate').value;
			owner = rs('owner').value;
			custom = rs('custom').value;
			Organization = rs('Organization').value;
			stockname = rs('stockname').value;
			stock = rs('stock').value;
			operatorname = rs('operatorname').value;
			operator = rs('operator').value;
			InvoiceTypename = rs('InvoiceTypename').value;
			InvoiceType = rs('InvoiceType').value;
			InvoiceNum = rs('InvoiceNum').value;
			InvoiceMemo = rs('InvoiceMemo').value;
			VIPCustomname = rs('VIPCustomname').value;
			VIPCustomID = rs('VIPCustomID').value;
			UUID = rs('UUID').value
			Payment = getPayment(id);
		}
	}
	data = {"total":11,"rows":[
		{"name":"单据号","value":id,"group":"系统生成","field":"_id","func":"",'rowstyle':'color:#999;'},
		{"name":"删除","value":isdeleted,"group":"系统生成","field":"_isdeleted","render":"boolRender",'rowstyle':'color:#999;','fieldstyle':'color:#f00;'},
		{"name":"创建时间","value":new Date(createdate).Format('yyyy-MM-dd hh:mm:ss'),"group":"系统生成","field":"_createdate",'rowstyle':'color:#999;'},
		{"name":"更新时间","value":new Date(updatedate).Format('yyyy-MM-dd hh:mm:ss'),"group":"系统生成","field":"_updatedate",'rowstyle':'color:#999;'},
		{"name":"操作员","value":owner,"group":"系统生成","field":"_owner",'rowstyle':'color:#999;'},
		{'name':'单据日期','value':new Date(billdate).Format('yyyy-MM-dd'),'group':'必填信息','editor':'datebox','field':'billdate'},
		{'name':'客户','value':custom,'group':'必填信息',"editor":{
				"type":"combogrid",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":125
				}
			},
			'field':'custom','func':''},
		{'name':'organization','value':Organization,'group':'必填信息','hidden':true,'field':'organization','func':''},
		{'name':'仓库','value':stockname,'group':'必填信息',"editor":{
				"type":"combogrid",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":127
				}
			},
			'field':'stockname','func':''},
		{'name':'stock','value':stock,'group':'必填信息','hidden':true,'field':'stock','func':''},
		{'name':'业务员','value':operatorname,'group':'必填信息',"editor":{
				"type":"combogrid",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":148
				}
			},
			'field':'operatorname','func':''},
		{'name':'operator','value':operator,'group':'必填信息','hidden':true,'field':'operator','func':''},
		{'name':'发票类型','value':InvoiceTypename,'group':'发票',"editor":{
				"type":"combogrid",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":187
				}
			},
			'field':'InvoiceTypename','func':''},
		{'name':'InvoiceType','value':InvoiceType,'group':'发票','hidden':true,'field':'InvoiceType','func':''},
		{"name":"发票号码","value":InvoiceNum,"group":"发票","editor":"text","field":"InvoiceNum"},
		{"name":"发票备注","value":InvoiceMemo,"group":"发票","editor":{"type":"textbox","options":{"buttonText":"保存"}},"field":"InvoiceMemo"},
		{'name':'会员','value':VIPCustomname,'group':'会员',"editor":{
				"type":"combogrid",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":398
				}
			},
			'field':'VIPCustomname','func':''},
		{'name':'VIPCustomID','value':VIPCustomID,'group':'会员','hidden':true,'field':'VIPCustomID','func':''},
		{"name":"UUID","value":UUID,"group":"POS",'rowstyle':'color:#999;'},
	]};
	for(var i in Payment){
		data.rows.push(Payment[i])
	}
	ebx.stdout = data;
	
	function getPayment(id){
		var data =[
			{"name":"现金","value":100,"group":"收款方式","editor":{"type":"textbox","options":{"buttonText":"保存"}},"render":"currencyRender"},
			{"name":"刷卡","value":200,"group":"收款方式","editor":{"type":"textbox","options":{"buttonText":"保存"}},"render":"currencyRender"},
			{"name":"支付宝","value":100,"group":"收款方式","editor":{"type":"textbox","options":{"buttonText":"保存"}},"render":"currencyRender"},
			{"name":"微信","value":500,"group":"收款方式","editor":{"type":"textbox","options":{"buttonText":"保存"}},"render":"currencyRender"}
		];
			
		return data;
	}
})();
%>
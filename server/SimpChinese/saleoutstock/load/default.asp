<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select a.billmemo,a.isdeleted,a.auditid,a.updatedate,a.createdate,u.title as owner,c.title as custom,a.Organization,a.billdate,s.title as stockname,a.stock, o.title as operatorname,a.operator,i.title as InvoiceTypename,a.InvoiceType,a.InvoiceNum,a.InvoiceMemo,v.title as VIPCustomname,a.VIPCustomID,a.UUID,r.title as Currencyname,a.Currency,a.Relation,sm.title as CheckTypename,a.CheckType from ' + TableName + ' a,biuser u,bicustom c,bistock s,biuser o,biInvoiceType i, biVIPCustom v,biCurrency r,biSettlement sm where a.CheckType=sm.id and r.id=a.Currency and a.VIPCustomID=v.id and a.InvoiceType=i.id and a.Operator=o.id and a.Stock=s.id and a.Organization=c.id and a.owner=u.id and a.id=' + id,
		rs,
		data = [],
		isdeleted = 0,
		auditid = 0,
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
		Payment = {},
		Currency = 0,
		Currencyname = '',
		Relation = 1,
		CheckTypename = ''
		CheckType = 0,
		billmemo = '';
	
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			isdeleted = rs('isdeleted').value;
			auditid = rs('auditid').value;
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
			VIPCustomID = ebx.validInt(rs('VIPCustomID').value);
			UUID = rs('UUID').value;
			Currencyname = rs('Currencyname').value;
			Currency = ebx.validInt(rs('Currency').value);
			Relation = ebx.validFloat(rs('Relation').value);
			CheckTypename = rs('CheckTypename').value;
			CheckType = ebx.validInt(rs('CheckType').value);
			billmemo = rs('billmemo').value;
		}
	}
	data = {"total":11,"rows":[
		{"name":"单据号","value":id,"group":"系统生成","func":"",'rowstyle':'color:#999;','field':''},
		{"name":"删除","value":isdeleted,"group":"系统生成","render":"boolRender",'rowstyle':'color:#999;','fieldstyle':'color:#f00;'},
		{"name":"审核","value":auditid,"group":"系统生成","render":"boolRender",'rowstyle':'color:#999;','fieldstyle':'color:#009;'},
		{"name":"创建时间","value":new Date(createdate).Format('yyyy-MM-dd hh:mm:ss'),"group":"系统生成",'rowstyle':'color:#999;'},
		{"name":"更新时间","value":new Date(updatedate).Format('yyyy-MM-dd hh:mm:ss'),"group":"系统生成",'rowstyle':'color:#999;'},
		{"name":"操作员","value":owner,"group":"系统生成",'rowstyle':'color:#999;'},
		{"name":"UUID","value":UUID,"group":"系统生成",'hidden':UUID==null?true:false,'rowstyle':'color:#999;'},
		{'name':'单据日期','value':new Date(billdate).Format('yyyy-MM-dd'),'group':'必填信息','editor':{
				"type":'datebox',
				"options":{
					"required":true,
					"validType":"Date",
					"hasDownArrow":false
				}
			},
			'field':'billdate'},
		{'name':'客户','value':custom,'group':'必填信息',"editor":{
				"type":"droplist",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"hasDownArrow":false,//隐藏右边得下箭头
					"required":true,
					//"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":125
				}
			},
			'field':'custom','func':''},
		{'name':'organization','value':Organization,'group':'系统生成','hidden':true,'field':'organization','func':''},
		{'name':'仓库','value':stockname,'group':'必填信息',"editor":{
				"type":"droplist",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"hasDownArrow":false,//隐藏右边得下箭头
					"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":127
				}
			},
			'field':'stockname','func':''},
		{'name':'stock','value':stock,'group':'系统生成','hidden':true,'field':'stock','func':''},
		{'name':'业务员','value':operatorname,'group':'必填信息',"editor":{
				"type":"droplist",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"hasDownArrow":false,//隐藏右边得下箭头
					"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":148
				}
			},
			'field':'operatorname','func':''},
		{'name':'operator','value':operator,'group':'系统生成','hidden':true,'field':'operator','func':''},
		{'name':'发票类型','value':InvoiceTypename,'group':'发票',"editor":{
				"type":"droplist",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"hasDownArrow":false,//隐藏右边得下箭头
					//"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":187
				}
			},
			'field':'InvoiceTypename','func':''},
		{'name':'InvoiceType','value':InvoiceType,'group':'系统生成','hidden':true,'field':'InvoiceType','func':''},
		{"name":"发票号码","value":InvoiceNum,"group":"发票","editor":{"type":"textbox","options":{"buttonText":"保存"}},"field":"InvoiceNum"},
		{"name":"发票备注","value":InvoiceMemo,"group":"发票","editor":{"type":"textbox","options":{"buttonText":"保存"}},"field":"InvoiceMemo"},
		{'name':'会员','value':VIPCustomname,'group':'会员',"editor":{
				"type":"droplist",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"hasDownArrow":false,//隐藏右边得下箭头
					//"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":398
				}
			},
			'field':'VIPCustomname','func':''},
		{'name':'VIPCustomID','value':VIPCustomID,'group':'系统生成','hidden':true,'field':'VIPCustomID','func':''},
		{'name':'币种','value':Currencyname,'group':'其他',"editor":{
				"type":"droplist",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"hasDownArrow":false,//隐藏右边得下箭头
					//"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":272
				}
			},
			'field':'Currencyname','func':''},
		{'name':'Currency','value':VIPCustomID,'group':'系统生成','hidden':true,'field':'Currency','func':''},
		{"name":"汇率","value":Relation,"group":"其他","editor":"text",'field':'Relation'},
		{'name':'结算方式','value':CheckTypename,'group':'其他',"editor":{
				"type":"droplist",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"hasDownArrow":false,//隐藏右边得下箭头
					//"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":130
				}
			},
			'field':'CheckTypename','func':''},
		{'name':'CheckType','value':CheckType,'group':'系统生成','hidden':true,'field':'CheckType','func':''},
		{"name":"备注","value":billmemo,"group":"其他","editor":"text","field":"billmemo"},

	]};
	ebx.stdout = data;
})();
%>
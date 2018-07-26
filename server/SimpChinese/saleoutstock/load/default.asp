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
		{"name":"���ݺ�","value":id,"group":"ϵͳ����","field":"_id","func":"",'rowstyle':'color:#999;'},
		{"name":"ɾ��","value":isdeleted,"group":"ϵͳ����","field":"_isdeleted","render":"boolRender",'rowstyle':'color:#999;','fieldstyle':'color:#f00;'},
		{"name":"����ʱ��","value":new Date(createdate).Format('yyyy-MM-dd hh:mm:ss'),"group":"ϵͳ����","field":"_createdate",'rowstyle':'color:#999;'},
		{"name":"����ʱ��","value":new Date(updatedate).Format('yyyy-MM-dd hh:mm:ss'),"group":"ϵͳ����","field":"_updatedate",'rowstyle':'color:#999;'},
		{"name":"����Ա","value":owner,"group":"ϵͳ����","field":"_owner",'rowstyle':'color:#999;'},
		{'name':'��������','value':new Date(billdate).Format('yyyy-MM-dd'),'group':'������Ϣ','editor':'datebox','field':'billdate'},
		{'name':'�ͻ�','value':custom,'group':'������Ϣ',"editor":{
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
		{'name':'organization','value':Organization,'group':'������Ϣ','hidden':true,'field':'organization','func':''},
		{'name':'�ֿ�','value':stockname,'group':'������Ϣ',"editor":{
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
		{'name':'stock','value':stock,'group':'������Ϣ','hidden':true,'field':'stock','func':''},
		{'name':'ҵ��Ա','value':operatorname,'group':'������Ϣ',"editor":{
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
		{'name':'operator','value':operator,'group':'������Ϣ','hidden':true,'field':'operator','func':''},
		{'name':'��Ʊ����','value':InvoiceTypename,'group':'��Ʊ',"editor":{
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
		{'name':'InvoiceType','value':InvoiceType,'group':'��Ʊ','hidden':true,'field':'InvoiceType','func':''},
		{"name":"��Ʊ����","value":InvoiceNum,"group":"��Ʊ","editor":"text","field":"InvoiceNum"},
		{"name":"��Ʊ��ע","value":InvoiceMemo,"group":"��Ʊ","editor":{"type":"textbox","options":{"buttonText":"����"}},"field":"InvoiceMemo"},
		{'name':'��Ա','value':VIPCustomname,'group':'��Ա',"editor":{
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
		{'name':'VIPCustomID','value':VIPCustomID,'group':'��Ա','hidden':true,'field':'VIPCustomID','func':''},
		{"name":"UUID","value":UUID,"group":"POS",'rowstyle':'color:#999;'},
	]};
	for(var i in Payment){
		data.rows.push(Payment[i])
	}
	ebx.stdout = data;
	
	function getPayment(id){
		var data =[
			{"name":"�ֽ�","value":100,"group":"�տʽ","editor":{"type":"textbox","options":{"buttonText":"����"}},"render":"currencyRender"},
			{"name":"ˢ��","value":200,"group":"�տʽ","editor":{"type":"textbox","options":{"buttonText":"����"}},"render":"currencyRender"},
			{"name":"֧����","value":100,"group":"�տʽ","editor":{"type":"textbox","options":{"buttonText":"����"}},"render":"currencyRender"},
			{"name":"΢��","value":500,"group":"�տʽ","editor":{"type":"textbox","options":{"buttonText":"����"}},"render":"currencyRender"}
		];
			
		return data;
	}
})();
%>
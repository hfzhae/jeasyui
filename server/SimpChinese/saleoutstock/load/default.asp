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
		{"name":"���ݺ�","value":id,"group":"ϵͳ����","func":"",'rowstyle':'color:#999;','field':''},
		{"name":"ɾ��","value":isdeleted,"group":"ϵͳ����","render":"boolRender",'rowstyle':'color:#999;','fieldstyle':'color:#f00;'},
		{"name":"���","value":auditid,"group":"ϵͳ����","render":"boolRender",'rowstyle':'color:#999;','fieldstyle':'color:#009;'},
		{"name":"����ʱ��","value":new Date(createdate).Format('yyyy-MM-dd hh:mm:ss'),"group":"ϵͳ����",'rowstyle':'color:#999;'},
		{"name":"����ʱ��","value":new Date(updatedate).Format('yyyy-MM-dd hh:mm:ss'),"group":"ϵͳ����",'rowstyle':'color:#999;'},
		{"name":"����Ա","value":owner,"group":"ϵͳ����",'rowstyle':'color:#999;'},
		{"name":"UUID","value":UUID,"group":"ϵͳ����",'hidden':UUID==null?true:false,'rowstyle':'color:#999;'},
		{'name':'��������','value':new Date(billdate).Format('yyyy-MM-dd'),'group':'������Ϣ','editor':{
				"type":'datebox',
				"options":{
					"required":true,
					"validType":"Date",
					"hasDownArrow":false
				}
			},
			'field':'billdate'},
		{'name':'�ͻ�','value':custom,'group':'������Ϣ',"editor":{
				"type":"droplist",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"hasDownArrow":false,//�����ұߵ��¼�ͷ
					"required":true,
					//"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":125
				}
			},
			'field':'custom','func':''},
		{'name':'organization','value':Organization,'group':'ϵͳ����','hidden':true,'field':'organization','func':''},
		{'name':'�ֿ�','value':stockname,'group':'������Ϣ',"editor":{
				"type":"droplist",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"hasDownArrow":false,//�����ұߵ��¼�ͷ
					"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":127
				}
			},
			'field':'stockname','func':''},
		{'name':'stock','value':stock,'group':'ϵͳ����','hidden':true,'field':'stock','func':''},
		{'name':'ҵ��Ա','value':operatorname,'group':'������Ϣ',"editor":{
				"type":"droplist",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"hasDownArrow":false,//�����ұߵ��¼�ͷ
					"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":148
				}
			},
			'field':'operatorname','func':''},
		{'name':'operator','value':operator,'group':'ϵͳ����','hidden':true,'field':'operator','func':''},
		{'name':'��Ʊ����','value':InvoiceTypename,'group':'��Ʊ',"editor":{
				"type":"droplist",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"hasDownArrow":false,//�����ұߵ��¼�ͷ
					//"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":187
				}
			},
			'field':'InvoiceTypename','func':''},
		{'name':'InvoiceType','value':InvoiceType,'group':'ϵͳ����','hidden':true,'field':'InvoiceType','func':''},
		{"name":"��Ʊ����","value":InvoiceNum,"group":"��Ʊ","editor":{"type":"textbox","options":{"buttonText":"����"}},"field":"InvoiceNum"},
		{"name":"��Ʊ��ע","value":InvoiceMemo,"group":"��Ʊ","editor":{"type":"textbox","options":{"buttonText":"����"}},"field":"InvoiceMemo"},
		{'name':'��Ա','value':VIPCustomname,'group':'��Ա',"editor":{
				"type":"droplist",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"hasDownArrow":false,//�����ұߵ��¼�ͷ
					//"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":398
				}
			},
			'field':'VIPCustomname','func':''},
		{'name':'VIPCustomID','value':VIPCustomID,'group':'ϵͳ����','hidden':true,'field':'VIPCustomID','func':''},
		{'name':'����','value':Currencyname,'group':'����',"editor":{
				"type":"droplist",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"hasDownArrow":false,//�����ұߵ��¼�ͷ
					//"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":272
				}
			},
			'field':'Currencyname','func':''},
		{'name':'Currency','value':VIPCustomID,'group':'ϵͳ����','hidden':true,'field':'Currency','func':''},
		{"name":"����","value":Relation,"group":"����","editor":"text",'field':'Relation'},
		{'name':'���㷽ʽ','value':CheckTypename,'group':'����',"editor":{
				"type":"droplist",
				"options":{
					"style":"biOpen2",
					"validType":"combogridValue",
					"hasDownArrow":false,//�����ұߵ��¼�ͷ
					//"required":true,
					"idField":"id",
					"idField":"title",
					"rownumbers":true,
					"panelWidth":250,
					"template":130
				}
			},
			'field':'CheckTypename','func':''},
		{'name':'CheckType','value':CheckType,'group':'ϵͳ����','hidden':true,'field':'CheckType','func':''},
		{"name":"��ע","value":billmemo,"group":"����","editor":"text","field":"billmemo"},

	]};
	ebx.stdout = data;
})();
%>
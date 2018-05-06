<!--# include virtual="server/public.asp" -->
<%

getData();

function getData(){
	var rs = Server.CreateObject("Adodb.Recordset"), 
		sql = 'select code as Code,title as Title,isdeleted as IsDeleted from bistock where accountid=1 order by id desc';			
	rs.open(sql, ebx.conn, 1, 1);
	var data = new Array();
	data["total"] = rs.RecordCount;
	data["rows"] = rs;
	
	ebx.stdout = data;
}


//ebx.stdout = {"total":1,"rows":[
//	{"Count":"","Code":"FI-SW-01","Title":"Koi","IsDeleted":1,"unitcost":10.00,"status":true,"listprice":36.50,"attr1":"Large","itemid":"EST-1"}
//]};

/*
ebx.stdout = {"total":10,"rows":[
	{"Count":"","Code":"FI-SW-01","Title":"Koi","IsDeleted":1,"unitcost":10.00,"status":true,"listprice":36.50,"attr1":"Large","itemid":"EST-1"},
	{"Count":"","Code":"K9-DL-01","Title":"Dalmation","IsDeleted":1,"unitcost":12.00,"status":false,"listprice":18.50,"attr1":"Spotted Adult Female","itemid":"EST-10"},
	{"Count":"","Code":"RP-SN-01","Title":"Rattlesnake","IsDeleted":1,"unitcost":12.00,"status":"","listprice":38.50,"attr1":"Venomless","itemid":"EST-11"},
	{"Count":"","Code":"RP-SN-02","Title":"Rattlesnake","IsDeleted":0,"unitcost":12.00,"status":true,"listprice":26.50,"attr1":"Rattleless","itemid":"EST-12"},
	{"Count":"","Code":"RP-LI-02","Title":"Iguana","IsDeleted":1,"unitcost":12.00,"status":"","listprice":35.50,"attr1":"Green Adult","itemid":"EST-13"},
	{"Count":"","Code":"FL-DSH-01","Title":"Manx","IsDeleted":0,"unitcost":12.00,"status":"","listprice":158.50,"attr1":"Tailless","itemid":"EST-14"},
	{"Count":"","Code":"FL-DSH-03","Title":"Manx","IsDeleted":1,"unitcost":12.00,"status":"","listprice":83.50,"attr1":"With tail","itemid":"EST-15"},
	{"Count":"","Code":"FL-DLH-02","Title":"Persian","IsDeleted":1,"unitcost":12.00,"status":"","listprice":23.50,"attr1":"Adult Female","itemid":"EST-16"},
	{"Count":"","Code":"FL-DLH-04","Title":"Persian","IsDeleted":1,"unitcost":12.00,"status":"on","listprice":89.50,"attr1":"Adult Male","itemid":"EST-17"},
	{"Count":"","Code":"AV-CB-01","Title":"Amazon Parrot","IsDeleted":1,"unitcost":92.00,"status":"","listprice":63.50,"attr1":"Adult Male","itemid":"EST-18"}
]};
*/
%>
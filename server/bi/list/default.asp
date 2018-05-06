<!--# include virtual="server/public.asp" -->
<%
(function(){
	var rs = Server.CreateObject("Adodb.Recordset"), 
		sql;
		
	switch(ebx.stdin['template']){
		case '2':
			sql = 'select p.Nvarchar3 as Barcode,p.VenderCode,p.TaxRate,p.Nvarchar4 as AUnit,isnull(p.Currency10, 0) as Relation,p.Nvarchar1 as Unit,p.AssessCost,p.Currency7 as Price, p.Currency6 as DetailPrice,p.ProductType, pc.title as ClassName, p.Nvarchar2 as Spec,p.code as Code,p.title as Title,p.isdeleted as IsDeleted from biproduct p, biproductclass pc where p.Bigint1=pc.id and p.accountid=1 order by p.id desc';
			break;
		case '3':
			sql = 'select code as Code,title as Title,isdeleted as IsDeleted from bistock where accountid=1 order by id desc';
			break;
		default:
			sql = 'select code as Code,title as Title,isdeleted as IsDeleted from biarea where accountid=1 order by id desc';
			break;
	}
	rs.open(sql, ebx.conn, 1, 1);
	var data = new Array();
	data["total"] = rs.RecordCount;
	data["rows"] = rs;
	
	ebx.stdout = data;
})();
%>
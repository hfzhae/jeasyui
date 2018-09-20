<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdin['id']){
		ebx.stdout = []; 
		return
	};
	var id = ebx.validInt(ebx.stdin['id']),
		swhere = '';
	
	if(ebx.stdin['find']){
		var	find = ebx.stdin['find'];
		if(ebx.validInt(find) > 0){
			swhere = ' and b.billid=' + find;
		}else{
			find = ebx.sqlStringEncode(find);
			swhere = " and (p.title like '%" + find + "%' or p.code like '%" + find + "%' or p.SearchCode1 like '%" + find + "%')";
		}
	}
	
	var page = {//iStart：起始行数，iLength：每页行数，iTotalLength：总行数（回调用）
			iStart: ebx.validInt(ebx.stdin['page']>1?((ebx.stdin['page'] - 1) * ebx.stdin['rows']) + 1: 1), 
			iLength: ebx.validInt(ebx.stdin['rows']), 
			iTotalLength: 0
		},
		//sql = 'select p.Currency6 as oldprice, p.id as productid,b.billid,p.code as pcode,p.title as pname,p.nvarchar2 as spec,p.nvarchar1 as unit,b.quantity,b.price,b.amount,p.taxrate,c.title as organ,b.strmemo,b.billdate from res_SO_Inv a, res_SO_InvList b,biproduct p,bicustom c where c.id=a.OrganID and a.productid=p.id and a.id=b.id and a.OrganID=' + id + swhere + ' order by b.billdate desc',
		sql = 'select p.id as productid,p.code as productcode,p.title as productname,p.nvarchar2 as spec,b.quantity,p.nvarchar1 as unit,a.relation,b.aquantity,b.aunit,p.Currency6 as oldprice,b.price,b.taxrate,inv.title as invoicetype,a.billdate,u.title as operator,s.title as stock,a.id as billtitle from bistock s, biuser u, biInvoiceType inv, bdoutstock a, bdoutstocklist b,biproduct p,bicustom c where a.auditid>0 and s.id=a.stock and u.id=a.operator and inv.id=a.invoicetype and a.billtype=1306 and c.id=a.Organization and b.productid=p.id and a.id=b.id and a.Organization=' + id + swhere + ' order by a.billdate desc',
		rs = ebx.dbx.openpage(sql, page),
		data = {"total": 0, "rows": []};//分页查询语句
		
	data["total"] = page.iTotalLength;
	data["rows"] = eval('('+ebx.convertRsToJson(rs, 1)+')');//为了分页提供总行数，所以处理了这里只传递rows内容
	data["footer"] = [{}];
	ebx.stdout = data;
})();
%>
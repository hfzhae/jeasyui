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
	var sql = 'select p.Currency6 as oldprice, p.id as productid,b.billid,p.code as pcode,p.title as pname,p.nvarchar2 as spec,p.nvarchar1 as unit,b.quantity,b.price,b.amount,p.taxrate,c.title as organ,b.strmemo,b.billdate from res_SO_Inv a, res_SO_InvList b,biproduct p,bicustom c where c.id=a.OrganID and a.productid=p.id and a.id=b.id and a.OrganID=' + id + swhere + ' order by b.billdate desc',
		rs = ebx.dbx.open(sql, 1, 1);

	ebx.stdout = rs;
})();
%>
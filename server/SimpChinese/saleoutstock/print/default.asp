<!-- #include file="../Common.asp" -->
<%
(function(){
	if(!ebx.stdin['id']){ 
		ebx.stdout = {result:0};
		return;
	}

	var id = ebx.validInt(ebx.stdin['id']);
	
	if(id == 0){
		ebx.stdout = {result:0};
		return;
	}
	
	var	data = {total:0, rows:[]},
		sql = "select bd.billdate,bd.id,bd.createdate,bd.updatedate,s.title as stocktitle,u.title as usertitle,bd.auditid,c.title as customname,bd.amount,bd.billmemo,u1.title as owner from " + TableName + " bd, bistock s, biuser u,bicustom c,biuser u1 where u1.id=bd.owner and bd.Organization=c.id and bd.stock=s.id and bd.Operator=u.id and bd.id=" + id,
		rsBD = ebx.dbx.open(sql, 1, 1),
		sqllist = 'select l.*,p.title as productname,p.code as productcode,p.nvarchar2 as Spec,p.nvarchar1 as Unit from ' + TableName + 'List l, biproduct p where l.productid=p.id and l.id=' + id +' order by l.Serial',
		rsBDlist = ebx.dbx.open(sqllist, 1, 1);
		
	if(rsBD.eof || rsBDlist.eof){
		ebx.stdout = {result:0};
		return;
	}	
	
	ebx.print.init(id)
	
	ebx.stdout['result'] = 1;//成功标记
	ebx.stdout['head'] = ebx.print.bd(rsBD, 'SaleOutStockPrinthead');//获取表头对象，利用显示式样格式化内容
	ebx.stdout['title'] = ebx.print.headerStyle.length==0?EventName:ebx.print.headerStyle;//获取单据标题，如果为空则使用common.asp中的EventName
	ebx.stdout['headtext'] = ebx.print.footerStyle;//获取显示式样里的表头（表尾式样）
	ebx.stdout['foot'] = ebx.print.bd(rsBD, 'SaleOutStockPrintfoot');//获取表尾对象，利用显示式样格式化内容
	ebx.stdout['foottext'] = ebx.print.headerStyle + ebx.print.footerStyle;//获取显示式样里的表尾（表头式样 + 表尾式样）
	ebx.stdout['liststyle'] = ebx.print.liststyle('SaleOutStockPrintList');//获取list的显示式样
	ebx.stdout['bdlist'] = rsBDlist;//list对象
	ebx.stdout['color'] = ebx.print.getColor();
	ebx.stdout['size'] = ebx.print.getSize();
})();
%>
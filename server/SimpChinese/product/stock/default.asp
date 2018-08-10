<!--# include virtual="server/public.asp" -->
<%
(function(){
	var data = {"total": 0, "rows": []},
		id = ebx.validInt(ebx.stdin['id']);
		
	if(id == 0)return(data);
	
	var page = {//iStart：起始行数，iLength：每页行数，iTotalLength：总行数（回调用）
			iStart: ebx.validInt(ebx.stdin['page']>1?((ebx.stdin['page'] - 1) * ebx.stdin['rows']) + 1: 1), 
			iLength: ebx.validInt(ebx.stdin['rows']), 
			iTotalLength: 0
		},
		sql = "select [bd].[code] as ProductCode,[bd].[title] as ProductName,[bd].[id] as [id] ,[bd].[nvarchar1] as [unit] ,[bd].[nvarchar2] as [Spec],s.title as StockName,res.productserial ,sum(res.quantity) as quantity,sum(res.amount) as amount from biproduct [bd],resProductStock res,bistock s,userstock us where us.sid=s.id and us.uid="+ebx.owner+" and res.stock=s.id and res.productid=bd.id and [bd].[isdeleted]=0 and [bd].[accountid]="+ebx.accountid+" and [bd].[id]="+id+" group by [bd].[code],[bd].[title],[bd].[id],[bd].[nvarchar1],[bd].[nvarchar2],s.title,res.productserial",
		rs = ebx.dbx.openpage(sql, page);//分页查询语句
		
	data["total"] = page.iTotalLength;
	data["rows"] = eval('('+ebx.convertRsToJson(rs, 1)+')');//为了分页提供总行数，所以处理了这里只传递rows内容
	data["footer"] = [{}];
	ebx.stdout = data;
})();
%>
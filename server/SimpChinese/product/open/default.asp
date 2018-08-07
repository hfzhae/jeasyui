<!--# include virtual="server/public.asp" -->
<%
(function(){

	var page = {//iStart：起始行数，iLength：每页行数，iTotalLength：总行数（回调用）
			iStart: ebx.validInt(ebx.stdin['page']>1?((ebx.stdin['page'] - 1) * ebx.stdin['rows']) + 1: 1), 
			iLength: ebx.validInt(ebx.stdin['rows']), 
			iTotalLength: 0
		};

	var data = {"total": 0, "rows": []},
		find = ebx.stdin['find'];
		
	if(!find){find = ''}else{find = find.replaceAll('\'', '');}
	
	var	strwhere = find.length>0?" and (bd.title like '%" + find + "%' or bd.code like '%" + find + "%' or bd.SearchCode1 like '%" + find + "%')":'',
		sql = "select [bd].[id] as [id] ,[bd].[code] as [code] ,[bd].[title] as [title] ,[bd].[nvarchar1] as [unit] ,[bd].[nvarchar2] as [Spec] ,[bd].[nvarchar3] as [nvarchar3] ,[bd].[currency7] as [price] ,[bd].[currency6] as [detailprice] ,[bd].[taxrate] as [taxrate] ,[bd].[isdeleted] as [isdeleted] ,[bd].[nvarchar1] as [nvarchar1] ,[bd].[searchcode1] as [searchcode1] ,[bd].[currency10] as [currency10] ,[bd].[nvarchar4] as [nvarchar4] ,[bd].[vendercode] as [vendercode] ,[bd].[vipcash] as [vipcash] ,1 as [quantity] from biproduct [bd] where [bd].[isdeleted]=0 and  [bd].[accountid]=1 and [bd].[isdeleted]=0 " + strwhere +" order by [ID]",
		rs = ebx.dbx.openpage(sql, page);//分页查询语句
	
	data["total"] = page.iTotalLength;
	data["rows"] = eval('('+ebx.convertRsToJson(rs, 1)+')');//为了分页提供总行数，所以处理了这里只传递rows内容
	data["footer"] = [{}];
	ebx.stdout = data;
})();
%>
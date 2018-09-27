<!--# include virtual="server/public.asp" -->
<%
(function(){
	var data = {"total": 0, "rows": []},
		id = ebx.validInt(ebx.stdIn['id']),
		listView = eval('('+ebx.stdIn['listView']+')'),
		listViewF = '';
		listViewG = '';
		
	if(id == 0){
		ebx.stdOut = data;
		return;
	}	
	for(var i in listView){
		switch(i){
			case 'productSerial':
				if(listView[i] == 1){
					listViewF += ',res.productSerial';
					listViewG += ',res.productSerial'
				}
				break;
			case 'colorSize':
				if(listView[i] == 1){
					listViewF += ',bc.title as color,bs.title as size';
					listViewG += ',bc.title,bs.title'
				}
				break;
			case 'expire':
				if(listView[i] == 1){
					listViewF += ',res.expire';
					listViewG += ',res.expire'
				}
				break;
			case 'batch':
				if(listView[i] == 1){
					listViewF += ',res.Nvarchar2 as batch';
					listViewG += ',res.Nvarchar2'
				}
				break;
			default:
				break;
		}
	}
	
	var page = {//iStart：起始行数，iLength：每页行数，iTotalLength：总行数（回调用）
			iStart: ebx.validInt(ebx.stdIn['page']>1?((ebx.stdIn['page'] - 1) * ebx.stdIn['rows']) + 1: 1), 
			iLength: ebx.validInt(ebx.stdIn['rows']), 
			iTotalLength: 0
		},
		sql = "select [bd].[code] as ProductCode,[bd].[title] as ProductName,[bd].[id] as [id] ,[bd].[nvarchar1] as [unit] ,[bd].[nvarchar2] as [Spec],s.title as StockName"+listViewF+" ,sum(res.quantity) as quantity,sum(res.amount) as amount from biproduct [bd],resProductStock res,bistock s,userstock us,biColor bc,bisize bs where res.colorid=bc.id and res.sizeid=bs.id and us.sid=s.id and us.uid="+ebx.owner+" and res.stock=s.id and res.productid=bd.id and [bd].[isDeleted]=0 and [bd].[accountId]="+ebx.accountId+" and [bd].[id]="+id+" group by [bd].[code],[bd].[title],[bd].[id],[bd].[nvarchar1],[bd].[nvarchar2],s.title"+listViewG,
		rs = ebx.dbx.openPage(sql, page);//分页查询语句
		
	data["total"] = page.iTotalLength;
	data["rows"] = eval('('+ebx.convertRsToJson(rs, 1)+')');//为了分页提供总行数，所以处理了这里只传递rows内容
	data["footer"] = [{}];
	ebx.stdOut = data;
})();
%>
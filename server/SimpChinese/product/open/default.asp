<!--# include virtual="server/public.asp" -->
<%
(function(){
	var data = {"total": 0, "rows": []},
		find = ebx.stdin['find'];
		
	if(!find){find = ''}else{find = find.replaceAll('\'', '');}
	
	if(find.length > 0){
		var sql ="select top 1 [bd].[code] as code,[bd].[title] as title,[bd].[id] as [productid] ,[bd].[code] as [productcode],[bd].[title] as [productname] ,[bd].[nvarchar1] as [unit] ,[bd].[nvarchar2] as [Spec] ,[bd].[nvarchar3] as [nvarchar3] ,[bd].[currency7] as [price] ,[bd].[currency6] as [detailprice],[bd].[currency7] as [amount] ,[bd].[taxrate] as [taxrate] ,[bd].[isdeleted] as [isdeleted] ,[bd].[nvarchar1] as [nvarchar1] ,[bd].[searchcode1] as [searchcode1] ,[bd].[currency10] as [currency10] ,[bd].[nvarchar4] as [nvarchar4] ,[bd].[vendercode] as [vendercode] ,[bd].[vipcash] as [vipcash] ,1 as [quantity],bd.LengthSerial from biproduct [bd], resProductStock res,userstock us where us.sid=res.stock and us.uid="+ebx.owner+" and res.productid=bd.id and res.ProductSerial='"+find+"' and [bd].[isdeleted]=0 and  [bd].[accountid]=1 and [bd].[isdeleted]=0",
			rs = ebx.dbx.open(sql);
			
		if(rs.eof){
			var page = {//iStart����ʼ������iLength��ÿҳ������iTotalLength�����������ص��ã�
					iStart: ebx.validInt(ebx.stdin['page']>1?((ebx.stdin['page'] - 1) * ebx.stdin['rows']) + 1: 1), 
					iLength: ebx.validInt(ebx.stdin['rows']), 
					iTotalLength: 0
				},
				strwhere = " and (bd.title like '%" + find + "%' or bd.code like '%" + find + "%' or bd.SearchCode1 like '%" + find + "%')",
				sql = "select [bd].[code] as code,[bd].[title] as title,[bd].[id] as [productid] ,[bd].[code] as [productcode] ,[bd].[title] as [productname] ,[bd].[nvarchar1] as [unit] ,[bd].[nvarchar2] as [Spec] ,[bd].[nvarchar3] as [nvarchar3] ,[bd].[currency7] as [price] ,[bd].[currency6] as [detailprice],[bd].[currency7] as [amount] ,[bd].[taxrate] as [taxrate] ,[bd].[isdeleted] as [isdeleted] ,[bd].[nvarchar1] as [nvarchar1] ,[bd].[searchcode1] as [searchcode1] ,[bd].[currency10] as [currency10] ,[bd].[nvarchar4] as [nvarchar4] ,[bd].[vendercode] as [vendercode] ,[bd].[vipcash] as [vipcash] ,1 as [quantity],bd.LengthSerial from biproduct [bd] where [bd].[isdeleted]=0 and  [bd].[accountid]=1 and [bd].[isdeleted]=0 " + strwhere +" order by [ID]",
				rs = ebx.dbx.openpage(sql, page);//��ҳ��ѯ���
				
			data["total"] = page.iTotalLength;
			data["rows"] = eval('('+ebx.convertRsToJson(rs, 1)+')');//Ϊ�˷�ҳ�ṩ�����������Դ���������ֻ����rows����
			data["footer"] = [{}];
			ebx.stdout = data;
		}else{
			//�������ֶε�rs��bin���������� 2018-8-8 zz
			var ProductSerialRS = ebx.dbx.getRs();
			ProductSerialRS.Fields.Append('ProductSerial', 200, -1);
			ProductSerialRS.open();
			ProductSerialRS.addnew();
			ProductSerialRS('ProductSerial') = find;
			ProductSerialRS.Update;
			var bin = ebx.convertRsToBin(ProductSerialRS);

			var rsEx = ebx.dbx.getRs();
			for(var i =0; i < rs.Fields.count; i++){
				rsEx.Fields.Append(rs.Fields(i).Name, rs.Fields(i).Type, rs.Fields(i).DefinedSize);
			}
			rsEx.Fields.Append('ProductSerial', 205, -1);
			rsEx.open();
			rsEx.addnew();
			while(!rs.eof){
				for(var i = 0; i < rs.Fields.count; i++){
					rsEx(rs.Fields(i).name) = rs(rs.Fields(i).name);
				}
				rs.MoveNext();
			}
			rsEx('ProductSerial') = bin;
			rsEx.update();
			//����end
			data["total"] = rsEx.Recordcount;
			data["rows"] = eval('('+ebx.convertRsToJson(rsEx, 1)+')');//Ϊ�˷�ҳ�ṩ�����������Դ���������ֻ����rows����
			data["footer"] = [{}];
			ebx.stdout = data;
		}
	}else{
		var page = {//iStart����ʼ������iLength��ÿҳ������iTotalLength�����������ص��ã�
				iStart: ebx.validInt(ebx.stdin['page']>1?((ebx.stdin['page'] - 1) * ebx.stdin['rows']) + 1: 1), 
				iLength: ebx.validInt(ebx.stdin['rows']), 
				iTotalLength: 0
			},
			sql = "select [bd].[code] as code,[bd].[title] as title,[bd].[id] as [productid] ,[bd].[code] as [productcode] ,[bd].[title] as [productname] ,[bd].[nvarchar1] as [unit] ,[bd].[nvarchar2] as [Spec] ,[bd].[nvarchar3] as [nvarchar3] ,[bd].[currency7] as [price] ,[bd].[currency6] as [detailprice],[bd].[currency7] as [amount] ,[bd].[taxrate] as [taxrate] ,[bd].[isdeleted] as [isdeleted] ,[bd].[nvarchar1] as [nvarchar1] ,[bd].[searchcode1] as [searchcode1] ,[bd].[currency10] as [currency10] ,[bd].[nvarchar4] as [nvarchar4] ,[bd].[vendercode] as [vendercode] ,[bd].[vipcash] as [vipcash] ,1 as [quantity] from biproduct [bd] where [bd].[isdeleted]=0 and  [bd].[accountid]=1 and [bd].[isdeleted]=0 order by [ID]",
			rs = ebx.dbx.openpage(sql, page);//��ҳ��ѯ���
			
		data["total"] = page.iTotalLength;
		data["rows"] = eval('('+ebx.convertRsToJson(rs, 1)+')');//Ϊ�˷�ҳ�ṩ�����������Դ���������ֻ����rows����
		data["footer"] = [{}];
		ebx.stdout = data;
	}
})();
%>
<!--# include virtual="server/public.asp" -->
<%
(function(){
	var data = {"total": 0, "rows": []},
		id = ebx.validInt(ebx.stdIn['id']);
		
	if(id == 0){
		ebx.stdOut = data;
		return;
	}
	var sql ="select cs.id,cs.title from biproduct p, bdColorSize cs where p.id="+id+" and p.ColorSizeGroup=cs.id and p.accountId="+ebx.accountId+" and cs.isDeleted=0",
		rs = ebx.dbx.open(sql, 1, 1);
		
	if(!rs.eof){
		data["total"] = rs.Recordcount;
		data["rows"] = eval('('+ebx.convertRsToJson(rs, 1)+')');
		data["footer"] = [{}];
	}
	ebx.stdOut = data;
})();
%>
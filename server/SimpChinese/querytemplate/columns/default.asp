<!-- #include file="../Common.asp" -->
<%
(function(){
	if(!ebx.stdin['id']){ 
		ebx.stdout = {total:0, rows:[]};
		return;
	}
	var id = ebx.validInt(ebx.stdin['id']);
	
	if(id == 0){ 
		ebx.stdout = {total:0, rows:[]};
		return;
	}
	
	var sql = 'select Columns from biQueryWizard where id=' + id,
		rs = ebx.dbx.open(sql, 1, 1);
	
	if(rs.eof){
		ebx.stdout = {total:0, rows:[]};
		return;
	}
	
	ebx.stdout = ebx.convertBinToRs(rs('Columns').value);
})();
%>
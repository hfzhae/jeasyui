<!-- #include file="../Common.asp" -->
<%
(function(){
	if(!ebx.stdIn['id']){ 
		ebx.stdOut = {total:0, rows:[]};
		return;
	}
	var id = ebx.validInt(ebx.stdIn['id']);
	
	if(id == 0){ 
		ebx.stdOut = {total:0, rows:[]};
		return;
	}
	
	var sql = 'select Columns from biQueryWizard where id=' + id,
		rs = ebx.dbx.open(sql, 1, 1);
	
	if(rs.eof){
		ebx.stdOut = {total:0, rows:[]};
		return;
	}
	
	ebx.stdOut = ebx.convertBinToRs(rs('Columns').value);
})();
%>
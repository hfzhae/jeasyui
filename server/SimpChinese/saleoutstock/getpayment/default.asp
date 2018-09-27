<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdIn['id']){
		ebx.stdOut = {"total": 0, "rows": []}; 
		return
	};
	var id = ebx.validInt(ebx.stdIn['id']);
	if(id == 0){
		ebx.stdOut = {"total": 0, "rows": []}; 
		return
	}
	var rs = ebx.dbx.open('select payment,amount from bdOutStockPayment where id=' + id, 1, 1);
	if(!rs.eof){
		ebx.stdOut = rs;
	}else{
		ebx.stdOut = {"total": 0, "rows": []}; 
	}
})();
%>
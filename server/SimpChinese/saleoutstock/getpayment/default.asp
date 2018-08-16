<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdin['id']){
		ebx.stdout = {"total": 0, "rows": []}; 
		return
	};
	var id = ebx.validInt(ebx.stdin['id']);
	if(id == 0){
		ebx.stdout = {"total": 0, "rows": []}; 
		return
	}
	var rs = ebx.dbx.open('select payment,amount from bdOutStockPayment where id=' + id, 1, 1);
	if(!rs.eof){
		ebx.stdout = rs;
	}else{
		ebx.stdout = {"total": 0, "rows": []}; 
	}
})();
%>
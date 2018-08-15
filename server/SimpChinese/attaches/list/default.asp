<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdin['id'] || !ebx.stdin['billtype']){
		ebx.stdout = {"total": 0, "rows": []}; 
		return
	};
	var id = ebx.validInt(ebx.stdin['id']),
		billtype = ebx.validInt(ebx.stdin['billtype']);
	
	if(id == 0 || billtype == 0){
		ebx.stdout = {"total": 0, "rows": []}; 
		return
	}
	
	var rs = ebx.dbx.open('select filename from NPAttaches where billid=' + id + ' and billtype=' + billtype, 1, 1);
	if(!rs.eof){
		var data = rs('filename').value.toString().split(','),
			rows = [];
		for(var i in data){
			rows.push({filename:data[i]});
		}
		ebx.stdout = {total: data.length, rows: rows}
	}else{
		ebx.stdout = {"total": 0, "rows": []}; 
	}
})();
%>
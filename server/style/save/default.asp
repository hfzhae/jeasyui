<!-- #include file="../Common.asp" -->
<%
(function(){
	var bd = ebx.convertJsonToRs(eval('(' + ebx.stdin['bd'] + ')')),
		bdlist = ebx.convertJsonToRs(eval('(' + ebx.stdin['bdlist'] + ')'));
	
	ebx.stdout['bd'] = {total: bd.RecordCount, rows: bd};
	ebx.stdout['bdlist'] = {total: bdlist.RecordCount, rows: bdlist};
	
	
	
	function fnSave(){
		
	}
	
	
	function saveBD(id){
		if(ebx.validInt(id) == 0)return(false);
		var rsBD = ebx.dbx.open('select * from ' +  + ' where id=' + id),
			rsBDList = ebx.dbx.open('select * from ' +  + 'list where id=' + id);
		
		
	}
})();
%>
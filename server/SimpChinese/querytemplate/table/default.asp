<!-- #include file="../Common.asp" -->
<%
(function(){
	var rs = ebx.dbx.getRs(),
		sql = 'select title ',
		ocat = Server.CreateObject('ADOX.Catalog');
		
	rs.Fields.Append('ID', 203, -1);
	rs.open();
	
	ocat.ActiveConnection = ebx.conn;
	for(var i = 0; i < ocat.Tables.count; i++){
		if(ocat.Tables(i).Type.toLowerCase() === 'table'){
			rs.AddNew()
			rs(0) = ocat.Tables(i).Name;
		}
	}
	
	ebx.stdout = rs;
})();
%>
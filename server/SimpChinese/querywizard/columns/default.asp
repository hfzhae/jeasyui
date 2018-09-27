<!-- #include file="../Common.asp" -->
<%
(function(){
	if(!ebx.stdIn['tblName']){ 
		ebx.stdOut = {total:0, rows:[]};
		return;
	}
	var rs = ebx.dbx.getRs(),
		sql = '',
		ocat = Server.CreateObject('ADOX.Catalog'),
		tblName = ebx.sqlStringEncode(ebx.stdIn['tblName']);
		
	rs.Fields.Append('title', 203, -1);
	rs.Fields.Append('type', 203, -1);
	rs.open();
	
	if(tblName.indexOf('select') < 0){
		ocat.ActiveConnection = ebx.conn;
		for(var i = 0; i < ocat.Tables(tblName).Columns.count; i++){
			rs.AddNew()
			rs(0) = ocat.Tables(tblName).Columns(i).Name;
			rs(1) = GetDataType(ocat.Tables(tblName).Columns(i).Type);
		}
	}
	ebx.stdOut = rs;
	
	function GetDataType(n){
		switch(ebx.validInt(n)){
			case 16:
			case 2:
			case 3:
			case 20:
			case 17:
			case 18:
			case 19:
			case 21:
			case 4:
			case 5:
			case 6:
			case 14:
			case 131:
			case 11:
				return 'numeric';
				break;
			case 7:
			case 133:
			case 134:
			case 135:
			case 64:
				return 'date';
				break;
			default:
				return 'string';
				break;
		}
	}
})();
%>
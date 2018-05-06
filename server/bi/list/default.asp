<!--# include virtual="server/public.asp" -->
<%
(function(){
	var rs = Server.CreateObject("Adodb.Recordset"), 
		sql;
		
	switch(ebx.stdin['template']){
		case '2':
			sql = 'select code as Code,title as Title,isdeleted as IsDeleted,nvarchar1 from biproduct where accountid=1 order by id desc';
			break;
		case '3':
			sql = 'select code as Code,title as Title,isdeleted as IsDeleted from bistock where accountid=1 order by id desc';
			break;
		default:
			sql = 'select code as Code,title as Title,isdeleted as IsDeleted from biarea where accountid=1 order by id desc';
			break;
	}
	rs.open(sql, ebx.conn, 1, 1);
	var data = new Array();
	data["total"] = rs.RecordCount;
	data["rows"] = rs;
	
	ebx.stdout = data;
})();
%>
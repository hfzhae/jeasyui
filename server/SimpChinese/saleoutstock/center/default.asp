<!-- #include file="../Common.asp" -->
<%
(function(){
	if(!ebx.stdIn['id']){ 
		ebx.stdOut = {total:0, rows:[]};
		return;
	}

	var id = ebx.validInt(ebx.stdIn['id']),
		data = new Array(),
		sql = 'select l.*,p.title as productname,p.code as productcode,p.nvarchar2 as Spec,p.nvarchar1 as Unit from ' + TableName + 'List l, biproduct p where l.productid=p.id and l.id=' + id +' order by l.Serial',
		rs = ebx.dbx.open(sql, 1, 1);

	ebx.stdOut = rs;
})();
%>
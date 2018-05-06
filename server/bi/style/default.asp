<!--# include virtual="server/public.asp" -->
<%
(function(){
	var style = ebx.stdin['style'];
	if(style.length > 0){
		var rs = Server.CreateObject("Adodb.Recordset"), 
			sql = 'select l.SetHeaderText as title,l.field,l.width,l.fieldstyle,l.render, 1 as sortable, 1 as search from bdStyle bd, bdStyleList l where not l.Field=\'#Count\' and bd.title=\'' + style + '\' and bd.id=l.id and bd.isdeleted=0 order by Serial';			
		rs.open(sql, ebx.conn, 1, 1);
		ebx.stdout['data'] = rs;
	}
})();
%>
<!--# include virtual="server/public.asp" -->
<%
getStyle();

function getStyle(){
	var style = ebx.stdin['style'];
	
	if(style.length > 0){
		var rs = Server.CreateObject("Adodb.Recordset"), 
			sql = 'select l.SetHeaderText as title,l.Field,l.width,l.fieldstyle,l.Render, 1 as sortable from bdStyle bd, bdStyleList l where not l.Field=\'#Count\' and bd.title=\'' + style + '\' and bd.id=l.id and bd.isdeleted=0 order by Serial';			
		rs.open(sql, ebx.conn, 1, 1);
		ebx.stdout['data'] = rs;
	}
}
%>
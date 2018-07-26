<!--# include virtual="server/public.asp" -->
<%
(function(){
	var style = ebx.stdin['style'];
	if(style.length > 0){
		var sql = 'select l.SetFooterText as foot,l.SetHeaderText as title, Lower(l.field) as field,l.width,l.fieldstyle,l.render, 1 as sortable, 1 as search,case when Editable=1 then \'text\' else \'\' end as editor from bdStyle bd, bdStyleList l where not l.Field=\'#Count\' and bd.title=\'' + style + '\' and bd.id=l.id and bd.isdeleted=0 order by Serial',
			rs = ebx.dbx.open(sql, 1, 1);
		ebx.stdout['data'] = eval('('+ebx.convertRsToJson(rs, 1)+')');;
		
		var sql = 'select title,Type,FieldStyle,HeaderStyle,FooterStyle,Border,Header,Footer,Height,Width from bdStyle where title=\'' + style + '\' and isdeleted=0',
			rs = ebx.dbx.open(sql, 1, 1);
		ebx.stdout['bd'] = eval('('+ebx.convertRsToJson(rs, 1)+')');;
	}
})();
%>
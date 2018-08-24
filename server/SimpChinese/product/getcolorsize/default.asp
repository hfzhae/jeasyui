<!--# include virtual="server/public.asp" -->
<%
(function(){
	var data = {"total": 0, "rows": []},
		id = ebx.validInt(ebx.stdin['id']);
		
	if(id == 0){
		ebx.stdout = data;
		return;
	}
	var sqlSize = "select s.title, s.id from bdColorSizeList l,bisize s where l.ColorSizeID=s.id and l.id="+id+" and l.Type=1",
		rsSize = ebx.dbx.open(sqlSize, 1, 1),
		sqlColor = "select c.title, c.id from bdColorSizeList l,biColor c where l.ColorSizeID=c.id and l.id="+id+" and l.Type=0",
		rsColor = ebx.dbx.open(sqlColor, 1, 1);

	if(!rsSize.eof){
		var rsSize1 = ebx.dbx.getRs();
		var stylerows = [
			{field:'colorid',title:'colorid',"hidden":true},
			{field:'color',title:'ÑÕÉ«/³ßÂë'}
		];
		rsSize1.Fields.Append('colorid', 203, -1);
		rsSize1.Fields.Append('color', 203, -1);
		while(!rsSize.eof){
			rsSize1.Fields.Append('size_' +rsSize('id').value, 203, -1);
			stylerows.push({editor:'text',field:'size_'+rsSize('id').value,fieldstyle:'text-align:right;',title:rsSize('title').value,width:60});
			rsSize.MoveNext();
		}
		rsSize1.open();
	}else{
		var rsSize1 = ebx.dbx.getRs();
		var stylerows = [
			{field:'colorid',fieldstyle:'',title:'colorid',hidden:true},
			{field:'color',fieldstyle:'',title:'ÑÕÉ«/³ßÂë'}
		];
		rsSize1.Fields.Append('colorid', 203, -1);
		rsSize1.Fields.Append('color', 203, -1);
		rsSize1.Fields.Append('size_0', 203, -1);
		stylerows.push({editor:'text',field:'size_0',fieldstyle:'text-align:right;',title:'Í¨Âë',width:60});
		rsSize1.open();
	}
	
	var style = {"total":stylerows.length,"rows":stylerows}
	
	if(!rsColor.eof){
		while(!rsColor.eof){
			rsSize1.AddNew();
			rsSize1('colorid') = rsColor('id').value;
			rsSize1('color') = rsColor('title').value;
			rsColor.MoveNext();
		}
	}

	data["style"] = style
	data["total"] = rsSize1.Recordcount;
	data["rows"] = eval('('+ebx.convertRsToJson(rsSize1, 1)+')');
	data["footer"] = [{}];
	ebx.stdout = data;
})();
%>
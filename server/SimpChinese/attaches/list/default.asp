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
	
	var rs = ebx.dbx.open('select billid,billtype,filename from NPAttaches where billid=' + id + ' and billtype=' + billtype, 1, 1);
	
	if(!rs.eof){
		var data = rs('filename').value.toString().split(','),
			rows = [],
			filesize = 0,
			fso = Server.CreateObject('Scripting.FileSystemObject'),
			path = NetBox.MapPath('\\jeasyui\\attaches\\');
			
		path += rs('billtype').value +'\\'+ rs('billid').value +'\\';
		for(var i in data){
			if(fso.fileExists(path + data[i])){
				filesize=ebx.bytesToSize(fso.GetFile(path + data[i]).size);
				fileupdatedata = fso.GetFile(path + data[i]).DateLastModified
				rows.push({
					filename:data[i],
					size:filesize,
					uploaddate:new Date(fileupdatedata).Format("yyyy-MM-dd hh:mm:ss")
				});
			}
		}
		ebx.stdout = {total: data.length, rows: rows}
	}else{
		ebx.stdout = {"total": 0, "rows": []}; 
	}
})();
%>
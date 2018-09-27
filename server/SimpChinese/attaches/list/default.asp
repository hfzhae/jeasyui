<!--# include virtual="server/public.asp" -->
<%
(function(){
	if(!ebx.stdIn['id'] || !ebx.stdIn['billType']){
		ebx.stdOut = {"total": 0, "rows": []}; 
		return
	};
	var id = ebx.validInt(ebx.stdIn['id']),
		billType = ebx.validInt(ebx.stdIn['billType']);
	
	if(id == 0 || billType == 0){
		ebx.stdOut = {"total": 0, "rows": []}; 
		return
	}
	
	var rs = ebx.dbx.open('select billid,billType,filename from NPAttaches where billid=' + id + ' and billType=' + billType, 1, 1);
	
	if(!rs.eof){
		var data = rs('filename').value.toString().split(','),
			rows = [],
			filesize = 0,
			fso = Server.CreateObject('Scripting.FileSystemObject'),
			path = NetBox.MapPath('\\wwwroot\\attaches\\');
			
		path += rs('billType').value +'\\'+ rs('billid').value +'\\';
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
		ebx.stdOut = {total: data.length, rows: rows}
	}else{
		ebx.stdOut = {"total": 0, "rows": []}; 
	}
})();
%>
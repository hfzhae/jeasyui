<!--# include virtual="server/public.asp" -->
<%
dim style, StdIn, ParametStr, Paramet

FormSize = Request.TotalBytes
FormData = Request.BinaryRead(FormSize)
ParametStr = stream_binarytostring(FormData, "")

set Paramet = parseJSON(ParametStr)
'response.write Paramet.obj.d.e
'response.end

Function parseJSON(str)'将json文本转换成对象
    Dim scriptCtrl    
    If Not IsObject(scriptCtrl) Then
        Set scriptCtrl = Server.CreateObject("MSScriptControl.ScriptControl")
        scriptCtrl.Language = "JScript"
        scriptCtrl.AddCode "Array.prototype.get = function(x) { return this[x]; }; var result = null;"
    End If
    scriptCtrl.ExecuteStatement "result = " & str & ";"
    Set parseJSON = scriptCtrl.CodeObject.result
End Function  
	
function stream_binarytostring(binary, charset)'用adodb.stream获取requet内容
	const adtypetext = 2
	const adtypebinary = 1
	dim binarystream
	set binarystream = createobject("adodb.stream")

	binarystream.type = adtypebinary
	binarystream.open
	binarystream.write binary
	binarystream.position = 0
	binarystream.type = adtypetext
	if len(charset) > 0 then
		binarystream.charset = charset
	else
		binarystream.charset = "us-ascii"
	end if
	stream_binarytostring = binarystream.readtext
end function 

style = Paramet.style

set Paramet = nothing
select case style
Case "product1"
%>
[[
	{"field":"itemid","title":"编号","width":80,"sortable":true},
	{"field":"productname","title":"名称","width":100,"sortable":true},
	{"field":"nvarchae1","title":"规格","width":100,"sortable":true},
	{"field":"productClass","title":"产品类型","width":100,"sortable":true},
	{"field":"date","title":"日期","width":100,"sortable":true},
	{"field":"status","title":"删除","width":60,"align":"center","sortable":true,"render":"boolRender"}
]]
<%
Case "stock1"
%>
[[
	{"field":"itemid","title":"编号","width":80,"sortable":true},
	{"field":"productname","title":"名称","width":200,"sortable":true},
	{"field":"date","title":"更新日期","width":100,"sortable":true},
	{"field":"status","title":"删除","width":60,"align":"center","sortable":true,"render":"boolRender","fieldstyle":"background-color:#789;color:#ffffff;"}
]]
<%
Case "droplist"
%>
[[
	{"field":"inv","title":"编号","width":80,"search":true},
	{"field":"name","title":"名称","width":120,"search":true}
]]
<%
Case Else
	dim rs, sql, result, render
	set rs = Server.CreateObject("Adodb.Recordset")
	sql = "select l.SetHeaderText,l.Field,l.width,l.FieldStyle,l.Render from bdStyle bd, bdStyleList l where bd.title='" & style & "' and bd.id=l.id and bd.isdeleted=0 order by Serial"
	rs.open sql, conn, 1, 1
	result = "[["

	if not rs.eof then
		do while not rs.eof
			if rs("Field").value = "#Count" then rs.movenext
			render = rs("Render").value
			if rs("Field").value = "Title" then render = "color:#ff0000;"
			result = result & "{""field"":""" & rs("Field").value & """,""title"":""" & escape(rs("SetHeaderText").value) & """,""width"":" & rs("width").value & ",""render"":""" & render & """,""fieldstyle"":""" & rs("FieldStyle").value & """,""sortable"":true},"
			rs.movenext
		loop
	end if
	result = left(result, len(result) - 1)
	result = result & "]]"
	response.write result
end select
%>
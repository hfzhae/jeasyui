<!--# include virtual="server/public.asp" -->
<%
response.write getStyle()

function getStyle()
	getStyle = "["
	
	dim style, ParametStr, Paramet, FormSize, FormData

	FormSize = Request.TotalBytes
	FormData = Request.BinaryRead(FormSize)
	ParametStr = stream_binarytostring(FormData, "")

	set Paramet = parseJSON(ParametStr)

	style = Paramet.style
	
	if len(style) > 0 then
		dim rs, sql, render, FieldStyle
		set rs = Server.CreateObject("Adodb.Recordset")
		sql = "select l.SetHeaderText as title,l.Field,l.width,l.fieldstyle,l.Render, 1 as sortable from bdStyle bd, bdStyleList l where not l.Field='#Count' and bd.title='" & style & "' and bd.id=l.id and bd.isdeleted=0 order by Serial"
		rs.open sql, conn, 1, 1
		if not rs.eof then
			getStyle = getStyle & convertRsToJson(rs)
		end if
	end if
	
	getStyle = getStyle & "]"

	set Paramet = nothing
end function

%>
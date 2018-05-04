<%
Dim conn, Paramet

Initialize

sub Initialize()
	dim ParametStr, FormSize, FormData
	if Request.ServerVariables("Request_Method")="POST" then 'post的form
		FormSize = Request.TotalBytes
		FormData = Request.BinaryRead(FormSize)
		ParametStr = stream_binarytostring(FormData, "")

		if len(ParametStr) > 0 then
			set Paramet = parseJSON(ParametStr)
		end if
	else
		
	end if
	
	Set conn = Server.CreateObject("ADODB.Connection")
	conn.open Application("DateBase.ConnectString")
end sub

function parseJSON(str)'将json文本转换成对象 2018-5-4 zz
	if len(str) = 0 then exit function
	Dim scriptCtrl  
	If Not IsObject(scriptCtrl) Then
		Set scriptCtrl = Server.CreateObject("MSScriptControl.ScriptControl")
		scriptCtrl.Language = "JScript"
		scriptCtrl.AddCode "Array.prototype.get = function(x) { return this[x]; }; var result = null;"
	End If
	scriptCtrl.ExecuteStatement "result = " & str & ";"
	Set parseJSON = scriptCtrl.CodeObject.result
End function  
	
function stream_binarytostring(binary, charset)'用adodb.stream获取requet内容 2018-5-4 zz
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

function convertRsToJson(rs)'将rs对象转化成json文本 2018-5-4 zz
	convertRsToJson = "["
	dim s:s = ""
	if not rs.eof then 
		dim fields, i, sup_temp:set fields = rs.Fields
		if len(sup) > 0 then
			sup_temp = sup & ","
		end if
		rs.movefirst
		do while not rs.eof
			s = s & "{"
			for i = 0 to fields.Count - 1
				s = s & """" & LCase(fields(i).name) & """:" & getType(fields(i), sup) & "," & sup_temp
			next
			s = left(s, len(s) - 1)
			s = s & "},"
		rs.movenext
		loop
		s = left(s, len(s) - 1)
	end if
	convertRsToJson = convertRsToJson & s & "]"
end function

function escapeEx(str)'判断是否汉字字符，如果是用escapt编码加密 2018-5-4 zz
	escapeEx = str
	if len(str) <= 0 or isNull(str) then exit function
	dim hlen
	hlen=int(0)
	
	for i=1 to len(str)
		tmpascii=asc(mid(str,i,1))
		if tmpascii<0 or tmpascii>255 then
			hlen=hlen+1
		end if
	next
	
	if hlen > 0 then
		escapeEx = escape(str)
	end if
end function

function getType(Fields, sup)'数据类型判断函数，Fields：字段rs.Fields对象，sup：补充字段，返回针对类型处理后的值
	getType=""
	dim v : v = escapeEx(Fields.value)
	select case Fields.type
		case "202" :
			getType= """"&v&"""" '"文本"
		case "203" :
			getType= """"&v&"""" '"备注"
		case "3" :
			getType= v '"长整型"
		case "2" :
			getType= v '"整型"
		case "17" :
			getType= v '"字节"
		case "3" :
			getType= v '"长整型"
		case "4" :
			getType= v '"单精浮点"
		case "5" :
			getType= v '"双精浮点"
		case "3" :
			getType= v '"长整型"
		case "72" :
			getType= v '"同步复制ID"
		case "131" :
			getType= v '"小数"
		case "135" :
			getType= """"&v&"""" '"日期/时间"
		case "6" :
			getType= v '"货币"
		case "11" :
			getType= """"&v&"""" '"是/否"
		case "205" :
			getType= "[" & convertRsToJson(convertBinToRs(v)) & "]" '"OLE对象" 处理数据库里的rs对象二级制存储数据
	end select
end function

Function convertBinToRs(sBin)'二进制流转换成rs对象
	dim stm, rs
	Set stm = CreateObject("adodb.stream")
	stm.type = 1
	stm.Open
	stm.Write sBin
	stm.position = 0
	Set rs = CreateObject("adodb.recordset")
	rs.open stm
	set convertBinToRs = rs
End Function 

Function convertRsToBin(rs)'rs对象转换成二进制流
	dim stm
	convertRsToBin = Null
	if IsNull(rs) then exit function
	if typeName(rs)<>"Recordset" then exit function
	if rs.recordcount =0 then exit function
 	Set stm = CreateObject("adodb.stream")
	stm.type = 1
	stm.Open
	rs.save stm
	stm.position = 0
	convertRsToBin = stm.read
End Function 
%>

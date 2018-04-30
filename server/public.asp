<%
Dim conn
Set conn = Server.CreateObject("ADODB.Connection")
conn.open Application("DateBase.ConnectString")
%>

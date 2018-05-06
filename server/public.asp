<!--# include virtual="server/ebx.asp" -->
<%
ebx.Initialize();
function OnScriptEnd(){ebx.OnPageEnd(Response);}//页面结束时调用函数
%>

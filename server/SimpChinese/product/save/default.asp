<!-- #include file="../Common.asp" -->
<!-- #include virtual="/server/savebi.asp" -->
<%
(function(){
	ebx.savebi.init(TableName, ModType, IGID);
	ebx.savebi.save();
})();
%>
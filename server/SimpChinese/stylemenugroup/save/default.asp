<!-- #include file="../Common.asp" -->
<!-- #include virtual="/server/savebd.asp" -->
<%
(function(){
	ebx.savebd.init(TableName, ModType, IGID);
	ebx.savebd.save();
})();
%>
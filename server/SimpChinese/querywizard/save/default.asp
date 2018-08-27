<!-- #include file="../Common.asp" -->
<%
(function(){
	ebx.saveBD.init(TableName, ModType, IGID);
	ebx.saveBD.save();
})();
%>
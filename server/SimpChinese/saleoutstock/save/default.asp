<!-- #include file="../Common.asp" -->
<%
(function(){
	ebx.saveBD.init(TableName, ModType);
	ebx.saveBD.save();
})();
%>
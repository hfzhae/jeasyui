<!-- #include file="../Common.asp" -->
<!-- #include virtual="/server/undeleted.asp" -->
<%
(function(){
	ebx.undeleted.init(TableName);
	ebx.undeleted.deleted();
})();
%>
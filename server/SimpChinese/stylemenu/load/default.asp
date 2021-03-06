<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdIn["id"]),
		sql = "select a.MenuModule,a.isDeleted,a.updatedate,a.createdate,u.title as owner from bdStyleMenu a left join biuser u on a.owner=u.id where a.id=" + id,
		rs,
		data = [],
		title = "", isDeleted = 0, updatedate = new Date(), createdate = new Date(), owner = "";
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			title = rs("MenuModule").value;
			isDeleted = rs("isDeleted").value;
			updatedate = rs("updatedate").value;
			createdate = rs("createdate").value;
			owner = rs("owner").value
		}
	}
	data = {total:5,rows:[
		{name:"删除",value:isDeleted,group:"系统生成",field:"",render:"boolRender",func:"",rowstyle:"color:#999;",fieldstyle:"color:#f00;"},
		{name:"创建时间",value:new Date(createdate).Format("yyyy-MM-dd hh:mm:ss"),group:"系统生成",rowstyle:"color:#999;"},
		{name:"更新时间",value: new Date(updatedate).Format("yyyy-MM-dd hh:mm:ss"),group:"系统生成",rowstyle:"color:#999;"},
		{name:"操作员",value:owner,group:"系统生成",rowstyle:"color:#999;"},
		{name:"模块名称",value:title,group:"必填信息",editor:{type:"validatebox", options:{required:true,validType:"LetterInteger"}},field:"MenuModule"},//validatebox校验录入值合法性的支持方法
	]};
	ebx.stdOut = data;
})();
%>
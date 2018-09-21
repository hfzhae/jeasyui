<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin["id"]),
		sql = "select a.MenuGroupName,a.MenuGroupTitle,a.isdeleted,a.updatedate,a.createdate,u.title as owner from " + TableName + " a,biuser u where a.owner=u.id and a.id=" + id,
		rs,
		data = [],
		title = "", type = "", isdeleted = 0, updatedate = new Date(), createdate = new Date(), owner = "";
	
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1);
		if(!rs.eof){
			title = rs("MenuGroupName").value;
			type = rs("MenuGroupTitle").value;
			isdeleted = rs("isdeleted").value;
			updatedate = rs("updatedate").value;
			createdate = rs("createdate").value;
			owner = rs("owner").value
		}
	}
	data = {total:6,rows:[
		{name:"删除",value:isdeleted,group:"系统生成",field:"",render:"boolRender",func:"",rowstyle:"color:#999;",fieldstyle:"color:#f00;"},
		{name:"创建时间",value:new Date(createdate).Format("yyyy-MM-dd hh:mm:ss"),group:"系统生成",rowstyle:"color:#999;"},
		{name:"更新时间",value:new Date(updatedate).Format("yyyy-MM-dd hh:mm:ss"),group:"系统生成",rowstyle:"color:#999;"},
		{name:"操作员",value:owner,group:"系统生成",rowstyle:"color:#999;"},
		{name:"菜单组",value:title,group:"必填信息",editor:{type:"validatebox", options:{required:true,validType:"LetterInteger"}},field:"MenuGroupName"},//validatebox校验录入值合法性的支持方法
		{name:"显示名称",value:type,group:"必填信息",editor:{type:"validatebox", options:{required:true,validType:"String"}},field:"MenuGroupTitle"}
	]};
	ebx.stdout = data;
})();
%>
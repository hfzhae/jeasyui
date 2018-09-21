<!-- #include file="../Common.asp" -->
<%
(function(){
//debugger;
	var id = ebx.validInt(ebx.stdin["id"]),
		sql = "select a.code,a.title,a.isdeleted,a.updatedate,a.createdate,u.title as owner,a.relation,a.baseid from " + TableName + " a,biuser u where a.owner=u.id and a.id=" + id,
		rs,
		data = [],
		code = "", title = "", isdeleted = 0, updatedate = new Date(), createdate = new Date(), owner = "",relation=0,baseid=0;
	
	
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1);
		if(!rs.eof){
			code = rs("code").value;
			title = rs("title").value;
			isdeleted = rs("isdeleted").value;
			updatedate = rs("updatedate").value;
			createdate = rs("createdate").value;
			owner = rs("owner").value;
			relation=rs("relation").value;
			baseid=rs("baseid").value;
		}
	}

	data = {"total":9,"rows":[
		{"name":"删除","value":isdeleted,"group":"系统生成","field":"_isdeleted","render":"boolRender","rowstyle":"color:#999;","fieldstyle":"color:#f00;","func":""},
		{"name":"创建时间","value": new Date(createdate).Format("yyyy-MM-dd hh:mm:ss"),"group":"系统生成","rowstyle":"color:#999;"},
		{"name":"更新时间","value": new Date(updatedate).Format("yyyy-MM-dd hh:mm:ss"),"group":"系统生成","rowstyle":"color:#999;"},
		{"name":"操作员","value":owner,"group":"系统生成","rowstyle":"color:#999;"},
		{"name":"编号","value":code,"group":"必填信息","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"code","func":"cbRSNotNullAndNotRepeatCheck"},//validatebox校验录入值合法性的支持方法
		{"name":"名称","value":title,"group":"必填信息","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"title","func":""},//validatebox校验录入值合法性的支持方法
		{"name":"核算关系","value":relation,"group":"核算关系(外币=核算关系：本币)","editor":{"type":"validatebox", "options":{"required":true,"validType":"money"}},"field":"relation","func":""},
		{"name":"本币","value":"元","group":"核算关系(外币=核算关系：本币)","func":""},
		{"name":"baseid","value":baseid,"group":"系统生成","field":"baseid","hidden":true,"func":""}
	]};
	ebx.stdout = data;
})();
%>
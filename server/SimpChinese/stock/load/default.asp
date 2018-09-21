<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin["id"]),
		sql = "select a.code,a.title,a.MemoInfo,a.VIPDateFrom,a.VIPDateTo,a.VIPPoints,a.VIPCoefficient,a.isdeleted,a.int1,a.updatedate,a.createdate,u.title as owner  from " + TableName + " a,biuser u where a.owner=u.id and a.id=" + id,
		rs,
		data = [],
		code = "", title = "", MemoInfo = "", VIPDateFrom = new Date(), VIPDateTo = new Date(), VIPPoints = 0, VIPCoefficient = 0, isdeleted = 0, int1 = 0, updatedate = new Date(), createdate = new Date(), owner = "";
		
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			code = rs("code").value;
			title = rs("title").value;
			MemoInfo = rs("MemoInfo").value;
			VIPDateFrom = rs("VIPDateFrom").value;
			VIPDateTo = rs("VIPDateTo").value;
			VIPPoints = rs("VIPPoints").value;
			VIPCoefficient = rs("VIPCoefficient").value;
			isdeleted = rs("isdeleted").value;
			int1 = rs("int1").value;
			updatedate = rs("updatedate").value;
			createdate = rs("createdate").value;
			owner = rs("owner").value
		}
	}
	
	data = {"total":8,"rows":[
		{"name":"int1","value":int1,"group":"系统生成","field":"int1","hidden":true,"func":""},
		{"name":"删除","value":isdeleted,"group":"系统生成","field":"_isdeleted","render":"boolRender","rowstyle":"color:#999;","fieldstyle":"color:#f00;"},
		{"name":"创建时间","value": new Date(createdate).Format("yyyy-MM-dd hh:mm:ss"),"group":"系统生成","field":"_createdate","rowstyle":"color:#999;"},
		{"name":"更新时间","value": new Date(updatedate).Format("yyyy-MM-dd hh:mm:ss"),"group":"系统生成","field":"_updatedate","rowstyle":"color:#999;"},
		{"name":"操作员","value":owner,"group":"系统生成","field":"_owner","rowstyle":"color:#999;"},
		{"name":"编号","value":code,"group":"必填信息","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"code","func":"cbRSNotNullAndNotRepeatCheck"},
		{"name":"名称","value":title,"group":"必填信息","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"title","func":"cbRSDirectPy"},
		{"name":"备注","value":MemoInfo,"group":"其他","editor":"text","field":"MemoInfo"},
		{"name":"积分起始时间","value":new Date(VIPDateFrom).Format("yyyy-MM-dd hh:mm:ss"),"group":"会员相关","editor":{
				"type":"datetimebox",
				"options":{
					"hasDownArrow":false
				}
			},"field":"VIPDateFrom"},
		{"name":"积分结束时间","value":new Date(VIPDateTo).Format("yyyy-MM-dd hh:mm:ss"),"group":"会员相关","editor":{
				"type":"datetimebox",
				"options":{
					"hasDownArrow":false
				}
			},
			"field":"VIPDateTo"},
		{"name":"积分倍数","value":VIPPoints,"group":"会员相关","editor":{"type":"validatebox", "options":{"required":true,"validType":"Number"}},"field":"VIPPoints"},
		{"name":"积分赠送","value":VIPCoefficient,"group":"会员相关","editor":{"type":"validatebox", "options":{"required":true,"validType":"Number"}},"field":"VIPCoefficient"}
	]};

	ebx.stdout = data;
})();
%>
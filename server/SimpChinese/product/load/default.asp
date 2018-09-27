<!-- #include file="../Common.asp" -->
<%
(function(){
    var id = ebx.validInt(ebx.stdIn["id"]),
		sql = "select a.code,a.title,a.isDeleted,a.updatedate,a.createdate,u.title owner,a.bigint1 productclassid,bipc.title productclass,a.[Nvarchar2],a.[Nvarchar1],a.[Nvarchar3],a.[Nvarchar4],a.[Currency1],a.[Currency2],a.[Currency3],a.[Currency4],a.[Currency5],a.[Currency6],a.[Currency7],a.[Currency8],a.[Currency9],a.[Currency10],a.[TaxRate],a.[ProductType],a.[IsGroup],a.[ColorSizeGroup],a.[MemoInfo],a.[MadeIn],a.[OriginMade],a.[VenderCode],a.[Material],a.[Price],a.[WebFlag],a.[pProfile],a.[WebID],a.[bAttaches],a.[FromFlag],a.[AssessCost],a.[code1],a.[code2],a.[code3],a.[code4],a.[code5],a.[code6],a.[code7],a.[LengthSerial],a.[Batch],a.[VIPPoints],a.[VIPDateFrom],a.[VIPDateTo],a.[VIPCoefficient],a.[VIPCash],isnull(bdcs.title,'') ColorSizeGroupText from " + TableName + " a left join  bdcolorSize bdcs on a.ColorSizeGroup =bdcs.id,biuser u,biproductclass bipc where  a.bigint1=bipc.id and a.owner=u.id and a.id=" + id,
		rs,
		data = [],
		code = "", title = "", isDeleted = 0, updatedate = new Date(), createdate = new Date(),owner="",bigint1=0,productclass="",Nvarchar2="",Material="",Nvarchar3="",Nvarchar4="",Currency10=0,Nvarchar1="",Madein="",OriginMade="",VenderCode="",Currency7=0,Currency6=0,Currency5=0,Currency1=0,Currency4=0,Currency2=0,Currency3=0,AssessCost=0,TaxRate=0.16,LengthSerial=0,pProfile="",MemoInfo="",WebFlag=0,ProductType=0,IsGroup=0,VIPDateFrom=new Date(),VIPDateTo=new Date(),VIPCoefficient=1,VIPPoints=0,VIPCash=0,Batch=0,ColorSizeGroup=0,ColorSizeGroupText="";	
	
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1);
		if(!rs.eof){
			code = rs("code").value;
			title = rs("title").value;
			isDeleted = rs("isDeleted").value;
			updatedate = rs("updatedate").value;
			createdate = rs("createdate").value;
			owner = rs("owner").value;
			bigint1=rs("productclassid").value;
			productclass=rs("productclass").value;
			Nvarchar2=rs("Nvarchar2").value;
			Material=rs("Material").value;
			Nvarchar3=rs("Nvarchar3").value;
			Nvarchar4=rs("Nvarchar4").value;
			Currency10=rs("Currency10").value;
			Nvarchar1=rs("Nvarchar1").value;
			Madein=rs("Madein").value;
			OriginMade=rs("OriginMade").value;
			VenderCode=rs("VenderCode").value;
			Currency7=rs("Currency7").value;
			Currency6=rs("Currency6").value;
			Currency5=rs("Currency5").value;
			Currency1=rs("Currency1").value;
			Currency4=rs("Currency4").value;
			Currency2=rs("Currency2").value;
			Currency3=rs("Currency3").value;
			AssessCost=rs("AssessCost").value;
			ColorSizeGroup=rs("ColorSizeGroup").value;
			ColorSizeGroupText=rs("ColorSizeGroupText").value;
			TaxRate=rs("TaxRate").value;
			LengthSerial=rs("LengthSerial").value;
			pProfile=rs("pProfile").value;
			MemoInfo=rs("MemoInfo").value;
			WebFlag=rs("WebFlag").value;
			Batch=rs("Batch").value;
			VIPCoefficient=rs("VIPCoefficient").value;
			VIPPoints=rs("VIPPoints").value;
			VIPDateFrom=rs("VipDateFrom").value;
			VIPDateTo=rs("VIpDateTo").value;
			VIPCash=rs("VIPCash").value;
			IsGroup=rs("IsGroup").value;
			ProductType=rs("ProductType").value;
		}
	}
	
	data = {"total":40,"rows":[
		{"name":"删除","value":isDeleted,"group":"系统生成","field":"_isDeleted","render":"boolRender","rowstyle":"color:#999;","fieldstyle":"color:#f00;","func":""},
		{"name":"创建时间","value": new Date(createdate).Format("yyyy-MM-dd hh:mm:ss"),"group":"系统生成","field":"_createdate","rowstyle":"color:#999;"},
		{"name":"更新时间","value": new Date(updatedate).Format("yyyy-MM-dd hh:mm:ss"),"group":"系统生成","field":"_updatedate","rowstyle":"color:#999;"},
		{"name":"操作员","value":owner,"group":"系统生成","field":"_owner","rowstyle":"color:#999;"},
		{"name":"编号","value":code,"group":"必填信息","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"code","func":"cbRSNotNullAndNotRepeatCheck"},
		{"name":"名称","value":title,"group":"必填信息","editor":{"type":"validatebox", "options":{"required":true,"validType":"String"}},"field":"title"},
		{"name":"产品类型","value":productclass,"group":"必填信息","editor":{"type":"droplist","options":{"style":"biOpen2","validType":"combogridValue","required":true,"idField":"id","idField":"title","rownumbers":true,"panelWidth":250,"template":117}},"field":"productclass"},
		{"name":"bigint1","value":bigint1,"group":"系统生成","field":"bigint1","hidden":true,"func":""},
		{"name":"规格","value":Nvarchar2,"group":"基本信息","editor":"text","field":"Nvarchar2"},
		{"name":"材质","value":Material,"group":"基本信息","editor":"text","field":"Material"},
		{"name":"条码","value":Nvarchar3,"group":"基本信息","editor":"text","field":"Nvarchar3"},
		{"name":"辅助单位","value":Nvarchar4,"group":"单位关系(辅助单位=换算关系：单位)","editor":{"type":"validatebox", "options":{"required":false,"validType":"String"}},"field":"Nvarchar4","func":""},
		{"name":"换算关系","value":Currency10,"group":"单位关系(辅助单位=换算关系：单位)","editor":{"type":"validatebox", "options":{"required":false,"validType":"Integer"}},"field":"Currency10","func":""},
		{"name":"单位","value":Nvarchar1,"group":"单位关系(辅助单位=换算关系：单位)","editor":"text","field":"Nvarchar1"},		
		{"name":"产地","value":Madein,"group":"基本信息","editor":"text","field":"Madein"},
		{"name":"原产地","value":OriginMade,"group":"基本信息","editor":"text","field":"OriginMade"},
		{"name":"厂方编号","value":VenderCode,"group":"基本信息","editor":"text","field":"VenderCode"},
		{"name":"参考进价","value":Currency7,"group":"价格","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"Currency7","func":""},
		{"name":"零售价","value":Currency6,"group":"价格","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"Currency6","func":""},
		{"name":"优惠价","value":Currency5,"group":"价格","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"Currency5","func":""},
		{"name":"代理价","value":Currency1,"group":"价格","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"Currency1","func":""},
		{"name":"VIP价","value":Currency4,"group":"价格","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"Currency4","func":""},
		{"name":"批发价一","value":Currency2,"group":"价格","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"Currency2","func":""},
		{"name":"批发价二","value":Currency3,"group":"价格","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"Currency3","func":""},
		{"name":"考核价","value":AssessCost,"group":"价格","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"AssessCost","func":""},
		{"name":"税率","value":TaxRate,"group":"价格","editor":{"type":"validatebox", "options":{"required":false,"validType":"TaxRate"}},"field":"TaxRate","func":"","render":"percentRender"},
		{"name":"串号长度","value":LengthSerial,"group":"串号","editor":{"type":"validatebox", "options":{"required":false,"validType":"Integer"}},"field":"LengthSerial","func":""},
		{"name":"颜色尺码","value":ColorSizeGroupText,"group":"颜色尺码","editor":{"type":"droplist","options":{"style":"biOpen2","validType":"combogridValue","required":false,"idField":"id","idField":"title","rownumbers":true,"panelWidth":250,"template":230}},"field":"ColorSizeGroupText","func":"cbClearCS"},
		{"name":"ColorSizeGroup","value":ColorSizeGroup,"group":"系统生成","field":"ColorSizeGroup","hidden":true,"func":""},
		{"name":"产品介绍","value":pProfile,"group":"产品介绍","editor":{"type":"textbox","options":{"multiline":true,"height":"80px"}},"field":"pProfile"},
		{"name":"详细说明","value":MemoInfo,"group":"产品介绍","editor":{"type":"textbox","options":{"multiline":true,"height":"80px"}},"field":"MemoInfo"},
		{"name":"网上发布","value":WebFlag,"group":"其他","editor":{"type":"checkbox", "options":{"on":"1","off":"0"}},"field":"WebFlag","render":"boolRender"},
		{"name":"无形商品","value":ProductType,"group":"其他","editor":{"type":"checkbox","options":{"on":"1","off":"0"}},"field":"ProductType","render":"boolRender"},
		{"name":"套装产品","value":IsGroup,"group":"其他","editor":{"type":"checkbox","options":{"on":"1","off":"0"}},"field":"IsGroup","render":"boolRender"},
		{"name":"设置批次","value":Batch,"group":"其他","editor":{"type":"checkbox","options":{"on":"1","off":"0"}},"field":"Batch","render":"boolRender"},
		{"name":"积分起始时间","value":new Date(VIPDateFrom).Format("yyyy-MM-dd hh:mm:ss"),"group":"会员积分规则","editor":{"type":"datetimebox","options":{"required":true,"validType":"Datetime","hasDownArrow":false}},"field":"VIPDateFrom"},
		{"name":"积分结束时间","value":new Date(VIPDateTo).Format("yyyy-MM-dd hh:mm:ss"),"group":"会员积分规则","editor":{"type":"datetimebox","options":{"required":true,"validType":"Datetime","hasDownArrow":false}},"field":"VIPDateTo"},
		{"name":"积分倍数","value":VIPCoefficient,"group":"会员积分规则","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"VIPCoefficient","func":""},
		{"name":"积分赠送","value":VIPPoints,"group":"会员积分规则","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"VIPPoints","func":""},
		{"name":"兑换规则","value":VIPCash,"group":"会员兑换规则","editor":{"type":"validatebox", "options":{"required":false,"validType":"Money"}},"field":"VIPCash","func":""}
	]};
	
	ebx.stdOut = data;
	
})();

%>
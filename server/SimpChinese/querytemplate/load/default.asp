<!-- #include file="../Common.asp" -->
<%
(function(){
	var id = ebx.validInt(ebx.stdin['id']),
		sql = 'select a.title,a.isdeleted,a.updatedate,a.createdate,u.title as owner,Privilege,WizardID,w.title as Wizard from ' + TableName + ' a,biQueryWizard w,biuser u where a.WizardID=w.id and a.owner=u.id and a.id=' + id,
		rs,
		data = [],
		title = '', 
		isdeleted = 0, 
		updatedate = new Date(), 
		createdate = new Date(), 
		owner = '',
		Privilege = '',
		WizardID = 0,
		Wizard = '';
		
	if(id > 0){
		rs = ebx.dbx.open(sql, 1, 1)
		if(!rs.eof){
			title = rs('title').value;
			isdeleted = rs('isdeleted').value;
			updatedate = rs('updatedate').value;
			createdate = rs('createdate').value;
			owner = rs('owner').value;
			Privilege = rs('Privilege').value;
			WizardID = rs('WizardID').value;
			Wizard = rs('Wizard').value;
		}
	}
	
	data = {total:6,rows:[
		{name:'ID',value:id,group:'系统生成',field:'',render:'',func:'',rowstyle:'color:#999',fieldstyle:''},
		{name:'删除',value:isdeleted,group:'系统生成',field:'_isdeleted',render:'boolRender',func:'',rowstyle:'color:#999;',fieldstyle:'color:#f00;'},
		{name:'创建时间',value:new Date(createdate).Format('yyyy-MM-dd hh:mm:ss'),group:'系统生成',rowstyle:'color:#999;'},
		{name:'更新时间',value: new Date(updatedate).Format('yyyy-MM-dd hh:mm:ss'),group:'系统生成',rowstyle:'color:#999;'},
		{name:'操作员',value:owner,group:'系统生成',rowstyle:'color:#999;'},
		{name:'名称',value:title,group:'必填信息',editor:{type:'validatebox', options:{required:true,validType:'string'}},field:'title'},//validatebox校验录入值合法性的支持方法
		{name:'查询设计',value:Wizard,group:'必填信息',editor:{type:'droplist', options:{
				style:'QueryWizard',
				validType:'combogridValue',
				required:true,
				idField:'title',
				//textField:'title',
				//rownumbers:true,
				panelWidth:300,
				template:395
			}
		},field:'wizard'},//validatebox校验录入值合法性的支持方法
		{name:'WizardID',value:WizardID,group:'系统生成',hidden:true,field:'wizardid'},//validatebox校验录入值合法性的支持方法
		{name:'权限',value:Privilege,group:'其他',editor:'text',field:'privilege'}//validatebox校验录入值合法性的支持方法
	]};
	ebx.stdout = data;
})();
%>
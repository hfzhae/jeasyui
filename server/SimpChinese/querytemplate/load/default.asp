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
		{name:'ID',value:id,group:'ϵͳ����',field:'',render:'',func:'',rowstyle:'color:#999',fieldstyle:''},
		{name:'ɾ��',value:isdeleted,group:'ϵͳ����',field:'_isdeleted',render:'boolRender',func:'',rowstyle:'color:#999;',fieldstyle:'color:#f00;'},
		{name:'����ʱ��',value:new Date(createdate).Format('yyyy-MM-dd hh:mm:ss'),group:'ϵͳ����',rowstyle:'color:#999;'},
		{name:'����ʱ��',value: new Date(updatedate).Format('yyyy-MM-dd hh:mm:ss'),group:'ϵͳ����',rowstyle:'color:#999;'},
		{name:'����Ա',value:owner,group:'ϵͳ����',rowstyle:'color:#999;'},
		{name:'����',value:title,group:'������Ϣ',editor:{type:'validatebox', options:{required:true,validType:'string'}},field:'title'},//validateboxУ��¼��ֵ�Ϸ��Ե�֧�ַ���
		{name:'��ѯ���',value:Wizard,group:'������Ϣ',editor:{type:'droplist', options:{
				style:'QueryWizard',
				validType:'combogridValue',
				required:true,
				idField:'title',
				//textField:'title',
				//rownumbers:true,
				panelWidth:300,
				template:395
			}
		},field:'wizard'},//validateboxУ��¼��ֵ�Ϸ��Ե�֧�ַ���
		{name:'WizardID',value:WizardID,group:'ϵͳ����',hidden:true,field:'wizardid'},//validateboxУ��¼��ֵ�Ϸ��Ե�֧�ַ���
		{name:'Ȩ��',value:Privilege,group:'����',editor:'text',field:'privilege'}//validateboxУ��¼��ֵ�Ϸ��Ե�֧�ַ���
	]};
	ebx.stdout = data;
})();
%>
<!--# include virtual="server/public.asp" -->
<%
(function(){
	var nav = [
			{
				menu:'ConceptUIWindowManage',
				text:'开始',
				img:'/client/images/NavigationICON/start.png',
				children:[]
			},{
				menu:'Guide.Sales',
				text:'销售',
				img:'/client/images/NavigationICON/DatabaseQueryNew.png',
				children:[]
			},{
				menu:'Guide.Receive',
				text:'收款',
				img:'/client/images/NavigationICON/AccountingFormat.png',
				children:[]
			},{
				menu:'Guide.Purchase',
				text:'采购',
				img:'/client/images/NavigationICON/CreateReport.png',
				children:[]
			},{
				menu:'Guide.Payment',
				text:'付款',
				img:'/client/images/NavigationICON/CalculateNow.png',
				children:[]
			},{
				menu:'Guide.Stock',
				text:'仓储',
				img:'/client/images/NavigationICON/CreateClassModule.png',
				children:[]
			},{
				menu:'Guide.Cash',
				text:'财务',
				img:'/client/images/NavigationICON/TotalsMenu.png',
				children:[]
			},{
				menu:'Guide.VIP',
				text:'会员',
				img:'/client/images/NavigationICON/CreateTableTemplatesGallery.png',
				children:[]
			},{
				menu:'Guide.Setup',
				text:'设置',
				img:'/client/images/NavigationICON/CreateFormInDesignView.png',
				children:[]
			},{
				menu:'Guide.Website',
				text:'系统',
				img:'/client/images/NavigationICON/PageMenu.png',
				children:[]
			}
		],
		strNav = (function(){
			var s = '';
			for(var i in nav){
				s += '\'' + nav[i].menu + '\',';
			}
			s = s.substr(0, s.length-1);
			return s;
		})(),
		sql = 'select bd.MenuModule, mg.MenuGroupTitle,mg.id from bdStyleMenu bd, bdStyleMenulist l,bdStyleMenuGroup mg where l.MenuGroupID=mg.id and bd.id=l.id and bd.MenuModule in (' + strNav + ')',
		rs = ebx.dbx.open(sql, 1, 1);
		
	while(!rs.eof){
		for(var i in nav){
			if(nav[i].menu.toLowerCase() === rs('MenuModule').value.toLowerCase()){
				nav[i].children.push({menuid:rs('id').value,text:rs('MenuGroupTitle').value,children:[]});
			}
		}
		rs.MoveNext();
	}
	sql = 'select mgl.MenuModule as mode,mgl.Provider,bd.MenuModule, mgl.id,mgl.Serial,mgl.MenuName,mg.MenuGroupTitle from bdStyleMenu bd, bdStyleMenulist l,bdStyleMenuGroup mg,bdStyleMenuGroupList mgl where mg.id=mgl.id and l.MenuGroupID=mg.id and bd.id=l.id and bd.MenuModule in (' + strNav + ')',
	rs = ebx.dbx.open(sql);

	while(!rs.eof){
		for(var i in nav){
			if(nav[i].menu.toLowerCase() === rs('MenuModule').value.toLowerCase()){
				for(var j in nav[i].children){
					if(nav[i].children[j].text === rs('MenuGroupTitle').value){
						var paramet = rs('Provider').value,
							style = '',
							edit = '',
							template = 0,
							paramets = {
								menuid:rs('id').value.toString() + '_' + rs('Serial').value.toString(),
								text:rs('MenuName').value,
								mode:rs('mode').value.toString().toLowerCase()
							};
						if(paramet){
							paramet = paramet.toLowerCase().split(';');
							
							
							
							for(var k in paramet){
								if(paramet[k].split('=')[0]){
									paramets[paramet[k].split('=')[0].toLowerCase()] = paramet[k].split('=')[1]?paramet[k].split('=')[1].toString().toLowerCase():1;
								}
							}
						}
						nav[i].children[j].children.push(paramets);
					}
				}
			}
		}
		rs.MoveNext();
	}
	ebx.stdOut = nav;
})();
%>

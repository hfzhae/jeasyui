<%
/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/8/20
打印服务器端对象
*****************************************************************/
ebx.print = {
	rsBDTemplate:0,
	rsBDListTemplate:0,
	rsBDHeadStyle:'',
	rsBDFootStyle:'',
	rsBDListStyle:'',
	printing: function(options){//入口函数，参数：options：打印参数字典（区分大小写）
	/*
	参数字典：
	rsBDTemplate：表头查询模板
	rsBDListTemplate：明细查询模板
	rsBDHeadStyle：表头显示式样
	rsBDFootStyle：表尾显示式样
	rsBDListStyle：明细显示式样
	*/
		try{
			if(!ebx.stdIn['findid']){ //为了配合查询模板必须使用findid作为单据id的参数名
				ebx.stdOut = {result:0};
				return;
			}
			if(ebx.validInt(ebx.stdIn['findid']) == 0){
				ebx.stdOut = {result:0};
				return;
			}
			this.rsBDTemplate = ebx.validInt(options.rsBDTemplate);//表头查询模板
			this.rsBDListTemplate = ebx.validInt(options.rsBDListTemplate);//明细查询模板
			this.rsBDHeadStyle = ebx.sqlStringEncode(options.rsBDHeadStyle);//表头显示式样
			this.rsBDFootStyle = ebx.sqlStringEncode(options.rsBDFootStyle);//表尾显示式样
			this.rsBDListStyle = ebx.sqlStringEncode(options.rsBDListStyle);//明细显示式样
			return this.printData();
		}catch(e){
			ebx.stdOut = {result:0, msg: e.message};
		}
		
	},
	headerStyle: '',
	footerStyle: '',
	border: 1,
	header:1,
	footer:1,
	listWidth:100,
	headWidth:100,
	footWidth:100,
	headHeight: 0,
	printData: function(){//获取打印数据
		var	sql = ebx.getTemplateSQL(this.rsBDTemplate),
			rsBD = ebx.dbx.open(sql, 1, 1),
			sqllist = ebx.getTemplateSQL(this.rsBDListTemplate ),
			rsBDlist = ebx.dbx.open(sqllist, 1, 1),
			data = {};
			
		if(rsBD.eof || rsBDlist.eof){
			ebx.stdOut = {result:0};
			return;
		}	

		data['result'] = 1;//成功标记
		data['head'] = this.bd(rsBD, this.rsBDHeadStyle);//获取表头对象，利用显示式样格式化内容
		data['title'] = this.headerStyle;//获取单据标题，必须在ebx.print.bd后获取
		data['headText'] = this.footerStyle;//获取显示式样里的表头（表尾式样），必须在ebx.print.bd后获取
		data['headWidth'] = ebx.validInt(this.headWidth, 100);//表头宽度，数字会在客户端被转换成百分数，默认100%，必须在ebx.print.bd
		data['headHeight'] = ebx.validInt(this.headHeight, 0);//表头距离上边距的距离像素值，默认0，必须在ebx.print.bd
		data['foot'] = this.bd(rsBD, this.rsBDFootStyle);//获取表尾对象，利用显示式样格式化内容
		data['footText'] = this.headerStyle + '<br>' + this.footerStyle;//获取显示式样里的表尾（表头式样 + 表尾式样）
		data['footWidth'] = ebx.validInt(this.footWidth, 100);//表尾宽度，数字会在客户端被转换成百分数，默认100%，必须在ebx.print.bd
		data['listStyle'] = this.listStyle(this.rsBDListStyle);//获取list的显示式样
		data['border'] = ebx.validInt(this.border, 1);//list边框，必须在ebx.print.listStyle后获取
		data['header'] = ebx.validInt(this.header, 1);//是否显示list表头，必须在ebx.print.listStyle后获取
		data['footer'] = ebx.validInt(this.footer, 1);//是否显示合计表尾，必须在ebx.print.listStyle后获取
		data['listWidth'] = ebx.validInt(this.listWidth, 100);//表格宽度，数字会在客户端被转换成百分数，默认100%，必须在ebx.print.listStyle后获取
		data['bdList'] = rsBDlist;//list对象
		data['color'] = this.getColor();//获取颜色列表
		data['size'] = this.getSize();//获取尺码列表
		ebx.stdOut = data;

	},
	bd: function(rsBD, printstyle){
		if(printstyle.length === 0)return([]);
		if(typeof(rsBD) != 'object')return([]);
		if(rsBD.eof)return([]);
		
		var sql = "select bd.HeaderStyle,bd.FooterStyle,l.Field,l.Width,l.fieldStyle,l.SetHeaderText,Render,bd.width as bdwidth,bd.height as headHeight from bdStyle bd, bdStylelist l where bd.id=l.id and bd.title='"+printstyle+"' order by l.Serial",
			rs = ebx.dbx.open(sql, 1, 1),
			fields = rsBD.Fields,
			data = [];
		
		if(rs.eof)return([]);
		while(!rs.eof){
			this.headerStyle = rs('HeaderStyle').value
			this.footerStyle = rs('FooterStyle').value
			this.headWidth = rs('bdwidth').value
			this.footWidth = rs('bdwidth').value
			this.headHeight = rs('headHeight').value
			var t = {}
			for(var i = 0; i < fields.Count; i++){
				t['name'] = rs('SetHeaderText').value;
				if(rs('Field').value.toLowerCase() === fields(i).name.toLowerCase()){
					t['value'] = this.getType(rsBD(fields(i).name));
				}
				t['width'] = rs('Width').value + '%';
				t['style'] = rs('fieldStyle').value;
				t['render'] = rs('Render').value;
			}
			data.push(t);
			rs.MoveNext();
		}
		
		return data;
	},
	listStyle: function(printstyle){
		if(printstyle.length === 0)return([]);
		var sql = "select bd.HeaderStyle,bd.FooterStyle,l.Field,l.Width,l.fieldStyle,l.SetHeaderText,l.Render,l.SetFooterText,bd.border,bd.header,bd.footer,bd.Width as listWidth from bdStyle bd, bdStylelist l where bd.id=l.id and bd.title='"+printstyle+"' order by l.Serial",
			rs = ebx.dbx.open(sql, 1, 1),
			data = [];
		
		if(rs.eof)return([]);
		while(!rs.eof){
			this.border = rs('border').value
			this.header = rs('header').value
			this.footer = rs('footer').value
			this.listWidth = rs('listWidth').value
			var t = {};
			t['field'] = rs('Field').value;
			t['name'] = rs('SetHeaderText').value;
			t['width'] = rs('Width').value + '%';
			t['style'] = rs('fieldStyle').value;
			t['render'] = rs('Render').value;
			t['foot'] = ebx.validInt(rs('SetFooterText').value);
			data.push(t);
			rs.MoveNext();
		}
		return data;
	},
	getColor:function(){
		return rs = ebx.dbx.open("select id,title from biColor where accountId="+ebx.accountId,1,1);
	},
	getSize:function(){
		return rs = ebx.dbx.open("select id,title from biSize where accountId="+ebx.accountId,1,1);
	},
	getType: function(Fields){ //数据类型判断函数，Fields：字段rs.Fields对象，返回针对类型处理后的值
		var v = ebx.escapeEx(Fields.value)
		switch(Fields.type){
			case 200:
				return v; //"文本"
			case 202:
				return v; //"文本"
				break;
			case 203:
				return(ebx.validString(v)); //"备注"
				break;
			case 3:
				return(ebx.validInt(v)); //"长整型"
				break;
			case 2:
				return(ebx.validInt(v)); //"整型"
				break;
			case 17:
				return(ebx.validInt(v)); //"字节"
				break;
			case 3:
				return(ebx.validInt(v)); //"长整型"
				break;
			case 4:
				return(ebx.validFloat(v)); //"单精浮点"
				break;
			case 5:
				return(ebx.validFloat(v)); //"双精浮点"
				break;
			case 3:
				return(ebx.validInt(v)); //"长整型"
				break;
			case 72:
				return(ebx.validInt(v)); //"同步复制ID"
				break;
			case 131:
				return(ebx.validFloat(v)); //"小数"
				break;
			case 135:
				return(new Date(v).Format('yyyy-MM-dd hh:mm:ss')); //"日期/时间"
				break;
			case 6:
				return(ebx.validFloat(v)); //"货币"
				break;
			case 11:
				return(v); //"是/否"
				break;
			case 205:
				//return(ebx.convertRsToJson(ebx.convertBinToRs(v))); //"OLE对象" 处理数据库里嵌套的rs对象二级制存储数据
				break;
			default:
				return(v); //"其他"
				break;
		}
	}
};
%>

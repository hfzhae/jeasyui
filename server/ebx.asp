<% @debug=on
/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/5/6
*****************************************************************/
var ebx = {
	init: function(){
		Date.prototype.Format = function (fmt) { //author: meizz 
			var o = {
				"M+": this.getMonth() + 1, //月份 
				"d+": this.getDate(), //日 
				"h+": this.getHours(), //小时 
				"m+": this.getMinutes(), //分 
				"s+": this.getSeconds(), //秒 
				"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
				"S": this.getMilliseconds() //毫秒 
			};
			if (/(y+)/.test(fmt)) {
				fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
			}
			for (var k in o)
				if (new RegExp("(" + k + ")").test(fmt)) 
					fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		}
		String.prototype.replaceAll = function(s1,s2){ 
			return(this.replace(new RegExp(s1,"gm"),s2)); 
		}
		this.IDGen.init(0);
		this.Accountid = 1;//读取账套ID，待处理。。。
		this.Owner = 1;//读取登陆用户ID，待处理。。。
	},
	conn: [],
	Accountid: 0,
	Owner: 0,
	stdin: new Array(),
	stdout: new Array(),
	parseToJson: function (json_data){//Json格式转对象
		eval("var o=" + json_data);
		return(o);
	},
	getRequestParamet: function(s){//get参数格式转对象
		var arr = s.split('&'),
			d = new Array();
		if(arr.length <= 0) return(d);
		for(var i in arr){
			d[arr[i].split('=')[0]] = arr[i].split('=')[1];
		}
		return(d);
	},
	validFloat: function(f, def){//浮点格式化
		var n = parseFloat(f);
		if (isNaN(n)){
			return((def==undefined)?0:def);
		}else{
			return(n);
		}
	},
	validInt: function (i, def){//整形格式化
		var n = parseInt(i);
		if (isNaN(n)){
			return((def==undefined)?0:def);
		}else{
			return(n);
		}
	},
	sqlStringEncode: function (s){
		if(s == undefined) return('');
		return(s.replaceAll("'", "''"));
	},
	sqlstrTtodate: function (num) {//sql的日期文本格式化
        //Fri Oct 31 18:00:00 UTC+0800 2008  
        num=num+"";
        var date="";
        var month=new Array();
        month["Jan"]=1;
		month["Feb"]=2;
		month["Mar"]=3;
		month["Apr"]=4;
		month["May"]=5;
		month["Jun"]=6;
        month["Jul"]=7;
		month["Aug"]=8;
		month["Sep"]=9;
		month["Oct"]=10;
		month["Nov"]=11;
		month["Dec"]=12;
        var week = new Array();
        week["Mon"]="1";
		week["Tue"]="2";
		week["Wed"]="3";
		week["Thu"]="4";
		week["Fri"]="5";
		week["Sat"]="6";
		week["Sun"]="7";
        str=num.split(" ");
        date=str[5]+"-";
        date=date+month[str[1]]+"-"+str[2]+" "+str[3];
        //date=date+" 周"+week[str[0]];
        return(date);
	},
	Initialize: function (){
		var ParametStr, FormSize, FormData, Paramet
		if(Request.ServerVariables('Request_Method') == 'POST' ){ //post
			FormSize = Request.TotalBytes;
			FormData = Request.BinaryRead(FormSize);
			ParametStr = ebx.stream_binarytostring(FormData, '');
			ParametStr = ParametStr.replaceAll('\\+', ' ');//把jquery的ajax传递时空格转换成的加号替换成空格
			if(typeof(ParametStr) == 'string'){
				if(ParametStr.length > 0){
					try{
						var Paramet = ebx.parseToJson(ParametStr);
						ebx.convertObjToDic(ebx.stdin, ebx.UnescapeJson(Paramet));
						//ebx.convertObjToDic(ebx.stdin, unescape(decodeURI(Paramet)));
						
					}catch(e){
						if(e.name == 'SyntaxError'){
							ebx.stdin = ebx.UnescapeJson(ebx.getRequestParamet(ParametStr));
							//ebx.stdin = unescape(decodeURI(ebx.getRequestParamet(ParametStr)));
						}
					}
				}
			}
		}else{ //get
			ParametStr = Request.ServerVariables("QUERY_STRING")(1);
			if(typeof(ParametStr) == 'string'){
				ebx.stdin = ebx.UnescapeJson(ebx.getRequestParamet(ParametStr));
				//ebx.stdin = unescape(decodeURI(ebx.getRequestParamet(ParametStr)));
			}
		}
		ebx.conn = Server.CreateObject('ADODB.Connection');
		ebx.conn.open(Application('DateBase.ConnectString'));
	},
	stream_binarytostring: function (binary, charset){//用adodb.stream获取requet内容 2018-5-4 zz
		var binarystream = Server.CreateObject('adodb.stream');

		binarystream.type = 1
		binarystream.open
		binarystream.write(binary)
		binarystream.position = 0
		binarystream.type = 2
		
		if(charset.length > 0){
			binarystream.charset = charset
		}else{
			binarystream.charset = 'us-ascii'
		}
		return(binarystream.readtext);
	},
	convertObjToDic: function(dic, obj){//将Json转换成object的对象转换成可嵌套的字典对象 2018-5-5 zz
		if(typeof(obj) == 'object'){
			for(var i in obj){
				if(typeof(obj[i]) == 'object'){
					var d = new Array();
					ebx.convertObjToDic(d, obj[i]);
					dic[i] = d;
				}else{
					dic[i] = obj[i];
				}
			}
		}
	},
	convertRsToJson: function(rs){//将rs对象转化成json文本 2018-5-4 zz
		if(typeof(rs) != 'object')return('[]');
		if(rs.RecordCount == undefined)return('[]');
		if(rs.RecordCount == 0)return('[]');
		var s = '';
		rs.MoveFirst();
		if(!rs.eof){ 
			var fields = rs.Fields;
				
			rs.MoveFirst();
			while(!rs.eof){
				s += '{';
				for(var i = 0; i < fields.Count; i++){
					var comma = ',';
					if(i >= (fields.Count - 1)) comma = '';
					s += '"' + fields(i).name.toLowerCase() + '":' + ebx.getType(fields(i)) + comma;
				}
				//s = s.substr(0, s.length - 1);//效率太低，禁用了
				s += '},';
				rs.MoveNext();
			}
			s = s.substr(0, s.length - 1);
		}
		return('[' + s + ']');
	},
	convertJsonToRs: function (d){//json对象转换成rs，number类型由于其他行不确定内容，所以用文本类型创建，参数：d：json对象 2018-5-16 zz
		var rs = ebx.dbx.getRs();
		if(typeof(d) != 'object')return(rs);
		
		if(!d.total)return(rs);
		
		for(var i in d.rows[0]){
			switch(typeof(d.rows[0][i])){
				case 'string':
					rs.Fields.Append(i, 203, -1);
					break;
				case 'object':
					rs.Fields.Append(i, 205);
					break;
				case 'number':
					rs.Fields.Append(i, 203, -1);//数字类型无法确定其他行的内容，所以按文本类型创建
					//rs.Fields.Append(i, 6);
					break;
				case 'boolean':
					rs.Fields.Append(i, 11);
					break;
				case 'function':
					rs.Fields.Append(i, 205);
					break;
				case undefined:
					rs.Fields.Append(i, 203);
					break;
			}
		}
		rs.open();

		if(d.firstRows){//判断是否有分页，如果有分页，获取全部数据对象；
			var rows = d.firstRows;
		}else{
			var rows = d.rows;
		}

		for(var i in rows){
			rs.AddNew()
			var fields = rs.Fields;
			for(var j = 0; j < fields.Count; j++){
				switch(typeof(rows[i][fields(j).name])){
					case 'string':
						rs(fields(j).name) = rows[i][fields(j).name];
						break;
					case 'object':
						rs(fields(j).name) = ebx.convertRsToBin(convertJsonToRs(rows[i][fields(j).name]));//处理嵌套rs
						break;
					case 'number':
						rs(fields(j).name) = ebx.validFloat(rows[i][fields(j).name]);
						break;
					case 'boolean':
						rs(fields(j).name) = rows[i][fields(j).name];
						break;
					case 'function':
						rs(fields(j).name) = rows[i][fields(j).name];
						break;
					case undefined:
						rs(fields(j).name) = '';
						break;
				}
			}
		}
		rs.Update();
		return rs;
	},
	getType: function(Fields){ //数据类型判断函数，Fields：字段rs.Fields对象，返回针对类型处理后的值
		var v = ebx.escapeEx(Fields.value)
		switch(Fields.type){
			case 200:
				return('"' + v + '"'); //"文本"
			case 202:
				return('"' + v + '"'); //"文本"
				break;
			case 203:
				return('"' + v + '"'); //"备注"
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
				return('"' + ebx.sqlstrTtodate(v) + '"'); //"日期/时间"
				//return '"' + v + '"'; //"日期/时间"
				break;
			case 6:
				return(ebx.validFloat(v)); //"货币"
				break;
			case 11:
				return('"' + v + '"'); //"是/否"
				break;
			case 205:
				return(ebx.convertRsToJson(ebx.convertBinToRs(v))); //"OLE对象" 处理数据库里嵌套的rs对象二级制存储数据
				break;
			default:
				return('"' + v + '"'); //"其他"
				break;
		}
	},
	escapeEx: function(str){ //判断是否字符，如果是用escapt编码加密 2018-5-4 zz
		if(str == null) return('');
		
		//if(/^[\u3220-\uFA29]+$/.test(str)){//中文正则
		if(typeof(str) == 'string'){
			//return escape(str);
			//return ebx.GB2312ToUTF8(str);
			return str;
		}else{
			return(str);
		}
	},
	unescapeEx: function(str){ //判断是否字符，如果是用escapt编码加密 2018-5-4 zz
		if(str == null) return('');
		
		//if(/^[\u3220-\uFA29]+$/.test(str)){//中文正则
		if(typeof(str) == 'string'){
			return unescape(decodeURI(str));
			//return str;
		}else{
			return(str);
		}
	},
	GB2312ToUTF8: function (OutStr){//用Adodb.Stream转码gb2312-utf8，存在问题，转码彻底
		var Stream = Server.CreateObject("Adodb.Stream")
		Stream.Charset = 'UTF-8'
		Stream.Mode = 3
		Stream.Open()
		Stream.Type = 2
		Stream.Position = 0
		Stream.WriteText(OutStr)
		Stream.Position = 0
		Stream.Charset = 'GB2312'
		return Stream.ReadText;
	},
	UnescapeJson: function(s){//转码所有嵌套json中文的escape
		if(typeof(s) == 'object'){
			for(var i in s){
				if(typeof(s[i]) == 'object'){
					s[i] = this.UnescapeJson(s[i]);
				}else{
					s[i] = ebx.unescapeEx(s[i].replace(/%25/g, "%"));
				}
			}
		}else{
			s = ebx.unescapeEx(s.replace(/%25/g, "%"))
		}
		return(s);
	},
	EscapeJson: function(s){
		if(typeof(s) == 'object'){
			for(var i in s){
				if(typeof(s[i]) == 'object'){
					s[i] = this.UnescapeJson(s[i]);
				}else{
					if(/^[\u3220-\uFA29]+$/.test(s[i])){//判断是否包含中文字符
						s[i] = ebx.escapeEx(s[i]);
					}
				}
			}
		}else{
			if(/^[\u3220-\uFA29]+$/.test(s[i])){//判断是否包含中文字符
				s[i] = ebx.escapeEx(s[i]);
			}
		}
		return(s);
	},
	convertBinToRs: function(sBin){ //二进制流转换成rs对象
		var stm = Server.CreateObject("adodb.stream"),
			rs = ebx.dbx.getRs();
		if(sBin != null){
			stm.type = 1;
			stm.Open();
			stm.Write(sBin);
			stm.position = 0;
			rs.open(stm);
		}
		return(rs);
	},
	convertRsToBin: function(rs){ //rs对象转换成二进制流
		if(rs == null) return(null);
		if(typeof(rs) == 'object') return(null);
		if(rs.RecordCount == 0) return(null);
		
		var stm = Server.CreateObject("adodb.stream");
		stm.type = 1;
		stm.Open();
		rs.save(stm);
		stm.position = 0
		return(stm.read());
	},
	OnPageEnd: function(Response){//页面结束处理函数
		Response.Clear();
		Response.ContentType="text/HTML;charset=GB2312" 
		Response.ContentEncoding = 'gzip';
		Response.Write(ebx.convertDicToJson(ebx.stdout));
		ebx.CleanData();
	},
	CleanData: function(){//清除对象函数
		ebx.conn.Close;
		stdin = null;
		stdout = null;
	},
	convertDicToJson: function(d){//将Dic对象转化成json文本，支持字典、数组和rs的嵌套 2018-5-6 zz
		if(typeof(d) != 'object') return('{}');
		var s = '', arrtype;
		for(var i in d){
			var n = Number(i);//通过是否数字格式判断是否是数组，如果是数字，代表是数组，文本用[]包含，否则代表是字典，文本用{}包含
			if (!isNaN(n)){
				arrtype = 1;//设置json数组类型，1=[],0={}
				if(d[i].RecordCount == undefined){
					s += ebx.convertDicToJson(d[i]) +',';//处理嵌套字典
				}else{
					s += ebx.convertRsToJson(d[i]) +',';//处理嵌套的rs
				}
			}else{
				arrtype = 0;//设置json数组类型，1=[],0={}
				switch(typeof(d[i])){
					case 'string':
						s += '"'+ i +'":"' + ebx.escapeEx(d[i]) +'",';
						break;
					case 'object':
						if(d[i] == null){
							s += '"'+ i +'":"",';
						}else{
							if(d[i].RecordCount == undefined){
								s += '"'+ i +'":' + ebx.convertDicToJson(d[i]) +',';//处理嵌套字典
							}else{
								s += '"'+ i +'":' + ebx.convertRsToJson(d[i]) +',';//处理嵌套的rs
							}
						}
						break;
					case 'number':
						s += '"'+ i +'":' + d[i] +',';
						break;
					case 'boolean':
						s += '"'+ i +'":' + d[i] +',';
						break;
					case 'function':
						s += '"'+ i +'":' + d[i] +',';
						break;
					case undefined:
						s += ',';
						break;
				}
			}
		}
		s = s.substr(0, s.length - 1);
		if(arrtype){
			return('[' + s + ']');
		}else{
			return('{' + s + '}');
		}
	},
	getTemplateSQL: function(id){//从查询模板获取SQL，参数id：模板ID，返回sql语句
		var sql = 'select title,WizardID,Columns from biQueryTemplate where isdeleted=0 and id =' + id,
			rs = ebx.dbx.open(sql, 1, 1),
			Wizard,//查询设计对象
			Title,
			Columns,//查询模板列rs
			s = '',
			Sort = ebx.dbx.getRs(),//排序对象
			SortCount = 0,//排序序
			GroupBy = 0,//聚合函数表示，0没有聚合函数，1有聚合函数
			GroupByStr = '',//group by 生成文本
			remoteorder = '',//客户端点击排序参数
			remotesort = '';//客户端点击排序列
			
					
		if(!rs.eof){
			Title = rs('title').value;
			Wizard = ebx.getWizard(rs('WizardID').value);
			Columns = ebx.convertBinToRs(rs('Columns').value);
		}
		
		Sort.Fields.Append("SortOrder", 203, 1024);//定义排序序
		Sort.Fields.Append("Sort", 203, 1024);//定义排序文本
		Sort.Open();
				
		for(var i in ebx.stdin){//遍历获取客户端排序信息
			if(i == 'order'){
				remoteorder = ebx.stdin['order'];
				remotesort = ebx.stdin['sort'];
			}
		}
		
		if(remotesort){//客户端点击排序参数
			Sort.Addnew();
			Sort('SortOrder') = 1;
			Sort('Sort') = '[' + remotesort + '] ' + remoteorder;
		}else{
			Columns.MoveFirst();
			while(!Columns.eof){//字段排序处理，支持排序序
				if(ebx.validInt(Columns('Sort').value) == 2){
					Sort.Addnew();
					Sort('SortOrder') = ebx.validInt(Columns('SortOrder').value,0);
					Sort('Sort') = '[' + Columns('Source').value + '] DESC';
				}
				if(ebx.validInt(Columns('Sort').value) == 1){
					Sort.Addnew();
					Sort('SortOrder') = ebx.validInt(Columns('SortOrder').value,0);
					Sort('Sort') = '[' + Columns('Source').value + ']';
				}
				Columns.MoveNext();
			}
		}
		s += 'SELECT ';

		while(!Wizard['Columns'].eof){//字段加载，支持聚合函数处理
			Columns.MoveFirst();
			while(!Columns.eof){
				if(Columns('Source').value == Wizard['Columns']('Alias').value){
					if(Columns('GroupBy').value == '' || Columns('GroupBy').value == null){
						GroupByStr += '[' + Columns('Alias').value + '] ,';
						s +=  Wizard['Columns']('Column').value + ' AS [' + Columns('Alias').value + '] ,';
					}else{
						GroupBy = 1;
						s +=  Columns('GroupBy').value + '(' +Wizard['Columns']('Column').value + ') AS [' + Columns('Alias').value + '] ,';
					}
				}
				Columns.MoveNext();
			}
			Wizard['Columns'].MoveNext;
		}
		s = s.substr(0, s.length - 1);
		
		s += 'FROM ';
		
		while(!Wizard['Tables'].eof){//表
			s +=  Wizard['Tables']('id') + ' [' + Wizard['Tables']('Alias') + '] ,';
			Wizard['Tables'].MoveNext;
		}
		s = s.substr(0, s.length - 1);

		s += 'WHERE ';
		
		if(Wizard['Relates'].State){//条件关系
			while(!Wizard['Relates'].eof){
				s +=  Wizard['Relates']('Table') + '.' + Wizard['Relates']('Column') + Wizard['Relates']('Relate') + Wizard['Relates']('RelateTable') + '.' + Wizard['Relates']('RelateColumn') + ' AND ';
				Wizard['Relates'].MoveNext;
			}
		}
		
		if(Wizard['Filter']){//筛选文本
			s += Wizard['Filter'];
		}
		
		s = s.toLowerCase();
		
		s = s.replaceAll('@@accountid', this.Accountid);//账套
		s = s.replaceAll('@@owner', this.Owner);//用户

		var find = ebx.sqlStringEncode(ebx.stdin['find']),//获取搜索字段
			datefrom = ebx.sqlStringEncode(ebx.stdin['datefrom']),
			dateto = ebx.sqlStringEncode(ebx.stdin['dateto']),
			isdeleted = ebx.validInt(ebx.stdin['isdeleted']),
			isaudit =  ebx.validInt(ebx.stdin['isaudit'], -1); 

		if(datefrom.length > 0){
			datefrom = (datefrom.split('+')[0] + ' ' + datefrom.split('+')[1]).replaceAll('-', '/');
			s = s.replaceAll('@@datefrom', "'" + new Date(datefrom).Format('yyyy-MM-dd hh:mm:ss') + "'");//开始时间
		}else{
			s = s.replaceAll('@@datefrom', "'" + new Date('1900/1/1').Format('yyyy-MM-dd hh:mm:ss') + "'");//开始时间
		}
		
		if(dateto.length > 0){
			dateto = (dateto.split('+')[0] + ' ' + dateto.split('+')[1]).replaceAll('-', '/');
			s = s.replaceAll('@@dateto', "'" + new Date(dateto).Format('yyyy-MM-dd hh:mm:ss') + "'");//结束时间
		}else{
			s = s.replaceAll('@@dateto', "'" + new Date().Format('yyyy-MM-dd hh:mm:ss') + "'");//结束时间
		}

		switch(isdeleted){
			case 0:
				s = s.replaceAll('where', 'where [bd].[isdeleted]=0 and ');//未删除
				break;
			case 1:
				s = s.replaceAll('where', 'where [bd].[isdeleted]=1 and ');//已删除
				break;
			case 2:
				//全部
				break;
		}
		
		switch(isaudit){
			case 0:
				s = s.replaceAll('where', 'where [bd].[auditid]=0 and ');//未审核
				break;
			case 1:
				s = s.replaceAll('where', 'where [bd].[auditid]>=1 and ');//已审核
				break;
			case 2:
				//全部
				break;
		}
		
		if(typeof(find) == 'string'){
			if(find.length > 0){
				s = s.replaceAll('@@findbegin', '');//搜索开始
				s = s.replaceAll('@@findend', '');//搜搜结束
				s = s.replaceAll('@@find', '\'%' + find + '%\'');//搜索文字替换
			}else{
				var FINDBEGIN = s.indexOf('@@findbegin'),
					FINDEND = s.indexOf('@@findend');
				s = s.substr(0, FINDBEGIN) + s.substr(FINDEND + 9, s.length - 1);
			}
		}else{
			var FINDBEGIN = s.indexOf('@@findbegin'),
				FINDEND = s.indexOf('@@findend');
			s = s.substr(0, FINDBEGIN) + s.substr(FINDEND + 9, s.length - 1);
		}
		
		if(GroupBy){//聚合group by合成
			GroupByStr = GroupByStr.substr(0, GroupByStr.length - 1);
			s += 'group by ' + GroupByStr;
		}

		if(Sort.recordcount > 0){//排序合成
			s += 'order by ';
			Sort.Sort = 'SortOrder desc';
			while(!Sort.eof){
				s += Sort('Sort') + ','
				Sort.MoveNext();
			}
			s = s.substr(0, s.length - 1);
		}

		return(s);
	},
	getWizard: function(id){//获取查询设计对象，参数id：查询设计ID，返回查询设计字典
		var sql = 'select Title,Filter,Tables,Relates,Columns from biQueryWizard where isdeleted=0 and id=' + id,
			rs = ebx.dbx.open(sql, 1, 1),
			Wizard = new Array();
		if(rs.State > 0){
			if(!rs.eof){
				Wizard['title'] = rs('Title').value;
				Wizard['Filter'] = rs('Filter').value;
				Wizard['Tables'] = ebx.convertBinToRs(rs('Tables').value);
				Wizard['Relates'] = ebx.convertBinToRs(rs('Relates').value);
				Wizard['Columns'] = ebx.convertBinToRs(rs('Columns').value);
			}
		}
		return(Wizard);
	},
	dbx: {//数据库处理对象
		CursorLocation:3,
		CacheSize:16,
		getRs:function(){
			var rs = Server.CreateObject('ADODB.RecordSet');
			rs.CursorLocation = ebx.dbx.CursorLocation;
			rs.CacheSize = ebx.dbx.CacheSize;
			return(rs);
		},
		open: function(strSQL, iCur, iLock){//复刻rs.open方法
			var rs = ebx.dbx.getRs();
			if(typeof(strSQL) == 'string'){
				if(strSQL.length > 0){
					if(typeof(iCur) != 'number')iCur = 3;
					if(typeof(iLock) != 'number')iLock = 3;
					rs.open(strSQL, ebx.conn, iCur, iLock);
				}
			}
			return(rs);
		},
		openpage: function(strSQL, page){//分页rs函数，参数：strSQL：sql语句，page.iStart：起始行数，page.iLength：每页行数，page.iTotalLength：总行数（回调用）
			var rs,
				sLength = ebx.validInt(page.iLength,0)<1?2147483647:ebx.validInt(page.iLength,0);
			
			ebx.conn.CursorLocation = ebx.dbx.CursorLocation;
			rs = ebx.conn.Execute("declare @C int, @L int;exec sp_cursoropen @C output, N'" + ebx.sqlStringEncode(strSQL) + "', 1, 1, @L output;select @L;exec sp_cursorfetch @C, 16, " + page.iStart + ', ' + sLength + ";exec sp_cursorclose @C");
			rs = rs.NextRecordset();
			page.iTotalLength = rs(0).value;
			//if(page.iTotalLength-page.iStart-page.iLength<0)page.iLength = page.iTotalLength-page.iStart+1;
			return(rs.NextRecordset());
		}
	},
	IDGen: {//ID发生器对象 2018-7-6 zz
		conn: Server.CreateObject('ADODB.Connection'),
		Connstring: Application('DateBase.ConnectString'),
		ConnActive: function(){
			if(this.conn.State != 1){
				this.conn.Open(this.Connstring);
			}
		},
		ConnDisActive: function(){
			this.conn.Close();
		},
		init:function(bForce){//初始化函数，参数：bForce：是否清空，非0则清空所有NPIDGen表数据，0则退出函数
			this.ConnActive();
			var v, sSQL, bUser
			if(ebx.validInt(bForce) == 0){
				sSQL = 'Select Count(*) from NPIDGen';
				v = this.conn.Execute(sSQL);
				if(v(0).value > 0){ 
					return;
				}
				//this.conn.BeginTrans;
			}else{
				this.conn.BeginTrans();
				sSQL = 'Delete from NPIDGen';
				this.conn.Execute(sSQL, v)
			}
			
			try{
				sSQL = 'Select Distinct IGID as [TableID], [TableName] from BaseInfoType where InfoType>0';
				this.SetIDGen(sSQL);

				sSQL = 'Select Distinct IGID as [TableID], [TableName] from BillDocumentType where BillType>0';
				this.SetIDGen(sSQL);
				
				/*
				bUser = NetBOX.SysInfo("PROG_Info").length;//判断是否开发版
				if(bUser > 0){
					this.conn.execute('Update NPIDGen set MaxID =10000 where TableID =9465 and MaxID <10000'); //查询设计biQueryWizard
					this.conn.execute('Update NPIDGen set MaxID =10000 where TableID =9466 and MaxID <10000'); //查询模板biQueryTemplate
					this.conn.execute('Update NPIDGen set MaxID =10000 where TableID =9467 and MaxID <10000'); //查询方案biQueryRender
					this.conn.execute('Update NPIDGen set MaxID =10000 where TableID =1420 and MaxID <10000'); //权限NPPrivileges
					this.conn.execute('Update NPIDGen set MaxID =10000 where TableID =1421 and MaxID <10000'); //权限组NPGroups
					this.conn.execute('Update NPIDGen set MaxID =10000 where TableID =1405 and MaxID <10000'); //显示式样bdStyle
					this.conn.execute('Update NPIDGen set MaxID =10000 where TableID =1408 and MaxID <10000'); //菜单bdStyleMenu
					this.conn.execute('Update NPIDGen set MaxID =10000 where TableID =1409 and MaxID <10000'); //菜单组bdStyleMenuGroup
				}
				*/
				sSQL = 'Select Distinct IGID as [TableID], [TableName] from ResourceType';
				this.SetAuditIDGen(sSQL);
				this.conn.CommitTrans();
			}catch(e){
				this.conn.RollbackTrans;
				ebx.stdout['result'] = 0;
				ebx.stdout['msg'] = e;
			}
			this.ConnDisActive();
		},
		SetIDGen: function(sSQL){//写NPIDGen表，参数：sSQL：BaseInfoType表或BillDocumentType表的sql语句
			var str, v, MaxID, rs;
			
			rs = Server.CreateObject('adodb.recordset');
			rs.CursorLocation =3;
			rs.Open(sSQL, this.conn, 0, 1, 1);
			
			while(!rs.eof){
				str = 'Select Max(ID) as n from [' + rs('TableName').value + ']';
				v = this.conn.Execute(str);
				MaxID = ebx.validInt(v(0).value);
				str = 'Insert Into [NPIDGen] ([TableID], [MaxID]) values(' + rs('TableID').value + ',' + MaxID + ')';
				this.conn.Execute(str);
				rs.MoveNext();
			}
			v = null;
		},
		SetAuditIDGen: function(sSQL){//写资源表的NPIDGen表，参数：sSQL：ResourceType表的sql语句
			var str, v, MaxID, rs, vID, affectedRecords;
			rs = ebx.dbx.getRs();
			rs.Open(sSQL, this.conn, 0, 1, 1);
			MaxID = 0;
			while (!rs.eof){
				str = 'Select Max(ID) as n, Max(AuditID) as m from [' + rs("TableName").value + ']';
				v = this.conn.Execute(str);
				vID = ebx.validInt(v(0).value);
				str = 'Insert Into [NPIDGen] ([TableID], [MaxID]) values(' + rs("TableID").value + ',' + vID + ')'; 
				try{
					this.conn.Execute(str, affectedRecords);
				}catch(e){
					str = 'Update [NPIDGen] set [MaxID]=' + vID + ' where TableID=' + rs("TableID").value + ' and  MaxID<' + vID;
					this.conn.Execute(str, affectedRecords);
				}
				vID = ebx.validInt(v(1).value);
				if(vID >MaxID) MaxID =vID;
				rs.MoveNext();
			}
			str = 'Insert Into [NPIDGen] ([TableID], [MaxID]) values(3, ' + MaxID + ')'; 
			this.conn.Execute(str);
			v = null;
		},
		CTIDGen: function(Obj_ID, Obj_Number){//id发生器函数，参数：Obj_ID：发生器编号，Obj_Number：递增长度，默认1
			this.ConnActive();
			
			Obj_Number = ebx.validInt(Obj_Number, 1);

			this.conn.BeginTrans();

			try{
				var v, sSQL, options, IDGen = 0, rs
				
				sSQL = 'Select TableID, MaxID from NPIDGen where [TableID]=' + Obj_ID;
				rs = ebx.dbx.getRs();
				rs.Open(sSQL, this.conn, 3, 3, 1);
				
				if(rs.eof){
					rs.AddNew();
					rs('TableID') = Obj_ID;
					rs('MaxID') = Obj_Number;
				}else{
					Obj_Number += rs('MaxID').value;
					rs('MaxID') = Obj_Number;
				}
				rs.Update();
				rs = null;
				IDGen = Obj_Number;
				this.conn.CommitTrans();
			}catch(e){
				this.conn.RollbackTrans;
				ebx.stdout['result'] = 0;
				ebx.stdout['msg'] = e;
			}
			this.ConnDisActive();
			
			return IDGen;
		}
	},
	saveBD: {//单据保存对象 2018-7-6 zz
		ID:0,
		ParentID:0,
		bd:[],
		bdlist:[],
		TableName:'',
		ModType:'',
		init: function(TableName, ModType){//初始化对象，获取客户端发送得bd、bdlist、ID、ParentID、TableName、ModType参数
			this.bd = ebx.convertJsonToRs(eval('(' + ebx.stdin['bd'] + ')')),
			this.bdlist = ebx.convertJsonToRs(eval('(' + ebx.stdin['bdlist'] + ')')),
			this.ID = ebx.validInt(ebx.stdin['id']),
			this.ParentID = ebx.validInt(ebx.stdin['ParentID']);
			this.TableName = ebx.sqlStringEncode(TableName);
			this.ModType = ebx.validInt(ModType);
		},
		save: function(){
			ebx.conn.begintrans
			try{
				this._saveBD();
				ebx.conn.commitTrans;
				ebx.stdout['result'] = 1;
				ebx.stdout['id'] = this.ID;
			}catch(e){
				ebx.conn.RollbackTrans;
				ebx.stdout['result'] = 0;
				ebx.stdout['msg'] = e;
			}
			this.CleanData();
		},
		_saveBD: function(){
			if(this.ID == 0 || this.ParentID > 0){//ID为0或者ParentID>0(另存)时新建记录
				var rsBD = ebx.dbx.open('select * from ' + this.TableName + ' where 1=2'),
					rsBDList = ebx.dbx.open('select * from ' + this.TableName + 'list where 1=2'),
					rsBDFields = rsBD.Fields,
					rsBDListFields = rsBDList.Fields;
					
				this.ID = ebx.IDGen.CTIDGen(this.ModType);
				rsBD.AddNew();
				rsBD('RootID') = this.ID;
				rsBD('ParentID') = this.ParentID;
				rsBD('CreateDate') = new Date().Format('yyyy-MM-dd hh:mm:ss');
				rsBD("BillType") = this.ModType;
				rsBD("AccountID") = ebx.Accountid;
				rsBD("Owner") = ebx.Owner;
				rsBD("IsDeleted") = 0
				rsBD("AuditID") = 0
			}else{
				var rsBD = ebx.dbx.open('select * from ' + this.TableName + ' where id=' + this.ID),
					rsBDList = ebx.dbx.open('select * from ' + this.TableName + 'list where 1=2'),
					rsBDFields = rsBD.Fields,
					rsBDListFields = rsBDList.Fields;
			}

			this.bd.MoveFirst();
			while(!this.bd.eof){
				for(var i = 0; i < rsBDFields.Count; i++){
					if(rsBDFields(i).name.toLowerCase() == this.bd("field").value.toLowerCase()){
						rsBD(this.bd("field").value) = this.bd("value").value
					}
				}
				if(this.bd("field").value == 'id'){
					this.bd("value").value = this.ID;
				}
				this.bd.MoveNext();
			}
			rsBD('ID') = this.ID;
			rsBD('UpdateDate') = new Date().Format('yyyy-MM-dd hh:mm:ss');
			rsBD('UpdateCount') = ebx.validInt(rsBD('UpdateCount').value) + 1;
			rsBD.Update();

			ebx.dbx.open('delete ' + this.TableName + 'list where id=' + this.ID);
			this.bdlist.MoveFirst();
			while(!this.bdlist.eof){
				rsBDList.AddNew();
				var fields = this.bdlist.Fields,
					fieldsName = '';
				for(var i = 0; i < fields.Count; i++){
					fieldsName = fields(i).name;
					for(var j = 0; j < rsBDListFields.Count; j++){//判断字段与rsBDList相吻合的，执行写库操作 2018-7-11 zz
						if(rsBDListFields(j).name.toLowerCase() == fieldsName.toLowerCase()){
							rsBDList(fieldsName) = this.bdlist(fieldsName).value
						}
					}
				}
				rsBDList('ID') = this.ID;
				this.bdlist.MoveNext();
			}
			rsBDList.Update();
			rsBD = null;
			rsBDList = null;
		},
		CleanData: function(){
			this.ID = null;
			this.ParentID = null;
			this.bd = null;
			this.bdlist = null;
			this.TableName = null;
			this.ModType = null;
		}
	},
	saveBI: {//基本信息保存对象 2018-7-13 zz
		ID:0,
		ParentID:0,
		bi:[],
		TableName:'',
		ModType:'',
		init: function(TableName, ModType){//初始化对象，获取客户端发送得bd、bdlist、ID、ParentID、TableName、ModType参数
			this.bi = ebx.convertJsonToRs(eval('(' + ebx.stdin['bi'] + ')')),
			this.ID = ebx.validInt(ebx.stdin['id']),
			this.ParentID = ebx.validInt(ebx.stdin['ParentID']);
			this.TableName = ebx.sqlStringEncode(TableName);
			this.ModType = ebx.validInt(ModType);
		},
		save: function(){
			ebx.conn.begintrans
			try{
				this._saveBI();
				ebx.conn.commitTrans;
				ebx.stdout['result'] = 1;
				ebx.stdout['id'] = this.ID;
			}catch(e){
				ebx.conn.RollbackTrans;
				ebx.stdout['result'] = 0;
				ebx.stdout['msg'] = e;
			}
			this.CleanData();
		},
		_saveBI: function(){
			if(this.ID == 0 || this.ParentID > 0){//ID为0或者ParentID>0(另存)时新建记录
				var rsBI = ebx.dbx.open('select * from ' + this.TableName + ' where 1=2');
					
				this.ID = ebx.IDGen.CTIDGen(this.ModType);
				rsBI.AddNew();
				rsBI('RootID') = this.ID;
				rsBI('ParentID') = this.ParentID;
				rsBI('CreateDate') = new Date().Format('yyyy-MM-dd hh:mm:ss');
				rsBI("Infotype") = this.ModType;
				rsBI("AccountID") = ebx.Accountid;
				rsBI("Owner") = ebx.Owner;
				rsBI("IsDeleted") = 0,
				rsBIFields = rsBI.Fields;
			}else{
				var rsBI = ebx.dbx.open('select * from ' + this.TableName + ' where id=' + this.ID),
					rsBIFields = rsBI.Fields;
			}
			this.bi.MoveFirst();
			while(!this.bi.eof){
				for(var i = 0; i < rsBIFields.Count; i++){
					if(rsBIFields(i).name.toLowerCase() == this.bi("field").value.toLowerCase()){
						rsBI(this.bi("field").value) = this.bi("value").value
					}
				}
				//if(this.bi("field").value == 'id'){
				//	this.bi("value").value = this.ID;
				//}
				this.bi.MoveNext();
			}
			rsBI('ID') = this.ID;
			rsBI('UpdateDate') = new Date().Format('yyyy-MM-dd hh:mm:ss');
			rsBI('UpdateCount') = ebx.validInt(rsBI('UpdateCount').value) + 1;
			rsBI.Update();
			rsBI = null;
		},
		CleanData: function(){
			this.ID = null;
			this.ParentID = null;
			this.bi = null;
			this.TableName = null;
			this.ModType = null;
		}
	},
	deleted: {
		ID: 0,
		TableName:'',
		init:function(TableName){
			this.ID = ebx.validInt(ebx.stdin['id']),
			this.TableName = ebx.sqlStringEncode(TableName);
		},
		deleted: function(){
			ebx.conn.begintrans
			try{
				this._del();
				ebx.conn.commitTrans;
				ebx.stdout['result'] = 1;
				ebx.stdout['id'] = this.ID;
			}catch(e){
				ebx.conn.RollbackTrans;
				ebx.stdout['result'] = 0;
				ebx.stdout['msg'] = e;
			}
			this.CleanData();
		},
		_del: function(){
			if(this.ID > 0){
				var rs = ebx.dbx.open('select IsDeleted,updatedate,Owner from ' + this.TableName + ' where id=' + this.ID);
				if(!rs.eof){
					if(rs('IsDeleted').value == 1) throw '记录已删除！';
					rs('IsDeleted') = 1;
					rs('updatedate') = new Date().Format('yyyy-MM-dd hh:mm:ss');
					rs("Owner") = ebx.Owner;
					rs.update;
				}else{
					throw '记录不存在！';
				}
				rs = null
			}else{
				throw '记录不存在！';
			}
		},
		CleanData: function(){
			this.ID = null;
			this.TableName = null;
			this.ModType = null;
		}
	},
	undeleted: {
		ID: 0,
		TableName:'',
		init:function(TableName){
			this.ID = ebx.validInt(ebx.stdin['id']),
			this.TableName = ebx.sqlStringEncode(TableName);
		},
		deleted: function(){
			ebx.conn.begintrans
			try{
				this._del();
				ebx.conn.commitTrans;
				ebx.stdout['result'] = 1;
				ebx.stdout['id'] = this.ID;
			}catch(e){
				ebx.conn.RollbackTrans;
				ebx.stdout['result'] = 0;
				ebx.stdout['msg'] = e;
			}
			this.CleanData();
		},
		_del: function(){
			if(this.ID > 0){
				var rs = ebx.dbx.open('select IsDeleted,updatedate,Owner from ' + this.TableName + ' where id=' + this.ID);
				if(!rs.eof){
					if(rs('IsDeleted').value == 0) throw '记录未删除！';
					rs('IsDeleted') = 0;
					rs('updatedate') = new Date().Format('yyyy-MM-dd hh:mm:ss');
					rs("Owner") = ebx.Owner;
					rs.update;
				}else{
					throw '记录不存在！';
				}
				rs = null
			}else{
				throw '记录不存在！';
			}
		},
		CleanData: function(){
			this.ID = null;
			this.TableName = null;
			this.ModType = null;
		}
	}
}
ebx.init();
%>

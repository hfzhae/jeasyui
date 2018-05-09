<% @debug=on
/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/5/6
*****************************************************************/
var ebx = {
	conn: [], 
	stdin: new Array(),
	stdout: new Array(),
	parseToJson: function (json_data){//Json格式转对象
		eval("var o=" + json_data);
		return o;
	},
	getRequestParamet: function(s){//get参数格式转对象
		var arr = s.split('&'),
			d = new Array();
		if(arr.length <= 0) return d;
		for(var i in arr){
			d[arr[i].split('=')[0]] = arr[i].split('=')[1];
		}
		return d;
	},
	validFloat: function(f, def){//浮点格式化
		var n = parseFloat(f);
		if (isNaN(n)){
			return ((def==undefined)?0:def);
		}else{
			return n;
		}
	},
	validInt: function (i, def){//整形格式化
		var n = parseInt(i);
		if (isNaN(n)){
			return ((def==undefined)?0:def);
		}else{
			return n;
		}
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
        return date;
	},
	Initialize: function (){
		var ParametStr, FormSize, FormData, Paramet
		if(Request.ServerVariables('Request_Method') == 'POST' ){ //post
			FormSize = Request.TotalBytes;
			FormData = Request.BinaryRead(FormSize);
			ParametStr = ebx.stream_binarytostring(FormData, '');
			if(typeof(ParametStr) == 'string'){
				try{
					var Paramet = ebx.parseToJson(ParametStr);
					ebx.convertObjToDic(ebx.stdin, Paramet);
				}catch(e){
					if(e.name == 'SyntaxError'){
						ebx.stdin = ebx.getRequestParamet(ParametStr);
					}
				}
			}
		}else{ //get
			ParametStr = Request.ServerVariables("QUERY_STRING")(1);
			if(typeof(ParametStr) == 'string'){
				ebx.stdin = ebx.getRequestParamet(ParametStr);
			}
		}
		
		ebx.conn = Server.CreateObject('ADODB.Connection');
		ebx.conn.open(Application('DateBase.ConnectString'));
		String.prototype.replaceAll = function(s1,s2){ 
			return this.replace(new RegExp(s1,"gm"),s2); 
		}
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
		return binarystream.readtext
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
		var s = '';
		if(!rs.eof){ 
			var fields = rs.Fields;
				
			rs.MoveFirst();
			while(!rs.eof){
				s += '{';
				for(var i = 0; i < fields.Count; i++){
					s += '"' + fields(i).name + '":' + ebx.getType(fields(i)) + ',';
				}
				s = s.substr(0, s.length - 1);
				s += '},';
				rs.MoveNext();
			}
			s = s.substr(0, s.length - 1);
		}
		return '[' + s + ']';
	},
	getType: function(Fields){ //数据类型判断函数，Fields：字段rs.Fields对象，返回针对类型处理后的值
		var v = ebx.escapeEx(Fields.value)
		switch(Fields.type){
			case 202:
				return '"' + v + '"'; //"文本"
				break;
			case 203:
				return  '"' + v + '"'; //"备注"
				break;
			case 3:
				return ebx.validInt(v); //"长整型"
				break;
			case 2:
				return ebx.validInt(v); //"整型"
				break;
			case 17:
				return ebx.validInt(v); //"字节"
				break;
			case 3:
				return ebx.validInt(v); //"长整型"
				break;
			case 4:
				return ebx.validFloat(v); //"单精浮点"
				break;
			case 5:
				return ebx.validFloat(v); //"双精浮点"
				break;
			case 3:
				return ebx.validInt(v); //"长整型"
				break;
			case 72:
				return ebx.validInt(v); //"同步复制ID"
				break;
			case 131:
				return ebx.validFloat(v); //"小数"
				break;
			case 135:
				return '"' + ebx.sqlstrTtodate(v) + '"'; //"日期/时间"
				//return '"' + v + '"'; //"日期/时间"
				break;
			case 6:
				return ebx.validFloat(v); //"货币"
				break;
			case 11:
				return '"' + v + '"'; //"是/否"
				break;
			case 205:
				return ebx.convertRsToJson(ebx.convertBinToRs(v)); //"OLE对象" 处理数据库里嵌套的rs对象二级制存储数据
				break;
		}
	},
	escapeEx: function(str){ //判断是否字符，如果是用escapt编码加密 2018-5-4 zz
		if(str == null) return('');
		
		//if(/^[\u3220-\uFA29]+$/.test(str)){//中文正则
		if(typeof(str) == 'string'){
			return escape(str);
		}else{
			return str;
		}
	},
	convertBinToRs: function(sBin){ //二进制流转换成rs对象
		var stm = Server.CreateObject("adodb.stream"),
			rs = Server.CreateObject("adodb.recordset");
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
		if(rs.recordcount = 0) return(null);
		
		var stm = Server.CreateObject("adodb.stream");
		stm.type = 1;
		stm.Open();
		rs.save(stm);
		stm.position = 0
		return stm.read();
	},
	OnPageEnd: function(Response){//页面结束处理函数
		Response.Write(ebx.convertDicToJson(ebx.stdout));
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
						s += '"'+ i +'":"' + d[i] +'",';
						break;
					case 'object':
						if(d[i].RecordCount == undefined){
							s += '"'+ i +'":' + ebx.convertDicToJson(d[i]) +',';//处理嵌套字典
						}else{
							s += '"'+ i +'":' + ebx.convertRsToJson(d[i]) +',';//处理嵌套的rs
						}
						break;
					case 'number':
						s += '"'+ i +'":' + d[i] +',';
						break;
					case 'boolean':
						s += '"'+ i +'":' + d[i] +',';
						break;
					case 'function':
						s += '"'+ i +'":"' + d[i] +'",';
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
			rs = Server.CreateObject('ADODB.RecordSet'),
			Wizard = [],//查询设计对象
			Title = '',
			Columns = [],//查询模板列rs
			s = '',
			Sort = Server.CreateObject('ADODB.RecordSet'),//排序对象
			SortCount = 0,//排序序
			GroupBy = 0,//聚合函数表示，0没有聚合函数，1有聚合函数
			GroupByStr = '';//group by 生成文本
			
		rs.open(sql, ebx.conn, 1, 1);
		
		if(!rs.eof){
			Title = rs('title').value;
			Wizard = ebx.getWizard(rs('WizardID').value);
			Columns = ebx.convertBinToRs(rs('Columns').value);
		}
		
		Sort.Fields.Append("SortOrder", 203, 1024);//定义排序序
		Sort.Fields.Append("Sort", 203, 1024);//定义排序文本
		Sort.Open();
		
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

		s += 'WHERE 1=1 AND ';
		if(Wizard['Relates'].State){//条件关系
			while(!Wizard['Relates'].eof){
				s +=  Wizard['Relates']('Table') + '.' + Wizard['Relates']('Column') + Wizard['Relates']('Relate') + Wizard['Relates']('RelateTable') + '.' + Wizard['Relates']('RelateColumn') + ' AND ';
				Wizard['Relates'].MoveNext;
			}
		}
		
		if(Wizard['Filter']){//筛选文本
			s += Wizard['Filter'];
		}
		
		s = s.replaceAll('@@AccountID', 1);//账套
		s = s.replaceAll('@@Owner', 1);//用户
		s = s.replaceAll('@@FINDBEGIN', '');//搜索开始
		s = s.replaceAll('@@FINDEND', '');//搜搜结束
		
		s = s.replaceAll('@@FIND', '\'%%\'');//搜索文字替换
		
		if(GroupBy){//聚合group by合成
			GroupByStr = GroupByStr.substr(0, GroupByStr.length - 1);
			s += 'GROUP BY ' + GroupByStr;
		}

		if(Sort.recordcount > 0){//排序合成
			s += 'ORDER BY ';
			Sort.Sort = 'SortOrder desc';
			while(!Sort.eof){
				s += Sort('Sort') + ','
				Sort.MoveNext();
			}
			s = s.substr(0, s.length - 1);
		}

		return s;
	},
	getWizard: function(id){//获取查询设计对象，参数id：查询设计ID，返回查询设计字典
		var sql = 'select Title,Filter,Tables,Relates,Columns from biQueryWizard where isdeleted=0 and id=' + id,
			rs = Server.CreateObject('ADODB.RecordSet'),
			Wizard = new Array();
			
		rs.open(sql, ebx.conn, 1, 1);
		
		if(!rs.eof){
			Wizard['title'] = rs('Title').value;
			Wizard['Filter'] = rs('Filter').value;
			Wizard['Tables'] = ebx.convertBinToRs(rs('Tables').value);
			Wizard['Relates'] = ebx.convertBinToRs(rs('Relates').value);
			Wizard['Columns'] = ebx.convertBinToRs(rs('Columns').value);
		}
		return Wizard;
	}
}
%>

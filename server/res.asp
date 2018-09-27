<%
/****************************************************************
Copyright (c) 2018 by ZYDSOFT Company. ALL RIGHTS RESERVED.
dev by zz on 2018/9/22
资源审核对象
*****************************************************************/
ebx.res = {
	productStock:{//库存资源审核对象
		stockId: 0,//仓库ID
		billType: 0,//单据类型
		billId: 0,//单据号
		auditId: 0,//审核ID
		auditDate: '',//审核日期
		billDate: '',//单据日期
		billTitle: '',//单据号（字符串）
		billSerial: 0,//单据行序号
		expire: '',//质保期
		batch: '',//批次
		venderId: 0,//供应商ID
		allowNegative: 0,//是否允许负库存，0不允许，>0允许，默认0
		costMethod: 0,//成本核算方法 0=移动加权平均;1=先进先出; 2=个别计价, 3后进先出
		decimalDigits: 2,//金额小数位数，默认2位
		rootDate: '',
		init: function(stockId, billType, billId, auditId, auditDate, billDate, billTitle, rootDate, venderId){//初始化函数
			this.stockId = ebx.validInt(stockId);
			this.billType = ebx.validInt(billType);
			this.billId = ebx.validInt(billId);
			this.auditId = ebx.validInt(auditId);
			this.auditDate = ebx.sqlStringEncode(auditDate);
			this.billDate = ebx.sqlStringEncode(billDate);
			this.rootDate = ebx.sqlStringEncode(rootDate);
			this.billTitle = ebx.sqlStringEncode(billTitle);
			this.venderId = ebx.validInt(venderId);
			
			if(this.auditDate.length > 0){
				this.auditDate = this.auditDate.replaceAll('-', '/');
				this.auditDate = new Date(this.auditDate).Format('yyyy-MM-dd hh:mm:ss');
			}else{
				this.auditDate = new Date(now()).Format('yyyy-MM-dd hh:mm:ss');
			}
		
			if(this.billDate.length > 0){
				this.billDate = billDate.replaceAll('-', '/');
				this.billDate = new Date(this.billDate).Format('yyyy-MM-dd hh:mm:ss');
			}else{
				this.billDate = new Date(now()).Format('yyyy-MM-dd hh:mm:ss');
			}
			
			if(this.rootDate.length == 0) this.rootDate = billDate;
			
			var rs = ebx.dbx.open('Select allowNegative, costMethod, decimalDigits from biCorperation where ID=' + ebx.accountId);
			if(rs.eof) throw '账套信息有误！';
			this.allowNegative = ebx.validInt(rs('allowNegative').value);
			this.costMethod = ebx.validInt(rs('costMethod').value);
			this.decimalDigits = ebx.validInt(rs('decimalDigits').value);

			if(this.costMethod < 0 || this.costMethod > 3} this.costMethod = 1;
			if(this.decimalDigits < 0 || this.decimalDigits > 4) this.decimalDigits = 2;

			rs = null;
		},
		add:function(productId, quantity, amount, price, pSerial, batch, colorId, sizeId, billSerial, expire, ioFlag){//入库方法
			productId = ebx.validInt(productId);
			quantity = ebx.validFloat(quantity);
			amount = ebx.validFloat(amount);
			price = ebx.validFloat(price);
			pSerial = ebx.sqlStringEncode(pSerial);
			batch = ebx.sqlStringEncode(batch);
			colorId = ebx.validInt(colorId);
			sizeId = ebx.validInt(sizeId);
			billSerial = ebx.validInt(billSerial);
			expire = ebx.sqlStringEncode(expire);
			ioFlag = ebx.validInt(ioFlag);
			
			if(expire.length > 0){
				expire = expire.replaceAll('-', '/');
				expire = new Date(expire).Format('yyyy-MM-dd hh:mm:ss');
			}else{
				expire = '';
			}

			if(quantity < 0) throw '数量应该大于0！';

			if(quantity == 0 && amount == 0) return;//数量金额都为0时退出
			if(productId == 0) throw '产品信息有误！';
			
			getProductInfo(productId);//获取产品信息
			
			if(this.productInfo.productType == 1) return;//虚拟产品退出函数
			
			if(price == -1){
				price = this.productInfo.inPrice;//金额为-1时，单价取产品目录参考进价
			}else{
				price = thia.getPrice(quantity, amount);//否则单价等于金额除以数量
			}
			if(this.productInfo.lengthSerial > 0){
				if(pSerial.length != this.productInfo.lengthSerial) throw '产品 ' + this.productInfo.productName + ' 串号 ' + pSerial + ' 的位数不是：' + this.productInfo.lengthSerial + '位！';
			}
			if(batch.length == 0){
				if(this.productInfo.batch == 1) throw '产品 ' + this.productInfo.productName + ' 已经设置批次，请到产品信息中确认。';
			}else{
				if(this.productInfo.batch == 0) throw '产品 ' + this.productInfo.productName + ' 没有设置批次，请到产品信息中确认。';
			}
			
			costMethod = this.productInfo.costMethod;//通过产品区分成本核算方法
			
			if(costMethod == 0 && allowNegative){//成本核算方式为移动加权平均且允许负数
				var invId,//资源id
					invRootId,//资源根id
					invQty,//库存数量
					invAmt,//库存金额
					lastQty,//剩余数量
					auditedQty = 0,//审核数量
					rootDate,//入账时间
					auditedAmount,//审核金额
					outQty,
					inQty,
					outAmount,
					inAmount,
					strWhere = getInvstrWhere(batch, pSerial, colorId, sizeId),
					sql = "select top 1 * from resProductStock with(readpast) where " + strWhere + " and quantity <0 order by rootid",
					rs = ebx.dbx.open(sql);
				
				rs.MoveFirst();
				while(!rs.eof){
					invId = rs('id').value;
					ebx.dbx.open("delete from resProductStock where id=" + invId);
					invRootId = rs('rootid').value;
					invQty = rs('quantity').value;
					invAmt = rs('amount').value;
					rootDate = rs('rootDate').value;
					price = rs('price').value;
					if(!rootDate){
						rootDate = this.rootDate;
					}
					sql = (function(){
						var s = "insert into res_PInv_Out ",
							id =  ebx.CTIdGen(1332);
						
						s += "(";
						s += "id,parentid,rootid,auditId,createdate,updatedate,isDeleted,accountId,billDate,billId,billSerial,billType,stock,productId,nvarchar2,productSerial,colorId,sizeId,quantity,price,amount,nvarchar1,ioFlag,expire,rootDate,venderId";
						s += ")";
						s += " values ";
						s += "(";
						s += id + "," + rs('parentid').value + "," + invRootId + "," + rs("auditId").value + ",'" + rs("createdate").value + "','" + this.auditDate + "',1," + ebx.accountId + ",'" + rs("billDate").value + "'," + rs("billId").value + "," + rs("billSerial").value + "," + rs("billType").value + "," + this.stockId + "," + this.productId + ",'" + batch + "','" + pSerial + "'," + colorId + "," + sizeId + "," + invQty + "," + price + "," + invAmt + ",'" + rs("nvarchar1").value + "'," + rs("ioFlag").value + ",'" + rs("Expire").value + "','" + rootDate + "'," + this.venderId;
						s += ")";
						
						return s;
					})();
					ebx.conn.execute(_sql);//写出入库资源表
					
					lastQty = quantity - auditedQty;//计算剩余库存
					
					if(lastQty == invQty){//负库存数量与入库数量相等的情况，出掉库存，退出循环
						
					}
					if(lastQty > invQty){
						
					}
					if(lastQty < invQty){
						
					}
					
					
					
					
					rs.MoveNext();
				}
			}else{//不允许负数时执行
				if(this.productInfo.lengthSerial > 0){
					if(!ebx.dbx.open("select id from resProductStock with(readpast) where productSerial='" + pSerial + "'", 1, 1).eof) throw '串号(' + pSerial + ')已存在！';
				}
				sql = (function(){
					var s = "insert into resProductStock ",
						id =  ebx.CTIdGen(1332);
						
					s += "(";
					s += "id,parentid,rootid,auditId,createdate,updatedate,isDeleted,accountId,billDate,billId,billSerial,billType,stock,productId,nvarchar2,productSerial,colorId,sizeId,quantity,price,amount,nvarchar1,ioFlag,expire,rootDate,venderId";
					s += ")";
					s += " values ";
					s += "(";
					s += id + ",0," + id + "," + this.auditId + ",'" + this.auditDate + "','" + this.auditDate + "',0," + ebx.accountId + ",'" + this.billDate + "'," + this.billId + "," + billSerial + "," + this.billType + "," + this.stockId +"," + this.productId + ",'" + batch + "','" + pSerial + "'," + colorId + "," + sizeId + "," + quantity + "," + this.getPrice(quantity, amount) + "," + amount + ",'" + this.billTitle + "'," + ioFlag + ",'" + expire + "','" + this.rootDate + "'," + this.venderId
					s += ")";
					
					return s;
				})();
				ebx.conn.execute(sql);
					
				return amount;
			}
		},
		cut:function(){//出库方法
			
		},
		getProductInfo: function(id){//获取产品信息
			var sql = 'select currency7 as inPrice, title as productName, isGroup, productType,lengthSerial,batch,0 as costMethod from biProduct where id=' + id,
				rs = ebx.open(sql, 1, 1);
			if(rs.eof) throw '产品信息有误！';
			this.productInfo = {
				inPrice：ebx.validFloat(rs('inPrice').value),//参考进价
				productName: rs('productName').value,//产品名称
				isGroup: ebx.validInt(rs('isGroup').value),//是否套装产品
				productType: ebx.validInt(rs('productType').value),//是否虚拟产品
				lengthSerial: ebx.validInt(rs('lengthSerial').value),//串号长度
				batch: ebx.validInt(rs('batch').value),//是否必填批次
				costMethod: ebx.validInt('costMethod').value)//按产品区分的成本核算方式
			}
			rs = null;
		},
		getPrice: function(q, a){
			if(q == 0) return 0;
			return(a/q);
		},
		getInvstrWhere: function(batch, pSerial, colorId, sizeId){//获取库存组合的where字符串
			var sql = " stock=" + this.stockie + " and productId=" + productId + " and isDeleted=0 and accountId=" + ebx.accountId;
			if(batch.length > 0){
				sql += " and nvarchar2='" + batch + "'";
			}
			if(pSerial.length > 0){
				sql += " and productSerial='" + pSerial + "'";
			}else if(colorId > 0){
				sql += " and colorId=" + colorId + " and sizeId=" + sizeId;
			}
			return sql;
		}
	}
}
%>

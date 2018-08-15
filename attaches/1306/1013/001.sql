declare @AccountID int
declare @Owner int


set @AccountID = 1
set @Owner = 1

SELECT [bd].[ID] AS [BillID],
[bd].[AuditID] AS [AuditID],
dateadd("d",day([bd].[BillDate])-1,dateadd("m",month([bd].[BillDate])-1,dateadd("yyyy",year([bd].[BillDate])-1900,'1900-01-01'))) AS [BillDate],
Substring([bd].[BillMemo],charindex(' ',[bd].[BillMemo])+1,len([bd].[BillMemo])) AS [BillMemo],
[bdp].[Payment] AS [Payment],
[bdp].[Amount] AS [Amount],
[C].[Code] AS [CCode],
[C].[Title] AS [CTitle],
[S].[Code] AS [SCode],
[S].[Title] AS [STitle],
[U].[Code] AS [UCode],
[U].[Title] AS [UTitle],
[BT].[BillName] AS [BillName],
dateadd("m",month([bd].[BillDate])-1,dateadd("yyyy",year([bd].[BillDate])-1900,'1900-01-01')) AS [Month],
dateadd("yyyy",year([bd].[BillDate])-1900,'1900-01-01') AS [Year],
[S].[Nvarchar1] AS [Nvarchar1],
[S].[Nvarchar2] AS [Nvarchar2],
[bd].[ECSSOrderCode] AS [ECSSOrderCode],
[bd].[out_trade_no] AS [out_trade_no],
[bd].[trade_no] AS [trade_no],
[bd].[MID] AS [MID],
[bd].[OrderID] AS [OrderID]
FROM bdOutStock [bd], bdOutStockPayment [bdp], biCustom [C], biStock [S], biUser [U], UserStock [US], BillDocumentType [BT]
WHERE [US].[UID]=@@Owner and [bd].[IsDeleted]=0 and [bd].[AccountID]=@@AccountID AND bd.[ID]=bdp.[ID] AND bd.[BillType]=BT.[BillType] AND bd.[Organization]=C.[ID] AND bd.[Stock]=S.[ID] AND bd.[Owner]=U.[ID] AND S.[ID]=US.[SID]
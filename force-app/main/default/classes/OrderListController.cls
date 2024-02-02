public with sharing class OrderListController {
    @AuraEnabled
    // System.debug(JSON.serialize(OrderListController.getSearchList('', '')));
    public static ResultWrapper getSearchList(String searchOption, String searchSt) {
        System.debug('searchOption ::: ' + searchOption);
        System.debug('searchSt ::: ' + searchSt);
        
        ResultWrapper resultWrap = new ResultWrapper();
        List<OrderWrapper> orderWrapList = new List<OrderWrapper>();
        String strQuery = 'SELECT Id, Type__c, Status__c, ProductName__c, OrderOwner__c, Name, OrderDate__c FROM OrderList__c';
        String strQuery_WHERE = '';
        String strQuery_OrderBy = ' ORDER BY OrderDate__c ASC';

        if(String.valueOf(searchOption) != '' && String.valueOf(searchSt) != '') {
            if(searchOption == 'OrderNum') {
                strQuery_WHERE += ' WHERE Name LIKE \'%' + searchSt + '%\'';
            } else if(searchOption == 'ProdName') {
                strQuery_WHERE += ' WHERE ProductName__c LIKE \'%' + searchSt + '%\'';
            }
        }
        
        List<OrderList__c> orderList = Database.query(strQuery + strQuery_WHERE + strQuery_OrderBy);
        Integer totalCnt = Database.countQuery('SELECT COUNT() FROM OrderList__c' + strQuery_WHERE);
        System.debug('strQuery + strQuery_WHERE ::: ' + strQuery + strQuery_WHERE);
        System.debug('orderList ::: ' + orderList);
        System.debug('totalCnt ::: ' + totalCnt);

        for(OrderList__c ord : orderList) {
            OrderWrapper orderWrap = new OrderWrapper();
            orderWrap.id = ord.Id;
            orderWrap.type = ord.Type__c;
            orderWrap.status = ord.Status__c;
            orderWrap.prodName = ord.ProductName__c;
            orderWrap.orderOwner = ord.OrderOwner__c;
            orderWrap.orderNum = ord.Name;
            orderWrap.orderDate = ord.OrderDate__c;

            orderWrapList.add(orderWrap);
        }
        resultWrap.recordCnt = totalCnt;
        resultWrap.orderWrapList = orderWrapList;

        return resultWrap;
    }

    public class ResultWrapper {
        @AuraEnabled public Integer recordCnt {get; set;}
        @AuraEnabled public List<OrderWrapper> orderWrapList {get; set;}

        public ResultWrapper() {}
    }

    public class OrderWrapper {
        @AuraEnabled public String  id          {get; set;}
        @AuraEnabled public String  type        {get; set;}
        @AuraEnabled public String  status      {get; set;}
        @AuraEnabled public String  prodName    {get; set;}
        @AuraEnabled public String  orderOwner  {get; set;}
        @AuraEnabled public String  orderNum    {get; set;}
        @AuraEnabled public Date    orderDate   {get; set;}

        public OrderWrapper() {}
    }
}
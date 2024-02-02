public with sharing class OrderListOneController {
    @AuraEnabled
    // System.debug(JSON.serialize(OrderListController.getSearchList('', '')));
    public static ResultWrapper getOrderListOne(String orderId) {
        System.debug('>>>>>orderId: ' + orderId);
        
        ResultWrapper resultWrap = new ResultWrapper();
        List<OrderWrapper> orderWrapList = new List<OrderWrapper>();
        String strQuery = 'SELECT Id, Type__c, Status__c, ProductName__c, OrderOwner__c, Name, OrderDate__c FROM OrderList__c';
        String strQuery_WHERE = ' WHERE Id = '+ orderId;
        
        List<OrderList__c> orderListOne = Database.query(strQuery + strQuery_WHERE);
        Integer totalCnt = Database.countQuery('SELECT COUNT() FROM OrderList__c' + strQuery_WHERE);
        System.debug('>>>>>strQuery + strQuery_WHERE: ' + strQuery + strQuery_WHERE);
        System.debug('>>>>>orderList: ' + orderList);
        System.debug('>>>>>totalCnt: ' + totalCnt);

        OrderWrapper orderWrap = new OrderWrapper();
        orderWrap.type = ord.Type__c;
        orderWrap.status = ord.Status__c;
        orderWrap.prodName = ord.ProductName__c;
        orderWrap.orderOwner = ord.OrderOwner__c;
        orderWrap.orderNum = ord.Name;
        orderWrap.orderDate = ord.OrderDate__c;

        resultWrap.recordCnt = totalCnt;
        resultWrap.orderWrapList = orderWrap;

        return resultWrap;
    }

    public class ResultWrapper {
        @AuraEnabled public Integer recordCnt {get; set;}
        @AuraEnabled public List<OrderWrapper> orderWrapList {get; set;}

        public ResultWrapper() {}
    }

    public class OrderWrapper {
        @AuraEnabled public String  type        {get; set;}
        @AuraEnabled public String  status      {get; set;}
        @AuraEnabled public String  prodName    {get; set;}
        @AuraEnabled public String  orderOwner  {get; set;}
        @AuraEnabled public String  orderNum    {get; set;}
        @AuraEnabled public Date    orderDate   {get; set;}

        public OrderWrapper() {}
    }
}
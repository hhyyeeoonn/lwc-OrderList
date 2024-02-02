import { LightningElement, track, wire, api } from 'lwc';
import label_totalListNum from '@salesforce/label/c.label_totalListNum';
import getSearchList from '@salesforce/apex/OrderListController.getSearchList';
import { NavigationMixin } from 'lightning/navigation';

export default class OrderList extends NavigationMixin(LightningElement) {
    @track resultList = [];

    // 더보기버튼
    @track showOnceNum = 10; // 한 번에 보여주는 content 개수
    @track pagingDef ={
        seeMore : false, // 더보기 버튼 활성화 여부
        currentShowNum : 10, // 현재 보여주고 있는 content 개수
        allPageNum : 0, // 전체 페이지 번호
        currentPageNum : 1, // 현재 페이지 번호
        isRendered : false, // 내용이 render 되었는지
        className : '.contentList' // content class 이름
    };

    
    
    //선택된 값을 저장함
    userSelect = {
        searchOption:'OrderNum', searchSt:''
    };

    // 검색옵션
    searchOption = [
        {label : '주문번호', value : 'OrderNum'},
        {label : '자재명', value : 'ProdName'}
    ]

    searchOptionChange(e) {this.userSelect.searchOption = e.target.value;}
    searchStChange(e) {this.userSelect.searchSt = e.target.value;}

    namedPageRef;
    namedPageUrl;

    async connectedCallback() {
        let result = await getSearchList();
        console.log('result:', JSON.parse(JSON.stringify(result)));
        
        this.resultList = result;
        
        this.namedPageRef = {
            type : 'comm__namedPage',
            attributes : {
                name : 'cafe__c'
            },
        }

        // 페이지 이동하기 NavigationMixin.GenerateUrl : url 생성됨
        this[NavigationMixin.GenerateUrl](this.namedPageRef).then((url) => (this.namedPageUrl = url));
        console.log('this.namedPageUrl: ' + this.namedPageUrl);
    }
    
    // 페이지 이동하기 NavigationMixin.Navigate : 페이지로 이동
    navigateToCafePage() {
        this[NavigationMixin.Navigate]({
            type : 'comm__namedPage',
            attributes : {
                name : 'cafe__c'
            },
        });
    }

    clickCafe() {
        //location.href = this.namedPageUrl; 페이지가 새로고침됨
        this[NavigationMixin.Navigate](this.namedPageRef);

    }

    navigateToTestPage() {
        this[NavigationMixin.Navigate]({
            type : 'comm__namedPage',
            attributes : {
                name : 'testPage__c'
            },
        });
    }


     // 검색버튼
    async searchBtnAction(e) {
        console.log(this.userSelect.searchOption, this.userSelect.searchSt);
        let searchResult = await getSearchList({searchOption: this.userSelect.searchOption, searchSt: this.userSelect.searchSt});
        console.log('searchResult:', JSON.parse(JSON.stringify(searchResult)));
        this.pagingDef.seeMore = false;
        this.pagingDef.currentShowNum = 10;
        this.pagingDef.allPageNum = 0
        this.pagingDef.currentPageNum = 1
        this.pagingDef.isRendered = false; 
        this.resultList = searchResult;
    }

    renderedCallback() { 
        
        if(!this.pagingDef.isRendered) {
            this.setPagingDefault(this.resultList.orderWrapList, this.showOnceNum, this.pagingDef);
        }
    }

    // default Paging setting
    async setPagingDefault(list, intNum, pagingObj) { // this.defaultList, this.showOnceNum, this.pagingDef
        pagingObj.currentShowNum = intNum;
        pagingObj.allPageNum = Math.ceil(this.resultList.orderWrapList.length / intNum);
        pagingObj.currentPageNum = 1;
        console.log('setPagingDefault > pagingDef: ', this.pagingDef);
        let pagingContent = this.template.querySelectorAll(pagingObj.className);
        if(pagingContent.length !== 0) {
            pagingObj.isRendered = true;
            this.pagingController(list, intNum, pagingObj);
        }
    }

    //click see more button
    pagingSeeMore() {
        this.pagingDef.currentPageNum += 1;
        this.pagingController(this.resultList.orderWrapList, this.showOnceNum, this.pagingDef);
    }

    // control paging
    pagingController(list, intNum, pagingObj) {
        pagingObj.currentShowNum = intNum * pagingObj.currentPageNum;
        if(pagingObj.currentShowNum > list.length) {
            pagingObj.currentShowNum = list.length;
        }
        pagingObj.seeMore = (intNum * pagingObj.currentPageNum) < list.length;

        let pagingContent = this.template.querySelectorAll(pagingObj.className);
        console.log('pagingContent: ', pagingContent);
        pagingContent.forEach((el, index) => {
            if(index < pagingObj.currentShowNum) {
                el.style.display = ''; // ie가 아닌 표준계열에서는 display:block 가 아니라 display:table-row 를 사용함 때문에 display='block'을 사용했을 때 셀 한 칸에 표현되었던 것
            } else {
                el.style.display = 'none';
            }
        });
    }


    // 엔터키 검색
    searchKeyAction(e) {
       
        if(e.keyCode === 13) {
            console.log('e.keyCode: ', e.keyCode);
        }
    }

    // 조회된 검색글 개수
    get totalListNum() {
        let totalLabel = label_totalListNum.replace("{0}", this.resultList.recordCnt);
        
        return totalLabel;
    }
    
}
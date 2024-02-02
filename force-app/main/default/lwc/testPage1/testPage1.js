import { LightningElement } from 'lwc';
import { NavigationMixin, track } from 'lightning/navigation';

export default class TestPage1 extends NavigationMixin(LightningElement) {
    
    
    // 이거 없어도 잘 돌아감,,,,,,,,,삽질 잘 햇따
    renderedCallback() {
        //offsetHeight 요소의 높이값 
        //template.querySelect() 일치하는 요소를 검색해서 제일 첫 번째 값을 반환함
        //template.querySelectAll() 일치하는 모든 요소를 유사배열(nodeList)로 반환 *유사배열은 배열메서드 사용 불가

        let listHeightNum = 0;
        let maxHeightNum = 0;
        let allListHeight = this.template.querySelectorAll(".c_ul");
        
        //nodes는 유사배열이지만 프로토타입에 forEach가 있어서 forEach 사용이 가능하다 비슷한 유사배열인 els는 forEach 사용 불가능 
        //call이나 apply를 사용하면 배열의 메서드를 빌려쓸 수 있다
        
        //가장 긴 높이값 구하기
        allListHeight.forEach((listHeight) => {
            console.log(listHeight.offsetHeight);
            listHeightNum = listHeight.offsetHeight;
            if(maxHeightNum < listHeightNum) {
                maxHeightNum = listHeightNum;
                console.log('maxHeightNum: ' + maxHeightNum)
            }
        });

        //속성값 변경하기
        for(let i = 0; i < allListHeight.length; i++) {
            allListHeight[i].style.height = maxHeightNum + "px";
        }

        console.log('allListHeight.length: ' + allListHeight.length);
    }


}
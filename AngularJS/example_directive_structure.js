app.directive('yourDirectiveName', function ($filter, $templateCache, $timeout, DataSharingService,$rootScope) {
    return {
        restrict: 'EAC', // cách dùng: E->element=> lúc dùng như vầy(chữ viết hoa thay= dấu '-' và viết thường xuống):
                                            //=Example: <your-directive-name input1="{{object}} input3='true'"></your-directive-name>
                        // cách dùng A->attibute=> lúc dùng mình làm dạng attribute: example: <div your-directive-name input1="{{object}} input3='true'></div>
                        // còn C-> class=> dùng như css class name vậy: <div class='your-directive-name' input1="{{object}} input3='true'></div>
        replace: true,
        template: $templateCache.get('nature-tile-tpl.html'),
        scope: {
            input1: '=', // binding đầu vào là object, one more thing is: without (?)=> mandatory input
            input2: "=?", // question mark ? => this input is optional
            input3: '@' // binding đầu là là 1 giá trị: example true/false, 'abc',..
			input4OrMethod:'&' // dùng call ngược lại cho parent. ví vụ ng-change mình publish ra...
        },
        controller: function ($scope, $element, $attrs) { 
            // your business here
            //Note1: biến nào mình gắn vào $scope của current directive quản lý=> có thể render lên GUI = {{tên biến}}
                    // và update realtime(ai change value thì nó có ngay value ko cần set/get bằng tay).
                    //Nên cân nhắc cái nào nên gán $scope vì nhìu quá $scope của directive nặng nề. Ko cần thiết thì khai báo cục bộ bthuong thôi.
                    //Thường gán cho $scope là khi mình muốn GUI call tới hoặc directive khác call tới
                    //Examlpe : $scope.myFunction = function(){}  và cục bộ là: function myFunction(){}
                    //          $scope.myVariable  và var myVariable.

            //Note2: Còn UI thì hay gặp vấn đề ng-if, ng-show/ng-hide:
                    // ***ng-if: nếu TRUE thì render ra/ FALSE là mất trên DOM luôn=> mất liên kết của directive
                    //       => nếu mình dùng vidu như: <div ng-if='bienA' ></div> => nếu biến 'bienA'= FALSE mà mình biến TRUE sometime nó ko ăn(do mất lk)
                    //       => phải wraper cái biến 'bienA' vào một object: <div ng-if='abc.bienA' ></div> => khi đó lúc TRUE lúc FALSE nó sẽ effect.

                    // ***ng-show/ng-hide: thì dễ hơn, đơn thuần chỉ là css hide đi ko cho thấy=> DOM vẫn nằm đó, ko quan trọng việc mất lien kết issue
        },
        },

        link: function ($scope, $element) {
            // your business here also, but when you but in link part=> it execute only the DOM is rendered    
        }
    };
});
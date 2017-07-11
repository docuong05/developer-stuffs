$scope.studentsList = [{
		id: 100,
		name: Do Van Cuong,
		status: 'active'
	}, {
		id: 101,
		name: Nguyen Hong Nhut,
		status: 'done'
	}, {
		id: 102,
		name: Vo Quang Danh,
		status: 'waiting'
	}, {
		id: 103,
		name: Truong Anh Kiet,
		status: 'active'
}];


// Cách viết đúng với angularJS: Vì thế mạnh angularJS là binding 2 chiều
$scope.changeStatusOfStudent_1(currentStudent){
	currentStudent.status ='active';
	// call services A
	// làm chuyện ấy
	// Ta thấy trên HMLT student này sẽ có 'màu-xanh' class ngay lập tức(angularJS tự listen và update thôi)
}


// Cách viết sai với angularJS: Vì thế làm giảm performance nếu list nhiều item,
//=> nếu trong loop đó ta còn làm nhiều chuyện khác blah balh=> mình phải wait
$scope.changeStatusOfStudent_2(currentStudent){
	for (var i = 0; i< $scope.studentsList.length; i++) {
		if($scope.studentsList[i] === currentStudent.id){
			$scope.studentsList[i].status ='active';
			// call services A
			// làm chuyện ấy
		}
	}	
}

=>NOTE Là: Khi làm việc với angularJS hạn chế đến mức có thể viết quá nhiều code vô ích, 
			khai báo nhiều biến phụ vô ích trong khi ta có thể làm live trên object của list nào đó
			

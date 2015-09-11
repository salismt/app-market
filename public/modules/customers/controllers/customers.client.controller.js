'use strict';

var customersApp = angular.module('customers');

// Customers controller
customersApp.controller('CustomersController', ['$scope', '$stateParams', 'Authentication', 'Customers', '$modal', '$log',
	function($scope, $stateParams, Authentication, Customers, $modal, $log) {

		this.authentication = Authentication;

		// Find a list of Customers
		this.customers = Customers.query();

				// Open a modal window to create a single customer record
		this.modalCreate = function (size) { //selectedCustomer is the customer detail
			
			var modalInstance = $modal.open({
				templateUrl: 'modules/customers/views/create-customer.client.view.html', //  uour view template
				controller: function ($scope, $modalInstance){ // customer is your item

					$scope.ok = function () {
						if (this.createCustomerForm.$valid) {
							$modalInstance.close(); // close the modal by setting $scope.customer
						}
						
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel'); //dismiss the modal
					};
				},
				size: size
			});

			modalInstance.result.then(function () {
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		// Open a modal window to update a single customer record
		this.modalUpdate = function (size, selectedCustomer) { //selectedCustomer is the customer detail
			
			var modalInstance = $modal.open({
				templateUrl: 'modules/customers/views/edit-customer.client.view.html', //  uour view template
				controller: function ($scope, $modalInstance, customer){ // customer is your item
					$scope.customer = customer; //set your customer

					$scope.ok = function () {
						if (this.updateCustomerForm.$valid) {
							$modalInstance.close($scope.customer); // close the modal by setting $scope.customer
						}
						
					};

					$scope.cancel = function () {
						$modalInstance.dismiss('cancel'); //dismiss the modal
					};
				},
				size: size,
				resolve: {
					customer: function () {
						return selectedCustomer; // return the detail of your customer
					}
				}
			});

			modalInstance.result.then(function (selectedItem) {
				$scope.selected = selectedItem;
			}, function () {
				$log.info('Modal dismissed at: ' + new Date());
			});
		};

		// Remove existing Customer
		this.remove = function(customer) {
			if ( customer ) { 
				customer.$remove();

				for (var i in this.customers) {
					if (this.customers [i] === customer) {
						this.customers.splice(i, 1);
					}
				}
			} else {
				this.customer.$remove();
			}
		};


	}
]);

customersApp.controller('CustomersCreateController', ['$scope', 'Customers', 'Notify',
	function($scope, Customers, Notify) {

				// Create new Customer
		this.create = function() {
			// Create new Customer object
			var customer = new Customers ({
				firstName: this.firstName,
				surname: this.surname,
				suburb: this.suburb,
				country: this.country,
				industry: this.industry,
				email: this.email,
				phone: this.phone,
				referred: this.referred,
				channel: this.channel
			});

			// Redirect after save
			customer.$save(function(response) {

				Notify.sendMsg('NewCustomer', {'id': response._id});

			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.channelOptions = [
			{id: '1', item: 'Facebook'},
			{id: '2', item: 'Twitter'},
			{id: '3', item: 'Email'},
			{id: '4', item: 'Television'},
			{id: '5', item: 'Friend'},
			{id: '6', item: 'Other'}
		];
		
		
	}
]);

customersApp.controller('CustomersUpdateController', ['$scope', 'Customers',
	function($scope, Customers) {
		
		// Update existing Customer
		this.update = function(updatedCustomer) {
			var customer = updatedCustomer;

			customer.$update(function() {
				// we don't want to change the location path
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

	}
]);

customersApp.directive('customerList', ['Customers', 'Notify', function (Customers, Notify) {
	return {
		restrict: 'E',
		transclide: true,
		templateUrl: 'modules/customers/views/customer-list-template.html',
		link: function (scope, element, attrs) {

			//When a new customer is added, update the customer list
			Notify.getMsg('NewCustomer', function (event, data) {

				scope.customersCtrl.customers = Customers.query();

			});
		}
	};
}]);





	

		
	// 	// Find existing Customer
	// 	$scope.findOne = function() {
	// 		$scope.customer = Customers.get({ 
	// 			customerId: $stateParams.customerId
	// 		});
	// 	};
	// 
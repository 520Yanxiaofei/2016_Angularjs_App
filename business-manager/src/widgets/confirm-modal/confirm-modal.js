angular.module("App.Widgets").factory("Confirm", [
	"$uibModal",
	function(
		$uibModal
	) {
		var confirmModalController = [
			"$scope",
			"$uibModalInstance",
			"$timeout",
			"confirm",
			function(
				$scope,
				$uibModalInstance,
				$timeout,
				confirm
			) {
				$scope.confirm = confirm

				$scope.ok = function() {
					confirm.ok()
					$uibModalInstance.dismiss("cancel")
				}

				$scope.cancel = function() {
					$uibModalInstance.dismiss("cancel")
				}

			}
		]

		return {
			show: function(confirm) {
				var confirmModal = $uibModal.open({
					backdrop: "static",
					animation: true,
					templateUrl: "widgets/confirm-modal/confirm-modal.html",
					windowClass: "confirm-modal",
					controller: confirmModalController,
					resolve: {
						confirm: function() {
							return confirm
						}
					}
				})
			}
		}

	}
])
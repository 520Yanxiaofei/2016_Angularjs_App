angular.module("App.Widgets").factory("Prompt", [
	"$uibModal",
	function(
		$uibModal
	) {
		var confirmModalController = [
			"$scope",
			"$uibModalInstance",
			"$timeout",
			"prompt",
			function(
				$scope,
				$uibModalInstance,
				$timeout,
				prompt
			) {
				$scope.prompt = prompt

				$scope.ok = function() {
					prompt.ok($scope.text)
					$uibModalInstance.dismiss("cancel")
				}

				$scope.cancel = function() {
					$uibModalInstance.dismiss("cancel")
				}

			}
		]

		return {
			show: function(prompt) {
				var confirmModal = $uibModal.open({
					backdrop: "static",
					animation: true,
					templateUrl: "widgets/prompt-modal/prompt-modal.html",
					windowClass: "prompt-modal",
					controller: confirmModalController,
					resolve: {
						prompt: function() {
							return prompt
						}
					}
				})
			}
		}

	}
])
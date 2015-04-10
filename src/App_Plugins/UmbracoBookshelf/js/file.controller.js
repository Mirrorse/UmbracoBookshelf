﻿angular.module('umbraco').controller('UmbracoBookshelfFileController', function ($scope, $http, $routeParams, $rootScope, umbracoBookshelfResource, umbracoBookshelfService, notificationsService) {

    $scope.model = {};
    $scope.model.filePath = decodeURIComponent($routeParams.id);
    $scope.isEditing = false;
    $scope.isSaving = false;
    $scope.hasEdited = false;
    $scope.model.content = "";
    $scope.config = {};

    umbracoBookshelfResource.getConfig().then(function(data) {
        $scope.config = data;
    }).then(function() {
        umbracoBookshelfResource.getFileContents($scope.model.filePath).then(function(data) {
            $scope.model.content = data.Content;
        });
    });

    $scope.toggleEdit = function() {
        $scope.isEditing = !$scope.isEditing;
        $scope.hasEdited = true;

        if (!$scope.isEditing) {
            $scope.save();
        }
    }

    $scope.save = function () {
        $scope.isSaving = true;

        umbracoBookshelfService.saveFile($scope.model.filePath, $scope.model.content).then(function (data) {
            $scope.isSaving = false;
            $scope.hasEdited = false;

            notificationsService.success("Success", "The file has been saved.");
        });
    }

    $rootScope.$on('$locationChangeStart', function (event, nextLocation, currentLocation) {
        if ($scope.hasEdited) {
            $scope.save();
        }
    });
});

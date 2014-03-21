var scripts = document.getElementsByTagName("script");
var currentScriptPath = scripts[scripts.length-1].src;

angular.module('swAngularAdvancedGrid', [])
    .directive('swAngularAdvancedGrid', function () {
        return {
            restrict: "A",
            replace: true,
            transclude: false,
            scope: {
                ngModel: '=',
                metaData: '=?swMetaData',
                options: '=swOptions'
            },
            templateUrl: currentScriptPath.substring(0, currentScriptPath.lastIndexOf('/') + 1) + "swAngular-AdvancedGrid.html",
            controller: function ($scope) {
                $scope.handleButtonClick = function (callback, entry) {
                    if (typeof callback === 'function') {
                        callback(entry);
                    } else {
                        switch (callback) {
                            case 'liveedit':
                                $scope.enableLiveEditing(entry);
                                break;
                        }
                    }
                };

                $scope.storeLiveEdit = function (entry) {
                    angular.forEach($scope.list, function (entry) {
                        entry.liveEditingEnabled = false;
                    });

                    if ($scope.options.listeners && $scope.options.listeners.onliveedit) {
                        $scope.options.listeners.onliveedit(entry);
                    }
                };

                $scope.discardLiveEdit = function (entry) {
                    angular.forEach($scope.list, function (entry) {
                        entry.liveEditingEnabled = false;
                    });

                    for (var key in entry) {
                        if (entry.hasOwnProperty(key) && entry.$$swag_secure.hasOwnProperty(key)) {
                            entry[key] = entry.$$swag_secure[key];
                        }
                    }
                };

                $scope.enableLiveEditing = function (selectedEntry) {
                    if (!$scope.options.enableLiveEditing) {
                        return;
                    }

                    selectedEntry.$$swag_secure = angular.copy(selectedEntry);

                    angular.forEach($scope.list, function (entry) {
                        entry.liveEditingEnabled = false;
                    });

                    selectedEntry.liveEditingEnabled = true;
                };

                $scope.guessLiveEditingType = function (value) {
                    switch (typeof value) {
                        case 'string':
                            return 'text';
                        case 'number':
                            return 'number';
                        case 'boolean':
                            return 'checkbox';
                    }
                };

                $scope.setPage = function (page) {
                    if (!$scope.options.hasOwnProperty('listeners')
                        || typeof $scope.options.listeners.onchangepage !== 'function')
                        return;

                    $scope.options.listeners.onchangepage(page.offset, $scope.metaData.limit);
                };

                $scope.setFirstPage = function () {
                    $scope.options.listeners.onchangepage(0, $scope.metaData.limit);
                };
                $scope.setPreviousPage = function () {
                    var currentOffset = $scope.currentPage.offset;
                    $scope.options.listeners.onchangepage(currentOffset - $scope.metaData.limit, $scope.metaData.limit);

                };
                $scope.setNextPage = function () {
                    var currentOffset = $scope.currentPage.offset;
                    $scope.options.listeners.onchangepage(currentOffset + $scope.metaData.limit, $scope.metaData.limit);

                };
                $scope.setLastPage = function () {
                    var numPages = Math.ceil($scope.metaData.total / $scope.metaData.limit);
                    $scope.options.listeners.onchangepage(numPages * $scope.metaData.limit - $scope.metaData.limit, $scope.metaData.limit);
                };

                $scope.isOnFirstPage = function () {
                    return $scope.metaData.offset == 0;
                };

                $scope.isOnLastPage = function () {
                    var numPages = Math.ceil($scope.metaData.total / $scope.metaData.limit);
                    return $scope.metaData.offset == numPages * $scope.metaData.limit - $scope.metaData.limit;
                };


                /**
                 * On Refresh
                 */
                $scope.refresh = function () {
                    if (!$scope.options.hasOwnProperty('listeners')
                        || typeof $scope.options.listeners.onrefresh !== 'function')
                        return;

                    $scope.options.listeners.onrefresh();
                };


                /**
                 * On Order change
                 * @param field
                 */
                $scope.changeOrder = function (field) {
                    if (!$scope.options.hasOwnProperty('listeners')
                        || typeof $scope.options.listeners.onchangeorder !== 'function') return;

                    for (var fieldKey in $scope.options.fields) {
                        if ($scope.options.fields[fieldKey] === field) continue;

                        $scope.options.fields[fieldKey].order = '';
                    }

                    field.order = (field.order != 'desc') ? 'desc' : 'asc';

                    $scope.options.listeners.onchangeorder(field.column, field.order);
                };

                /**
                 * On Order change
                 * @param field
                 */
                $scope.changeItemsPerPage = function (number) {
                    if (!$scope.options.hasOwnProperty('listeners')
                        || typeof $scope.options.listeners.onitemsperpagechange !== 'function') return;

                    if (isNaN(number)) {
                        return;
                    }

                    $scope.options.listeners.onitemsperpagechange(number);
                };

                /**
                 * On Order change
                 * @param field
                 */
                $scope.search = function (query) {
                    if (!$scope.options.hasOwnProperty('listeners')
                        || typeof $scope.options.listeners.onsearch !== 'function') return;

                    $scope.options.listeners.onsearch(query);
                };
            },
            link: function ($scope, $element, $attrs) {
                if (!$scope.hasOwnProperty('options')) {
                    throw new Error('Options are required!');
                }

                $scope.list = [];
                $scope.metaData = {};

                /**
                 * Extract list
                 */
                if ($scope.ngModel.hasOwnProperty('data')) {
                    $scope.list = $scope.ngModel.data;
                } else {
                    $scope.list = $scope.ngModel;
                }

                /**
                 * Extract meta data
                 */
                if ($scope.ngModel.hasOwnProperty('metaData')) {
                    $scope.metaData = $scope.ngModel.metaData;
                }
                $scope.itemPerPageNumber = $scope.metaData.limit || 0;

                /**
                 * Prepare fields
                 */
                for (var fieldKey in $scope.options.fields) {
                    $scope.options.fields.sorting = '';

                    if (typeof $scope.options.fields[fieldKey].renderer !== 'function') {
                        $scope.options.fields[fieldKey].renderer = function (input, row) {
                            return input;
                        }
                    }
                }

                /**
                 * Enable eiew-elements
                 */
                $scope.showHeadingBar = $scope.options.heading || $scope.showMetaData || $scope.showRefreshButton;
                $scope.showFooterBar = $scope.options.showPagination || $scope.options.showItemsPerPage || $scope.options.showSearch;

                /**
                 * Calculate pagination
                 */
                $scope.currentPage = undefined;
                $scope.$watch('metaData', function () {
                    var paginationWidth = $scope.options.paginationWidth || 2;
                    var limit = $scope.metaData.limit;
                    var offset = $scope.metaData.offset;
                    var total = $scope.metaData.total;

                    $scope.pages = [];
                    if (!(isNaN(limit) || isNaN(offset) || isNaN(total))) {
                        var numPages = Math.ceil(total / limit);
                        var startPage = Math.floor(offset / limit) - Math.floor(paginationWidth / 2);
                        startPage = (startPage < 0) ? 0 : startPage;

                        var currentPageId = Math.floor(offset / limit);
                        for (var i = startPage; i < Math.min(numPages, startPage + paginationWidth); i++) {
                            var newPage = {
                                label: i + 1,
                                offset: i * $scope.metaData.limit
                            };
                            if (i === currentPageId) {
                                $scope.currentPage = newPage;
                            }

                            $scope.pages.push(newPage);
                        }
                    }
                }, true);
            }
        };
    });
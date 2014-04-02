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
            template: [
                '<div class="panel panel-default">',
                '    <div class="panel-heading" ng-show="showHeadingBar">',
                '        <div class="row">',
                '            <div class="col-md-8">{{options.heading}}</div>',
                '            <div class="col-md-3">',
                '                <span ng-show="options.showMetaData">{{options.snippets.showingItems}} {{metaData.offset}} - {{(metaData.offset > metaData.total) ? (metaData.offset + metaData.total) : (metaData.offset + metaData.limit)}} {{options.snippets.of || '/'}} {{metaData.total}}</span>',
                '            </div>',
                '            <div class="col-md-1">',
                '                <i class="glyphicon glyphicon-refresh" ng-show="options.showRefreshButton" ng-click="refresh()"></i>',
                '            </div>',
                '        </div>',
                '    </div>',
                '    <div class="panel-body">',
                '        <table class="table table-condensed table-hover table-striped">',
                '            <thead>',
                '                <tr>',
                '                    <th ng-repeat="field in options.fields" width="{{field.weight}}%">',
                '                        <span ng-show="field.order==\'asc\'">',
                '                            <i class="glyphicon glyphicon-sort-by-alphabet"></i>',
                '                            <a ng-click="changeOrder(field, field.orderByValue, \'desc\')">{{field.label}}:</a>',
                '                        </span>',
                '                        <span ng-show="field.order==\'desc\'">',
                '                            <i class="glyphicon glyphicon-sort-by-alphabet-alt"></i>',
                '                            <a ng-click="changeOrder(field, field.orderByValue, \'asc\')">{{field.label}}:</a>',
                '                        </span>',
                '                        <span ng-hide="field.order.length>0">',
                '                            <a ng-click="changeOrder(field, field.orderByValue, \'desc\')">{{field.label}}:</a>',
                '                        </span>',
                '                    </th>',
                '                </tr>',
                '            </thead>',
                '            <tbody>',
                '                <tr ng-repeat="entry in list" ng-dblclick="enableLiveEditing(entry)">',
                '                    <td ng-repeat="field in options.fields" >',
                '                        <div ng-if="!entry.liveEditingEnabled || !field.liveEditable">',
                '        {{field.renderer(entry[field.column], entry, field.column)}}',
                '                        </div>',
                '                        <div ng-if="entry.liveEditingEnabled && field.liveEditable">',
                '                            <input type="{{field.liveEditType || guessLiveEditingType(entry[field.column])}}" ng-model="entry[field.column]"/>',
                '                        </div>',
                '                    </td>',
                '                    <td ng-repeat="button in options.buttons">',
                '                        <div ng-if="!button.button">',
                '                            <div ng-if="button.glyphicon.length>0">',
                '                                <a ng-click="handleButtonClick(button.onclick, entry)">',
                '                                    <i class="glyphicon glyphicon-{{button.glyphicon}}" title="{{button.label}}"></i>',
                '                                </a>',
                '                            </div>',
                '                            <div ng-if="button.iconPath.length>0">',
                '                                <img ng-src="button.iconPath" alt="{{button.label}}"/>',
                '                            </div>',
                '                        </div>',
                '                        <button ng-if="button.button" ng-click="handleButtonClick(button.onclick, entry)">',
                '                            <i ng-if="button.glyphicon.length>0" class="glyphicon glyphicon-{{button.glyphicon}}"',
                '                            title="{{button.label}}"></i>',
                '                            <img ng-if="button.iconPath.length>0" ng-src="button.iconPath" alt="{{button.label}}"/>',
                '        {{button.label}}',
                '                        </button>',
                '                    </td>',
                '                    <td ng-if="entry.liveEditingEnabled" no-wrap>',
                '                        <span class="glyphicon glyphicon-ok" ng-click="storeLiveEdit(entry)"></span>',
                '                        <span class="glyphicon glyphicon-remove" ng-click="discardLiveEdit(entry)"></span>',
                '                    </td>',
                '                </tr>',
                '            </tbody>',
                '        </table>',
                '    </div>',
                '    <div class="panel-footer" ng-show="showFooterBar">',
                '        <div class="row">',
                '            <div class="col-md-4">',
                '                <ul ng-show="options.showPagination" class="pagination pagination col"',
                '                style="margin: 0px 0px; font-weight: bolder;">',
                '                    <li>',
                '                        <span ng-show="isOnFirstPage()" class="glyphicon glyphicon-step-backward"> </span>',
                '                        <a ng-show="!isOnFirstPage()" class="glyphicon glyphicon-step-backward" ng-click="setFirstPage()"> </a>',
                '                    </li>',
                '                    <li>',
                '                        <span ng-show="isOnFirstPage()" class="glyphicon glyphicon-fast-backward"> </span>',
                '                        <a ng-show="!isOnFirstPage()"class="glyphicon glyphicon-backward" ng-click="setPreviousPage()"> </a>',
                '                    </li>',
                '                    <li data-ng-repeat="page in pages">',
                '                        <a ng-show="currentPage.label != page.label" ng-click="setPage(page)">{{page.label}}</a>',
                '                        <span ng-show="currentPage.label == page.label">{{page.label}}</span>',
                '                    </li>',
                '                    <li>',
                '                        <span ng-show="isOnLastPage()" class="glyphicon glyphicon-fast-forward" ng-click="setNextPage()"> </span>',
                '                        <a ng-show="!isOnLastPage()" class="glyphicon glyphicon-forward" ng-click="setNextPage()"> </a>',
                '                    </li>',
                '                    <li>',
                '                        <span ng-show="isOnLastPage()" class="glyphicon glyphicon-step-forward" ng-click="setNextPage()"> </span>',
                '                        <a ng-show="!isOnLastPage()" class="glyphicon glyphicon-step-forward" ng-click="setLastPage()"> </a>',
                '                    </li>',
                '                </ul>',
                '            </div>',
                '            <div class="col-md-4">',
                '                <div ng-show="options.showItemsPerPage">',
                '                    <label for="ag_itemsperpage">{{options.snippets.itemsPerPage || \'Items per page:\'}}</label>',
                '                    <input id="ag_itemsperpage" class="form-inline" type="number" ng-model="itemPerPageNumber"',
                '                    style="width: 50px;"/>',
                '                    <button ng-click="changeItemsPerPage(itemPerPageNumber)">{{options.snippets.buttonChangeItemsPerPage || \'Ok\'}}</button>',
                '                </div>',
                '            </div>',
                '            <div class="col-md-4">',
                '                <div ng-show="options.showSearch">',
                '                    <label for="ag_search">{{options.snippets.search || \'Search:\'}}</label>',
                '                    <input type="text" class="form-inline" ng-model="searchQuery"/>',
                '                    <button ng-click="search(searchQuery)">{{options.snippets.buttonSearch || \'Ok\'}}</button>',
                '                </div>',
                '            </div>',
                '        </div>',
                '    </div>',
                '</div>'
            ].join('\n'),
            link: function ($scope) {
                if (!$scope.hasOwnProperty('options')) {
                    throw new Error('Options are required!');
                }

                /**
                 * Prepare fields
                 */
                for (var fieldKey in $scope.options.fields) {
                    $scope.options.fields.sorting = '';

                    if (typeof $scope.options.fields[fieldKey].renderer !== 'function') {
                        $scope.options.fields[fieldKey].orderByValue = $scope.options.fields[fieldKey].column;
                        $scope.options.fields[fieldKey].renderer = function (input, row, column) {
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

                $scope.$watch('ngModel', function () {
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

                    if ($scope.list === undefined) {
                        throw new Error('No data provided');
                    }

                    if ($scope.metaData === undefined) {
                        throw new Error('No meta data provided');
                    }

                    $scope.itemPerPageNumber = $scope.metaData.limit || 0;
                });

                $scope.$watch('metaData', function (newMetaData) {
                    if (newMetaData === undefined) {
                        throw new Error('Meta data undefined');
                    }

                    if (newMetaData.limit === undefined) {
                        throw new Error('Meta data invalid: limit undefined');
                    }

                    if (newMetaData.offset === undefined) {
                        throw new Error('Meta data invalid: offset undefined');
                    }

                    if (newMetaData.total === undefined) {
                        throw new Error('Meta data invalid: total undefined');
                    }

                    var paginationWidth = $scope.options.paginationWidth || 2;
                    var limit = newMetaData.limit;
                    var offset = newMetaData.offset;
                    var total = newMetaData.total;

                    $scope.pages = [];
                    if (!(isNaN(limit) || isNaN(offset) || isNaN(total))) {
                        var numPages = Math.ceil(total / limit);
                        var startPage = Math.floor(offset / limit) - Math.floor(paginationWidth / 2);
                        startPage = (startPage < 0) ? 0 : startPage;

                        var currentPageId = Math.floor(offset / limit);
                        for (var i = startPage; i < Math.min(numPages, startPage + paginationWidth); i++) {
                            var newPage = {
                                label: i + 1,
                                offset: i * limit
                            };
                            if (i === currentPageId) {
                                $scope.currentPage = newPage;
                            }

                            $scope.pages.push(newPage);
                        }
                    }
                }, true);
            },
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
                    if ($scope.metaData === undefined) return;
                    if (!$scope.options.hasOwnProperty('listeners')
                        || typeof $scope.options.listeners.onchangepage !== 'function')
                        return;

                    $scope.options.listeners.onchangepage(page.offset, $scope.metaData.limit);
                };

                $scope.setFirstPage = function () {
                    if ($scope.metaData === undefined) return;
                    $scope.options.listeners.onchangepage(0, $scope.metaData.limit);
                };
                $scope.setPreviousPage = function () {
                    if ($scope.metaData === undefined) return;
                    var currentOffset = $scope.currentPage.offset;
                    $scope.options.listeners.onchangepage(currentOffset - $scope.metaData.limit, $scope.metaData.limit);

                };
                $scope.setNextPage = function () {
                    if ($scope.metaData === undefined) return;
                    var currentOffset = $scope.currentPage.offset;
                    $scope.options.listeners.onchangepage(currentOffset + $scope.metaData.limit, $scope.metaData.limit);

                };
                $scope.setLastPage = function () {
                    if ($scope.metaData === undefined) return;
                    var numPages = Math.ceil($scope.metaData.total / $scope.metaData.limit);
                    $scope.options.listeners.onchangepage(numPages * $scope.metaData.limit - $scope.metaData.limit, $scope.metaData.limit);
                };

                $scope.isOnFirstPage = function () {
                    if ($scope.metaData === undefined) return;
                    return $scope.metaData.offset == 0;
                };

                $scope.isOnLastPage = function () {
                    if ($scope.metaData === undefined) return;

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
                $scope.changeOrder = function (field, orderBy, orderSequence) {
                    if (!$scope.options.hasOwnProperty('listeners')
                        || typeof $scope.options.listeners.onchangeorder !== 'function') return;

                    for (var fieldKey in $scope.options.fields) {
                        if ($scope.options.fields[fieldKey] === field) continue;

                        $scope.options.fields[fieldKey].order = '';
                    }

                    field.order = orderSequence;

                    $scope.options.listeners.onchangeorder(orderBy, orderSequence);
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
            }
        };
    });
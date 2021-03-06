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
                '    <div class="panel-heading" data-ng-show="showHeadingBar">',
                '        <div class="row">',
                '            <div class="col-md-8"><h3 class="panel-title">{{options.heading}}</h3></div>',
                '            <div class="col-md-3">',
                '                <span data-ng-show="options.showMetaData">{{options.snippets.showingItems}} {{metaData.offset}} - {{(metaData.offset > metaData.total) ? (metaData.offset + metaData.total) : (metaData.offset + metaData.limit)}} {{options.snippets.of || \'/\'}} {{metaData.total}}</span>',
                '            </div>',
                '            <div class="col-md-1" class="pointer">',
                '                <a class="glyphicon glyphicon-refresh" data-ng-show="options.showRefreshButton" data-ng-click="refresh()"></a>',
                '            </div>',
                '        </div>',
                '    </div>',
                '    <div class="panel-body">',
                '        <table class="table table-condensed table-hover table-striped">',
                '            <thead>',
                '                <tr>',
                '                    <th data-ng-repeat="field in options.fields" width="{{field.weight}}%" class="pointer">',
                '                        <span data-ng-show="field.order==\'asc\'">',
                '                            <i class="glyphicon glyphicon-sort-by-alphabet"></i>',
                '                            <a data-ng-click="changeOrder(field, field.orderByValue, \'desc\')">{{field.label}}:</a>',
                '                        </span>',
                '                        <span data-ng-show="field.order==\'desc\'">',
                '                            <i class="glyphicon glyphicon-sort-by-alphabet-alt"></i>',
                '                            <a data-ng-click="changeOrder(field, field.orderByValue, \'asc\')">{{field.label}}:</a>',
                '                        </span>',
                '                        <span data-ng-hide="field.order.length>0">',
                '                            <a data-ng-click="changeOrder(field, field.orderByValue, \'desc\')">{{field.label}}:</a>',
                '                        </span>',
                '                    </th>',
                '                </tr>',
                '            </thead>',
                '            <tbody>',
                '                <tr data-ng-show="list.length < 1">',
                '                    <td colspan="{{options.fields.length+options.buttons.length}}">',
                '                        <span class="glyphicon glyphicon-info-sign"></span> <span>{{options.emptyGridText || \'No data available\'}}</span>',
                '                    </td>',
                '                </tr>',
                '                <tr data-ng-repeat="entry in list" data-ng-click="onRowClick(entry)" data-ng-dblclick="enableLiveEditing(entry)">',
                '                    <td data-ng-repeat="field in options.fields" >',
                '                        <div data-ng-if="(!entry.liveEditingEnabled || !field.liveEditable) && !field.sanitize">',
                '        {{field.renderer(entry[field.column], entry, field.column)}}',
                '                        </div>',
                '                        <div data-ng-if="(!entry.liveEditingEnabled || !field.liveEditable) && field.sanitize" data-ng-bind-html="field.renderer(entry[field.column], entry, field.column)">',
                '                        <div data-ng-if="entry.liveEditingEnabled && field.liveEditable">',
                '                            <input type="{{field.liveEditType || guessLiveEditingType(entry[field.column])}}" data-ng-model="entry[field.column]"/>',
                '                        </div>',
                '                    </td>',
                '                    <td data-ng-repeat="button in options.buttons">',
                '                        <div data-ng-if="!button.button" class="pointer">',
                '                            <div data-ng-if="button.glyphicon.length>0">',
                '                                <a data-ng-click="handleButtonClick(button.onclick, entry)" data-ng-hide="button.isDisabled(entry)">',
                '                                    <i class="glyphicon glyphicon-{{button.glyphicon}}" title="{{button.label}}"></i>',
                '                                </a>',
                '                                <i data-ng-show="button.isDisabled(entry)" class="glyphicon glyphicon-{{button.glyphicon}}" title="{{button.label}}"></i>',
                '                            </div>',
                '                            <div data-ng-if="button.iconPath.length>0">',
                '                                <img data-ng-src="button.iconPath" alt="{{button.label}}"/>',
                '                            </div>',
                '                        </div>',
                '                        <button data-ng-if="button.button" data-ng-click="handleButtonClick(button.onclick, entry)" data-ng-disabled="button.isDisabled(entry)">',
                '                            <i data-ng-if="button.glyphicon.length>0" class="glyphicon glyphicon-{{button.glyphicon}}"',
                '                            title="{{button.label}}"></i>',
                '                            <img data-ng-if="button.iconPath.length>0" data-ng-src="button.iconPath" alt="{{button.label}}"/>',
                '        {{button.label}}',
                '                        </button>',
                '                    </td>',
                '                    <td data-ng-if="entry.liveEditingEnabled" no-wrap>',
                '                        <span class="glyphicon glyphicon-ok" data-ng-click="storeLiveEdit(entry)"></span>',
                '                        <span class="glyphicon glyphicon-remove" data-ng-click="discardLiveEdit(entry)"></span>',
                '                    </td>',
                '                </tr>',
                '            </tbody>',
                '        </table>',
                '    </div>',
                '    <div class="panel-footer" data-ng-show="showFooterBar">',
                '        <div class="row">',
                '            <div class="col-md-4">',
                '                <ul data-ng-show="options.showPagination" class="pagination pagination col"',
                '                style="margin: 0px 0px; font-weight: bolder;">',
                '                    <li class="pointer">',
                '                        <span data-ng-show="isOnFirstPage()" class="pagination-col">«</span>',
                '                        <a data-ng-show="!isOnFirstPage()" data-ng-click="setPreviousPage()">«</a>',
                '                    </li>',
                '                    <li data-ng-repeat="page in pages" class="pagination-col pointer" data-ng-class="{\'alert-success\': currentPage.label == page.label}">',
                '                        <a data-ng-show="currentPage.label != page.label" data-ng-click="setPage(page)">{{page.label}}</a>',
                '                        <span data-ng-show="currentPage.label == page.label">{{page.label}}</span>',
                '                    </li>',
                '                    <li class="pointer">',
                '                        <span data-ng-show="isOnLastPage()" class="pagination-col">»</span>',
                '                        <a data-ng-show="!isOnLastPage()" ng-click="setNextPage()">»</a>',
                '                    </li>',
                '                </ul>',
                '            </div>',
                '            <div class="col-md-4">',
                '                <div data-ng-show="options.showItemsPerPage" class="input-group">',
                '                    <span class="input-group-addon">{{options.snippets.itemsPerPage || \'Items per page:\'}}</span>',
                '                    <input type="number" class="main-form main-form-default" data-ng-model="itemPerPageNumber" style="width: 70px;" />',
                '                    <span class="input-group-btn"><button type="button" data-ng-click="changeItemsPerPage(itemPerPageNumber)" class="btn btn-default">{{options.snippets.buttonChangeItemsPerPage || \'Ok\'}}</button></span>',
                '                </div>',
                '            </div>',
                '            <div class="col-md-4">',
                '                <div data-ng-show="options.showSearch" class="input-group">',
                '                    <span class="input-group-addon">{{options.snippets.search || \'Search:\'}}</span>',
                '                    <input type="text" class="main-form main-form-default" data-ng-model="searchQuery" style="width: 100px;" />',
                '                    <span class="input-group-btn"><button type="button" data-ng-click="search(searchQuery)" class="btn btn-default">{{options.snippets.buttonSearch || \'Ok\'}}</button></span>',
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
                    if(!$scope.options.fields.hasOwnProperty(fieldKey)) continue;
                    $scope.options.fields.sorting = '';

                    if (typeof $scope.options.fields[fieldKey].renderer !== 'function') {
                        $scope.options.fields[fieldKey].orderByValue = $scope.options.fields[fieldKey].column;
                        $scope.options.fields[fieldKey].renderer = function (input, row, column) {
                            return input;
                        }
                    }
                }

                /**
                 * Prepare buttons
                 */
                for(var buttonKey in $scope.options.buttons) {
                    if(!$scope.options.buttons.hasOwnProperty(buttonKey)) continue;

                    if(typeof $scope.options.buttons[buttonKey].isDisabled !== 'function') {
                        $scope.options.buttons[buttonKey].isDisabled = function() {
                            return false;
                        }
                    }
                    if(typeof $scope.options.buttons[buttonKey].isDisabled() !== 'boolean') {
                        console.log('hell');
                        $scope.options.buttons[buttonKey].isDisabled = function() {
                            return false;
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

                $scope.onRowClick = function(clickedEntry) {
                    if (!$scope.options.hasOwnProperty('listeners')
                        || typeof $scope.options.listeners.onrowclick !== 'function')
                        return;

                    $scope.options.listeners.onrowclick(clickedEntry);
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

                    return $scope.metaData.offset == numPages * $scope.metaData.limit - $scope.metaData.limit
                        || $scope.metaData.offset == 0;
                };


                /**
                 *
                 */
                $scope.refresh = function () {
                    if (!$scope.options.hasOwnProperty('listeners')
                        || typeof $scope.options.listeners.onrefresh !== 'function')
                        return;

                    $scope.options.listeners.onrefresh();
                };


                /**
                 *
                 * @param field
                 * @param orderBy
                 * @param orderSequence
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
                 *
                 * @param number
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
                 *
                 * @param query
                 */
                $scope.search = function (query) {
                    if (!$scope.options.hasOwnProperty('listeners')
                        || typeof $scope.options.listeners.onsearch !== 'function') return;

                    $scope.options.listeners.onsearch(query);
                };
            }
        };
    });
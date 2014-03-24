Shopware AngularJs -- swAngular Advanced Grid
=====================================

This is an Shopware-AngularJs Component, it can be installed via Bower.

## Installation

Via [bower](http://bower.io):

	bower install sw-angular-advanced-grid

## How to Use the Component


###Show data table
The advanced grid can be used as easily as the simple grid except that options are required. The grid can be used like this:

    &lt;div sw-angular-advanced-grid ng-model="exampleData" sw-options="options"&gt;&lt;/div&gt;

The options are defined in the controller and stored in the `$scope.options` variable. Options must at least consist of column definitions.
Besides column definitions as `fields` you are allowed to define `buttons` which are attached to each row of the table.

* Fields are defined by a `label`, `column` in the data set and optional horizontal `weight` and a `renderer` function.
* Buttons are defined by a `label`, `class`, `glyphicon`, `button` and an `onclick` handler.

Example options may look like this:

    $scope.options = {
        fields: [
            {label: 'Id', column: 'id', weight: '10'},
            {label: 'Vorname', column: 'firstname', weight: '20'},
            {label: 'Nachname', column: 'lastname', weight: '20'},
            {label: 'Alter', column: 'age', weight: '10'},
            {label: 'Qualitäten', column: 'qualities', weight: '40', renderer: function (input) {
                return input.join(', ');
            }}
        ],
        buttons: [
            {
                label: 'MyButton',
                class: '',
                glyphicon: 'edit',
                button: false,
                onclick: function (row) {
                    //..
                }
            }
        ]
    };

###Advanced options

The advanced grid was designed so serve as a client side interface for server side data aggregation.

By that means, all pagination and search logic is not in any way defined by this component. In fact, user interactions are converted to defined events which can be handled through `listeners` within the options defining controller, a service or whatever place you want.

Moreover, the grid is ready for i18n through `snippets` definitions.

All view components (heading, refresh button, search field, pagination, etc.) are opt in!

Advanced example options may look like this:

    $scope.options = {
        heading: 'Advanced grid with meta data',
        showRefreshButton: true,
        showPagination: true,
        showItemsPerPage: true,
        showSearch: true,
        showMetaData: true,
        enableLiveEditing: true,
        paginationWidth: 3,
        fields: [
            {label: 'Id', column: 'id', weight: '10'},
            {label: 'Vorname', column: 'firstname', weight: '20', liveEditType: 'text', liveEditable: true},
            {label: 'Nachname', column: 'lastname', weight: '20', liveEditable: true},
            {label: 'Alter', column: 'age', weight: '10', liveEditable: true},
            {label: 'Qualitäten', column: 'qualities', weight: '40', renderer: function (input) {
                return input.join(', ');
            }}
        ],
        buttons: [
            {label: 'MyButton', class: '', glyphicon: 'star', button: false, onclick: function (row) {
                console.log('row is ', row);
            }},
            {label: 'Live Edit', class: '', glyphicon: 'edit', button: false, onclick: 'liveedit'}
        ],
        listeners: {
            onchangeorder: function (orderBy, orderSequence) {
                console.log('ordering by ' + orderBy + ' ' + orderSequence);
            },
            onrefresh: function () {
                console.log('refreshing');
            },
            onsearch: function(query) {
                console.log('seaching for',query);
            },
            onitemsperpagechange: function(number) {
                $scope.exampleData2.metaData.limit = number;
            },
            onchangepage: function(offset, limit) {
                console.log('limit: '+limit+', offset: '+offset);
                $scope.exampleData2.metaData.limit = limit;
                $scope.exampleData2.metaData.offset = offset;
            },
            onliveedit: function(entry) {
                console.log('edited',entry);
            }
        },
        snippets: {
            showingItems: 'Zeige',
            of: 'von',
            itemsPerPage: 'Einträge je Seite:',
            search: 'Suchen:',
            buttonChangeItemsPerPage: 'Los',
            buttonSearch: 'Los'
        }
    }

###Examples

Here are some [Examples](http://swangular.shopware.de.cloud2-vm153.de-nserver.de/#/advancedGrid)
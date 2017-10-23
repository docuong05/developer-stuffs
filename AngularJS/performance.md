Improve Performance in JS/HTML - Angular Tips
===========

### 1. Should use latest version of angular (newer version have performance improved) - *Don't live in the past*

### 2. angular.copy carefully - *Great Power come Great Responsibility*

- Only use angular.copy when we really need it as it use deep copy to perform the clone.
- Clone only property that we need to clone.

```js
    var obj = {
      bigAndComplexProperty: {...}, //<== angular.copy will take time to clone this property that we dont use (waste time)
      normalProperty: {...},
      propertyThatWeNeedToClone: {...}
    };

    //Insead of
    var clonnedData = anglar.copy(obj);
    processAndModifyData(clonnedData.propertyThatWeNeedToClone);

    //we should use
    var clonnedProperty = anglar.copy(obj.propertyThatWeNeedToClone);
    processAndModifyData(clonnedProperty);
```

### 3. For big and complex DOM (or not used frequently), we should use ng-if instead of ng-show to reduce render time.
- ng-show/hide keep the DOM in DOM tree and set CSS class to `display:none!important`.
- Keep in mind that ng-if will re-render the DOM everytime so if the element is show/hide frequently then should consider to use ng-show/hide

### 4. Should'nt have big/complex/cost time filter.
Filter will be evaluated in every digest so it can block UI. If something big/complex, we can pre-calculate/format in Javascript before put it to HTML instead of formating by filter.

Instead of:
```html
  <span> {{'DESCRIPTION' | translate }} </span>
```

We should use:

```js
  $scope.lables = {
    description: translateService.translate('DESCRIPTION')
  }
```

```html
  //one time binding would be the best choice for static label
  <span> {{::labels.description}} </span>
```

### 5. Advoid deep watch ($watch with third parameter as true) as mush as possible
It will be called everytime watched object's property changed. See below explaination for more detail

```javascript
    //$watch() will be trigger by:
    $scope.myArray = [];
    $scope.myArray = null;
    $scope.myArray = otherArray;

    //$watchCollection() will be trigger by everything above and:
    $scope.myArray.push({});//add element
    $scope.myArray.splice(0,1);//remove element
    $scope.myArray[0] = {} ;//assign child element to different value

    //$watch(..., ..., true) will be trigger by everything above and:
    $scope.myArray[0].someProperty = 'newValue'

    //NOTE: $watch() is the only one that fires when an array is replaced with another with the same axact content. Ex:
    $scope.myArray = ['A', 'B', 'c'];
    var newArray = [];
    newArray.push('A');
    newArray.push('B');
    newArray.push('C');

    $scope.myArray = newArray;  //$watch is triggered by this assignation
```
### 6. Advoid filter in ng-repeat.

### 8. Advoid using $timeout as muchs as possible.
It'll wait for at least 1 digest cycle before execute (after DOM rendered)
**Note:** Need to have convincible reason for each time we use $timeout/$interval - comments is **MANDATORY** for easy maintenance + readability

### 9. Consider use javascript worker if possible

### 10. Should focus on scope property to hanlde business intead of DOM.
With DOM, we need to wait digest loop to process the DOM (with new scope property changed) before we can use it <== one of the reasons that we use $timeout (which we shouldn't)

### 11. Should advoid use $watch with function.
Should we use it, the function need to be small and fast.

### 12. Reduce the amount of watcher.
a. Watches are set on
  - `$scope.$watch`
  - `{{ }}` interpolation
  - Most directive (Ex: `ng-show`, `ng-hide`, ...)
  - Isolated Scope vairables mapping: `scope: { foor: '=', bar: '@'}`
  - Filter `{{ value | uppercase }}`
  - `ng-repeat`

b. Watchers (digest cycle) run on
  - User action (`ng-click` etc). Most built in directives will call `$scope.apply` upon completion which triggers the digest cycle.
  - `ng-change`
  - `ng-model`
  - `$http` events (so all ajax calls)
  - `$q` promises resolved
  - `$timeout`
  - `$interval`
  - Manual call to `$scope.apply` and `$scope.digest`

### 13. When use `ng-repeat` we should use `track by`
In order to help angular determine old/new item so they can re-use rendered element for that item without re render it. Popular case:

```js
  scope.myArray = [{id:1, data: 'A'}, {id:2, data: 'B'}, {id:3, data: 'C'}]
```

```html
  <div ng-repeat="item in myArray"> {{item.id}} - {{item.data}} </div>
```

If we reload `myArray` array (update changed from server)

```js
  function reload(){
    return [{id:1, data: 'A-modified'}, {id:2, data: 'B'}, {id:3, data: 'C-modified'}];
  }
  scope.myArray = reloadData();
```

Angular have no way to know that we've already render item 1,2,3 => it re render all items in `myArray`.

```html
  <div ng-repeat="item in myArray track by item.id"> {{item.id}} - {{item.data}} </div>
```
If we use track by `item.id`, angular can check the id to know that it's already rendered DOM for item 1,2,3 so it can reuse it => provide a performance boost

**Note**: advoid use `track by $index` with *one time binding* (because of `ng-repeat` reusing the DOM), it may cause out-of-sync with the underlying data

[More details](https://docs.angularjs.org/api/ng/directive/ngRepeat)

### 13. Advoid ng-repeat with large data.
Should we use it, consider to use infinite scrolling/pagination

### 14. Use bind once when possible.
Either built in bind once or third party bind-once lib.

### 15. Debounce ng-model.
If you know there is going to be a lot of changes coming from an `ng-model`, you can de-bounce the input.
For example if you have a search input like Google, you can de-bounce it by setting the following ng-model option:

```html
  <input ng-model="inputValue" ng-model-options="{ debounce: 250 }"/>
```

This will ensure that the digest cycle due to the changes in this input model will get triggered no more then once per 250ms .

### 16. Use console.time / console.timeEnd to benchMark functions

### 17. Should use lodash for slow function instead of rewrite everything or use angular function.

### 18. Use Batarang plugin (on chrome) to benchmark watchers.

### 19. Remember that DOM access is expensive.
should consider before query/modify/add/remove a DOM element. Should advoide inline style also.

### 20. Scope all variables as tightly as possible.
In order to allow the JavaScript garbage collector to free up your memory sooner rather then later. This is an exceedingly common cause of slow, laggy, non-responsive JavaScript in general and Angular in particular.

Be aware of the following problems:

```js
  function demo(){
    var b = {childFunction: function(){console.log('hi this is the child function')};
    b.childFunction();
    return b;
  }
```
When the function terminates, there will be no further references to b available, and the garbage collector will free up the memory. However, if there is a line elsewhere like so:

```js
  var cFunc = demo();
```

We now bind the object to a variable and maintain reference to it, preventing the garbage collector from cleaning it up. While this may be necessary, it is important to be aware of what effect you are having on object references.

### 21. Deregister all `$on`, `$watch` of other scope (that is register in our scope. Ex: `scope.$parent.$on`, `$rootScope.$watch`), $timeout, $interval and element event listeners in `$on('$destroy')`



# Reference
1. https://www.airpair.com/angularjs/posts/angularjs-performance-large-applications
2. [EvalAsync Example](https://stackoverflow.com/questions/12729122/angularjs-prevent-error-digest-already-in-progress-when-calling-scope-apply/23102223#23102223) and [Comparation $apply, $digest, $timeout, $evalAsync](http://www.codingeek.com/angularjs/angular-js-apply-timeout-digest-evalasync/)
3. [Custom ng-repeat for better performance](http://blog.scalyr.com/2013/10/angularjs-1200ms-to-35ms/)
4. https://github.com/RajaJaganathan/angularjs-best-practices

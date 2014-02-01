var dang = angular.module('dang', [])

dang.directive('dang', function(){
  function link(scope, el, attr){
    el = el[0]
    var svg = d3.select(el)
    scope.$watch(function(){
      return el.clientWidth * el.clientHeight
    }, function(){
      var width = el.clientWidth
      var height = el.clientHeight
      scope.width = width
      scope.height = height
      svg.attr('width', width).attr('height', height)
    })
  }
  function controller($scope, $window){
    $scope.width = 0
    $scope.height = 0
    var m = 30
    $scope.margin = { left: m, top: m, right: m, bottom: m }
  }
  return {
    link: link
    , restrict: 'A'
    , controller: controller
    , transclude: true
    , template: '<g ng-transclude></g>'
  }
})

dang.directive('dangSkatter', function(){
  function link(scope, el, attr){
    el = el[0]
    var svg = d3.select(el)
    var width, height
    var points = svg.selectAll('circle')
    var m
    var data
    scope.$watch('data', function(data_){ data = data_; update() })
    function update(){
      if(!data) return
      var xExtent = d3.extent(data, function(d){ return d[0] })
      scope.x.domain(xExtent)
      var yExtent = d3.extent(data, function(d){ return d[1] })
      scope.y.domain(yExtent)
      points = points.data(data)
      points.enter().append('circle').attr('r', 2)
      points.exit().remove()
      points.attr({
          cx: function(d){ return scope.x(d[0]) }
        , cy: function(d){ return scope.y(d[1]) }
      })
    }
    scope.$watch('margin', function(margin){
      m = margin
      update()
    }, true)
    scope.$watch('width * height', function(){
      width = scope.width, height = scope.height
      svg.attr('width', width).attr('height', height)
      scope.x.range([m.left, width - m.right])
      scope.y.range([m.top, height - m.bottom])
      update()
    })
  }
  function controller($scope){
    $scope.x = d3.scale.linear()
    $scope.y = d3.scale.linear()
  }
  return { 
      link: link
    , restrict: 'A'
    , require: '^dang'
    , controller: controller
  }
})


dang.directive('dangBar', function(){
  function link(scope, el, attr){

  }
  function controller($scope){
    // wow
  }
  return { 
      link: link
    , restrict: 'E'
    , transclude: true
    , controller: controller
    , require: '^dang'
    , template: '<svg><g ng-transclude></g></svg>'
    , replace: true
  }
})

dang.directive('dangAxis', function(){
  function link(scope, el, attr){
    var el = el[0]
    var g = d3.select(el)
    var axis = d3.svg.axis()
    scope.$watch('scale', function(scale){
      axis.scale(scale)
      g.call(axis)
    })
    scope.$watch('orient', function(orient){
      console.log('watching orient', orient)
      axis.orient(orient)
      g.call(axis)
    })

    // $scope.$watch('x', function(x){
    //   console.log('watch x', x)
    // })
    // d3.select(el[0]).append('circle').attr('r', 10).attr('cx', 100)
  }
  return {
     require: ['?^dangSkatter', '?^dangBar']
    , scope: { orient: '=', scale: '=' }
    , restrict: 'A'
    , link: link
  }
})
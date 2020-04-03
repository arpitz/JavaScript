/* This is the Abstract Factory Design Pattern */

(function(win, $){

    function RedCircle(){}

    RedCircle.prototype.create = function(){
        var item = $('<div class="circle"></div>');
        return item;
    }

    function BlueCircle(){}

    BlueCircle.prototype.create = function(){
        var item = $('<div class="circle" style="background: blue"></div>');
        return item;
    }

    var CircleFactory = function(){
        this.types = {};
        this.create = function(type){
            return new this.types[type]().create();
        }

        this.register = function(type, circleClass){
            if(circleClass.prototype.create)
                this.types[type] = circleClass;
        }
    }

    var CircleGeneratorSingleton = (function(){
        var instance, _cf;
        function init(){
            var _aCircle = [],
                _stage = $('.advert'),
                _cf = new CircleFactory();
                _cf.register('red', RedCircle);
                _cf.register('blue', BlueCircle);

            function create(left, top, type){
                var circle = _cf.create(type);
                _position(circle, left, top);
                return circle;
            }

            function add(circle){
                _stage.append(circle);
                _aCircle.push(circle);
            }

            function _position(circle, left, top){
                circle.css('left', left);
                circle.css('top', top);
            }

            function index(){
                return _aCircle.length;
            }

            return{
                index: index,
                create: create,
                add: add
            }
        }

        return{
            getInstance: function(){
                if(!instance){
                    instance = init();
                }
                return instance;
            }
        }  
    })();

    $(win.document).ready(function(){
        $('.advert').click(function(e){
            var cg = CircleGeneratorSingleton.getInstance();
            var circle = cg.create(e.pageX-25, e.pageY-25, "red");
            cg.add(circle);
        })
    })

    $(document).keypress((e) => {
        if(e.key == 'a'){
            var cg = CircleGeneratorSingleton.getInstance();
            var circle = cg.create(Math.floor(Math.random()*600), Math.floor(Math.random()*600), "blue");
            cg.add(circle);
        }
    })

})(window, jQuery);
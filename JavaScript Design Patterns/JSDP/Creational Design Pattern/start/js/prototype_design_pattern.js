/* This is the Prototype Design Pattern */

(function(win, $){

    function clone(src, out){
        for(var attr in src.prototype){
            out.prototype[attr] = src.prototype[attr]; 
        }
    }

    function Circle(){
        this.item = $('<div class="circle"></div>');
    }

    Circle.prototype.color = function(clr){
        this.item.css('background', clr);
    }

    Circle.prototype.move = function(left, top){
        this.item.css('left', left);
        this.item.css('top', top);
    }

    Circle.prototype.get = function(){
        return this.item;
    }

    function Rect(){
        this.item = $('<div class="rect"></div>');
    }

    clone(Circle, Rect);

    function RedCircleBuilder(){
        this.item = new Circle();
        this.init();
    }

    RedCircleBuilder.prototype.init = function(){

    }

    RedCircleBuilder.prototype.get = function(){
        return this.item;
    }

    function BlueCircleBuilder(){
        this.item = new Circle();
        this.init();
    }

    BlueCircleBuilder.prototype.init = function(){
        this.item.color("blue");

        var rect = new Rect();
        rect.color("yellow");
        rect.move(40, 40);

        this.item.get().append(rect.get());
    }

    BlueCircleBuilder.prototype.get = function(){
        return this.item;
    }
    var CircleFactory = function(){
        this.types = {};
        this.create = function(type){
            return new this.types[type]().get();
        }

        this.register = function(type, circleClass){
            if(circleClass.prototype.init && circleClass.prototype.get)
                this.types[type] = circleClass;
        }
    }

    var CircleGeneratorSingleton = (function(){
        var instance, _cf;
        function init(){
            var _aCircle = [],
                _stage = $('.advert'),
                _cf = new CircleFactory();
                _cf.register('red', RedCircleBuilder);
                _cf.register('blue', BlueCircleBuilder);

            function create(left, top, type){
                var circle = _cf.create(type);
                circle.move(left, top);
                return circle;
            }

            function add(circle){
                _stage.append(circle.get());
                _aCircle.push(circle);
            }

            function _position(circle, left, top){
                circle.move(left, top);
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
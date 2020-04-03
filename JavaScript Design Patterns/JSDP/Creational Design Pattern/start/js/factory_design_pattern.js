/* This is the Factory Design Pattern */
/* Based on our requirement, we return that specific object form the Factory */
/* On click we want a Red circle, on keypress we want Blue circle. */

(function(win, $){

    var RedCircle = function(){
        var item = $('<div class="circle"></div>');
        return item;
    }

    var BlueCircle = function(){
        var item = $('<div class="circle" style="background: blue"></div>');
        return item;
    }

    var CircleFactory = function(){
        this.create = function(color){
            if(color === 'blue')
                return new BlueCircle();
            return new RedCircle();
        }
    }

    var CircleGeneratorSingleton = (function(){
        var instance, _cf;
        function init(){
            var _aCircle = [],
                _stage = $('.advert'),
                _cf = new CircleFactory();

            function create(left, top, color){
                var circle = _cf.create(color);
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
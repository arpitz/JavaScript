/* This is the Singleton Design Pattern */
/* It makes only one object and returns the previous constructed object on future calls. */

(function(win, $){
    var CircleGeneratorSingleton = (function(){
        var instance;
        function init(){
            var _aCircle = [],
                _stage = $('.advert');

            function create(left, top){
                var circle = $('<div class="circle"></div>');
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
                    console.log("making new instance");
                }
                console.log("returning already made instance");
                return instance;
            }
        }  
    })();

    $(win.document).ready(function(){
        $('.advert').click(function(e){
            var cg = CircleGeneratorSingleton.getInstance();
            var circle = cg.create(e.pageX-25, e.pageY-25);
            cg.add(circle);
        })
    })

    $(document).keypress((e) => {
        if(e.key == 'a'){
            var cg = CircleGeneratorSingleton.getInstance();
            var circle = cg.create(Math.floor(Math.random()*600), Math.floor(Math.random()*600));
            cg.add(circle);
        }
    })

})(window, jQuery);
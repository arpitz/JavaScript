(function(win, $){
	function clone(src,out){
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
        this.item.css('left',left);
        this.item.css('top',top);
	};

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
	RedCircleBuilder.prototype.init = function() {
		//NOTHING
	};

	RedCircleBuilder.prototype.get = function() {
		return this.item;
	};
	
	function BlueCircleBuilder(){
		this.item = new Circle();
		this.init();
	}

	BlueCircleBuilder.prototype.init = function() {
		this.item.color("blue");

		var rect = new Rect();
        rect.color("yellow");
        rect.move(40,40);
		this.item.get().append(rect.get());
	}; 
	BlueCircleBuilder.prototype.get = function() {
		return this.item;
	};
	
	ShapeFactory = function(){
        this.types = {};
        this.create = function(type){
            return new this.types[type]().get();
        };

        this.register = function(type, cls){
            if(cls.prototype.init && cls.prototype.get){
                this.types[type] = cls;
            }
        }
	};

	var CircleGeneratorSingleton = (function(){
		var instance;
		function init(){
			var _aCircle = [],
                _stage,
                _sf = new ShapeFactory(),
                _cc = new CompositeController(_aCircle);

			function _position(circle, left, top){
				circle.move(left, top);
            }
            
            function registerShape(color, className){
                _sf.register(color, className);
            }

            function setStage(s){
                _stage = s;
            }

			function create(left, top,type){
				var circle = _sf.create(type);
				circle.move(left, top);
				return circle;
            }
            
            function tint(clr){
                _cc.action('color',clr);
            }

            function move(left, top){
                _cc.action("move", left, top);
            }

			function add(circle){
				_stage.add(circle.get());
				_aCircle.push(circle);
			}

			function index(){
				return _aCircle.length;
			}

			return {
                index:index,
                create:create,
                add:add,
                register: registerShape,
                setStage: setStage,
                tint: tint,
                move: move
            };
		}

		return {
			getInstance: function(){
				if(!instance){
					instance = init();
				}
				return instance;
			}
		}
    })();
    
    function StageAdapter(element){
        this.index = 0;
        this.context = $(element);   
    }
    StageAdapter.prototype.SIGNATURE = "stageItem_";

    StageAdapter.prototype.add = function(item){
        ++this.index;
        item.addClass(this.SIGNATURE + this.index);
        this.context.append(item);
    }

    StageAdapter.prototype.remove = function(index){
        this.context.remove('.'+ this.SIGNATURE + index);
    }

    function CompositeController(arr){
        this.arr = arr;
    }

    CompositeController.prototype.action = function(actionType){
        var args = Array.prototype.slice.call(arguments);
        args.shift();
        for(var item in this.arr){
            this.arr[item][actionType].apply(this.arr[item], args);
        }
    }

	$(win.document).ready(function(){
        var cg = CircleGeneratorSingleton.getInstance();
        cg.register("red", RedCircleBuilder);
        cg.register("blue", BlueCircleBuilder);
        cg.setStage(new StageAdapter($('.advert')));

		$('.advert').click(function(e){
			var circle = cg.create(e.pageX-25, e.pageY-25,"red");
			cg.add(circle);
		});

		$(document).keypress(function(e){
			if(e.key=='a'){
				var circle = cg.create(Math.floor(Math.random()*600),
										Math.floor(Math.random()*600),"blue");
				cg.add(circle);
			} else if(e.key=='t'){
				cg.tint("black");
			} else if(e.key=='r' || e.key=='ArrowRight'){
				cg.move("+=5px", "+=0px");
			} else if(e.key=='l' || e.key=='ArrowLeft'){
				cg.move("-=5px", "+=0px");
			}
		});
	});

})(window, jQuery);
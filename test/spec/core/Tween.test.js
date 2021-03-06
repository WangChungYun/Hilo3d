const Tween = Hilo3d.Tween;
const Ease = Hilo3d.Tween.Ease;
const Ticker = Hilo3d.Ticker;

describe('Tween', function(){
    describe('Tween', function(){
        var ticker = new Ticker(60);
        ticker.addTick(Tween);
        ticker.start();

        var obj;
        beforeEach('init obj', function(){
            obj = {x:0,y:0};
        });

        it('fromTo', function(done){
            var startTime = Date.now();
            Tween.fromTo(obj, {
                x:50, y:50
            }, {
                x:100, y:100
            },{
                duration:300,
                delay:200,
                onStart:function(){
                    try{
                        if (!window._IS_CI) {
                            (Date.now() - startTime).should.be.within(180, 250);
                        }
                        obj.should.eql({x:50, y:50});
                    }
                    catch(e){
                        done(e);
                    }
                },
                onComplete:function(){
                    try{
                        if (!window._IS_CI) {
                            (Date.now() - startTime).should.be.within(460, 600);
                        }
                        obj.should.eql({x:100, y:100});
                        done();
                    }
                    catch(e){
                        done(e);
                    }
                }
            });
        });

        it('add & remove', function(){
            var tween = new Tween(obj, {}, {});
            Tween.add(tween);
            tween.should.be.equalOneOf(Tween._tweens);
            Tween.remove(tween);
            tween.should.not.be.equalOneOf(Tween._tweens);
        });

        it('removeAll', function(){
            Tween.add(new Tween(obj, {}, {}));
            Tween.add(new Tween(obj, {}, {}));
            Tween.add(new Tween(obj, {}, {}));
            Tween.removeAll();
            Tween._tweens.length.should.equal(0);
        });

        it('seek', function(){
            var tween = new Tween(obj, {x:0, y:0}, {x:100, y:100}, {paused:true, duration:1});
            tween.seek(0);
            obj.should.eql({x:0, y:0});
            tween.seek(0.8);
            obj.should.eql({x:80, y:80});
            tween.seek(1);
            obj.should.eql({x:100, y:100});
        });

    });

    describe('Ease', function(){
        var easeTypeNames = ['Linear', 'Quad', 'Cubic', 'Quart', 'Quint', 'Sine', 'Expo', 'Circ', 'Elastic', 'Back', 'Bounce'];
        var easeFunctionNames = ['EaseNone', 'EaseIn', 'EaseOut', 'EaseInOut'];

        easeTypeNames.forEach(function(easeTypeName){
            var easeType = Ease[easeTypeName];
            it(easeTypeName, function(){
                easeFunctionNames.forEach(function(easeFunctionName){
                    var easeFunction = easeType[easeFunctionName];
                    if(easeFunction){
                        Math.abs(easeFunction(0) - 0).should.belowOrEqual(0.000999);
                        Math.abs(easeFunction(1) - 1).should.belowOrEqual(0.000999);
                    }
                });
            });
        });
    });
});

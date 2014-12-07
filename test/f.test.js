/* global describe, it, beforeEach*/

var f = require('./../src/f.js');
var expect = require('expect.js');

describe('f unctional', function (){

  // if (typeof window != 'undefined') {
  //   beforeEach(function (done) {
  //     setTimeout(function (){ done(); }, 15);
  //   });
  // }

  it('should have a version', function (){
    expect(f).to.have.property('VERSION');
  });

  describe('.o()', function (){

    it('should fail if no arguments passed', function (){
      expect(f.o).to.throwError();
    });

    it('should return the only argument', function (){
      var noop = function (){};
      expect(f.o(noop)).to.equal(noop);
    });

    it('should compose n functions from left to right', function (){
      function plusTwo (x){ return x + 2; }
      function minusOne (x){ return x - 1; }
      function threeTimes (x){ return x * 3; }
      var composed = f.o(plusTwo, minusOne, threeTimes);
      expect(composed(1)).to.equal(4);
    });

    it('should call the wrapped function is the context of the wrapper', function (){
      function setValue (value){ this.value = value; }
      var ctx = {},
          composed = f.o(setValue, Number);

      composed.call(ctx, '123');

      expect(ctx).to.have.property('value', 123);
    });

  });

  describe('.uncurry()', function (){

    it('should fail without input when result is called', function (){
      expect(f.uncurry()).to.throwError();
    });

    it('the resulting function should take its context as first argument', function (){
      expect(f.uncurry(''.trim)(' to be trimmed ')).to.equal('to be trimmed');
    });

    it('the resulting function should ignore whichever context it is call in ' +
       'i.e. the first argument takes precedence', function (){
      expect(f.uncurry(''.trim).call(' ignored ', ' trimmed ')).to.equal('trimmed');
    });

  });

  describe('.curry()', function (){

    it('should fail without any arguments', function (){
      expect(f.curry).to.throwError();
    });

    it('should curry the given function with the accompanying arguments', function (){
      expect(f.curry(Math.max, 1, 2)()).to.equal(2);
    });

    it('should append the next to the previous arguments', function (){
      expect(f.curry(Math.max, 1)(2)).to.equal(2);
    });

    it('should always return yet another function as long as ' +
       'there were less arguments passed than required', function (){
      expect(f.curry(Math.max)(1)(2)).to.equal(2);
    });

    it('should accept `don\'t-cares` and fill them in the right order', function (){
      function concat(a, b){ return a.concat(b); }
      expect(f.curry(concat, f, 'world!')('hello ')).to.equal('hello world!');
    });

    it('should accept the number of required arguments as the first argument', function (){
      expect(f.curry(3, Math.max)(1)(2)(3)).to.equal(3);
    });

  });

  describe('.chsig()', function (){

    it.skip('still missing..');
  });

});

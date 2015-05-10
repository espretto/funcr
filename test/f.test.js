/* global describe, it, beforeEach*/

var f = require('./../build/f.compat-1.1.1.js');
var expect = require('expect.js');

describe('f unctional', function (){

  // <= ie8 seems having trouble
  // ---------------------------
  // if (typeof window != 'undefined') {
  //   beforeEach(function (done) {
  //     setTimeout(function (){ done(); }, 15);
  //   });
  // }

  it('should have a version', function (){
    expect(f).to.have.property('VERSION');
  });

});

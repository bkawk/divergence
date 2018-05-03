const slop = require('../src/functions/slope');

var chai = require('chai'),
    should = chai.should,
    expect = chai.expect,
    assert = chai.assert;

    describe('Slope tests', function () {
        it("When infinity always true", function(){
            //infinity always true
            expect(slop(2,3,4), true);
            expect(slop(2,4,3), false);
        });
        it("Should return true", function(){
            expect(slop(0,5,4), true);
        });
        it("Should return false", function(){  
            expect(slop(0,2,4), false);
        });
    });   
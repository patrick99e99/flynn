describe("Util.minMaxBound()", function() {
    var bottom = 6;
    var top = 9;
    var original_value;
    var bounded_value;

    it("returns original value if within bounds", function() {
        for(original_value=bottom; original_value<=top; ++original_value){
            bounded_value = Flynn.Util.minMaxBound(original_value, bottom, top);
            expect(bounded_value).toEqual(original_value);
        }
    });

    it("returns upper bound for values that are above bounds", function() {
        for(original_value=top+1; original_value<=top+3; ++original_value){
            bounded_value = Flynn.Util.minMaxBound(original_value, bottom, top);
            expect(bounded_value).toEqual(top);
        }
    });

    it("returns lower bound for values that are below bounds", function() {
        for(original_value=bottom-3; original_value<bottom; ++original_value){
            bounded_value = Flynn.Util.minMaxBound(original_value, bottom, top);
            expect(bounded_value).toEqual(bottom);
        }
    });

});

describe("Util.angleBound2Pi()", function() {
    var original_angle;
    var bounded_angle;
    var offset_angle;
    it("returns original angle > 0 and < 2*Pi", function() {
        for(original_angle=0; original_angle<Math.PI*2; original_angle+=Math.PI/8){
            bounded_angle = Flynn.Util.angleBound2Pi(original_angle);
            expect(bounded_angle).toEqual(original_angle);
        }
    });

    it("returns equivalent angle between 0 and 2*Pi if angle > 2*Pi", function() {
        for(offset_angle=Math.PI*2; offset_angle<=Math.PI*4; offset_angle+=Math.PI*2){
            for(original_angle=0; original_angle<=Math.PI*2; original_angle+=Math.PI/8){
                bounded_angle = Flynn.Util.angleBound2Pi(original_angle+offset_angle);
                expect(bounded_angle).toBeCloseTo(original_angle);
            }
        }
    });

    it("returns equivalent angle between 0 and 2*Pi if angle < 0", function() {
        for(offset_angle=-Math.PI*2; offset_angle>=-Math.PI*4; offset_angle-=Math.PI*2){
            for(original_angle=0; original_angle<=Math.PI*2; original_angle+=Math.PI/8){
                bounded_angle = Flynn.Util.angleBound2Pi(original_angle+offset_angle);
                expect(bounded_angle).toBeCloseTo(original_angle);
            }
        }
    });
});

describe("Util.zeroPad()", function() {
    var i;
    var result_text;
    var data = [
        [ 1, 2,     "01"],
        [ 9, 3,    "009"],
        [10, 3,    "010"],
        [99, 3,    "099"],
        [ 9, 6, "000009"],
    ];
    it("returns a zero padded string when passed a number shorter than the requested pad length", function() {
        for(i=0; i<data.length; i++){
            result_text = Flynn.Util.zeroPad(data[i][0], data[i][1]);
            expect(result_text).toEqual(data[i][2]);
        }
    });

    data = [
        [   11, 2, "11"  ],
        [  999, 3, "999" ],
        [ 9999, 3, "9999"],
    ];
    it("returns an unpadded string when passed a number longer than or equal to the requested pad length", function() {
        for(i=0; i<data.length; i++){
            result_text = Flynn.Util.zeroPad(data[i][0], data[i][1]);
            expect(result_text).toEqual(data[i][2]);
        }
    });


});

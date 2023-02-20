    subgroup = []; // = [2, 3, 5]; // draggable control points
    mapping = []; // = [2, pow(2, 19/12f), pow(2, 28/12f)];

    points = []; // list of points on the ruler
    pointMapped = []; // to store calculated values

    // [points, pointMapped] tuple lookup table?
    
    // interactive
    xShift = -20;
    xScale = 50;

    lineYPos = 100;
    lineHeight = 20;
    
    // of course, all the numbers above should be bigdecimal
    constructor(s, m, lb, ub, lyp, lh) {
        this.subgroup = s;
        this.mapping = m;
        this.points = listSmooth(s, lb, ub); // lower/upper bounds
        this.lineYPos = 100;
        this.lineHeight = 20;
    }

    // two modes of moving control points:
    // "coarse": just drag the point (shift to snap to grid)
    // "fine": click the point, move/zoom, click another point,
    // shaded control point appears, press [place] button 
    // to confirm

    // detect the mouse movement:
    mouseOver() {
        // make the button of the control point light up
    }

    // if moved:
    update() { // something like that, not a real function for now
        // really, nothing is. this isn't even pseudocode, just
        // a medium for communication.
        
        // update the mapping numbers if the control points moved
        // update the graphics if the background moved 
    }

    draw() {
        // just draw the dang thing already
        // colored control points (maybe the shape instead,
        // ◇ for control, ○ for everything else)
        
        // scale (decimal, can zoom in infinitely)
        // might display another zoom in view by communicating with 
        // another SlideRuleShaft object, preferrably inside
        // a SlideRule.
    }
}
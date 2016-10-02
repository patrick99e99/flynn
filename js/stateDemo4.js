if (typeof Game == "undefined") {
   var Game = {};  // Create namespace
}

// Star colors from http://www.vendian.org/mncharity/dir3/starcolor/
Game.star_colors_realistic = [
    '#9bb2ff', '#9eb5ff', '#a3b9ff', '#aabfff', '#b2c5ff', '#bbccff', '#c4d2ff', '#ccd8ff', 
    '#d3ddff', '#dae2ff', '#dfe5ff', '#e4e9ff', '#e9ecff', '#eeefff', '#f3f2ff', '#f8f6ff', 
    '#fef9ff', '#fff9fb', '#fff7f5', '#fff5ef', '#fff3ea', '#fff1e5', '#ffefe0', '#ffeddb', 
    '#ffebd6', '#ffe9d2', '#ffe8ce', '#ffe6ca', '#ffe5c6', '#ffe3c3', '#ffe2bf', '#ffe0bb', 
    '#ffdfb8', '#ffddb4', '#ffdbb0', '#ffdaad', '#ffd8a9', '#ffd6a5', '#ffd5a1', '#ffd29c', 
    '#ffd096', '#ffcc8f', '#ffc885', '#ffc178', '#ffb765', '#ffa94b', '#ff9523', '#ff7b00', 
    '#ff5200'
];

Game.star_colors_simple = [
    Flynn.Colors.DODGERBLUE,
    Flynn.Colors.CYAN,
    Flynn.Colors.RED,
    Flynn.Colors.YELLOW,    
];

Game.StarField = Flynn.State.extend({
    init: function(width, height, density, realistic_colors) {
        // density is in stars per 100x100 pixel area
        
        this.stars=[];
        var num_stars = Math.floor((width/100) * (height/100) * density);
        var i;
        var star_color;

        for(i=0; i<num_stars; i++){
            if(realistic_colors){
                star_color = Flynn.Util.randomChoice(Game.star_colors_realistic);
            }
            else{
                star_color = Flynn.Util.randomChoice(Game.star_colors_simple);
            }
            this.stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                color: Flynn.Util.shadeBlend(
                    -Math.random(),
                    star_color)
            });
        }
    },

    render: function(ctx){
        var i, len;

        for(i=0, len=this.stars.length; i<len; i++){
            ctx.fillStyle=this.stars[i].color;
            ctx.fillRect(
                this.stars[i].x - Flynn.mcp.viewport.x,
                this.stars[i].y - Flynn.mcp.viewport.y,
                2,
                2);
        }
    }
});

Game.StateDemo4 = Flynn.State.extend({

    VIEWPORT_SWEEP_ANGLE_SPEED: 0.008,

    init: function() {
        var i, x, len;
        this._super();
   
        this.center_x = Flynn.mcp.canvasWidth/2;
        this.center_y = Flynn.mcp.canvasHeight/2;

        this.world_rect = new Flynn.Rect(
            0, 0, Flynn.mcp.canvasWidth * 2, Flynn.mcp.canvasHeight * 2
            );

        this.starfield = new Game.StarField(
            this.world_rect.width,
            this.world_rect.height,
            4,    // density
            false // realistic_colors
            );
        this.viewport_sweep_angle = 0;

        this.viewport_sweep_radius = Flynn.mcp.canvasHeight / 2;

        var poly_init = [
            {points:Game.Points.SHIP,        scale:3, color: Flynn.Colors.DODGERBLUE},
            {points:Game.Points.SHIPB,       scale:3, color: Flynn.Colors.RED},
            {points:Game.Points.POINTY_SHIP, scale:3, color: Flynn.Colors.GREEN},
            {points:Game.Points.STAR_WING,   scale:3, color: Flynn.Colors.ORANGE},
            {points:Game.Points.ABSTRACT,    scale:3, color: Flynn.Colors.MAGENTA},
            {points:Game.Points.RESPAWN,     scale:3, color: Flynn.Colors.CYAN}
            ];
        this.polygons = [];
        var poly_radius = 300;
        var angle_step = Math.PI*2/poly_init.length;
        for (i=0,len=poly_init.length; i<len; i++){
            this.polygons.push(new Flynn.Polygon(
                poly_init[i].points,
                poly_init[i].color,
                poly_init[i].scale, 
                {   x:this.world_rect.center_x + Math.cos(i*angle_step) * poly_radius, 
                    y:this.world_rect.center_y + Math.sin(i*angle_step) * poly_radius, 
                    is_world:true}
                ));
        }

        this.extra_lives_poly = new Flynn.Polygon(
            Game.Points.SHIP,
            Flynn.Colors.DODGERBLUE,
            3.0, // scale
            {   x:0, // Will be set when rendering instances
                y:70, 
                is_world:false}
            );
        this.extra_lives_poly.setAngle(-Math.PI/2);

    },

    handleInputs: function(input, paceFactor) {
        
        if (input.virtualButtonWasPressed("UI_right")){
            Flynn.mcp.nextState = Game.States.HOME;
        }
        if (input.virtualButtonWasPressed("UI_left")){
            Flynn.mcp.nextState = Game.States.DEMO3;
        }

        if(Flynn.mcp.developerModeEnabled){
            // Metrics toggle
            if (input.virtualButtonWasPressed("dev_metrics")){
                Flynn.mcp.canvas.showMetrics = !Flynn.mcp.canvas.showMetrics;
            }

            // Toggle DEV pacing mode slow mo
            if (input.virtualButtonWasPressed("dev_slow_mo")){
                Flynn.mcp.toggleDevPacingSlowMo();
            }

            // Toggle DEV pacing mode fps 20
            if (input.virtualButtonWasPressed("dev_fps_20")){
                Flynn.mcp.toggleDevPacingFps20();
            }
        }
    },

    update: function(paceFactor) {
        var i, len;

        // Swirl the viewport around the world center
        this.viewport_sweep_angle += this.VIEWPORT_SWEEP_ANGLE_SPEED * paceFactor;
        Flynn.mcp.viewport.x = (
              this.world_rect.center_x 
            + Math.cos(this.viewport_sweep_angle) * this.viewport_sweep_radius
            - Flynn.mcp.canvasWidth / 2 
            );
        Flynn.mcp.viewport.y = (
              this.world_rect.center_y 
            + Math.sin(this.viewport_sweep_angle) * this.viewport_sweep_radius
            - Flynn.mcp.canvasHeight / 2 
            );

        // Rotate polydons
        for (i=0,len=this.polygons.length; i<len; i++){
            this.polygons[i].setAngle(this.polygons[i].angle - Math.PI/60.0 * paceFactor * (1 + 0.2*i));
        }

    },

    render: function(ctx){

        ctx.clearAll();

        var left_x = 10;
        var margin = 3;
        var i, j, x, len;
        var heading_color = Flynn.Colors.YELLOW;
        var curret_y = 42;

        ctx.vectorText("SCREEN COORDINATES VS. WORLD COORDINATES", 1.5, left_x, curret_y, null, heading_color);
        
        this.starfield.render(ctx);
        for (i=0,len=this.polygons.length; i<len; i++){
            this.polygons[i].render(ctx);
            // Render text in world coordinates
            ctx.vectorText(
                "SHIP "+i, 
                1.5, // scale
                this.polygons[i].position.x-24, 
                this.polygons[i].position.y+30, 
                null,
                Flynn.Colors.YELLOW,
                true // is_world
                );
            }

        ctx.vectorTextArc(
            "ARC TEXT IN WORLD COORDINATES",
            2.0, 
            this.world_rect.center_x, 
            this.world_rect.center_y, 
            -Math.PI/2, 
            100,   // radius
            Flynn.Colors.CYAN,
            true,  // is_centered
            false, // is_reversed
            true   // is_world
            );

        var box_size = 80;
        ctx.vectorRect(
            this.world_rect.center_x - box_size/2,
            this.world_rect.center_y - box_size/2,
            box_size,
            box_size,
            Flynn.Colors.MAGENTA,
            null,   // fill_color
            true    // is_world
            );


        Game.render_page_frame (ctx, Game.States.DEMO4);

        // Extra lives
        for(i=0;i<3;i++){
            this.extra_lives_poly.position.x = Flynn.mcp.canvasWidth - 30 - i*30;
            this.extra_lives_poly.render(ctx);
        }
    },

});
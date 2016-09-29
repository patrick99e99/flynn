if (typeof Game == "undefined") {
   var Game = {};  // Create namespace
}

Game.StateDemo2 = Flynn.State.extend({

    GRAVITY_X: 0,
    GRAVITY_Y: 9.86,     
    RENDER_SCALE: 100, // 100 pixels == 1 meter
    SPAWN_MARGIN: 100,

    WALL_THICKNESS: 20,
    WALL_HEIGHT: 600,
    WALL_MARGIN: 20,


    init: function(mcp) {
        var i, x;
        this._super(mcp);
        
        this.canvasWidth = mcp.canvas.ctx.width;
        this.canvasHeight = mcp.canvas.ctx.height;
        this.center_x = this.canvasWidth/2;
        this.center_y = this.canvasHeight/2;
        this.viewport_v = new Victor(0,0);
        this.gameClock = 0;
        this.render_dirty = true;

        this.physics = new Flynn.Physics(mcp.canvas.ctx, this.GRAVITY_X, this.GRAVITY_Y, this.RENDER_SCALE);

        var SPAWN_MARGIN = 50;

        // Floor
        new Flynn.Body(this.physics, { type: "static",
            x: (this.canvasWidth/2)/this.RENDER_SCALE,
            y: (this.canvasHeight-this.WALL_MARGIN-(this.WALL_THICKNESS/2))/this.RENDER_SCALE,
            height: this.WALL_THICKNESS/this.RENDER_SCALE,
            width: (this.canvasWidth-(2*this.WALL_MARGIN))/this.RENDER_SCALE,
            color: Flynn.Colors.GRAY,
            });
        // Walls
        for(i=0; i<2; i++){
            x = this.WALL_MARGIN + (this.WALL_THICKNESS/2);
            if(i==1){
                // Reflect to right hand side
                x = this.canvasWidth - x;
            }
            new Flynn.Body(this.physics, { type: "static",
                x: x/this.RENDER_SCALE,
                y: (this.canvasHeight-this.WALL_MARGIN-this.WALL_THICKNESS-(this.WALL_HEIGHT/2)+1)/this.RENDER_SCALE,
                height: this.WALL_HEIGHT/this.RENDER_SCALE,
                width: this.WALL_THICKNESS/this.RENDER_SCALE,
                color: Flynn.Colors.GRAY,
                });
        }


        for(i=0; i<10; i++){
            new Flynn.Body(this.physics, {
                x: (SPAWN_MARGIN +  Math.random() * (this.canvasWidth  - 2*SPAWN_MARGIN))/this.RENDER_SCALE,
                y: (SPAWN_MARGIN +  Math.random() * (this.canvasHeight - 2*SPAWN_MARGIN))/this.RENDER_SCALE,
                shape:"circle",
                radius: 30/this.RENDER_SCALE,
                color: Flynn.Colors.MAGENTA,
                render_sides: 10,
                });
            new Flynn.Body(this.physics, {
                x: (SPAWN_MARGIN +  Math.random() * (this.canvasWidth  - 2*SPAWN_MARGIN))/this.RENDER_SCALE,
                y: (SPAWN_MARGIN +  Math.random() * (this.canvasHeight - 2*SPAWN_MARGIN))/this.RENDER_SCALE,
                shape:"circle",
                radius: 20/this.RENDER_SCALE,
                color: Flynn.Colors.CYAN,
                render_sides: 5,
                });
            new Flynn.Body(this.physics, {
                x: (SPAWN_MARGIN +  Math.random() * (this.canvasWidth  - 2*SPAWN_MARGIN))/this.RENDER_SCALE,
                y: (SPAWN_MARGIN +  Math.random() * (this.canvasHeight - 2*SPAWN_MARGIN))/this.RENDER_SCALE,
                height: 30/this.RENDER_SCALE,
                width: 30/this.RENDER_SCALE,
                color: Flynn.Colors.YELLOW,
                });
            new Flynn.Body(this.physics, {
                x: (SPAWN_MARGIN +  Math.random() * (this.canvasWidth  - 2*SPAWN_MARGIN))/this.RENDER_SCALE,
                y: (SPAWN_MARGIN +  Math.random() * (this.canvasHeight - 2*SPAWN_MARGIN))/this.RENDER_SCALE,
                height: 30/this.RENDER_SCALE,
                width: 60/this.RENDER_SCALE,
                color: Flynn.Colors.GREEN,
                });
            new Flynn.Body(this.physics, {
                x: (SPAWN_MARGIN +  Math.random() * (this.canvasWidth  - 2*SPAWN_MARGIN))/this.RENDER_SCALE,
                y: (SPAWN_MARGIN +  Math.random() * (this.canvasHeight - 2*SPAWN_MARGIN))/this.RENDER_SCALE,
                points:[
                    new Box2D.Common.Math.b2Vec2(0, +20/this.RENDER_SCALE),
                    new Box2D.Common.Math.b2Vec2(0, -20/this.RENDER_SCALE),
                    new Box2D.Common.Math.b2Vec2(120/this.RENDER_SCALE, 0),
                    // [0, -10/this.RENDER_SCALE]
                ],
                color: Flynn.Colors.ORANGE,
                shape:"polygon",
                });
        }

    },

    handleInputs: function(input, paceFactor) {
        
        if (input.virtualButtonIsPressed("right")){
            this.mcp.nextState = Game.States.DEMO3;
        }
        if (input.virtualButtonIsPressed("left")){
            this.mcp.nextState = Game.States.DEMO1;
        }

        if(this.mcp.developerModeEnabled){
            // Metrics toggle
            if (input.virtualButtonIsPressed("dev_metrics")){
                this.mcp.canvas.showMetrics = !this.mcp.canvas.showMetrics;
            }

            // Toggle DEV pacing mode slow mo
            if (input.virtualButtonIsPressed("dev_slow_mo")){
                this.mcp.toggleDevPacingSlowMo();
            }

            // Toggle DEV pacing mode fps 20
            if (input.virtualButtonIsPressed("dev_fps_20")){
                this.mcp.toggleDevPacingFps20();
            }
        }
    },

    update: function(paceFactor) {
        this.gameClock += paceFactor;
        this.physics.update(paceFactor);
    },

    render: function(ctx){

        ctx.clearAll();

        var left_x = 10;
        var margin = 3;
        var i, j, x;
        var heading_color = Flynn.Colors.YELLOW;
        
        Game.render_page_frame (ctx, Game.States.DEMO2);

        this.physics.render(ctx);
    },

});
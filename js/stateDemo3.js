if (typeof Game == "undefined") {
   var Game = {};  // Create namespace
}

Game.StateDemo3 = Flynn.State.extend({

    CROSSHAIR_SPEED: 3,
    BULLET_SPEED: 4,
    BULLET_LIFETIME: 2 * 60,

    init: function() {
        var i, x;
        this._super();
        
        this.center_x = Flynn.mcp.canvasWidth/2;
        this.center_y = Flynn.mcp.canvasHeight/2;
        this.viewport_v = new Victor(0,0);
        this.gameClock = 0;

        this.collision_rects = [
            new Flynn.Rect( 30,   60, 150, 150),
            new Flynn.Rect( 30,  240, 150, 150),
            new Flynn.Rect( 200, 240, 150, 150)
            ];

        this.joystick_test_rect = new Flynn.Rect(Flynn.mcp.canvasWidth-476, 60, 450, 450);

        this.polygons = [];
        var poly_info = [
            {   points: Game.Points.COLLISION1, 
                scale: 10.5, 
                position:{
                    x: this.collision_rects[0].center_x,
                    y: this.collision_rects[0].center_y,
                    is_world: false
                }
            },
            {   points: Game.Points.COLLISION1, 
                scale: 10.5,
                position: {
                    x: this.collision_rects[1].center_x,
                    y: this.collision_rects[1].bottom + 100,
                    is_world: false
                }
            },
            {   points:Game.Points.COLLISION2, 
                scale:7.0,
                position:{
                    x:this.collision_rects[1].center_x + 110, 
                    y: this.collision_rects[1].bottom + 100,
                    is_world: false
                }
            },
            {   points:Game.Points.TRI4_MAIN, 
                scale: 15.0, 
                position:{
                    x: this.collision_rects[1].center_x,
                    y: this.collision_rects[1].center_y,
                    is_world: false
                }
            },
            {   points:Game.Points.TRI4_MAIN, 
                scale: 15.0, 
                position:{
                    x: this.collision_rects[2].center_x,
                    y: this.collision_rects[2].center_y,
                    is_world: false
                }
            }
            ];
        for (i=0; i<poly_info.length; i++){
            this.polygons.push(new Flynn.Polygon(
                poly_info[i].points, 
                Flynn.Colors.GRAY,
                poly_info[i].scale,
                poly_info[i].position
                ));
        }

        this.polygons[3].setBoundingPoly(Game.Points.TRI4_BOUNDS);
        this.polygons[4].setBoundingPoly(Game.Points.TRI4_BOUNDS);
        this.polygons[4].bounding_visible = true;
        this.bounding_collision = false;

        this.crosshair_poly = new Flynn.Polygon(
            Game.Points.CROSSHAIR, 
            Flynn.Colors.WHITE,
            3,
            {
                x: this.joystick_test_rect.center_x,
                y: this.joystick_test_rect.center_y,
                is_world: false
            });

        this.projectiles = new Flynn.Projectiles(
            this.joystick_test_rect, // bounds_rect
            false                    // is_world=false (use screen coordinates)
            );

        this.bullet = {
            x:this.collision_rects[0].center_x, 
            y:this.collision_rects[0].center_y,
            dx: 1,
            dy: 0.35,
            size:3,
        };

        // this.targets=[
        //     {poly_index:1, x:this.collision_rects[0].center_x,     y:310},
        //     {poly_index:2, x:this.collision_rects[0].center_x+110, y:310}
        // ];

        Flynn.mcp.input.showTouchRegion('fire_l');
        Flynn.mcp.input.showTouchRegion('fire_r');
        Flynn.mcp.input.showVirtualJoystick('stick');
        Flynn.mcp.input.showVirtualJoystick('stick2');
    },

    handleInputs: function(input, paceFactor) {
        
        if (input.virtualButtonWasPressed("UI_right")){
            Flynn.mcp.nextState = Game.States.DEMO4;
        }
        if (input.virtualButtonWasPressed("UI_left")){
            Flynn.mcp.nextState = Game.States.DEMO2;
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

        // Move crosshair
        if (input.virtualButtonIsDown("left")){
            this.crosshair_poly.position.x = Math.max(
                this.crosshair_poly.position.x - this.CROSSHAIR_SPEED * paceFactor,
                this.joystick_test_rect.left);
        }
        if (input.virtualButtonIsDown("right")){
            this.crosshair_poly.position.x = Math.min(
                this.crosshair_poly.position.x + this.CROSSHAIR_SPEED * paceFactor,
                this.joystick_test_rect.right);
        }
        if (input.virtualButtonIsDown("up")){
            this.crosshair_poly.position.y = Math.max(
                this.crosshair_poly.position.y - this.CROSSHAIR_SPEED * paceFactor,
                this.joystick_test_rect.top);
        }
        if (input.virtualButtonIsDown("down")){
            this.crosshair_poly.position.y = Math.min(
                this.crosshair_poly.position.y + this.CROSSHAIR_SPEED * paceFactor,
                this.joystick_test_rect.bottom);
        }

        // Fire
        if (input.virtualButtonWasPressed("fire_l")){
            console.log("fire left");
            this.projectiles.add(
                this.crosshair_poly.position,
                {x:-this.BULLET_SPEED, y:0},
                this.BULLET_LIFETIME,
                3,
                Flynn.Colors.YELLOW
                );
        }
        if (input.virtualButtonWasPressed("fire_r")){
            console.log("fire right");
            this.projectiles.add(
                this.crosshair_poly.position,
                {x:this.BULLET_SPEED, y:0},
                this.BULLET_LIFETIME,
                3,
                Flynn.Colors.YELLOW
                );
        }
    },

    update: function(paceFactor) {
        this.gameClock += paceFactor;
        this.projectiles.update(paceFactor);

        var i;
        for (i=0; i<this.polygons.length; i++){
            this.polygons[i].setAngle(this.polygons[i].angle + 
            Math.PI/280.0 * Math.pow(1.2, Math.min(i,3)) * paceFactor);
        }

        this.bullet.x += this.bullet.dx * paceFactor;
        if(   (this.bullet.dx > 0 && this.bullet.x > this.collision_rects[0].right)
           || (this.bullet.dx < 0 && this.bullet.x < this.collision_rects[0].left)){
            this.bullet.dx = -this.bullet.dx;
            this.bullet.x += this.bullet.dx * paceFactor;
        }
        this.bullet.y += this.bullet.dy * paceFactor;
        if(   (this.bullet.dy > 0 && this.bullet.y > this.collision_rects[0].bottom)
           || (this.bullet.dy < 0 && this.bullet.y < this.collision_rects[0].top)){
            this.bullet.dy = -this.bullet.dy;
            this.bullet.y += this.bullet.dy * paceFactor;
        }

        if(this.polygons[0].hasPoint(
            0,0,
            this.bullet.x-this.collision_rects[0].center_x,
            this.bullet.y-this.collision_rects[0].center_y)){
            // Collided
            this.polygons[0].color = Flynn.Colors.RED;
        }
        else{
            // Not collided
            this.polygons[0].color = Flynn.Colors.GRAY;
        }

        this.bounding_collision = this.polygons[3].hasPoint(
            0,0,
            this.bullet.x-this.collision_rects[0].center_x,
            this.bullet.y-this.collision_rects[0].center_y
            );

        if(this.polygons[2].is_colliding(this.polygons[1])){
            // Collided
            this.polygons[1].color = Flynn.Colors.RED;
            this.polygons[2].color = Flynn.Colors.RED;
        }
        else{
            // Not collided
            this.polygons[1].color = Flynn.Colors.GRAY;
            this.polygons[2].color = Flynn.Colors.GRAY;
        }
    },

    render: function(ctx){

        ctx.clearAll();

        this.projectiles.render(ctx);

        var left_x = 10;
        var indent = 20;
        var i, j, x, name, color, len;
        var heading_color = Flynn.Colors.YELLOW;
        var button_list=['up', 'left', 'right', 'down', 'fire_l', 'fire_r'];
        var curret_y = 42;
        
        Game.render_page_frame (ctx, Game.States.DEMO3);

        ctx.vectorText("POINT COLLISION", 1.5, left_x, curret_y, 'left', heading_color);
        curret_y += 175;
        ctx.vectorText("POINT COLLISION WITH BOUNDING POLYGON", 1.5, left_x, curret_y, 'left', heading_color);
        for(i=0; i<this.collision_rects.length; i++){
            ctx.vectorRect(
                this.collision_rects[i].left, 
                this.collision_rects[i].top, 
                this.collision_rects[i].width,
                this.collision_rects[i].height,
                Flynn.Colors.DODGERBLUE);
        }
        ctx.vectorText("HIDDEN", 
            1.5, 
            this.collision_rects[1].left + 8, 
            this.collision_rects[1].top + 8,
            'left', 
            Flynn.Colors.YELLOW);
        ctx.vectorText("VISIBLE", 
            1.5, 
            this.collision_rects[2].left + 8, 
            this.collision_rects[2].top + 8,
            'left', 
            Flynn.Colors.YELLOW);

        ctx.fillStyle=Flynn.Colors.YELLOW;
        ctx.fillRect(
            this.bullet.x - this.bullet.size/2,
            this.bullet.y - this.bullet.size/2,
            this.bullet.size,
            this.bullet.size);

        if(this.bounding_collision){
            ctx.fillStyle=Flynn.Colors.RED;
        }
        else{
            ctx.fillStyle=Flynn.Colors.YELLOW;
        }
        var y_offset = this.collision_rects[1].top - this.collision_rects[0].top;
        ctx.fillRect(
            this.bullet.x - this.bullet.size/2,
            this.bullet.y - this.bullet.size/2 + y_offset,
            this.bullet.size,
            this.bullet.size);
        var x_offset = this.collision_rects[2].left - this.collision_rects[1].left;
        ctx.fillRect(
            this.bullet.x - this.bullet.size/2 + x_offset,
            this.bullet.y - this.bullet.size/2 + y_offset,
            this.bullet.size,
            this.bullet.size);

        curret_y = this.collision_rects[1].bottom + 10;
        ctx.vectorText("LOSSY POLYGON COLLISION", 1.5, left_x, curret_y, 'left', heading_color);

        for (i=0; i<this.polygons.length; i++){
            this.polygons[i].render(ctx);
        }
        // Show collision verticies
        for (i=0, len=this.polygons[2].points.length; i<len; i+=2){
            ctx.fillStyle=Flynn.Colors.YELLOW;
            ctx.fillRect(
                this.polygons[2].position.x + this.polygons[2].points[i]-1,
                this.polygons[2].position.y + this.polygons[2].points[i+1]-1,
                3,
                3);
        }

        left_x = 450;
        curret_y = 42;
        ctx.vectorText("BUTTONS", 1.5, left_x, curret_y, 'left', heading_color);
        for (i=0; i<button_list.length; i++){
            name = button_list[i];
            if(Flynn.mcp.input.virtualButtonIsDown(name)){
                color = Flynn.Colors.GREEN;
            }
            else{
                color = Flynn.Colors.GRAY;
            }
            curret_y += 20;
            ctx.vectorText(name, 1.5, left_x + indent, curret_y, 'left', color);
        }

        ctx.vectorRect(
            this.joystick_test_rect.left, 
            this.joystick_test_rect.top, 
            this.joystick_test_rect.width,
            this.joystick_test_rect.height,
            Flynn.Colors.DODGERBLUE);

        this.crosshair_poly.render(ctx);

    },

});
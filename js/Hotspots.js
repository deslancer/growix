class Hotspots {
    constructor(name, size, position,color,adv_texture, scene) {
        this.scene = scene;
        this.mesh = '';

        this.size = size;
        this.mesh_position = position;
        this.actionManager = new BABYLON.ActionManager(this.scene);
        this.advancedTexture = adv_texture;
        this.highlight = new BABYLON.HighlightLayer("hl", this.scene);
        this.__createHotspot(name, size, color);
    }
    __createHotspot(name, size,color){
        let size_new;
        let highlight = this.highlight;
        let glowLayer = this.scene.getGlowLayerByName('glow');

        let texture = this.createTexture(color);
        if(this.__detectMob()){
            size_new = size * 2.5;
        }else {
            size_new = size
        }
        let mesh = BABYLON.MeshBuilder.CreateDisc(name, {
            radius: size_new,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE
        }, this.scene);
        let infoMaterial = new BABYLON.StandardMaterial("infoMat", this.scene);
        infoMaterial.useAlphaFromDiffuseTexture = true;
        infoMaterial.diffuseTexture = new BABYLON.Texture(texture, this.scene);
        infoMaterial.diffuseColor = new BABYLON.Color3(1, 1, 1);
        infoMaterial.emissiveColor = new BABYLON.Color3(1, 1, 1);
        infoMaterial.emissiveIntensity = 3;
        infoMaterial.disableLighting = true;
        infoMaterial.diffuseTexture.hasAlpha = true;
        mesh.material = infoMaterial;
        this.mesh = mesh;
        glowLayer.addExcludedMesh(mesh);
        mesh.billboardMode = BABYLON.Mesh.BILLBOARDMODE_Y;
        mesh.position = this.mesh_position;
        //highlight.addMesh(mesh, BABYLON.Color3.White());
        highlight.innerGlow = false;
        this.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev){
            highlight.addMesh(mesh,new BABYLON.Color3(0.97, 0.36, 0.05));
        }));
        this.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev){
            highlight.removeMesh(mesh);
        }));
    }
    addTextWithLine(top, left, txt, lbl_color, line_color, dot_color) {
        let this_mesh = this.mesh;
        let label = new BABYLON.GUI.Rectangle("label for " + this.mesh.name);
        label.background = 'transparent';
        label.alpha = 1;
        if (this.__detectMob()){
            label.height = "110px";
            label.width = "300px";
        }else {
            label.height = "80px";
            label.width = "200px";
        }

        label.cornerRadius = 5;
        label.thickness = 0;
        label.linkOffsetY = 30;
        label.top = top;
        label.left = left;
        label.zIndex = 5;
        label.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        label.isVisible = false;
        this.advancedTexture.addControl(label);


        let text1 = new BABYLON.GUI.TextBlock();
        text1.text = txt;
        if (this.__detectMob()){
            text1.fontSize  = 30;
        }
        text1.color = "white";
        text1.textWrapping = true;
        label.addControl(text1);

        let line = new BABYLON.GUI.Line();
        line.alpha = 0.9;
        line.lineWidth = 2;
        line.color = line_color;
        line.isVisible = false;
        line.transformCenterY = 1;
        line.transformCenterX = 1;
        line.scaleY = 0.7;
        if(this.__detectMob()){
            line.scaleY = 0.9;
        }
        this.advancedTexture.addControl(line);
        line.linkWithMesh(this.mesh);
        line.connectedControl = label;

        let endRound = new BABYLON.GUI.Ellipse();
        endRound.width = "70px";
        endRound.isVisible = false;
        endRound.height = "70px";
        endRound.color = dot_color;
        this.advancedTexture.addControl(endRound);
        endRound.linkWithMesh(this.mesh);

        this.mesh.actionManager = this.actionManager;
        this.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function(ev){

            if (ev.meshUnderPointer.name === this_mesh.name) {
                label.isVisible = true;
                text1.isVisible = true;
                line.isVisible = true;
                endRound.isVisible = true;
            }
        }));
        label.onPointerDownObservable.add(function () {
            label.isVisible = false;
            line.isVisible = false;
            endRound.isVisible = false;
        })
        return label
    }
    createTexture(color) {
        let canvas = document.createElement('canvas');
        canvas.style.background = 'transparent';
        canvas.width = 900;
        canvas.height = 900;
        document.body.appendChild(canvas);
        const ctx = canvas.getContext("2d");
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        //console.log(canvas)
        const radius = 180;
        const radius2 = 360;
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = color;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius2, 0, 2 * Math.PI, false);
        ctx.lineWidth = 90;
        ctx.strokeStyle = color;
        ctx.stroke();
        let result = canvas.toDataURL("image/svg");
        canvas.remove();
        return result
    }
    __detectMob() {
        const toMatch = [
            /Android/i,
            /webOS/i,
            /iPhone/i,
            /iPod/i,
            /BlackBerry/i,
            /Windows Phone/i
        ];
        return toMatch.some((toMatchItem) => {
            return navigator.userAgent.match(toMatchItem);
        });
    }
    deleteSpot(){
        this.mesh.dispose();
    }
}
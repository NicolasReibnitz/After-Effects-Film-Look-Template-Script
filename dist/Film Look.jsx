"use strict";
var setEffectPropEnabled = false;
var file = new File('~/Documents/list-of-set-properties.tsv');
var columns = [];
columns.push('Layer Name');
columns.push('Effect Name');
columns.push('Property Name');
columns.push('Default Property Value');
columns.push('New Property Value');
columns.push('Is Expression');
columns.push('Default Expression');
columns.push('New Expression');
if (file.open('w')) {
    file.writeln(columns.join('\t'));
    file.close();
}
var Utils;
(function (Utils) {
    function getPropertyTypeName(typeNum) {
        switch (typeNum) {
            case PropertyType.PROPERTY:
                return 'Property';
            case PropertyType.INDEXED_GROUP:
                return 'Indexed Group';
            case PropertyType.NAMED_GROUP:
                return 'Named Group';
            default:
                return 'Unknown';
        }
    }
    Utils.getPropertyTypeName = getPropertyTypeName;
    function logEffectProp(effect, name, value, isExpression) {
        var columns = [];
        var isEffect = effect.isEffect;
        var layerName = isEffect ? effect.parentProperty.parentProperty.name : effect.name || '';
        var effectName = isEffect ? effect.name : '';
        var prop = effect.property(name);
        var defaultPropValue = prop.value;
        var propValue = isExpression ? '' : value;
        var propExpression = isExpression ? value.replace(/\r?\n/g, ' ') : '';
        var defaultExpression = prop.expressionEnabled ? prop.expression.replace(/\r?\n/g, ' ') : '';
        columns.push(layerName); // Layer Name
        columns.push(effectName); // Effect Name
        columns.push(name); // Property Name
        columns.push(defaultPropValue); // Property Value Before
        columns.push(propValue); // Property Value After
        columns.push(isExpression ? 'true' : 'false'); // Property Expression
        columns.push(defaultExpression); // Default Expression
        columns.push(propExpression); // New Expression
        if (file.open('a')) {
            file.writeln(columns.join('\t'));
            file.close();
        }
    }
    Utils.logEffectProp = logEffectProp;
    function cleanProject(compName) {
        var trash = [];
        if (file.open('a')) {
            for (var i = 1; i <= app.project.items.length; i++) {
                var itemName = app.project.item(i).name;
                // file.writeln(itemName);
                if (itemName === compName || itemName.substring(0, 2) === '# ') {
                    trash.push(app.project.item(i));
                    // app.project.item(i).remove();
                    // file.writeln(itemName + ' removed from project.');
                }
                //  else {
                // 	file.writeln(itemName);
                // }
            }
            for (var j = 0; j < trash.length; j++) {
                file.writeln(trash[j].name);
                trash[j].remove();
            }
            file.close();
        }
    }
    Utils.cleanProject = cleanProject;
    function enableSetEffectProp(enable) {
        setEffectPropEnabled = enable;
    }
    Utils.enableSetEffectProp = enableSetEffectProp;
    function setEffectProp(effect, name, value, isExpression) {
        if (!setEffectPropEnabled)
            return;
        var prop = effect.property(name);
        if (prop && prop.setValue) {
            Utils.logEffectProp(effect, name, value, isExpression);
            try {
                if (isExpression)
                    prop.expression = value;
                else
                    prop.setValue(value);
            }
            catch (e) {
                showCatchError(effect, name, value, e);
            }
        }
        else {
            throw new Error("Effect property '" + name + "' not found or not settable.");
        }
    }
    Utils.setEffectProp = setEffectProp;
    function showCatchError(effect, name, value, error) {
        alert(effect.name +
            '\nSET EFFECT PROPERTY ERROR:' +
            '\n\nCannot set "' +
            name +
            '" to "' +
            value +
            '".\n\n[' +
            error.description +
            ']');
    }
    Utils.showCatchError = showCatchError;
    function addSolid(comp, name, color, width, height, blendMode, isAdjustment) {
        var solid = comp.layers.addSolid(color, '# ' + name, width, height, 1);
        if (blendMode)
            solid.blendingMode = blendMode;
        if (isAdjustment)
            solid.adjustmentLayer = true;
        return solid;
    }
    Utils.addSolid = addSolid;
    function listLayerEffects(comp) {
        var postfix = setEffectPropEnabled ? comp.name : comp.name + '-defaults';
        var file = new File('~/Documents/list-of-layer-effects-' + postfix + '.txt');
        var file2 = new File('~/Documents/list-of-layer-effects-' + postfix + '.tsv');
        var columns = [];
        var layersList = '';
        var currentProp = '';
        if (file2.open('w')) {
            columns.push('Layer Name');
            columns.push('Effect Index');
            columns.push('Effect Name');
            columns.push('Effect Match Name');
            columns.push('Property Index');
            columns.push('Property Name');
            columns.push('Property Match Name');
            columns.push('Property Value');
            columns.push('Property Value Type');
            columns.push('Property Type');
            columns.push('Property Expression');
            file2.writeln(columns.join('\t'));
            try {
                for (var layerIndex = 1; layerIndex <= comp.numLayers; layerIndex++) {
                    var layer = comp.layer(layerIndex);
                    var effects = layer.property('Effects');
                    var effectsList = '';
                    layersList += layerIndex + '. ' + layer.name + '\n';
                    for (var effectIndex = 1; effectIndex <= effects.numProperties; effectIndex++) {
                        var effect = effects.property(effectIndex);
                        effectsList += '	' + effectIndex + '. ' + effect.name + ' (' + effect.matchName + ')\n';
                        var propsList = '';
                        for (var propertyIndex = 1; propertyIndex <= effect.numProperties; propertyIndex++) {
                            var prop = effect.property(propertyIndex);
                            var propHasValues = prop.propertyValueType !== PropertyValueType.NO_VALUE &&
                                prop.propertyValueType !== PropertyValueType.CUSTOM_VALUE;
                            var propValue = propHasValues ? prop.value : '';
                            currentProp = layer.name + '>' + effect.matchName + '>' + prop.matchName;
                            columns.length = 0;
                            columns.push(layer.name);
                            columns.push(effectIndex.toString());
                            columns.push(effect.name);
                            columns.push(effect.matchName);
                            columns.push(propertyIndex.toString());
                            columns.push(prop.name);
                            columns.push(prop.matchName);
                            columns.push(propValue === null || propValue === void 0 ? void 0 : propValue.toString());
                            columns.push(typeof propValue);
                            columns.push(Utils.getPropertyTypeName(prop.propertyType));
                            columns.push(prop.expressionEnabled ? prop.expression.replace(/\r?\n/g, ' ') : '');
                            var result = '		' +
                                layer.name +
                                '.' +
                                effect.matchName +
                                '.' +
                                propertyIndex.toString() +
                                '. ' +
                                prop.name +
                                ' (' +
                                prop.matchName +
                                '): ' +
                                (propValue === null || propValue === void 0 ? void 0 : propValue.toString()) +
                                ' (' +
                                typeof propValue +
                                ') [' +
                                prop.propertyType +
                                ']\n';
                            file2.writeln(columns.join('\t'));
                            propsList += result;
                        }
                        effectsList += propsList;
                    }
                    layersList += effectsList + '\n';
                }
            }
            catch (e) {
                file2.close();
                alert(e.description + '\n' + currentProp);
            }
            file2.close();
        }
        else {
            alert('Could not open file for writing.' + '\n' + file2.fullName);
        }
        if (file.open('w')) {
            file.writeln(comp.name + ':\n\n' + layersList + '\n');
            file.close();
        }
        else {
            alert('Could not open file for writing.' + '\n' + file.fullName);
        }
    }
    Utils.listLayerEffects = listLayerEffects;
})(Utils || (Utils = {}));
// Apply color correction FX to the 'Color Correction' layer in the active comp
var _ColorCorrection;
(function (_ColorCorrection) {
    function applyEffects(layer) {
        // app.beginUndoGroup('Apply Color Correction FX');
        /* === Glow === */
        var glow = layer.effect.addProperty('ADBE Glo2');
        Utils.setEffectProp(glow, 'Glow Threshold', (50 / 100) * 255);
        Utils.setEffectProp(glow, 'Glow Radius', 1000);
        Utils.setEffectProp(glow, 'Glow Intensity', 0.2);
        Utils.setEffectProp(glow, 'Glow Operation', 6); // Screen
        /* === CC Vignette === */
        var vignette = layer.effect.addProperty('CC Vignette');
        Utils.setEffectProp(vignette, 'Amount', 100);
        /* === Levels === */
        var levels = layer.effect.addProperty('ADBE Easy Levels2');
        Utils.setEffectProp(levels, 'Output Black', 0.05);
        Utils.setEffectProp(levels, 'Output White', 0.95);
        // app.endUndoGroup();
    }
    _ColorCorrection.applyEffects = applyEffects;
})(_ColorCorrection || (_ColorCorrection = {}));
// Add Grain FX to the "Grain" layer in the active comp
var _Grain;
(function (_Grain) {
    function applyEffects(layer) {
        // app.beginUndoGroup('Apply Grain FX');
        /* === NOISE === */
        var noise = layer.effect.addProperty('ADBE Noise2');
        Utils.setEffectProp(noise, 'ADBE Noise2-0001', 30); // Amount of Noise
        Utils.setEffectProp(noise, 'ADBE Noise2-0002', 0); // Use color noise
        /* === GAUSSIAN BLUR === */
        var blur = layer.effect.addProperty('ADBE Gaussian Blur 2');
        Utils.setEffectProp(blur, 'Blurriness', 10);
        Utils.setEffectProp(blur, 'Repeat Edge Pixels', true);
        /* === UNSHARP MASK === */
        var unsharp = layer.effect.addProperty('ADBE Unsharp Mask2');
        Utils.setEffectProp(unsharp, 'Amount', 300);
        Utils.setEffectProp(unsharp, 'Radius', 3);
        // app.endUndoGroup();
    }
    _Grain.applyEffects = applyEffects;
})(_Grain || (_Grain = {}));
// Create a "Damage" solid layer with 4K 4:3 settings and proper effects
var _Damage;
(function (_Damage) {
    function applyEffects(layer) {
        // app.beginUndoGroup('Apply Damage FX');
        /* === FIRST FRACTAL NOISE === */
        var fractal1 = layer.effect.addProperty('ADBE Fractal Noise');
        Utils.setEffectProp(fractal1, 'Contrast', 1000);
        Utils.setEffectProp(fractal1, 'Brightness', -460);
        Utils.setEffectProp(fractal1, 'Uniform Scaling', false);
        Utils.setEffectProp(fractal1, 'Scale Width', 600);
        Utils.setEffectProp(fractal1, 'Scale Height', 1000);
        Utils.setEffectProp(fractal1, 'Scale Height', 'wiggle(24, 400)', true);
        Utils.setEffectProp(fractal1, 'Complexity', 7);
        Utils.setEffectProp(fractal1, 'Random Seed', 'time * 24', true);
        /* === EXTRACT === */
        var extract = layer.effect.addProperty('ADBE Extract');
        Utils.setEffectProp(extract, 'Black Point', 20);
        Utils.setEffectProp(extract, 'Black Softness', 20);
        /* === SECOND FRACTAL NOISE === */
        var fractal2 = layer.effect.addProperty('ADBE Fractal Noise');
        Utils.setEffectProp(fractal2, 'Contrast', 313);
        Utils.setEffectProp(fractal2, 'Brightness', 40);
        Utils.setEffectProp(fractal2, 'Scale', 50);
        Utils.setEffectProp(fractal2, 'Blending Mode', 9);
        /* === CC TONER === */
        var toner = layer.effect.addProperty('CC Toner');
        Utils.setEffectProp(toner, 'Midtones', [0.184, 0.765, 0.369]); // #2FC35E normalized
        // app.endUndoGroup();
    }
    _Damage.applyEffects = applyEffects;
})(_Damage || (_Damage = {}));
// Apply blob FX to the 'Blobs' layer in the active comp
var _Blobs;
(function (_Blobs) {
    function applyEffects(layer) {
        // app.beginUndoGroup('Apply Blob FX');
        /* === FRACTAL NOISE === */
        var fractal = layer.effect.addProperty('ADBE Fractal Noise');
        // fractal.property('Fractal Type').setValue(7); // Dynamic
        Utils.setEffectProp(fractal, 'Fractal Type', 7);
        // fractal.property('Invert').setValue(true);
        Utils.setEffectProp(fractal, 'Invert', true);
        // fractal.property('Contrast').setValue(1875);
        Utils.setEffectProp(fractal, 'Contrast', 1875);
        // fractal.property('Brightness').setValue(880);
        Utils.setEffectProp(fractal, 'Brightness', 880);
        // fractal.property('Scale').setValue(400);
        Utils.setEffectProp(fractal, 'Scale', 400);
        // fractal.property('Random Seed').expression = 'time * 200';
        Utils.setEffectProp(fractal, 'Random Seed', 'time * 200', true);
        /* === CC TONER === */
        var toner = layer.effect.addProperty('CC Toner');
        // toner.property('Midtones').setValue([0.173, 0.373, 0.29]);
        Utils.setEffectProp(toner, 'Midtones', [0.173, 0.373, 0.29]); // #2C5F4A
        // app.endUndoGroup();
    }
    _Blobs.applyEffects = applyEffects;
})(_Blobs || (_Blobs = {}));
// Apply scratches FX to the 'Scratches' layer in the active comp
var _Scratches;
(function (_Scratches) {
    function applyEffects(layer) {
        // app.beginUndoGroup('Apply Scratches FX');
        /* === FRACTAL NOISE === */
        var fractal = layer.effect.addProperty('ADBE Fractal Noise');
        // fractal.property('Invert').setValue(true);
        Utils.setEffectProp(fractal, 'Invert', true);
        // fractal.property('Contrast').setValue(200);
        Utils.setEffectProp(fractal, 'Contrast', 200);
        // fractal.property('Brightness').setValue(110);
        Utils.setEffectProp(fractal, 'Brightness', 110);
        // fractal.property('Uniform Scaling').setValue(false);
        Utils.setEffectProp(fractal, 'Uniform Scaling', false);
        // fractal.property('Scale Width').setValue(50);
        Utils.setEffectProp(fractal, 'Scale Width', 50);
        // fractal.property('Scale Height').setValue(10000);
        Utils.setEffectProp(fractal, 'Scale Height', 10000);
        // fractal.property('Random Seed').expression = 'time * 200';
        Utils.setEffectProp(fractal, 'Evolution', 'time * 200', true);
        /* === TURBULENT DISPLACE === */
        var turb = layer.effect.addProperty('ADBE Turbulent Displace');
        // turb.property('Amount').setValue(10);
        Utils.setEffectProp(turb, 'Amount', 10);
        // turb.property('Amount').expression = 'wiggle(10, 5)';
        Utils.setEffectProp(turb, 'Amount', 'wiggle(10, 5)', true);
        // turb.property('Size').setValue(100);
        Utils.setEffectProp(turb, 'Size', 100);
        // turb.property('Size').expression = 'wiggle(10, 10)';
        Utils.setEffectProp(turb, 'Size', 'wiggle(10, 10)', true);
        // turb.property('Complexity').setValue(3);
        Utils.setEffectProp(turb, 'Complexity', 3);
        // turb.property('Random Seed').expression = 'time * 24';
        Utils.setEffectProp(turb, 'Random Seed', 'time * 24', true);
        // app.endUndoGroup();
    }
    _Scratches.applyEffects = applyEffects;
})(_Scratches || (_Scratches = {}));
// Apply dust FX to the 'Dust' layer in the active comp
var _Dust;
(function (_Dust) {
    function applyEffects(layer) {
        // app.beginUndoGroup('Apply Dust FX');
        /* === FRACTAL NOISE === */
        var fractal = layer.effect.addProperty('ADBE Fractal Noise');
        // fractal.property('Fractal Type').setValue(12);
        Utils.setEffectProp(fractal, 'Fractal Type', 12); // Smeary
        // fractal.property('Invert').setValue(true);
        Utils.setEffectProp(fractal, 'Invert', true);
        // fractal.property('Contrast').setValue(3000);
        Utils.setEffectProp(fractal, 'Contrast', 3000);
        // fractal.property('Brightness').setValue(-2925);
        Utils.setEffectProp(fractal, 'Brightness', -2925);
        // fractal.property('Scale').setValue(400);
        Utils.setEffectProp(fractal, 'Scale', 400);
        // fractal.property('Complexity').setValue(3);
        Utils.setEffectProp(fractal, 'Complexity', 3);
        // fractal.property('Sub Influence (%)').setValue(30);
        Utils.setEffectProp(fractal, 'Sub Influence (%)', 30);
        // fractal.property('Sub Scaling').setValue(50);
        Utils.setEffectProp(fractal, 'Sub Scaling', 50);
        // fractal.property('Random Seed').expression = 'time * 24';
        Utils.setEffectProp(fractal, 'Random Seed', 'time * 24', true);
        /* === SET CHANNELS === */
        var setChannels = layer.effect.addProperty('ADBE Set Channels');
        // setChannels.property('ADBE Set Channels-0008').setValue(5); // Luminance
        Utils.setEffectProp(setChannels, 'ADBE Set Channels-0008', 5); // Luminance
        /* === NOISE === */
        var noise = layer.effect.addProperty('ADBE Noise2');
        // noise.property('ADBE Noise2-0001').setValue(100);
        Utils.setEffectProp(noise, 'ADBE Noise2-0001', 100); // Amount of Noise
        /* === UNSHARP MASK === */
        var unsharp = layer.effect.addProperty('ADBE Unsharp Mask2');
        // unsharp.property('Amount').setValue(200);
        Utils.setEffectProp(unsharp, 'Amount', 200);
        // unsharp.property('Radius').setValue(2);
        Utils.setEffectProp(unsharp, 'Radius', 2);
        /* === GAUSSIAN BLUR === */
        var blur = layer.effect.addProperty('ADBE Gaussian Blur 2');
        // blur.property('Blurriness').setValue(3);
        Utils.setEffectProp(blur, 'Blurriness', 3);
        // blur.property('Repeat Edge Pixels').setValue(true);
        Utils.setEffectProp(blur, 'Repeat Edge Pixels', true);
        // app.endUndoGroup();
    }
    _Dust.applyEffects = applyEffects;
})(_Dust || (_Dust = {}));
// Apply Gate Weave FX to the 'Gate Weave' layer in the active comp
var _GateWeave;
(function (_GateWeave) {
    function applyEffects(layer) {
        // app.beginUndoGroup('Apply Gate Weave FX');
        /* === TRANSFORM === */
        var transform = layer.effect.addProperty('ADBE Geometry2');
        Utils.setEffectProp(transform, 'Position', 'x = wiggle(12, 1)[0];\n' + 'y = wiggle(3, 0.3, 3, 4)[1];\n' + '[x, y];', true);
        Utils.setEffectProp(transform, 'Scale Width', 101.5);
        Utils.setEffectProp(transform, 'Scale Height', 101.5);
        // app.endUndoGroup();
    }
    _GateWeave.applyEffects = applyEffects;
})(_GateWeave || (_GateWeave = {}));
// Apply Light Leaks FX to the 'Light Leaks' layer in the active comp
var _LightLeaks;
(function (_LightLeaks) {
    function applyEffects(layer) {
        // app.beginUndoGroup('Apply Light Leaks FX');
        /* === FRACTAL NOISE #1 === */
        var fractal1 = layer.effect.addProperty('ADBE Fractal Noise');
        // fractal1.property('Invert').setValue(true);
        Utils.setEffectProp(fractal1, 'Invert', true);
        // fractal1.property('Contrast').setValue(60);
        Utils.setEffectProp(fractal1, 'Contrast', 60);
        // fractal1.property('Brightness').setValue(-30);
        Utils.setEffectProp(fractal1, 'Brightness', -30);
        // fractal1.property('Uniform Scaling').setValue(false);
        Utils.setEffectProp(fractal1, 'Uniform Scaling', false);
        // fractal1.property('Scale Width').setValue(4000);
        Utils.setEffectProp(fractal1, 'Scale Width', 4000);
        // fractal1.property('Scale Height').setValue(8000);
        Utils.setEffectProp(fractal1, 'Scale Height', 8000);
        // fractal1.property('Complexity').setValue(2);
        Utils.setEffectProp(fractal1, 'Complexity', 2);
        // fractal1.property('Random Seed').expression = 'time * 400';
        Utils.setEffectProp(fractal1, 'Evolution', 'time * 400', true);
        /* === CC TONER === */
        var toner = layer.effect.addProperty('CC Toner');
        // toner.property('Tones').setValue(3);
        Utils.setEffectProp(toner, 'Tones', 3); // Pentone
        // toner.property('Darktones').setValue([0.192, 0.227, 0.294]); // #313A4B
        Utils.setEffectProp(toner, 'Darktones', [0.192, 0.227, 0.294]); // #313A4B
        // toner.property('Midtones').expression = 'v = wiggle(5, 0.2)[0]; [v, v, v, 1]';
        Utils.setEffectProp(toner, 'Midtones', 'v = wiggle(5, 0.2)[0]; [v, v, v, 1]', true);
        /* === FRACTAL NOISE #2 === */
        var fractal2 = layer.effect.addProperty('ADBE Fractal Noise');
        // fractal2.property('Brightness').setValue(-20);
        Utils.setEffectProp(fractal2, 'Brightness', -20);
        // fractal2.property('Uniform Scaling').setValue(false);
        Utils.setEffectProp(fractal2, 'Uniform Scaling', false);
        // fractal2.property('Scale Width').setValue(3000);
        Utils.setEffectProp(fractal2, 'Scale Width', 3000);
        // fractal2.property('Scale Height').setValue(6000);
        Utils.setEffectProp(fractal2, 'Scale Height', 6000);
        // fractal2.property('Complexity').setValue(1);
        Utils.setEffectProp(fractal2, 'Complexity', 1);
        // fractal2.property('Random Seed').expression = 'time * 100';
        Utils.setEffectProp(fractal2, 'Evolution', 'time * 100', true);
        Utils.setEffectProp(fractal2, 'Blending Mode', 5);
        // app.endUndoGroup();
    }
    _LightLeaks.applyEffects = applyEffects;
})(_LightLeaks || (_LightLeaks = {}));
// Apply flicker FX to the 'Flicker' layer in the active comp
var _Flicker;
(function (_Flicker) {
    function applyEffects(layer) {
        // app.beginUndoGroup('Apply Flicker FX');
        /* === EXPOSURE === */
        var exposure = layer.effect.addProperty('ADBE Exposure2');
        Utils.setEffectProp(exposure, 'Exposure', 'wiggle(12, 0.1)', true);
        // app.endUndoGroup();
    }
    _Flicker.applyEffects = applyEffects;
})(_Flicker || (_Flicker = {}));
// 4K 4:3 Film Look Template
var compName = 'FilmLook_4K_4x3_Theatrical';
var compWidth = 2880;
var compHeight = 2160;
var compDuration = 30;
var compFrameRate = 25;
(function (thisObj) {
    // (function (thisObj) {
    var win = thisObj instanceof Panel ? thisObj : new Window('palette', 'AE Utils Panel', undefined, { resizeable: true });
    // if (win instanceof Panel) {
    // 	win.text = 'AE Utils'; // Your custom tab label
    // }
    win.orientation = 'column';
    win.alignChildren = 'fill';
    // Button 1
    var btnGenerateFilmLook = win.add('button', undefined, 'Generate Film Look Template');
    btnGenerateFilmLook.onClick = function () {
        if (typeof createFilmLookTemplate === 'function') {
            createFilmLookTemplate(true);
        }
        else {
            alert('createFilmLookTemplate() is not defined.');
        }
    };
    // Button 2
    var btnGenerateFilmLookDefaults = win.add('button', undefined, 'Generate Film Look Template (defaults)');
    btnGenerateFilmLookDefaults.onClick = function () {
        if (typeof createFilmLookTemplate === 'function') {
            createFilmLookTemplate(false);
        }
        else {
            alert('createFilmLookTemplate() is not defined.');
        }
    };
    // Button 3
    var btnCleanProject = win.add('button', undefined, 'Clean Project');
    btnCleanProject.onClick = function () {
        if (typeof Utils.cleanProject === 'function') {
            Utils.cleanProject(compName);
        }
        else {
            alert('cleanProject() is not defined.');
        }
    };
    // Button 4
    var btnListLayerEffectsTexturelabs = win.add('button', undefined, 'List Layer Effects (Texturelabs)');
    btnListLayerEffectsTexturelabs.onClick = function () {
        if (typeof listLayerEffectsTexturelabs === 'function') {
            listLayerEffectsTexturelabs('Texturelabs');
        }
        else {
            alert('listLayerEffectsTexturelabs() is not defined.');
        }
    };
    // Button 5
    var btnListLayerEffectsFilmLook = win.add('button', undefined, 'List Layer Effects (FilmLook)');
    btnListLayerEffectsFilmLook.onClick = function () {
        if (typeof listLayerEffectsTexturelabs === 'function') {
            listLayerEffectsTexturelabs('FilmLook');
        }
        else {
            alert('listLayerEffectsTexturelabs() is not defined.');
        }
    };
    win.layout.layout(true);
    if (win instanceof Window) {
        win.center();
        win.show();
    }
    // })(this);
    // createDevMenu();
    // Utils.cleanProject(compName);
    // createFilmLookTemplate(false);
    // Utils.cleanProject(compName);
    // createFilmLookTemplate(true);
})(this);
function createFilmLookTemplate(setEffectProps) {
    Utils.enableSetEffectProp(setEffectProps);
    app.beginUndoGroup('Create Film Look Template');
    var comp = app.project.items.addComp(compName, compWidth, compHeight, 1, compDuration, compFrameRate);
    /* === FOOTAGE PLACEHOLDER === */
    Utils.addSolid(comp, 'Footage Placeholder', [0.1, 0.1, 0.1], compWidth, compHeight, null, false);
    /* === COLOR CORRECTION === */
    var colorCorrectionLayer = Utils.addSolid(comp, 'Color Correction', [1, 1, 1], compWidth, compHeight, null, true);
    /* === GRAIN === */
    var grain = Utils.addSolid(comp, 'Grain', [1, 1, 1], compWidth, compHeight, null, true);
    /* === DAMAGE === */
    var damage = Utils.addSolid(comp, 'Damage', [1, 1, 1], compWidth, compHeight, BlendingMode.HARD_LIGHT, false);
    /* === BLOBS === */
    var blobs = Utils.addSolid(comp, 'Blobs', [1, 1, 1], compWidth, compHeight, BlendingMode.MULTIPLY, false);
    /* === SCRATCHES === */
    var scratches = Utils.addSolid(comp, 'Scratches', [0, 0, 0], compWidth, compHeight, BlendingMode.MULTIPLY, false);
    Utils.setEffectProp(scratches, 'Scale', [100, 4000]);
    /* === DUST === */
    var dust = Utils.addSolid(comp, 'Dust', [1, 1, 1], compWidth, compHeight, BlendingMode.NORMAL, false);
    Utils.setEffectProp(dust, 'Scale', [200, 200]);
    /* === GATE WEAVE === */
    var gateWeave = Utils.addSolid(comp, 'Gate Weave', [1, 1, 1], compWidth, compHeight, null, true);
    // Utils.setEffectProp(gateWeave, 'Scale', [101.5, 101.5]);
    // Utils.setEffectProp(gateWeave, 'Scale', 101.5);
    /* === LIGHT LEAKS === */
    var lightLeaks = Utils.addSolid(comp, 'Light Leaks', [1, 1, 1], compWidth, compHeight, BlendingMode.SCREEN, false);
    /* === FLICKER === */
    var flicker = Utils.addSolid(comp, 'Flicker', [1, 1, 1], compWidth, compHeight, null, true);
    app.endUndoGroup();
    _ColorCorrection.applyEffects(colorCorrectionLayer);
    _Grain.applyEffects(grain);
    _Damage.applyEffects(damage);
    _Blobs.applyEffects(blobs);
    _Scratches.applyEffects(scratches);
    _Dust.applyEffects(dust);
    _GateWeave.applyEffects(gateWeave);
    _LightLeaks.applyEffects(lightLeaks);
    _Flicker.applyEffects(flicker);
    Utils.listLayerEffects(comp);
}
function listLayerEffectsTexturelabs(compName) {
    for (var i = 1; i <= app.project.items.length; i++) {
        if (app.project.item(i).name.indexOf(compName) === 0) {
            Utils.listLayerEffects(app.project.item(i));
        }
    }
}
// function createDevMenu() {
// 	const win = new Window('palette', 'Film Look Panel', undefined);
// 	win.orientation = 'column';
// 	win.alignChildren = 'fill';
// 	// Button 1
// 	const btnGenerateFilmLook = win.add('button', undefined, 'Generate Film Look Template');
// 	btnGenerateFilmLook.onClick = function () {
// 		if (typeof createFilmLookTemplate === 'function') {
// 			createFilmLookTemplate(true);
// 		} else {
// 			alert('createFilmLookTemplate() is not defined.');
// 		}
// 	};
// 	// Button 1
// 	const btnGenerateFilmLookDefaults = win.add('button', undefined, 'Generate Film Look Template (defaults)');
// 	btnGenerateFilmLookDefaults.onClick = function () {
// 		if (typeof createFilmLookTemplate === 'function') {
// 			createFilmLookTemplate(false);
// 		} else {
// 			alert('createFilmLookTemplate() is not defined.');
// 		}
// 	};
// 	// Button 2
// 	const btnCleanProject = win.add('button', undefined, 'Clean Project');
// 	btnCleanProject.onClick = function () {
// 		if (typeof Utils.cleanProject === 'function') {
// 			Utils.cleanProject(compName);
// 		} else {
// 			alert('cleanProject() is not defined.');
// 		}
// 	};
// 	// Button 3
// 	const btnListLayerEffectsTexturelabs = win.add('button', undefined, 'List Layer Effects (Texturelabs)');
// 	btnListLayerEffectsTexturelabs.onClick = function () {
// 		if (typeof listLayerEffectsTexturelabs === 'function') {
// 			listLayerEffectsTexturelabs('Texturelabs');
// 		} else {
// 			alert('listLayerEffectsTexturelabs() is not defined.');
// 		}
// 	};
// 	// win.center();
// 	win.show();
// 	alert('frame size: ' + win.frameSize.toString());
// 	alert('window bounds: ' + win.window.bounds.toString());
// 	alert('frame Location: ' + win.frameLocation.toString());
// 	alert('frame Bounds: ' + win.frameBounds.toString());
// }

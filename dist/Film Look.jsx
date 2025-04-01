"use strict";
var setEffectPropEnabled = false;
var Utils;
(function (Utils) {
    function initListOfSetPropertiesFile() {
        var file = new File('~/Documents/list-of-set-properties.tsv');
        file.encoding = 'UTF8';
        var columns = [];
        columns.push('Layer Name');
        columns.push('Effect Name');
        columns.push('Property Name');
        columns.push('Default Property Value');
        columns.push('New Property Value');
        columns.push('Is Expression');
        if (file.open('w')) {
            file.writeln(columns.join('\t'));
            file.close();
        }
    }
    Utils.initListOfSetPropertiesFile = initListOfSetPropertiesFile;
    function getCompName(style) {
        return 'Generated_' + style.replace(' ', '_') + '_Comp';
    }
    Utils.getCompName = getCompName;
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
        var file = new File('~/Documents/list-of-set-properties.tsv');
        file.encoding = 'UTF8';
        var columns = [];
        var defaultPropValue;
        var isEffect = effect.isEffect;
        var layerName = isEffect
            ? effect.parentProperty.parentProperty.name.replace(/^# /g, '')
            : effect.name.replace(/^# /g, '') || '';
        var effectName = isEffect ? effect.name : '';
        var prop = effect.property(name);
        var propValue = isExpression ? value.replace(/(\r\n|\r|\n)/g, ' ') : value;
        if (isExpression) {
            defaultPropValue = prop.expressionEnabled ? prop.expression.replace(/(\r\n|\r|\n)/g, ' ') : '';
        }
        else {
            defaultPropValue = prop.value;
        }
        columns.push(layerName); // Layer Name
        columns.push(effectName); // Effect Name
        columns.push(name); // Property Name
        columns.push(defaultPropValue); // Property Value Before
        columns.push(propValue); // Property Value After
        columns.push(isExpression ? 'true' : 'false'); // Property Expression
        if (file.open('a')) {
            file.writeln(columns.join('\t'));
            file.close();
        }
    }
    Utils.logEffectProp = logEffectProp;
    function listLayerEffectsOfAllComps() {
        for (var i = 1; i <= app.project.items.length; i++) {
            if (app.project.item(i).typeName === 'Composition') {
                Utils.listLayerEffects(app.project.item(i));
            }
        }
    }
    Utils.listLayerEffectsOfAllComps = listLayerEffectsOfAllComps;
    function cleanProject() {
        var trash = [];
        for (var i = 1; i <= app.project.items.length; i++) {
            var itemName = app.project.item(i).name;
            if (itemName.indexOf('Generated_') === 0 || itemName.indexOf('# ') === 0) {
                trash.push(app.project.item(i));
            }
        }
        for (var j = 0; j < trash.length; j++) {
            trash[j].remove();
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
        file.encoding = 'UTF8';
        file2.encoding = 'UTF8';
        file.lineFeed = 'Unix';
        file2.lineFeed = 'Unix';
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
                    layersList += layerIndex + '. ' + layer.name.replace(/^# /g, '') + '\n';
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
                            columns.push(layer.name.replace(/^# /g, ''));
                            columns.push(effectIndex.toString());
                            columns.push(effect.name);
                            columns.push(effect.matchName);
                            columns.push(propertyIndex.toString());
                            columns.push(prop.name);
                            columns.push(prop.matchName);
                            columns.push(propValue === null || propValue === void 0 ? void 0 : propValue.toString());
                            columns.push(typeof propValue);
                            columns.push(Utils.getPropertyTypeName(prop.propertyType));
                            columns.push(prop.expressionEnabled ? prop.expression.replace(/(\r\n|\r|\n)/g, ' ') : '');
                            var result = '		' +
                                layer.name.replace(/^# /g, '') +
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
                                '] ' +
                                (prop.expressionEnabled ? prop.expression.replace(/(\r\n|\r|\n)/g, ' ') : '') +
                                '\n';
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
    function importPsdToComp() {
        var comp = app.project.activeItem;
        if (!(comp instanceof CompItem)) {
            alert('Please select a composition.');
            return;
        }
        // 1. Choose a PSD file
        var psdFile = File.openDialog('Select a PSD file to import', '*.psd', false);
        if (!psdFile || !(psdFile instanceof File)) {
            alert('Please select a single PSD file.');
            return;
        }
        app.beginUndoGroup('Import PSD and Add as First Layer');
        // 2. Import the file into the project
        var importOptions = new ImportOptions(psdFile);
        if (!importOptions.canImportAs(ImportAsType.FOOTAGE)) {
            alert('This PSD cannot be imported as footage.');
            return;
        }
        importOptions.importAs = ImportAsType.FOOTAGE;
        var imported = app.project.importFile(importOptions);
        // 3. Add it as the first layer in the comp
        var newLayer = comp.layers.add(imported);
        newLayer.moveToEnd(); // This makes it layer 1
        app.endUndoGroup();
    }
    Utils.importPsdToComp = importPsdToComp;
})(Utils || (Utils = {}));
var _FilmLook;
(function (_FilmLook) {
    // Apply color correction FX to the 'Color Correction' layer in the active comp
    function applyColorCorrection(layer) {
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
        Utils.setEffectProp(levels, 'Output Black', 0.030517578125);
        Utils.setEffectProp(levels, 'Output White', 0.91552734375);
        // app.endUndoGroup();
    }
    _FilmLook.applyColorCorrection = applyColorCorrection;
    // Add Grain FX to the "Grain" layer in the active comp
    function applyGrain(layer) {
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
        // Utils.setEffectProp(unsharp, 'Radius', 3);
        Utils.setEffectProp(unsharp, 'Radius', 6);
        // app.endUndoGroup();
    }
    _FilmLook.applyGrain = applyGrain;
    // Create a "Damage" solid layer with 4K 4:3 settings and proper effects
    function applyDamage(layer) {
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
    _FilmLook.applyDamage = applyDamage;
    // Apply blob FX to the 'Blobs' layer in the active comp
    function applyBlobs(layer) {
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
    _FilmLook.applyBlobs = applyBlobs;
    // Apply scratches FX to the 'Scratches' layer in the active comp
    function applyScratches(layer) {
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
    _FilmLook.applyScratches = applyScratches;
    // Apply dust FX to the 'Dust' layer in the active comp
    function applyDust(layer) {
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
    _FilmLook.applyDust = applyDust;
    // Apply Gate Weave FX to the 'Gate Weave' layer in the active comp
    function applyGateWeave(layer) {
        /* === TRANSFORM === */
        var transform = layer.effect.addProperty('ADBE Geometry2');
        Utils.setEffectProp(transform, 'Position', 'x = wiggle(12, 1)[0];\n' + 'y = wiggle(3, 0.3, 3, 4)[1];\n' + '[x, y];', true);
        Utils.setEffectProp(transform, 'Scale Width', 101.5);
        Utils.setEffectProp(transform, 'Scale Height', 101.5);
    }
    _FilmLook.applyGateWeave = applyGateWeave;
    // Apply Light Leaks FX to the 'Light Leaks' layer in the active comp
    function applyLightLeaks(layer) {
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
    _FilmLook.applyLightLeaks = applyLightLeaks;
    // Apply flicker FX to the 'Flicker' layer in the active comp
    function applyFlicker(layer) {
        /* === EXPOSURE === */
        var exposure = layer.effect.addProperty('ADBE Exposure2');
        Utils.setEffectProp(exposure, 'Exposure', 'wiggle(12, 0.1)', true);
    }
    _FilmLook.applyFlicker = applyFlicker;
})(_FilmLook || (_FilmLook = {}));
var _NewsReel;
(function (_NewsReel) {
    // Apply color correction FX to the 'Color Correction' layer in the active comp
    function applyColorCorrection(layer) {
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
        Utils.setEffectProp(levels, 'Output Black', 0.030517578125);
        Utils.setEffectProp(levels, 'Output White', 0.91552734375);
        // app.endUndoGroup();
    }
    _NewsReel.applyColorCorrection = applyColorCorrection;
    // Add Grain FX to the "Grain" layer in the active comp
    function applyGrain(layer) {
        // app.beginUndoGroup('Apply Grain FX');
        /* === NOISE === */
        var noise = layer.effect.addProperty('ADBE Noise2');
        Utils.setEffectProp(noise, 'ADBE Noise2-0001', 30); // Amount of Noise
        Utils.setEffectProp(noise, 'ADBE Noise2-0002', 0); // Use color noise
        /* === GAUSSIAN BLUR === */
        var blur = layer.effect.addProperty('ADBE Gaussian Blur 2');
        Utils.setEffectProp(blur, 'Blurriness', 17);
        Utils.setEffectProp(blur, 'Repeat Edge Pixels', true);
        /* === UNSHARP MASK === */
        var unsharp = layer.effect.addProperty('ADBE Unsharp Mask2');
        Utils.setEffectProp(unsharp, 'Amount', 500);
        // Utils.setEffectProp(unsharp, 'Radius', 3);
        Utils.setEffectProp(unsharp, 'Radius', 7);
        // app.endUndoGroup();
    }
    _NewsReel.applyGrain = applyGrain;
    // Create a "Damage" solid layer with 4K 4:3 settings and proper effects
    function applyDamage(layer) {
        // app.beginUndoGroup('Apply Damage FX');
        /* === FIRST FRACTAL NOISE === */
        var fractal1 = layer.effect.addProperty('ADBE Fractal Noise');
        Utils.setEffectProp(fractal1, 'Contrast', 1000);
        Utils.setEffectProp(fractal1, 'Brightness', -440);
        Utils.setEffectProp(fractal1, 'Uniform Scaling', false);
        Utils.setEffectProp(fractal1, 'Scale Width', 1200);
        Utils.setEffectProp(fractal1, 'Scale Height', 2000);
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
    _NewsReel.applyDamage = applyDamage;
    // Apply blob FX to the 'Blobs' layer in the active comp
    function applyBlobs(layer) {
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
        Utils.setEffectProp(fractal, 'Brightness', 800);
        // fractal.property('Scale').setValue(400);
        Utils.setEffectProp(fractal, 'Scale', 2000);
        // fractal.property('Random Seed').expression = 'time * 200';
        Utils.setEffectProp(fractal, 'Random Seed', 'time * 200', true);
        /* === CC TONER === */
        var toner = layer.effect.addProperty('CC Toner');
        // toner.property('Midtones').setValue([0.173, 0.373, 0.29]);
        Utils.setEffectProp(toner, 'Midtones', [0.173, 0.373, 0.29]); // #2C5F4A
        // app.endUndoGroup();
    }
    _NewsReel.applyBlobs = applyBlobs;
    // Apply scratches FX to the 'Scratches' layer in the active comp
    function applyScratches(layer) {
        // app.beginUndoGroup('Apply Scratches FX');
        /* === FRACTAL NOISE === */
        var fractal = layer.effect.addProperty('ADBE Fractal Noise');
        // fractal.property('Invert').setValue(true);
        Utils.setEffectProp(fractal, 'Invert', true);
        // fractal.property('Contrast').setValue(200);
        Utils.setEffectProp(fractal, 'Contrast', 200);
        // fractal.property('Brightness').setValue(110);
        Utils.setEffectProp(fractal, 'Brightness', 105);
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
    _NewsReel.applyScratches = applyScratches;
    // Apply dust FX to the 'Dust' layer in the active comp
    function applyDust(layer) {
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
        Utils.setEffectProp(fractal, 'Brightness', -2900);
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
    _NewsReel.applyDust = applyDust;
    // Apply Gate Weave FX to the 'Gate Weave' layer in the active comp
    function applyGateWeave(layer) {
        /* === TRANSFORM === */
        var transform = layer.effect.addProperty('ADBE Geometry2');
        Utils.setEffectProp(transform, 'Position', 'x = wiggle(12, 3)[0];\n' + 'y = wiggle(3, 0.9, 3, 4)[1];\n' + '[x, y];', true);
        Utils.setEffectProp(transform, 'Scale Width', 102);
        Utils.setEffectProp(transform, 'Scale Height', 102);
    }
    _NewsReel.applyGateWeave = applyGateWeave;
    // Apply Light Leaks FX to the 'Light Leaks' layer in the active comp
    function applyLightLeaks(layer) {
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
    _NewsReel.applyLightLeaks = applyLightLeaks;
    // Apply flicker FX to the 'Flicker' layer in the active comp
    function applyFlicker(layer) {
        /* === EXPOSURE === */
        var exposure = layer.effect.addProperty('ADBE Exposure2');
        Utils.setEffectProp(exposure, 'Exposure', 'wiggle(12, 0.3)', true);
    }
    _NewsReel.applyFlicker = applyFlicker;
})(_NewsReel || (_NewsReel = {}));
/* eslint-disable @typescript-eslint/no-unused-vars */
var _Texturelabs;
(function (_Texturelabs) {
    // Apply color correction FX to the 'Color Correction' layer in the active comp
    function applyColorCorrection(layer) {
        /* === Glow === */
        var glow = layer.effect.addProperty('ADBE Glo2');
        Utils.setEffectProp(glow, 'Glow Threshold', (50 / 100) * 255);
        Utils.setEffectProp(glow, 'Glow Radius', 1000);
        Utils.setEffectProp(glow, 'Glow Intensity', 0.2);
        Utils.setEffectProp(glow, 'Glow Operation', 6); // Screen
        /* === Channel Mixer === */
        var channelMixer = layer.effect.addProperty('ADBE CHANNEL MIXER');
        Utils.setEffectProp(channelMixer, 'Blue-Green', 50);
        Utils.setEffectProp(channelMixer, 'Blue-Blue', 50);
        /* === Lumetri Color === */
        var lumetri = layer.effect.addProperty('ADBE Lumetri');
        Utils.setEffectProp(lumetri, 'ADBE Lumetri-0025', 5); // Look: CineSpace2383
        // This can't be set via script:
        // Highlight Tint:	Cyan/Blue
        /* === CC Vignette === */
        var vignette = layer.effect.addProperty('CC Vignette');
        Utils.setEffectProp(vignette, 'Amount', 50);
        /* === Levels === */
        var levels = layer.effect.addProperty('ADBE Easy Levels2');
        Utils.setEffectProp(levels, 'Output Black', 0.07629395); // 2500
        Utils.setEffectProp(levels, 'Output White', 0.91552734375); // 30000
    }
    _Texturelabs.applyColorCorrection = applyColorCorrection;
    // Add Grain FX to the "Grain" layer in the active comp
    function applyGrain(layer) {
        /* === NOISE === */
        var noise = layer.effect.addProperty('ADBE Noise2');
        Utils.setEffectProp(noise, 'ADBE Noise2-0001', 15); // Amount of Noise
        /* === GAUSSIAN BLUR === */
        var blur = layer.effect.addProperty('ADBE Gaussian Blur 2');
        Utils.setEffectProp(blur, 'Blurriness', 10);
        /* === UNSHARP MASK === */
        var unsharp = layer.effect.addProperty('ADBE Unsharp Mask2');
        Utils.setEffectProp(unsharp, 'Amount', 300);
        Utils.setEffectProp(unsharp, 'Radius', 6);
    }
    _Texturelabs.applyGrain = applyGrain;
    // Create a "Damage" solid layer with 4K 4:3 settings and proper effects
    function applyDamage(layer) {
        /* === FIRST FRACTAL NOISE === */
        var fractal1 = layer.effect.addProperty('ADBE Fractal Noise');
        Utils.setEffectProp(fractal1, 'Contrast', 1000);
        Utils.setEffectProp(fractal1, 'Brightness', -460);
        Utils.setEffectProp(fractal1, 'Uniform Scaling', false);
        Utils.setEffectProp(fractal1, 'Scale Width', 600);
        Utils.setEffectProp(fractal1, 'Scale Height', 1000);
        Utils.setEffectProp(fractal1, 'Scale Height', 'wiggle(24, 400)', true);
        Utils.setEffectProp(fractal1, 'Complexity', 7);
        Utils.setEffectProp(fractal1, 'Random Seed', 0);
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
        Utils.setEffectProp(fractal2, 'Blending Mode', 9); // Hard Light
        /* === CC TONER === */
        var toner = layer.effect.addProperty('CC Toner');
        Utils.setEffectProp(toner, 'Midtones', [0.184, 0.765, 0.369]); // #2FC35E normalized
    }
    _Texturelabs.applyDamage = applyDamage;
    // Apply blob FX to the 'Blobs' layer in the active comp
    function applyBlobs(layer) {
        /* === FRACTAL NOISE === */
        var fractal = layer.effect.addProperty('ADBE Fractal Noise');
        Utils.setEffectProp(fractal, 'Fractal Type', 7); // Dynamic
        Utils.setEffectProp(fractal, 'Invert', true);
        Utils.setEffectProp(fractal, 'Contrast', 1875);
        Utils.setEffectProp(fractal, 'Brightness', 880);
        Utils.setEffectProp(fractal, 'Scale', 400);
        Utils.setEffectProp(fractal, 'Random Seed', 0);
        Utils.setEffectProp(fractal, 'Random Seed', 'time * 200', true);
        /* === CC TONER === */
        var toner = layer.effect.addProperty('CC Toner');
        Utils.setEffectProp(toner, 'Midtones', [0.173, 0.373, 0.29]); // #2C5F4A
    }
    _Texturelabs.applyBlobs = applyBlobs;
    // Apply scratches FX to the 'Scratches' layer in the active comp
    function applyScratches(layer) {
        /* === FRACTAL NOISE === */
        var fractal = layer.effect.addProperty('ADBE Fractal Noise');
        Utils.setEffectProp(fractal, 'Invert', true);
        Utils.setEffectProp(fractal, 'Contrast', 200);
        Utils.setEffectProp(fractal, 'Brightness', 110);
        Utils.setEffectProp(fractal, 'Uniform Scaling', false);
        Utils.setEffectProp(fractal, 'Scale Width', 50);
        Utils.setEffectProp(fractal, 'Scale Height', 10000);
        Utils.setEffectProp(fractal, 'Evolution', 0);
        Utils.setEffectProp(fractal, 'Evolution', 'time * 200', true);
        /* === TURBULENT DISPLACE === */
        var turb = layer.effect.addProperty('ADBE Turbulent Displace');
        Utils.setEffectProp(turb, 'Amount', 10);
        Utils.setEffectProp(turb, 'Amount', 'wiggle(10, 5)', true);
        Utils.setEffectProp(turb, 'Size', 100);
        Utils.setEffectProp(turb, 'Size', 'wiggle(10, 10)', true);
        Utils.setEffectProp(turb, 'Complexity', 3);
        Utils.setEffectProp(turb, 'Random Seed', 0);
        Utils.setEffectProp(turb, 'Random Seed', 'time * 24', true);
    }
    _Texturelabs.applyScratches = applyScratches;
    // Apply dust FX to the 'Dust' layer in the active comp
    function applyDust(layer) {
        /* === FRACTAL NOISE === */
        var fractal = layer.effect.addProperty('ADBE Fractal Noise');
        Utils.setEffectProp(fractal, 'Fractal Type', 12); // Smeary
        Utils.setEffectProp(fractal, 'Invert', true);
        Utils.setEffectProp(fractal, 'Contrast', 3000);
        Utils.setEffectProp(fractal, 'Brightness', -2925);
        Utils.setEffectProp(fractal, 'Scale', 400);
        Utils.setEffectProp(fractal, 'Complexity', 3);
        Utils.setEffectProp(fractal, 'Sub Influence (%)', 30);
        Utils.setEffectProp(fractal, 'Sub Scaling', 50);
        Utils.setEffectProp(fractal, 'Random Seed', 0);
        Utils.setEffectProp(fractal, 'Random Seed', 'time * 24', true);
        /* === SET CHANNELS === */
        var setChannels = layer.effect.addProperty('ADBE Set Channels');
        Utils.setEffectProp(setChannels, 'ADBE Set Channels-0008', 5); // Luminance
        /* === NOISE === */
        var noise = layer.effect.addProperty('ADBE Noise2');
        Utils.setEffectProp(noise, 'ADBE Noise2-0001', 100); // Amount of Noise
        /* === UNSHARP MASK === */
        var unsharp = layer.effect.addProperty('ADBE Unsharp Mask2');
        Utils.setEffectProp(unsharp, 'Amount', 200);
        Utils.setEffectProp(unsharp, 'Radius', 2);
        /* === GAUSSIAN BLUR === */
        var blur = layer.effect.addProperty('ADBE Gaussian Blur 2');
        Utils.setEffectProp(blur, 'Blurriness', 3);
    }
    _Texturelabs.applyDust = applyDust;
    // Apply Gate Weave FX to the 'Gate Weave' layer in the active comp
    function applyGateWeave(layer) {
        /* === TRANSFORM === */
        var transform = layer.effect.addProperty('ADBE Geometry2');
        Utils.setEffectProp(transform, 'Position', 'x = wiggle(12, 1)[0];\n' + 'y = wiggle(3, 0.3, 3, 4)[1];\n' + '[x, y];', true);
        Utils.setEffectProp(transform, 'Scale Width', 101.5);
        Utils.setEffectProp(transform, 'Scale Height', 101.5);
    }
    _Texturelabs.applyGateWeave = applyGateWeave;
    // Apply Light Leaks FX to the 'Light Leaks' layer in the active comp
    function applyLightLeaks(layer) {
        /* === FRACTAL NOISE #1 === */
        var fractal1 = layer.effect.addProperty('ADBE Fractal Noise');
        Utils.setEffectProp(fractal1, 'Invert', true);
        Utils.setEffectProp(fractal1, 'Contrast', 60);
        Utils.setEffectProp(fractal1, 'Brightness', -30);
        Utils.setEffectProp(fractal1, 'Uniform Scaling', false);
        Utils.setEffectProp(fractal1, 'Scale Width', 4000);
        Utils.setEffectProp(fractal1, 'Scale Height', 8000);
        Utils.setEffectProp(fractal1, 'Complexity', 2);
        Utils.setEffectProp(fractal1, 'Evolution', 0);
        Utils.setEffectProp(fractal1, 'Evolution', 'time * 400', true);
        /* === CC TONER === */
        var toner = layer.effect.addProperty('CC Toner');
        Utils.setEffectProp(toner, 'Tones', 3); // Pentone
        Utils.setEffectProp(toner, 'Darktones', [0.192, 0.227, 0.294]); // #313A4B
        Utils.setEffectProp(toner, 'Midtones', 'v = wiggle(5, 1)', true);
        /* === FRACTAL NOISE #2 === */
        var fractal2 = layer.effect.addProperty('ADBE Fractal Noise');
        Utils.setEffectProp(fractal2, 'Brightness', -20);
        Utils.setEffectProp(fractal2, 'Uniform Scaling', false);
        Utils.setEffectProp(fractal2, 'Scale Width', 3000);
        Utils.setEffectProp(fractal2, 'Scale Height', 6000);
        Utils.setEffectProp(fractal2, 'Complexity', 1);
        Utils.setEffectProp(fractal2, 'Evolution', 0);
        Utils.setEffectProp(fractal2, 'Evolution', 'time * 100', true);
        Utils.setEffectProp(fractal2, 'Blending Mode', 5); // Multiply
    }
    _Texturelabs.applyLightLeaks = applyLightLeaks;
    // Apply flicker FX to the 'Flicker' layer in the active comp
    function applyFlicker(layer) {
        /* === EXPOSURE === */
        var exposure = layer.effect.addProperty('ADBE Exposure2');
        Utils.setEffectProp(exposure, 'Exposure', 0);
        Utils.setEffectProp(exposure, 'Exposure', 'wiggle(12, 0.1)', true);
    }
    _Texturelabs.applyFlicker = applyFlicker;
})(_Texturelabs || (_Texturelabs = {}));
// 4K 4:3 Film Look Template
var compWidth = 2880;
var compHeight = 2160;
var compDuration = 30;
var compFrameRate = 24;
(function (thisObj) {
    createUIPanel(thisObj);
})(this);
function createUIPanel(thisObj) {
    var win = thisObj instanceof Panel ? thisObj : new Window('palette', 'AE Utils Panel', undefined, { resizeable: true });
    win.orientation = 'column';
    win.alignChildren = 'fill';
    var btnGenerateFilmLook = win.add('button', undefined, 'Generate Film Look Comp');
    btnGenerateFilmLook.onClick = function () {
        createFilmLookTemplate('Film Look', true);
    };
    var btnGenerateNewsReel = win.add('button', undefined, 'Generate News Reel Comp');
    btnGenerateNewsReel.onClick = function () {
        createFilmLookTemplate('News Reel', true);
    };
    var btnGenerateTexturelabs = win.add('button', undefined, 'Generate Texturelabs Comp');
    btnGenerateTexturelabs.onClick = function () {
        createFilmLookTemplate('Texturelabs', true);
    };
    var btnGenerateFilmLookDefaults = win.add('button', undefined, 'Generate Film Look Comp (defaults)');
    btnGenerateFilmLookDefaults.onClick = function () {
        createFilmLookTemplate('Film Look', false);
    };
    var btnCleanProject = win.add('button', undefined, 'Clean Project');
    btnCleanProject.onClick = function () {
        Utils.cleanProject();
    };
    var btnListLayerEffectsTexturelabs = win.add('button', undefined, 'List Layer Effects');
    btnListLayerEffectsTexturelabs.onClick = function () {
        Utils.listLayerEffectsOfAllComps();
    };
    var btnImportPsdToComp = win.add('button', undefined, 'Import PSD to Comp');
    btnImportPsdToComp.onClick = function () {
        Utils.importPsdToComp();
    };
    win.layout.layout(true);
    if (win instanceof Window) {
        win.center();
        win.show();
    }
}
function createFilmLookTemplate(style, setEffectProps) {
    var footagePlaceholder;
    var colorCorrectionLayer;
    var grain;
    var damage;
    var blobs;
    var scratches;
    var dust;
    var gateWeave;
    var lightLeaks;
    var flicker;
    Utils.enableSetEffectProp(setEffectProps);
    Utils.initListOfSetPropertiesFile();
    app.beginUndoGroup('Create Film Look Template');
    var comp = app.project.items.addComp(Utils.getCompName(style), compWidth, compHeight, 1, compDuration, compFrameRate);
    if (style === 'Texturelabs') {
        /* === FOOTAGE PLACEHOLDER === */
        footagePlaceholder = Utils.addSolid(comp, 'Footage Placeholder', [1, 1, 1], compWidth, compHeight, null, false);
        footagePlaceholder.enabled = false;
        /* === LIGHT LEAKS === */
        lightLeaks = Utils.addSolid(comp, 'Light Leaks', [1, 1, 1], compWidth, compHeight, BlendingMode.SCREEN, false);
        Utils.setEffectProp(lightLeaks, 'Opacity', 33);
        /* === COLOR CORRECTION === */
        colorCorrectionLayer = Utils.addSolid(comp, 'Color Correction', [1, 1, 1], compWidth, compHeight, null, true);
        /* === FLICKER === */
        flicker = Utils.addSolid(comp, 'Flicker', [1, 1, 1], compWidth, compHeight, null, true);
        /* === DUST === */
        dust = Utils.addSolid(comp, 'Dust', [1, 1, 1], compWidth, compHeight, BlendingMode.NORMAL, false);
        Utils.setEffectProp(dust, 'Scale', [200, 200]);
        /* === DAMAGE === */
        damage = Utils.addSolid(comp, 'Damage', [1, 1, 1], compWidth, compHeight, BlendingMode.HARD_LIGHT, false);
        /* === BLOBS === */
        blobs = Utils.addSolid(comp, 'Blobs', [1, 1, 1], compWidth, compHeight, BlendingMode.MULTIPLY, false);
        /* === SCRATCHES === */
        scratches = Utils.addSolid(comp, 'Scratches', [0, 0, 0], compWidth, compHeight, BlendingMode.MULTIPLY, false);
        Utils.setEffectProp(scratches, 'Scale', [100, 4000]);
        /* === GRAIN === */
        grain = Utils.addSolid(comp, 'Grain', [1, 1, 1], compWidth, compHeight, null, true);
        /* === GATE WEAVE === */
        gateWeave = Utils.addSolid(comp, 'Gate Weave', [1, 1, 1], compWidth, compHeight, null, true);
    }
    else {
        /* === FOOTAGE PLACEHOLDER === */
        footagePlaceholder = Utils.addSolid(comp, 'Footage Placeholder', [1, 1, 1], compWidth, compHeight, null, false);
        footagePlaceholder.enabled = false;
        /* === COLOR CORRECTION === */
        colorCorrectionLayer = Utils.addSolid(comp, 'Color Correction', [1, 1, 1], compWidth, compHeight, null, true);
        /* === GRAIN === */
        grain = Utils.addSolid(comp, 'Grain', [1, 1, 1], compWidth, compHeight, null, true);
        /* === DAMAGE === */
        damage = Utils.addSolid(comp, 'Damage', [1, 1, 1], compWidth, compHeight, BlendingMode.HARD_LIGHT, false);
        /* === BLOBS === */
        blobs = Utils.addSolid(comp, 'Blobs', [1, 1, 1], compWidth, compHeight, BlendingMode.MULTIPLY, false);
        /* === SCRATCHES === */
        scratches = Utils.addSolid(comp, 'Scratches', [0, 0, 0], compWidth, compHeight, BlendingMode.MULTIPLY, false);
        Utils.setEffectProp(scratches, 'Scale', [100, 4000]);
        /* === DUST === */
        dust = Utils.addSolid(comp, 'Dust', [1, 1, 1], compWidth, compHeight, BlendingMode.NORMAL, false);
        Utils.setEffectProp(dust, 'Scale', [200, 200]);
        /* === GATE WEAVE === */
        gateWeave = Utils.addSolid(comp, 'Gate Weave', [1, 1, 1], compWidth, compHeight, null, true);
        /* === LIGHT LEAKS === */
        lightLeaks = Utils.addSolid(comp, 'Light Leaks', [1, 1, 1], compWidth, compHeight, BlendingMode.SCREEN, false);
        Utils.setEffectProp(lightLeaks, 'Opacity', 33);
        /* === FLICKER === */
        flicker = Utils.addSolid(comp, 'Flicker', [1, 1, 1], compWidth, compHeight, null, true);
    }
    app.endUndoGroup();
    if (style === 'News Reel') {
        _NewsReel.applyColorCorrection(colorCorrectionLayer);
        _NewsReel.applyGrain(grain);
        _NewsReel.applyDamage(damage);
        _NewsReel.applyBlobs(blobs);
        _NewsReel.applyScratches(scratches);
        _NewsReel.applyDust(dust);
        _NewsReel.applyGateWeave(gateWeave);
        _NewsReel.applyLightLeaks(lightLeaks);
        _NewsReel.applyFlicker(flicker);
    }
    else if (style === 'Film Look') {
        _FilmLook.applyColorCorrection(colorCorrectionLayer);
        _FilmLook.applyGrain(grain);
        _FilmLook.applyDamage(damage);
        _FilmLook.applyBlobs(blobs);
        _FilmLook.applyScratches(scratches);
        _FilmLook.applyDust(dust);
        _FilmLook.applyGateWeave(gateWeave);
        _FilmLook.applyLightLeaks(lightLeaks);
        _FilmLook.applyFlicker(flicker);
    }
    else if (style === 'Texturelabs') {
        _Texturelabs.applyColorCorrection(colorCorrectionLayer);
        _Texturelabs.applyGrain(grain);
        _Texturelabs.applyDamage(damage);
        _Texturelabs.applyBlobs(blobs);
        _Texturelabs.applyScratches(scratches);
        _Texturelabs.applyDust(dust);
        _Texturelabs.applyGateWeave(gateWeave);
        _Texturelabs.applyLightLeaks(lightLeaks);
        _Texturelabs.applyFlicker(flicker);
    }
    Utils.listLayerEffects(comp);
}

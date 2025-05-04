// 4K 4:3 Film Look Template
const compName = 'FilmLook_4K_4x3_Theatrical';
const compWidth = 2880;
const compHeight = 2160;
const compDuration = 30;
const compFrameRate = 25;

(function (thisObj) {
	// (function (thisObj) {
	const win =
		thisObj instanceof Panel ? thisObj : new Window('palette', 'AE Utils Panel', undefined, { resizeable: true });

	// if (win instanceof Panel) {
	// 	win.text = 'AE Utils'; // Your custom tab label
	// }

	win.orientation = 'column';
	win.alignChildren = 'fill';

	// Button 1
	const btnGenerateFilmLook = win.add('button', undefined, 'Generate Film Look Template');
	btnGenerateFilmLook.onClick = function () {
		if (typeof createFilmLookTemplate === 'function') {
			createFilmLookTemplate(true);
		} else {
			alert('createFilmLookTemplate() is not defined.');
		}
	};

	// Button 2
	const btnGenerateFilmLookDefaults = win.add('button', undefined, 'Generate Film Look Template (defaults)');
	btnGenerateFilmLookDefaults.onClick = function () {
		if (typeof createFilmLookTemplate === 'function') {
			createFilmLookTemplate(false);
		} else {
			alert('createFilmLookTemplate() is not defined.');
		}
	};

	// Button 3
	const btnCleanProject = win.add('button', undefined, 'Clean Project');
	btnCleanProject.onClick = function () {
		if (typeof Utils.cleanProject === 'function') {
			Utils.cleanProject(compName);
		} else {
			alert('cleanProject() is not defined.');
		}
	};

	// Button 4
	const btnListLayerEffectsTexturelabs = win.add('button', undefined, 'List Layer Effects (Texturelabs)');
	btnListLayerEffectsTexturelabs.onClick = function () {
		if (typeof listLayerEffectsTexturelabs === 'function') {
			listLayerEffectsTexturelabs('Texturelabs');
		} else {
			alert('listLayerEffectsTexturelabs() is not defined.');
		}
	};

	// Button 5
	const btnListLayerEffectsFilmLook = win.add('button', undefined, 'List Layer Effects (FilmLook)');
	btnListLayerEffectsFilmLook.onClick = function () {
		if (typeof listLayerEffectsTexturelabs === 'function') {
			listLayerEffectsTexturelabs('FilmLook');
		} else {
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

function createFilmLookTemplate(setEffectProps: boolean) {
	Utils.enableSetEffectProp(setEffectProps);

	app.beginUndoGroup('Create Film Look Template');

	const comp = app.project.items.addComp(compName, compWidth, compHeight, 1, compDuration, compFrameRate);

	/* === FOOTAGE PLACEHOLDER === */

	Utils.addSolid(comp, 'Footage Placeholder', [0.1, 0.1, 0.1], compWidth, compHeight, null, false);

	/* === COLOR CORRECTION === */

	const colorCorrectionLayer = Utils.addSolid(comp, 'Color Correction', [1, 1, 1], compWidth, compHeight, null, true);

	/* === GRAIN === */

	const grain = Utils.addSolid(comp, 'Grain', [1, 1, 1], compWidth, compHeight, null, true);

	/* === DAMAGE === */

	const damage = Utils.addSolid(comp, 'Damage', [1, 1, 1], compWidth, compHeight, BlendingMode.HARD_LIGHT, false);

	/* === BLOBS === */

	const blobs = Utils.addSolid(comp, 'Blobs', [1, 1, 1], compWidth, compHeight, BlendingMode.MULTIPLY, false);

	/* === SCRATCHES === */

	const scratches = Utils.addSolid(comp, 'Scratches', [0, 0, 0], compWidth, compHeight, BlendingMode.MULTIPLY, false);
	Utils.setEffectProp(scratches, 'Scale', [100, 4000]);

	/* === DUST === */

	const dust = Utils.addSolid(comp, 'Dust', [1, 1, 1], compWidth, compHeight, BlendingMode.NORMAL, false);
	Utils.setEffectProp(dust, 'Scale', [200, 200]);

	/* === GATE WEAVE === */

	const gateWeave = Utils.addSolid(comp, 'Gate Weave', [1, 1, 1], compWidth, compHeight, null, true);
	// Utils.setEffectProp(gateWeave, 'Scale', [101.5, 101.5]);
	// Utils.setEffectProp(gateWeave, 'Scale', 101.5);

	/* === LIGHT LEAKS === */

	const lightLeaks = Utils.addSolid(
		comp,
		'Light Leaks',
		[1, 1, 1],
		compWidth,
		compHeight,
		BlendingMode.SCREEN,
		false
	);

	/* === FLICKER === */

	const flicker = Utils.addSolid(comp, 'Flicker', [1, 1, 1], compWidth, compHeight, null, true);

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

function listLayerEffectsTexturelabs(compName: string) {
	for (let i = 1; i <= app.project.items.length; i++) {
		if (app.project.item(i).name.indexOf(compName) === 0) {
			Utils.listLayerEffects(app.project.item(i) as CompItem);
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

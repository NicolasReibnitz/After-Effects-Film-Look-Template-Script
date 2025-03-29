// 4K 4:3 Film Look Template
const compNamePrefix = 'FilmLook_4K_4x3_';
const compWidth = 2880;
const compHeight = 2160;
const compDuration = 30;
const compFrameRate = 24;

(function (thisObj) {
	const win =
		thisObj instanceof Panel ? thisObj : new Window('palette', 'AE Utils Panel', undefined, { resizeable: true });

	win.orientation = 'column';
	win.alignChildren = 'fill';

	const btnGenerateFilmLook = win.add('button', undefined, 'Generate Film Look Comp');
	btnGenerateFilmLook.onClick = function () {
		if (typeof createFilmLookTemplate === 'function') {
			createFilmLookTemplate('Film Look', true);
		} else {
			alert('createFilmLookTemplate() is not defined.');
		}
	};

	const btnGenerateNewsReel = win.add('button', undefined, 'Generate News Reel Comp');
	btnGenerateNewsReel.onClick = function () {
		if (typeof createFilmLookTemplate === 'function') {
			createFilmLookTemplate('News Reel', true);
		} else {
			alert('createFilmLookTemplate() is not defined.');
		}
	};

	const btnGenerateTexturelabs = win.add('button', undefined, 'Generate Texturelabs Comp');
	btnGenerateTexturelabs.onClick = function () {
		if (typeof createFilmLookTemplate === 'function') {
			createFilmLookTemplate('Texturelabs', true);
		} else {
			alert('createFilmLookTemplate() is not defined.');
		}
	};

	const btnGenerateFilmLookDefaults = win.add('button', undefined, 'Generate Film Look Comp (defaults)');
	btnGenerateFilmLookDefaults.onClick = function () {
		if (typeof createFilmLookTemplate === 'function') {
			createFilmLookTemplate('Film Look', false);
		} else {
			alert('createFilmLookTemplate() is not defined.');
		}
	};

	const btnCleanProject = win.add('button', undefined, 'Clean Project');
	btnCleanProject.onClick = function () {
		if (typeof Utils.cleanProject === 'function') {
			Utils.cleanProject(compNamePrefix);
		} else {
			alert('cleanProject() is not defined.');
		}
	};

	const btnListLayerEffectsTexturelabs = win.add('button', undefined, 'List Layer Effects (Texturelabs)');
	btnListLayerEffectsTexturelabs.onClick = function () {
		if (typeof listLayerEffectsTexturelabs === 'function') {
			listLayerEffectsTexturelabs('Texturelabs');
		} else {
			alert('listLayerEffectsTexturelabs() is not defined.');
		}
	};

	const btnListLayerEffectsFilmLook = win.add('button', undefined, 'List Layer Effects (FilmLook)');
	btnListLayerEffectsFilmLook.onClick = function () {
		if (typeof listLayerEffectsTexturelabs === 'function') {
			listLayerEffectsTexturelabs('FilmLook');
		} else {
			alert('listLayerEffectsTexturelabs() is not defined.');
		}
	};

	const btnImportPsdToComp = win.add('button', undefined, 'Import PSD to Comp');
	btnImportPsdToComp.onClick = function () {
		if (typeof listLayerEffectsTexturelabs === 'function') {
			Utils.importPsdToComp();
		} else {
			alert('importPsdToComp() is not defined.');
		}
	};

	win.layout.layout(true);

	if (win instanceof Window) {
		win.center();
		win.show();
	}
})(this);

function createFilmLookTemplate(style: string, setEffectProps: boolean) {
	Utils.enableSetEffectProp(setEffectProps);
	Utils.initListOfSetPropertiesFile();

	app.beginUndoGroup('Create Film Look Template');

	const comp = app.project.items.addComp(getCompName(style), compWidth, compHeight, 1, compDuration, compFrameRate);

	/* === FOOTAGE PLACEHOLDER === */

	const footagePlaceholder = Utils.addSolid(
		comp,
		'Footage Placeholder',
		[1, 1, 1],
		compWidth,
		compHeight,
		null,
		false
	);
	footagePlaceholder.enabled = false;

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
	Utils.setEffectProp(lightLeaks, 'Opacity', 33);

	/* === FLICKER === */

	const flicker = Utils.addSolid(comp, 'Flicker', [1, 1, 1], compWidth, compHeight, null, true);

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
	} else if (style === 'Film Look') {
		_FilmLook.applyColorCorrection(colorCorrectionLayer);
		_FilmLook.applyGrain(grain);
		_FilmLook.applyDamage(damage);
		_FilmLook.applyBlobs(blobs);
		_FilmLook.applyScratches(scratches);
		_FilmLook.applyDust(dust);
		_FilmLook.applyGateWeave(gateWeave);
		_FilmLook.applyLightLeaks(lightLeaks);
		_FilmLook.applyFlicker(flicker);
	} else if (style === 'Texturelabs') {
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

function getCompName(style: string) {
	return compNamePrefix + style.replace(' ', '_');
}

function listLayerEffectsTexturelabs(compName: string) {
	for (let i = 1; i <= app.project.items.length; i++) {
		if (app.project.item(i).name.indexOf(compName) === 0) {
			Utils.listLayerEffects(app.project.item(i) as CompItem);
		}
	}
}

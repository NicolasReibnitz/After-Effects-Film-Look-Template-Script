// 4K 4:3 Film Look Template
const compWidth = 2880;
const compHeight = 2160;
const compDuration = 30;
const compFrameRate = 24;

(function (thisObj) {
	createUIPanel(thisObj);
})(this);

function createUIPanel(thisObj: typeof globalThis) {
	const win =
		thisObj instanceof Panel ? thisObj : new Window('palette', 'AE Utils Panel', undefined, { resizeable: true });

	win.orientation = 'column';
	win.alignChildren = 'fill';

	const btnGenerateFilmLook = win.add('button', undefined, 'Generate Film Look Comp');
	btnGenerateFilmLook.onClick = function () {
		createFilmLookTemplate('Film Look', true);
	};

	const btnGenerateNewsReel = win.add('button', undefined, 'Generate News Reel Comp');
	btnGenerateNewsReel.onClick = function () {
		createFilmLookTemplate('News Reel', true);
	};

	const btnGenerateTexturelabs = win.add('button', undefined, 'Generate Texturelabs Comp');
	btnGenerateTexturelabs.onClick = function () {
		createFilmLookTemplate('Texturelabs', true);
	};

	const btnGenerateFilmLookDefaults = win.add('button', undefined, 'Generate Film Look Comp (defaults)');
	btnGenerateFilmLookDefaults.onClick = function () {
		createFilmLookTemplate('Film Look', false);
	};

	const btnCleanProject = win.add('button', undefined, 'Clean Project');
	btnCleanProject.onClick = function () {
		Utils.cleanProject();
	};

	const btnListLayerEffectsTexturelabs = win.add('button', undefined, 'List Layer Effects');
	btnListLayerEffectsTexturelabs.onClick = function () {
		Utils.listLayerEffectsOfAllComps();
	};

	const btnImportPsdToComp = win.add('button', undefined, 'Import PSD to Comp');
	btnImportPsdToComp.onClick = function () {
		Utils.importPsdToComp();
	};

	win.layout.layout(true);

	if (win instanceof Window) {
		win.center();
		win.show();
	}
}

function createFilmLookTemplate(style: string, setEffectProps: boolean) {
	let footagePlaceholder: AVLayer;
	let colorCorrectionLayer: AVLayer;
	let grain: AVLayer;
	let damage: AVLayer;
	let blobs: AVLayer;
	let scratches: AVLayer;
	let dust: AVLayer;
	let gateWeave: AVLayer;
	let lightLeaks: AVLayer;
	let flicker: AVLayer;

	Utils.enableSetEffectProp(setEffectProps);
	Utils.initListOfSetPropertiesFile();

	app.beginUndoGroup('Create Film Look Template');

	const comp = app.project.items.addComp(
		Utils.getCompName(style),
		compWidth,
		compHeight,
		1,
		compDuration,
		compFrameRate
	);

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
	} else {
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

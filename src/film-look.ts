namespace _FilmLook {
	// Apply color correction FX to the 'Color Correction' layer in the active comp

	export function applyColorCorrection(layer: AVLayer) {
		// app.beginUndoGroup('Apply Color Correction FX');

		/* === Glow === */

		const glow = layer.effect.addProperty('ADBE Glo2');
		Utils.setEffectProp(glow, 'Glow Threshold', (50 / 100) * 255);
		Utils.setEffectProp(glow, 'Glow Radius', 1000);
		Utils.setEffectProp(glow, 'Glow Intensity', 0.2);
		Utils.setEffectProp(glow, 'Glow Operation', 6); // Screen

		/* === CC Vignette === */

		const vignette = layer.effect.addProperty('CC Vignette');
		Utils.setEffectProp(vignette, 'Amount', 100);

		/* === Levels === */

		const levels = layer.effect.addProperty('ADBE Easy Levels2');
		Utils.setEffectProp(levels, 'Output Black', 0.030517578125);
		Utils.setEffectProp(levels, 'Output White', 0.91552734375);

		// app.endUndoGroup();
	}

	// Add Grain FX to the "Grain" layer in the active comp

	export function applyGrain(layer: AVLayer) {
		// app.beginUndoGroup('Apply Grain FX');

		/* === NOISE === */

		const noise = layer.effect.addProperty('ADBE Noise2');
		Utils.setEffectProp(noise, 'ADBE Noise2-0001', 30); // Amount of Noise
		Utils.setEffectProp(noise, 'ADBE Noise2-0002', 0); // Use color noise

		/* === GAUSSIAN BLUR === */

		const blur = layer.effect.addProperty('ADBE Gaussian Blur 2');
		Utils.setEffectProp(blur, 'Blurriness', 10);
		Utils.setEffectProp(blur, 'Repeat Edge Pixels', true);

		/* === UNSHARP MASK === */

		const unsharp = layer.effect.addProperty('ADBE Unsharp Mask2');
		Utils.setEffectProp(unsharp, 'Amount', 300);
		// Utils.setEffectProp(unsharp, 'Radius', 3);
		Utils.setEffectProp(unsharp, 'Radius', 6);

		// app.endUndoGroup();
	}

	// Create a "Damage" solid layer with 4K 4:3 settings and proper effects

	export function applyDamage(layer: AVLayer) {
		// app.beginUndoGroup('Apply Damage FX');

		/* === FIRST FRACTAL NOISE === */

		const fractal1 = layer.effect.addProperty('ADBE Fractal Noise');
		Utils.setEffectProp(fractal1, 'Contrast', 1000);
		Utils.setEffectProp(fractal1, 'Brightness', -460);
		Utils.setEffectProp(fractal1, 'Uniform Scaling', false);
		Utils.setEffectProp(fractal1, 'Scale Width', 600);
		Utils.setEffectProp(fractal1, 'Scale Height', 1000);
		Utils.setEffectProp(fractal1, 'Scale Height', 'wiggle(24, 400)', true);
		Utils.setEffectProp(fractal1, 'Complexity', 7);
		Utils.setEffectProp(fractal1, 'Random Seed', 'time * 24', true);

		/* === EXTRACT === */

		const extract = layer.effect.addProperty('ADBE Extract');
		Utils.setEffectProp(extract, 'Black Point', 20);
		Utils.setEffectProp(extract, 'Black Softness', 20);

		/* === SECOND FRACTAL NOISE === */

		const fractal2 = layer.effect.addProperty('ADBE Fractal Noise');
		Utils.setEffectProp(fractal2, 'Contrast', 313);
		Utils.setEffectProp(fractal2, 'Brightness', 40);
		Utils.setEffectProp(fractal2, 'Scale', 50);
		Utils.setEffectProp(fractal2, 'Blending Mode', 9);

		/* === CC TONER === */

		const toner = layer.effect.addProperty('CC Toner');
		Utils.setEffectProp(toner, 'Midtones', [0.184, 0.765, 0.369]); // #2FC35E normalized

		// app.endUndoGroup();
	}

	// Apply blob FX to the 'Blobs' layer in the active comp

	export function applyBlobs(layer: AVLayer) {
		// app.beginUndoGroup('Apply Blob FX');

		/* === FRACTAL NOISE === */

		const fractal = layer.effect.addProperty('ADBE Fractal Noise');
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

		const toner = layer.effect.addProperty('CC Toner');
		// toner.property('Midtones').setValue([0.173, 0.373, 0.29]);
		Utils.setEffectProp(toner, 'Midtones', [0.173, 0.373, 0.29]); // #2C5F4A

		// app.endUndoGroup();
	}

	// Apply scratches FX to the 'Scratches' layer in the active comp

	export function applyScratches(layer: AVLayer) {
		// app.beginUndoGroup('Apply Scratches FX');

		/* === FRACTAL NOISE === */

		const fractal = layer.effect.addProperty('ADBE Fractal Noise');
		// fractal.property('Invert').setValue(true);
		Utils.setEffectProp(fractal, 'Invert', true);
		// fractal.property('Contrast').setValue(200);
		Utils.setEffectProp(fractal, 'Contrast', 200);
		// fractal.property('Brightness').setValue(110);
		Utils.setEffectProp(fractal, 'Brightness', 100);
		// fractal.property('Uniform Scaling').setValue(false);
		Utils.setEffectProp(fractal, 'Uniform Scaling', false);
		// fractal.property('Scale Width').setValue(50);
		Utils.setEffectProp(fractal, 'Scale Width', 50);
		// fractal.property('Scale Height').setValue(10000);
		Utils.setEffectProp(fractal, 'Scale Height', 10000);
		// fractal.property('Random Seed').expression = 'time * 200';
		Utils.setEffectProp(fractal, 'Evolution', 'time * 200', true);

		/* === TURBULENT DISPLACE === */

		const turb = layer.effect.addProperty('ADBE Turbulent Displace');
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

	// Apply dust FX to the 'Dust' layer in the active comp

	export function applyDust(layer: AVLayer) {
		// app.beginUndoGroup('Apply Dust FX');

		/* === FRACTAL NOISE === */

		const fractal = layer.effect.addProperty('ADBE Fractal Noise');
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

		const setChannels = layer.effect.addProperty('ADBE Set Channels');
		// setChannels.property('ADBE Set Channels-0008').setValue(5); // Luminance
		Utils.setEffectProp(setChannels, 'ADBE Set Channels-0008', 5); // Luminance

		/* === NOISE === */

		const noise = layer.effect.addProperty('ADBE Noise2');
		// noise.property('ADBE Noise2-0001').setValue(100);
		Utils.setEffectProp(noise, 'ADBE Noise2-0001', 100); // Amount of Noise

		/* === UNSHARP MASK === */

		const unsharp = layer.effect.addProperty('ADBE Unsharp Mask2');
		// unsharp.property('Amount').setValue(200);
		Utils.setEffectProp(unsharp, 'Amount', 200);
		// unsharp.property('Radius').setValue(2);
		Utils.setEffectProp(unsharp, 'Radius', 2);

		/* === GAUSSIAN BLUR === */

		const blur = layer.effect.addProperty('ADBE Gaussian Blur 2');
		// blur.property('Blurriness').setValue(3);
		Utils.setEffectProp(blur, 'Blurriness', 3);
		// blur.property('Repeat Edge Pixels').setValue(true);
		Utils.setEffectProp(blur, 'Repeat Edge Pixels', true);

		// app.endUndoGroup();
	}

	// Apply Gate Weave FX to the 'Gate Weave' layer in the active comp

	export function applyGateWeave(layer: AVLayer) {
		/* === TRANSFORM === */

		const transform = layer.effect.addProperty('ADBE Geometry2');
		Utils.setEffectProp(
			transform,
			'Position',
			'x = wiggle(12, 1)[0];\n' + 'y = wiggle(3, 0.3, 3, 4)[1];\n' + '[x, y];',
			true
		);
		Utils.setEffectProp(transform, 'Scale Width', 101.5);
		Utils.setEffectProp(transform, 'Scale Height', 101.5);
	}

	// Apply Light Leaks FX to the 'Light Leaks' layer in the active comp

	export function applyLightLeaks(layer: AVLayer) {
		// app.beginUndoGroup('Apply Light Leaks FX');

		/* === FRACTAL NOISE #1 === */

		const fractal1 = layer.effect.addProperty('ADBE Fractal Noise');
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

		const toner = layer.effect.addProperty('CC Toner');
		// toner.property('Tones').setValue(3);
		Utils.setEffectProp(toner, 'Tones', 3); // Pentone
		// toner.property('Darktones').setValue([0.192, 0.227, 0.294]); // #313A4B
		Utils.setEffectProp(toner, 'Darktones', [0.192, 0.227, 0.294]); // #313A4B
		// toner.property('Midtones').expression = 'v = wiggle(5, 0.2)[0]; [v, v, v, 1]';
		Utils.setEffectProp(toner, 'Midtones', 'v = wiggle(5, 0.2)[0]; [v, v, v, 1]', true);

		/* === FRACTAL NOISE #2 === */

		const fractal2 = layer.effect.addProperty('ADBE Fractal Noise');
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

	// Apply flicker FX to the 'Flicker' layer in the active comp

	export function applyFlicker(layer: AVLayer) {
		/* === EXPOSURE === */

		const exposure = layer.effect.addProperty('ADBE Exposure2');
		Utils.setEffectProp(exposure, 'Exposure', 'wiggle(12, 0.1)', true);
	}
}

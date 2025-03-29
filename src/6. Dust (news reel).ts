// Apply dust FX to the 'Dust' layer in the active comp
namespace _DustNewsReel {
	export function applyEffects(layer: AVLayer) {
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
}

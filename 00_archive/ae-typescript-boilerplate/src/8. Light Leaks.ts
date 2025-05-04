// Apply Light Leaks FX to the 'Light Leaks' layer in the active comp
namespace _LightLeaks {
	export function applyEffects(layer: AVLayer) {
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
}

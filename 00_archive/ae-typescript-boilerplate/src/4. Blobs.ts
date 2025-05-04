// Apply blob FX to the 'Blobs' layer in the active comp

namespace _Blobs {
	export function applyEffects(layer: AVLayer) {
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
}

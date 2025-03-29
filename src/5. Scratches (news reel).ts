// Apply scratches FX to the 'Scratches' layer in the active comp
namespace _ScratchesNewsReel {
	export function applyEffects(layer: AVLayer) {
		// app.beginUndoGroup('Apply Scratches FX');

		/* === FRACTAL NOISE === */

		const fractal = layer.effect.addProperty('ADBE Fractal Noise');
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
}

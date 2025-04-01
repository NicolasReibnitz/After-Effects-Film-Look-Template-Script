/* eslint-disable @typescript-eslint/no-unused-vars */
namespace _Texturelabs {
	// Apply color correction FX to the 'Color Correction' layer in the active comp

	export function applyColorCorrection(layer: AVLayer) {
		/* === Glow === */

		const glow = layer.effect.addProperty('ADBE Glo2');

		Utils.setEffectProp(glow, 'Glow Threshold', (50 / 100) * 255);
		Utils.setEffectProp(glow, 'Glow Radius', 1000);
		Utils.setEffectProp(glow, 'Glow Intensity', 0.2);
		Utils.setEffectProp(glow, 'Glow Operation', 6); // Screen

		/* === Channel Mixer === */

		const channelMixer = layer.effect.addProperty('ADBE CHANNEL MIXER');

		Utils.setEffectProp(channelMixer, 'Blue-Green', 50);
		Utils.setEffectProp(channelMixer, 'Blue-Blue', 50);

		/* === Lumetri Color === */

		const lumetri = layer.effect.addProperty('ADBE Lumetri');

		Utils.setEffectProp(lumetri, 'ADBE Lumetri-0025', 5); // Look: CineSpace2383

		// This can't be set via script:
		// Highlight Tint:	Cyan/Blue

		/* === CC Vignette === */

		const vignette = layer.effect.addProperty('CC Vignette');

		Utils.setEffectProp(vignette, 'Amount', 50);

		/* === Levels === */

		const levels = layer.effect.addProperty('ADBE Easy Levels2');

		Utils.setEffectProp(levels, 'Output Black', 0.07629395); // 2500
		Utils.setEffectProp(levels, 'Output White', 0.91552734375); // 30000
	}

	// Add Grain FX to the "Grain" layer in the active comp

	export function applyGrain(layer: AVLayer) {
		/* === NOISE === */

		const noise = layer.effect.addProperty('ADBE Noise2');

		Utils.setEffectProp(noise, 'ADBE Noise2-0001', 15); // Amount of Noise

		/* === GAUSSIAN BLUR === */

		const blur = layer.effect.addProperty('ADBE Gaussian Blur 2');

		Utils.setEffectProp(blur, 'Blurriness', 10);

		/* === UNSHARP MASK === */

		const unsharp = layer.effect.addProperty('ADBE Unsharp Mask2');

		Utils.setEffectProp(unsharp, 'Amount', 300);
		Utils.setEffectProp(unsharp, 'Radius', 6);
	}

	// Create a "Damage" solid layer with 4K 4:3 settings and proper effects

	export function applyDamage(layer: AVLayer) {
		/* === FIRST FRACTAL NOISE === */

		const fractal1 = layer.effect.addProperty('ADBE Fractal Noise');

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

		const extract = layer.effect.addProperty('ADBE Extract');

		Utils.setEffectProp(extract, 'Black Point', 20);
		Utils.setEffectProp(extract, 'Black Softness', 20);

		/* === SECOND FRACTAL NOISE === */

		const fractal2 = layer.effect.addProperty('ADBE Fractal Noise');

		Utils.setEffectProp(fractal2, 'Contrast', 313);
		Utils.setEffectProp(fractal2, 'Brightness', 40);
		Utils.setEffectProp(fractal2, 'Scale', 50);
		Utils.setEffectProp(fractal2, 'Blending Mode', 9); // Hard Light

		/* === CC TONER === */

		const toner = layer.effect.addProperty('CC Toner');

		Utils.setEffectProp(toner, 'Midtones', [0.184, 0.765, 0.369]); // #2FC35E normalized
	}

	// Apply blob FX to the 'Blobs' layer in the active comp

	export function applyBlobs(layer: AVLayer) {
		/* === FRACTAL NOISE === */

		const fractal = layer.effect.addProperty('ADBE Fractal Noise');

		Utils.setEffectProp(fractal, 'Fractal Type', 7); // Dynamic
		Utils.setEffectProp(fractal, 'Invert', true);
		Utils.setEffectProp(fractal, 'Contrast', 1875);
		Utils.setEffectProp(fractal, 'Brightness', 880);
		Utils.setEffectProp(fractal, 'Scale', 400);
		Utils.setEffectProp(fractal, 'Random Seed', 0);
		Utils.setEffectProp(fractal, 'Random Seed', 'time * 200', true);

		/* === CC TONER === */

		const toner = layer.effect.addProperty('CC Toner');

		Utils.setEffectProp(toner, 'Midtones', [0.173, 0.373, 0.29]); // #2C5F4A
	}

	// Apply scratches FX to the 'Scratches' layer in the active comp

	export function applyScratches(layer: AVLayer) {
		/* === FRACTAL NOISE === */

		const fractal = layer.effect.addProperty('ADBE Fractal Noise');

		Utils.setEffectProp(fractal, 'Invert', true);
		Utils.setEffectProp(fractal, 'Contrast', 200);
		Utils.setEffectProp(fractal, 'Brightness', 110);
		Utils.setEffectProp(fractal, 'Uniform Scaling', false);
		Utils.setEffectProp(fractal, 'Scale Width', 50);
		Utils.setEffectProp(fractal, 'Scale Height', 10000);
		Utils.setEffectProp(fractal, 'Evolution', 0);
		Utils.setEffectProp(fractal, 'Evolution', 'time * 200', true);

		/* === TURBULENT DISPLACE === */

		const turb = layer.effect.addProperty('ADBE Turbulent Displace');

		Utils.setEffectProp(turb, 'Amount', 10);
		Utils.setEffectProp(turb, 'Amount', 'wiggle(10, 5)', true);
		Utils.setEffectProp(turb, 'Size', 100);
		Utils.setEffectProp(turb, 'Size', 'wiggle(10, 10)', true);
		Utils.setEffectProp(turb, 'Complexity', 3);
		Utils.setEffectProp(turb, 'Random Seed', 0);
		Utils.setEffectProp(turb, 'Random Seed', 'time * 24', true);
	}

	// Apply dust FX to the 'Dust' layer in the active comp

	export function applyDust(layer: AVLayer) {
		/* === FRACTAL NOISE === */

		const fractal = layer.effect.addProperty('ADBE Fractal Noise');

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

		const setChannels = layer.effect.addProperty('ADBE Set Channels');

		Utils.setEffectProp(setChannels, 'ADBE Set Channels-0008', 5); // Luminance

		/* === NOISE === */

		const noise = layer.effect.addProperty('ADBE Noise2');

		Utils.setEffectProp(noise, 'ADBE Noise2-0001', 100); // Amount of Noise

		/* === UNSHARP MASK === */

		const unsharp = layer.effect.addProperty('ADBE Unsharp Mask2');

		Utils.setEffectProp(unsharp, 'Amount', 200);
		Utils.setEffectProp(unsharp, 'Radius', 2);

		/* === GAUSSIAN BLUR === */

		const blur = layer.effect.addProperty('ADBE Gaussian Blur 2');

		Utils.setEffectProp(blur, 'Blurriness', 3);
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
		/* === FRACTAL NOISE #1 === */

		const fractal1 = layer.effect.addProperty('ADBE Fractal Noise');

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

		const toner = layer.effect.addProperty('CC Toner');

		Utils.setEffectProp(toner, 'Tones', 3); // Pentone
		Utils.setEffectProp(toner, 'Darktones', [0.192, 0.227, 0.294]); // #313A4B
		Utils.setEffectProp(toner, 'Midtones', 'v = wiggle(5, 1)', true);

		/* === FRACTAL NOISE #2 === */

		const fractal2 = layer.effect.addProperty('ADBE Fractal Noise');

		Utils.setEffectProp(fractal2, 'Brightness', -20);
		Utils.setEffectProp(fractal2, 'Uniform Scaling', false);
		Utils.setEffectProp(fractal2, 'Scale Width', 3000);
		Utils.setEffectProp(fractal2, 'Scale Height', 6000);
		Utils.setEffectProp(fractal2, 'Complexity', 1);
		Utils.setEffectProp(fractal2, 'Evolution', 0);
		Utils.setEffectProp(fractal2, 'Evolution', 'time * 100', true);
		Utils.setEffectProp(fractal2, 'Blending Mode', 5); // Multiply
	}

	// Apply flicker FX to the 'Flicker' layer in the active comp

	export function applyFlicker(layer: AVLayer) {
		/* === EXPOSURE === */

		const exposure = layer.effect.addProperty('ADBE Exposure2');

		Utils.setEffectProp(exposure, 'Exposure', 0);
		Utils.setEffectProp(exposure, 'Exposure', 'wiggle(12, 0.1)', true);
	}
}

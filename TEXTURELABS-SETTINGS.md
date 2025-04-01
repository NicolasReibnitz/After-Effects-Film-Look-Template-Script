![alt text](<assets/CleanShot 2025-03-29 at 05.10.28@2x.png>)

# COLOR CORRECTION

Adjustment Layer

## GLOW

Glow Threshold: 50%
Glow Radius: 500 <1000>
Glow Intensity: 0.2
Glow Operation: Screen

## CHANNEL MIXER

Blue-Green: 50
Blue-Blue: 50

## LUMETRI COLOR

Look: CineSpace2383
Highlight Tint: Cyan/Blue

## CC VIGNETTE

Amount: 50

## LEVELS

Output Black: 2500
Output White: 30000

![alt text](<assets/CleanShot 2025-03-29 at 05.14.49@2x.png>)

# GRAIN

Adjustment Layer

## NOISE

Amount: 10% \*15%

## GAUSSIAN BLUR

Blurriness: 6 \*10

## UNSHARP MASK

Amount: 300
Radius: 3 \*6

![alt text](<assets/CleanShot 2025-03-29 at 05.15.11@2x.png>)

# BLOBS

Solid Layer: Multiply Mode

## FRACTAL NOISE

Fractal Type: Dynamic
Invert: On
Contrast: 1875
Brightness: 880
Scale: 200% 400%
Random Seed:
time \* 200

## CC TONER

Midtones: #2C5F4A

![alt text](<assets/CleanShot 2025-03-29 at 05.12.12@2x.png>)

# DAMAGE

Solid Layer: Normal Mode

## FRACTAL NOISE

Contrast: 1000
Brightness: -460
Uniform Scaling: Off
Scale Width: 300 600*
Scale Height: 500 1000*
wiggle (24, 400)
Complexity: 7
Random Seed: 0
time \* 24

## EXTRACT

Black Point: 20
Black Softness: 20

## FRACTAL NOISE

Contrast: 313
Brightness: 40
Scale: 50%
Blending Mode: Hard Light

## CC TONER

Midtones: #2FC35E

![alt text](<assets/CleanShot 2025-03-29 at 05.12.39@2x.png>)

# SCRATCHES

Solid Layer: Multiply Mode
Scale: 100%, 2000%
\*Scale: 100%, 4000%

## FRACTAL NOISE

Invert: On
Contrast: 200
Brightness: 110
Uniform Scaling: Off
Scale Width: 25 50*
Scale Height: 10000
Evolution: 0
time * 200

## TURBULENT DISPLACE

Amount: 10
wiggle (10, 5).
Size: 50 100*
wiggle (10, 10)
Complexity: 3
Random Seed: 0
time * 24

![alt text](<assets/CleanShot 2025-03-29 at 05.13.26@2x.png>)

# DUST

Solid Layer: Normal Mode

## FRACTAL NOISE

Fractal Type: Smeary
Invert: On
Contrast: 3000
Brightness: -2925
Scale: 200% 40109
Complexity: 3
Sub Influence: 30%
Sub Scale: 50%
Random Seed: 0
time \* 24

## SET CHANNELS

Set Alpha to: Luminance

## NOISE

Amount: 100%

## UNSHARP MASK

Amount: 200%
Radius: 2

## GAUSSIAN BLUR

Blurriness: 3

![alt text](<assets/CleanShot 2025-03-29 at 05.13.40@2x.png>)

# GATE WEAVE

Adjustment Layer

## TRANSFORM EFFECT

Position:
x = wiggle (12, 0.5) [0];
y = wiggle (3, 0.15, 3, 4) [1];
[x; y]
Scale: 101.5%

**\*for 4k: In the expression, change 0.5 to 1 and change 0.15 to 0.3**

![alt text](<assets/CleanShot 2025-03-29 at 05.13.55@2x.png>)

# LIGHT LEAKS

Solid Layer: Screen Mode

## FRACTAL NOISE

Invert: On
Contrast: 60
Brightness: -30
Uniform Scaling: Off
Scale Width: 4000
Scale Height: 8000
Complexity: 2
Evolution: 0
time \* 400

## CC TONER

Tones: Pentatone
Midtones:
wiggle (5, 1)
Darktones: #313A4B

## FRACTAL NOISE

Brightness: -20
Uniform Scaling: Off
Scale Width: 3000
Scale Height: 6000
Complexity: 1
Evolution: 0
time \* 100
Blending Mode: Multiply

**\*4k: Use a 1920x1080 layer, scaled to 200%**

![alt text](<assets/CleanShot 2025-03-29 at 05.14.13@2x.png>)

# FLICKER

Adjustment Layer

## EXPOSURE

Exposure: 0
wiggle (12, 0.1)

![alt text](<assets/CleanShot 2025-03-29 at 05.38.04@2x.png>)

# VARIATIONS

## HEAVIER EFFECT

### DUST LAYER

Fractal Noise Brightness: -2900

### DAMAGE LAYER

Fractal Noise Brightness: -440

### BLOBS LAYER

Fractal Noise Brightness: 800

### SCRATCHES LAYER

Fractal Noise Brightness: 105

### GRAIN LAYER

Noise Amount 16%
Gaussian Blur: 8
Unsharp Mask Amount: 400
Unsharp Mask Radius: 4

![alt text](<assets/CleanShot 2025-03-29 at 05.38.23@2x.png>)

# VARIATIONS

## B/W NEWS REEL

### FLICKER LAYER

Exposure:
wiggle (12, 0.3)

### DUST LAYER

Fractal Noise Brightness: -2900

### DAMAGE LAYER

Fractal Noise Brightness: -440
Fractal Noise Scale: x 2

### BLOBS LAYER

Fractal Noise Brightness: 800
Fractal Noise Scale: 1000

### SCRATCHES LAYER

Fractal Noise Brightness: 105

### GRAIN LAYER

Noise Amount: 25%
Gaussian Blur: 10
Unsharp Mask Amount: 500
Unsharp Mask Radius: 4

- BLACK AND WHITE effect

### GATE WEAVE LAYER

x = wiggle (12, 1.5 ...
y = wiggle(3, 0.45 ...

![alt text](<assets/CleanShot 2025-03-29 at 05.09.14@2x.png>)

# VARIATIONS

## ORGANIC FILM

### LIGHT LEAKS LAYER

Fractal Noise 1 Evolution:
time \* 200
Fractal Noise 2: OFF

### COLOR CORRECTION LAYER

Blue-Green: 100
Blue-Blue: 0

### DAMAGE LAYER

OFF

### BLOBS LAYER

OFF

### SCRATCHES LAYER

OFF

### GRAIN LAYER

Noise Amount: 4%
Gaussian Blur: 1
Unsharp Mask Amount: 100
Unsharp Mask Radius: 2

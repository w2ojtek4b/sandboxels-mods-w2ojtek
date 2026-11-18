// mod is buged not updated

// bettersand.js
// Smooth color blending between sand and wet sand + water dye absorption

function startBetterSand() {
    if (typeof elements === "undefined" || !elements.sand || !elements.wet_sand) {
        setTimeout(startBetterSand, 200);
        return;
    }

    function parseRGB(colorStr) {
        if (!colorStr) return null;
        if (colorStr.startsWith("rgb")) {
            var m = colorStr.match(/\d+/g);
            return m ? { r: Number(m.at(0)), g: Number(m.at(1)), b: Number(m.at(2)) } : null;
        }
        if (colorStr.startsWith("#")) {
            var hex = colorStr.slice(1);
            if (hex.length === 3) {
                hex = hex.charAt(0) + hex.charAt(0) + hex.charAt(1) + hex.charAt(1) + hex.charAt(2) + hex.charAt(2);
            }
            return {
                r: parseInt(hex.slice(0, 2), 16),
                g: parseInt(hex.slice(2, 4), 16),
                b: parseInt(hex.slice(4, 6), 16)
            };
        }
        return null;
    }

    function blendSandColors(pixel) {
        if (Math.random() > 0.25) return;
        var c1 = parseRGB(pixel.color);
        if (!c1) return;

        var dir = Math.floor(Math.random() * 4);
        var nx = pixel.x + (dir === 0 ? 1 : dir === 1 ? -1 : 0);
        var ny = pixel.y + (dir === 2 ? 1 : dir === 3 ? -1 : 0);

        if (!isEmpty(nx, ny, true)) {
            var other = pixelMap.at(nx).at(ny);
            if (other && (other.element === "sand" || other.element === "wet_sand") && other.element !== pixel.element) {
                var c2 = parseRGB(other.color);
                if (!c2) return;

                var r = Math.round(c1.r * 0.75 + c2.r * 0.25);
                var g = Math.round(c1.g * 0.75 + c2.g * 0.25);
                var b = Math.round(c1.b * 0.75 + c2.b * 0.25);
                pixel.color = "rgb(" + r + "," + g + "," + b + ")";
            }
        }
    }

    function absorbWaterColor(pixel) {
        if (Math.random() > 0.4) return;
        var c1 = parseRGB(pixel.color);
        if (!c1) return;

        var dir = Math.floor(Math.random() * 4);
        var nx = pixel.x + (dir === 0 ? 1 : dir === 1 ? -1 : 0);
        var ny = pixel.y + (dir === 2 ? 1 : dir === 3 ? -1 : 0);

        if (!isEmpty(nx, ny, true)) {
            var other = pixelMap.at(nx).at(ny);
            if (other && other.element === "water") {
                var c2 = parseRGB(other.color);
                if (!c2) return;

                var r = Math.round(c1.r * 0.6 + (c2.r * 0.85) * 0.4);
                var g = Math.round(c1.g * 0.6 + (c2.g * 0.85) * 0.4);
                var b = Math.round(c1.b * 0.6 + (c2.b * 0.85) * 0.4);
                pixel.color = "rgb(" + r + "," + g + "," + b + ")";
            }
        }
    }

    var sandList = "sand,wet_sand".split(",");
    sandList.forEach(function(elName) {
        var el = elements[elName];
        if (el && !el._betterSandHooked) {
            el._betterSandHooked = true;
            var oldTick = el.tick;
            el.tick = function(pixel) {
                if (oldTick) oldTick(pixel);
                blendSandColors(pixel);
                absorbWaterColor(pixel);
            };
        }
    });

    console.log("bettersand.js podpiety poprawnie!");
}

startBetterSand();

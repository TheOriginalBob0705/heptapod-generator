"use strict"

document.addEventListener('DOMContentLoaded', init);

function init() {
    generate();
}

function generate() {
    const canvas = createCanvas(1900 * 2, 950 * 2);
    const ctx = canvas.getContext("2d");
    const center = { x: 1900, y: 950 };
    const segmentCount = 16;

    const breaks = getBreakCount();
    const primaryBreakPositionIndex = 0;
    const segmentDetails = generateSegmentDetails(segmentCount, breaks, primaryBreakPositionIndex);

    const moveStartingPosition = getRandomInIntRange(0, segmentCount - 1);
    for (let i = 0; i < moveStartingPosition; i++) {
        rotateCanvas(ctx, center.x, center.y, segmentCount);
    }

    drawLogogram(ctx, center, segmentCount, segmentDetails);

    displayLogogram(canvas, center);
}

function createCanvas(width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
}

function generateSegmentDetails(segmentCount, breaks, primaryBreakPositionIndex) {
    const segmentDetails = [];
    for (let i = 0; i < segmentCount; i++) {
        const isBreakSegment = isBreak(segmentCount, i, primaryBreakPositionIndex, breaks);
        const isThickSegment = Math.random() > 0.75 && !isBreakSegment;
        const thickness = isThickSegment ? getRandomInIntRange(90, 160) : 0;

        const details = {
            isBreak: isBreakSegment,
            isThick: isThickSegment,
            thickness: thickness
        };

        segmentDetails.push(details);
    }
    return segmentDetails;
}

function rotateCanvas(ctx, centerX, centerY, segmentCount) {
    ctx.translate(centerX, centerY);
    ctx.rotate(Math.PI * 2 / segmentCount);
    ctx.translate(-centerX, -centerY);
}

function drawLogogram(ctx, center, segmentCount, segmentDetails) {
    const ringRad = 750;
    const thinSmoothness = 10;
    let thickness = getRandomInIntRange(10, 30);

    for (let i = 0; i < segmentCount; i++) {
        rotateCanvas(ctx, center.x, center.y, segmentCount);
        const segment = segmentDetails[i];
        if (segment.isBreak) {
            continue;
        }

        ctx.beginPath();
        for (let j = 0; j < Math.floor(ringRad / thinSmoothness); j++) {
            const theta = Math.PI * 2 * thinSmoothness * j / ringRad / segmentCount;
            const randVal = Math.random();
            thickness += randVal < 0.2 ? -1 : randVal < 0.8 ? 0 : 1;
            thickness = getBetweenLimits(thickness, 10, 30);

            const xPosition = Math.floor(Math.cos(theta) * ringRad) + center.x;
            const yPosition = Math.floor(Math.sin(theta) * ringRad) + center.y;
            ctx.arc(xPosition, yPosition, thickness, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.fill();
    }
}

function displayLogogram(canvas, center) {
    const img = document.getElementById('img');
    img.src = canvas.toDataURL('imagee/png');
    img.width = center.x;
    img.height = center.y;
}

function isBreak(segmentCount, segmentIndex, breakIndex, gapCount) {
    if (segmentIndex < 0) segmentIndex = segmentIndex + segmentCount;
    if (gapCount === 0) return false;
    if (gapCount === 1) return segmentIndex === breakIndex;
    return segmentIndex === breakIndex || segmentIndex === ((breakIndex + 8) % 16);
}

function getBreakCount() {
    const randVal = Math.random();
    if (randVal < 2 / 3) {
        return 0;
    } else if (randVal < 8 / 9) {
        return 1;
    }
    return 2;
}

function getBetweenLimits(val, low, high) {
    if (val < low) return low;
    if (val > high) return high;
    return val;
}

function getRandomInIntRange(low, high) {
    return Math.floor(Math.random() * (high - low) + low);
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

/**
function generate() {
    let randVal;
    let segmentCount = 16;
    let breaks; //0, 1, 2
    let primaryBreakPositionIndex;
    let segmentDetails = [];
    let maxWidth = 160;
    let minWidth = 90;
    let minThinWidth = 10;
    let maxThinWidth = 30;
    let ringRad = 750;
    let center_x = 1900;
    let center_y = 950;
    let maxTendrilLength = 300;
    let minTendrilLength = 100;
    let maxTendrilWidth = 17;
    let minTendrilWidth = 2;
    let maxTendrilCount = 16;
    let minTendrilCount = 7;
    let thinSmoothness = 10;
    let endBlobMaxSize = 150;

    let c = document.createElement('canvas');
    let ctx = c.getContext("2d");
    c.width = center_x * 2;
    c.height = center_y * 2;
    ctx.fillStyle = '#000000';

    //roll for breaks
    breaks = getBreakCount();
    primaryBreakPositionIndex = 0;

    let moveStartingPosition = getRandomInIntRange(0, segmentCount - 1);
    for (let i = 0; i < moveStartingPosition; i++) {
        rotateCanvas(ctx, center_x, center_y, segmentCount);
    }

    for (let i = 0; i < segmentCount; i++) {
        let details = {};
        details.isBreak = isBreak(segmentCount, i, primaryBreakPositionIndex, breaks);

        randVal = Math.random();
        details.isThick = randVal > 0.75 && !details.isBreak; //random chance to be thick, not allowing thick if it's a break

        randVal = Math.random();
        if (details.isThick) {
            details.thickness = Math.floor(randVal * (maxWidth - minWidth)) + minWidth;
        } else {
            details.thickness = 0;
        }

        segmentDetails.push(details);
    }

    let r_offset = 0;
    let thickness = getRandomInIntRange(minThinWidth, maxThinWidth);
    let x_position = 0;
    let y_position = 0;
    let theta = 0;

    for (let i = 0; i < segmentCount; i++) {
        rotateCanvas(ctx, center_x, center_y, segmentCount);
        let segment = segmentDetails[i];
        if (segment.isBreak) {
            continue;
        }
        let leftNeighbor = segmentDetails[(i - 1 + 16) % 16];
        let rightNeighbor = segmentDetails[(i + 1) % 16];

        ctx.beginPath();
        for (let j = 0; j < Math.floor(ringRad / thinSmoothness) ; j++) {
            theta = Math.PI * 2 * thinSmoothness * j / ringRad / segmentCount;
            randVal = Math.random();
            thickness += randVal < .2 ? -1 : randVal < .8 ? 0 : 1;
            thickness = getBetweenLimits(thickness, minThinWidth, maxThinWidth);

            x_position = Math.floor(Math.cos(theta) * ringRad) + center_x;
            y_position = Math.floor(Math.sin(theta) * ringRad) + center_y;
            ctx.arc(x_position, y_position, thickness, 0, Math.PI * 2);
        }
        ctx.stroke();
        ctx.fill();
    }

    let img = document.getElementById('img')
    img.src = c.toDataURL('image/png');
    img.width = center_x;
    img.height = center_y;
}

function rotateCanvas(ctx, center_x, center_y, segmentCount) {
    ctx.translate(center_x, center_y);
    ctx.rotate(Math.PI * 2 / segmentCount);
    ctx.translate(-center_x, -center_y);
}

function isBreak(segmentCount, segmentIndex, breakIndex, gapCount) {
    if (segmentIndex < 0) { segmentIndex = segmentIndex + segmentCount; }
    if (gapCount === 0) { return false; }
    if (gapCount === 1) { return segmentIndex === breakIndex; }
    return segmentIndex === breakIndex || segmentIndex === ((breakIndex + 8) % 16);
}

function getBreakCount() {
    let randVal = Math.random();
    if (randVal < 2 / 3) {
        return 0;
    } else if (randVal < 8 / 9) {
        return 1;
    }
    return 2;
}

function getBetweenLimits(val, low, high) {
    if (val < low) { return low; }
    if (val > high) { return high; }
    return val;
}

function getRandomInRange(low, high) {
    let randVal = Math.random();
    return randVal * (high - low) + low;
}

function getRandomInIntRange(low, high) {
    let randVal = Math.random();
    return Math.floor(randVal * (high - low) + low);
}

let Point = function (x, y) {
    this.x = x;
    this.y = y;
}

 */
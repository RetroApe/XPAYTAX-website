'use strict';

    // Load navigation
fetch('nav.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navigation').innerHTML = data;
    });

// Load footer
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });



const originalPoly = document.querySelector('.polygon');
const reversePoly = document.querySelector('.reverse-polygon');

function matchHeight() {
    const height = originalPoly.offsetHeight;
    const width = window.getComputedStyle(originalPoly).width;

    reversePoly.style.height = `${height}px`;
    reversePoly.style.width = `${width}`;
} 

// Run on load and resize
window.addEventListener('load', matchHeight);
window.addEventListener('resize', matchHeight);





var width1 = 1440;
var width2 = 320;
var clampMax = 32;
var clampMin = 24;

var clampX;
var clampY;

clampY = (clampMax - clampMin) / (width1 - width2);
clampX = clampMax - width1 * clampY;

console.log(`clamp(${clampMin}px, ${clampX.toFixed(4)}px + ${(clampY * 100).toFixed(4)}vw, ${clampMax}px);`);
console.log(`clamp(${clampMin / 16}rem, ${(clampX / 16).toFixed(4)}rem + ${(clampY * 100).toFixed(4)}vw, ${clampMax / 16}rem);`);
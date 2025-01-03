const originalPoly = document.querySelector('.polygon');
const reversePoly = document.querySelector('.reverse-polygon');

function matchHeight() {
    const height = originalPoly.offsetHeight;
    reversePoly.style.height = `${height}px`;
    console.log(`${height}px`);
}

// Run on load and resize
window.addEventListener('load', matchHeight);
window.addEventListener('resize', matchHeight);
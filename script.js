'use strict';

var navList;
var openButton;

    // Load navigation
fetch('nav.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navigation').innerHTML = data;

        const navButton = document.getElementById("nav-button");
        navList = document.getElementById("nav-list");
        const navBar = document.getElementById("navbar");

        openButton = document.getElementById("open-sidebar-button");


        // Function to move the button based on screen width
        function handleResize() {
            if (window.innerWidth <= 1000) {
                // Move navButton into navList
                if (!navList.contains(navButton)) {
                    const listItem = document.createElement("li");
                    listItem.className = "nav-button";
                    listItem.appendChild(navButton);
                    navList.appendChild(listItem);
                }

            } else {
                // Move navButton back to its original position
                if (navList.contains(navButton)) {
                    navBar.appendChild(navButton);
                    const listItem = navList.querySelector(".nav-button:last-child"); // Remove the empty <li>
                    if (listItem) listItem.remove();
                }

                navList.classList.remove("show");  
                const overlay = document.getElementById("overlay");
                overlay.style.display = "none"; 

                navList.removeAttribute('inert');
            }
        }




        // Attach the function to the resize event and run it initially
        window.addEventListener("resize", handleResize);
        handleResize(); // Run initially to check current screen size
    });



// Load footer
fetch('footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });





    function openSidebar() {
        navList.classList.add("show");

        openButton.setAttribute('aria-expanded', 'true');

        const overlay = document.getElementById("overlay");
        overlay.style.display = "block";

        navList.setAttribute('inert', "");
    }


    function closeSidebar() {
        navList.classList.remove("show");

        openButton.setAttribute('aria-expanded', 'false');

        const overlay = document.getElementById("overlay");
        overlay.style.display = "none";

        navList.removeAttribute('inert');
    }

;




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
var value1 = 128;
var value2 = 64;

var clampX;
var clampY;

clampY = (value1 - value2) / (width1 - width2);
clampX = value1 - width1 * clampY;

console.log(`clamp(${value2}px, ${clampX.toFixed(4)}px + ${(clampY * 100).toFixed(4)}vw, ${value1}px);`);
console.log(`clamp(${value2 / 16}rem, ${(clampX / 16).toFixed(4)}rem + ${(clampY * 100).toFixed(4)}vw, ${value1 / 16}rem);`);
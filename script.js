'use strict';

var navList;
var openButton;
var navLinks;

document.addEventListener("DOMContentLoaded", () => {

    // Load navigation
fetch('nav.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('navigation').innerHTML = data;

        const navButton = document.getElementById("nav-button");
        navList = document.getElementById("nav-list");
        navLinks = document.querySelectorAll(".nav-link a");
        const navBar = document.getElementById("navbar");

        const currentPage = window.location.pathname.split("/").pop(); // Get the current page file name

        navLinks.forEach(link => {
            if (link.getAttribute("href") === currentPage) {
                link.classList.add("active-link"); // Add active class
                link.setAttribute("aria-current", "page"); // Set aria-current attribute
            } else {
                link.classList.remove("active-link"); // Remove active class
                link.removeAttribute("aria-current"); // Remove aria-current attribute
            }
        });


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
});    


document.addEventListener("DOMContentLoaded", () => {
    // Fetch the contact form
    fetch('contact-form.html')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load contact-form.html');
            }
            return response.text();
        })
        .then(html => {
            const contactFormSection = document.getElementById('contact-form');

            if (contactFormSection) {
                contactFormSection.innerHTML = html; // Insert fetched HTML content

                // Attach form submission handler after content is loaded
                const form = document.querySelector("form");
                const overlay = document.getElementById("overlay-form");
                const successWindow = document.getElementById("success");
                const failureWindow = document.getElementById("failure");
                const emailInput = document.getElementById("email");
                const nameInput = document.getElementById("name");
                const messageInput = document.getElementById("message");
                const loader = document.getElementById("loader");
                

                form.addEventListener("submit", async (event) => {
                    event.preventDefault(); // Prevent default form submission behavior 
                    
                    // Helper function to set validity
                    const setValidity = (input, isValid) => {
                        const invalidMessage = input.parentElement.querySelector(".invalid");
                        if (isValid) {
                            invalidMessage.classList.remove("invalid-show"); // Hide invalid message
                            input.classList.remove("invalid-show");
                            input.classList.add("valid-show");
                        } else {
                            invalidMessage.classList.add("invalid-show"); // Show invalid message
                            input.classList.add("invalid-show");
                            input.classList.remove("valid-show");
                        }
                    };


                    // Blur event listener
                    [nameInput, emailInput, messageInput].forEach((input) => {
                        input.addEventListener("blur", () => {
                            if (input === emailInput) {
                                // Validate email
                                setValidity(emailInput, isValidEmail(emailInput.value));
                            } else {
                                // Validate other inputs (name and message)
                                setValidity(input, !!input.value.trim());
                            }
                        });
                    });
                    

                    // Validate name input
                    const isNameValid = !!nameInput.value.trim();
                    setValidity(nameInput, isNameValid);

                    // Validate email input
                    const isEmailValid = isValidEmail(emailInput.value);
                    setValidity(emailInput, isEmailValid);

                    // Validate message input
                    const isMessageValid = !!messageInput.value.trim();
                    setValidity(messageInput, isMessageValid);

                    // If any input is invalid, stop submission
                    if (!isNameValid || !isEmailValid || !isMessageValid) {
                        return;
                    }

                    
                    // Helper function to toggle loader visibility
                    const toggleLoader = (show) => {
                        if(show) {
                            overlay.classList.add("show");
                            loader.classList.add("show");
                            overlay.removeAttribute("onclick");
                        } else {
                            loader.classList.remove("show");
                            overlay.setAttribute("onclick", "dismissMessage()");
                        }
                    };

                    toggleLoader(true);

                    

                    // Prepare form data
                    const formData = new FormData(form);

                    // Checking/Sending PHP Mail
                    try {
                        // Send the form data to the PHP script
                        const response = await fetch("includes/sendmail.php", {
                            method: "POST",
                            body: formData,
                        });
                        const result = await response.json();

                        toggleLoader(false);

                        if (result.success) {
                            // Show success window
                            const useClientName = successWindow.querySelector(".use-client-name");
                            useClientName.textContent = nameInput.value.trim();

                            successWindow.classList.add("show");
                            successWindow.removeAttribute("inert");
                        } else {
                            // Show failure window
                            const useClientName = failureWindow.querySelector(".use-client-name");
                            useClientName.textContent = nameInput.value.trim();

                            failureWindow.classList.add("show");
                            failureWindow.removeAttribute("inert");
                        }
                    } catch (error) {
                        // Handle network errors
                        console.error("Error submitting form:", error);
                        overlay.classList.add("show");
                        failureWindow.classList.add("show");
                        failureWindow.removeAttribute("inert");
                    }
                });




                // Dismiss message handler
                window.dismissMessage = () => {
                    overlay.classList.remove("show");
                    successWindow.classList.remove("show");
                    successWindow.setAttribute("inert", "");
                    failureWindow.classList.remove("show");
                    failureWindow.setAttribute("inert", "");
                };

                document.addEventListener('keydown', (event) => {
                    if (event.key === 'Escape') dismissMessage()
                  });

            } else {
                console.error('Target element #contact-form not found');
            }
        })
        .catch(error => console.error('Error loading contact-form.html:', error));

    // Function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    }
});

















function openSidebar() {
    navList.classList.add("show");

    openButton.setAttribute('aria-expanded', 'true');

    const overlay = document.getElementById("overlay");
    overlay.style.display = "block";

    navList.removeAttribute('inert');
}


function closeSidebar() {
    navList.classList.remove("show");

    openButton.setAttribute('aria-expanded', 'false');

    const overlay = document.getElementById("overlay");
    overlay.style.display = "none";

    navList.setAttribute('inert', "");
}





document.addEventListener("DOMContentLoaded", () => {
    const scrollToTopButton = document.getElementById("scroll-to-top");

    // Show or hide the button based on scroll position
    window.addEventListener("scroll", () => {
        if (window.scrollY > 500 && (window.innerHeight + window.scrollY + 50) < document.body.offsetHeight) {
            scrollToTopButton.classList.add("show");
            scrollToTopButton.removeAttribute('inert');
        } else {
            scrollToTopButton.classList.remove("show");
            scrollToTopButton.setAttribute('inert', "");
            
        }
    });

    // Scroll back to the top when the button is clicked
    window.scrollToTop = function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };
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
if (originalPoly) {
    window.addEventListener('load', matchHeight);
    window.addEventListener('resize', matchHeight);
}








var width1 = 1440;
var width2 = 320;
var value1 = 64;
var value2 = 16;

var clampX;
var clampY;

clampY = (value1 - value2) / (width1 - width2);
clampX = value1 - width1 * clampY;

console.log(`clamp(${value2}px, ${clampX.toFixed(4)}px + ${(clampY * 100).toFixed(4)}vw, ${value1}px);`);
console.log(`clamp(${value2 / 16}rem, ${(clampX / 16).toFixed(4)}rem + ${(clampY * 100).toFixed(4)}vw, ${value1 / 16}rem);`);
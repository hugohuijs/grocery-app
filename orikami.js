document.addEventListener("DOMContentLoaded", function () {
    console.log("DOMContentLoaded event fired.");

    const revealElements = document.querySelectorAll(".reveal-element");
    console.log("reveal-elements found", revealElements);

    let scrolling = false;

    window.addEventListener("scroll", function () {
        console.log("Scroll event fired.");
        requestAnimationFrame(function () {
            let hiddenElementsCount = 0; // Initialize a counter for hidden elements

            for (let i = 0; i < revealElements.length; i++) {
                const revealElement = revealElements[i];
                console.log("element is found in loop:", revealElement);

                if (revealElement.classList.contains("hidden")) {
                    console.log("The class 'hidden' is present.");
                    hiddenElementsCount++; // Increment the counter for hidden elements
                } else {
                    console.log("The class 'hidden' is not present.");
                }

                if (isElementInViewport(revealElement)) {
                    console.log("The element is in the viewport:", revealElement);
                } else {
                    console.log("The element is not in the viewport:", revealElement);
                }

                if (isElementInViewport(revealElement) && revealElement.classList.contains("hidden")) {
                    console.log("if is working!");

                    // Remove the "hidden" class to reveal the element with a CSS transition
                    revealElement.classList.remove("hidden");
                    console.log("hidden was removed");
                    hiddenElementsCount--; // Decrement the counter

                    // Check if all hidden elements have been revealed
                    if (hiddenElementsCount === 0) {
                        // Stop the loop by returning or breaking
                        return; // or use break; if this code is within a loop
                    }
                } else {
                    console.log("if not working");
                }
            }
        });
    });
});

function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right >= 0
    );
}


document.getElementById('scrollButton').addEventListener('click', function() {
    const targetSection = document.getElementById('targetSection');
    targetSection.scrollIntoView({ behavior: 'smooth' });
});

document.getElementById('submit_button').addEventListener('click', function() {
    alert("Hi there, this form is not functional yet ;) ");
})
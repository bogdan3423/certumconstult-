// Certum Consult - Interactive behaviors: mobile navigation, scroll animations, and form validation.

document.addEventListener("DOMContentLoaded", () => {
    const body = document.body;
    const navToggle = document.querySelector(".nav-toggle");
    const navLinksWrapper = document.querySelector(".nav-links");
    const navLinks = document.querySelectorAll(".nav-links a");

    const yearBadge = document.getElementById("year");
    if (yearBadge) {
        yearBadge.textContent = new Date().getFullYear();
    }

    // Mobile navigation toggle with simple icon animation
    if (navToggle && navLinksWrapper) {
        navToggle.addEventListener("click", () => {
            const isOpen = navLinksWrapper.classList.toggle("open");
            body.classList.toggle("menu-open", isOpen);
            navToggle.setAttribute("aria-expanded", String(isOpen));
            navToggle.classList.toggle("active", isOpen);
        });

        navLinks.forEach((link) => {
            link.addEventListener("click", () => {
                if (navLinksWrapper.classList.contains("open")) {
                    navLinksWrapper.classList.remove("open");
                    body.classList.remove("menu-open");
                    navToggle.setAttribute("aria-expanded", "false");
                    navToggle.classList.remove("active");
                }
            });
        });
    }

    // Scroll reveal using IntersectionObserver for smooth fade-up animations
    const revealElements = document.querySelectorAll(".reveal");
    if (revealElements.length > 0) {
        const observer = new IntersectionObserver(
            (entries, obs) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("visible");
                        obs.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        revealElements.forEach((element) => observer.observe(element));
    }

    // Contact form validation (runs only on contact page)
    const contactForm = document.querySelector("#contact-form");
    if (contactForm) {
        const nameField = contactForm.querySelector("input[name='name']");
        const emailField = contactForm.querySelector("input[name='email']");
        const messageField = contactForm.querySelector("textarea[name='message']");
        const errorContainer = contactForm.querySelector(".form-messages");

        contactForm.addEventListener("submit", (event) => {
            const errors = [];

            if (!nameField.value.trim()) {
                errors.push("Te rugăm să ne oferi numele complet.");
            }

            if (!validateEmail(emailField.value)) {
                errors.push("Te rugăm să introduci o adresă de email validă.");
            }

            if (messageField.value.trim().length < 20) {
                errors.push("Mesajul tău trebuie să conțină cel puțin 20 de caractere.");
            }

            if (errors.length > 0) {
                event.preventDefault();
                renderErrors(errorContainer, errors);
            } else {
                event.preventDefault();
                fetch("https://formsubmit.co/ajax/contact@certumconsult.ro", {
                    method: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: nameField.value,
                        email: emailField.value,
                        message: messageField.value
                    })
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.success) {
                            renderSuccess(errorContainer, "Îți mulțumim. Specialiștii noștri te vor contacta în scurt timp.");
                        } else {
                            renderErrors(errorContainer, data.errors);
                        }
                    })
                    .catch(error => console.log(error));
            
            }
        });
    }
});

function validateEmail(value) {
    // Basic email regex to ensure at least minimal structure
    const pattern = /^[\w.!#$%&'*+/=?`{|}~-]+@[\w-]+(\.[\w-]+)+$/;
    return pattern.test(String(value).toLowerCase());
}

function renderErrors(container, messages) {
    if (!container) return;
    container.innerHTML = messages
        .map((message) => `<p class="form-error">${message}</p>`)
        .join("");
}

function renderSuccess(container, message) {
    if (!container) return;
    container.innerHTML = `<p class="form-success">${message}</p>`;
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Modal Elements ---
    const modal = document.getElementById('requestModal');
    const serviceCards = document.querySelectorAll('.service-card');
    const closeBtn = document.querySelector('.close-btn');
    const formServiceNameInput = document.getElementById('form-service-name');
    const modalServiceDesc = document.getElementById('modal-service-desc');
    
    // --- Form Elements ---
    const form = document.querySelector('.request-form');
    const successMessageDiv = document.getElementById('form-success-message');
    const requestNumberSpan = document.getElementById('request-number');

    // --- Dynamic Copyright Year ---
    const copyrightYearSpan = document.getElementById('copyright-year');
    if (copyrightYearSpan) {
        copyrightYearSpan.textContent = new Date().getFullYear();
    }

    // --- Modal Logic ---
    const openModal = (card) => {
        const serviceName = card.getAttribute('data-service-name');
        const serviceDesc = card.getAttribute('data-service-desc');
        
        // Populate modal with service info
        formServiceNameInput.value = serviceName;
        modalServiceDesc.innerHTML = `<h3>${serviceName}</h3><p>${serviceDesc}</p>`;
        
        // Reset form state
        form.classList.remove('hidden');
        successMessageDiv.classList.add('hidden');
        form.reset();
        
        // Show modal
        modal.classList.add('active');
    };

    const closeModal = () => {
        modal.classList.remove('active');
    };

    serviceCards.forEach(card => {
        card.addEventListener('click', () => openModal(card));
    });

    closeBtn.addEventListener('click', closeModal);
    window.addEventListener('click', (event) => {
        if (event.target === modal) closeModal();
    });
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeModal();
    });

    // --- Advanced Form Submission Logic ---
    if (form) {
        form.addEventListener('submit', async (event) => {
            event.preventDefault(); // Stop default browser submission
            
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            const originalButtonText = submitButton.textContent;
            
            // Set sending state
            submitButton.textContent = document.documentElement.lang === 'ar' ? 'جار الإرسال...' : 'Sending...';
            submitButton.disabled = true;

            try {
                // Netlify submission
                await fetch('/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams(formData).toString()
                });

                // Generate a unique request number
                const requestNumber = `DL-${Date.now().toString().slice(-6)}`;
                requestNumberSpan.textContent = requestNumber;

                // Show success message and hide form
                form.classList.add('hidden');
                successMessageDiv.classList.remove('hidden');

            } catch (error) {
                console.error(error);
                alert(document.documentElement.lang === 'ar' ? 'حدث خطأ. يرجى المحاولة مرة أخرى.' : 'An error occurred. Please try again.');
            } finally {
                // Restore button
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            }
        });
    }
});
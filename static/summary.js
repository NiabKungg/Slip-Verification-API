document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');
    const accountNameInput = document.getElementById('account-name');

    // Sections
    const uploadSection = document.getElementById('upload-section');
    const previewSection = document.getElementById('preview-section');
    const resultsSection = document.getElementById('results-section');

    // Preview
    const fileCountSpan = document.getElementById('file-count');
    const imageGallery = document.getElementById('image-gallery');
    const clearBtn = document.getElementById('clear-btn');
    const analyzeBtn = document.getElementById('analyze-btn');

    // Results
    const loader = document.getElementById('loader');
    const dataView = document.getElementById('data-view');
    const errorView = document.getElementById('error-view');
    const newScanBtn = document.getElementById('new-scan-btn');
    const retryBtn = document.getElementById('retry-btn');

    // Data Fields
    const totalIncomeEl = document.getElementById('total-income');
    const totalExpenseEl = document.getElementById('total-expense');
    const slipsList = document.getElementById('slips-list');
    const errorMessage = document.getElementById('error-message');

    let selectedFiles = [];

    // --- File Selection & Drag-Drop ---

    browseBtn.addEventListener('click', () => fileInput.click());

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
    });

    // Drag and Drop Events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
    });

    dropZone.addEventListener('drop', (e) => {
        handleFiles(e.dataTransfer.files);
    });

    function handleFiles(files) {
        if (files.length === 0) return;

        let hasNewFiles = false;
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                selectedFiles.push(file);
                hasNewFiles = true;
            }
        });

        if (hasNewFiles) {
            updateGallery();
            showPreview();
        } else {
            alert('Please select valid image files (JPG, PNG).');
        }
    }

    function updateGallery() {
        imageGallery.innerHTML = '';
        fileCountSpan.textContent = selectedFiles.length;

        if (selectedFiles.length === 0) {
            resetApp();
            return;
        }

        selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const div = document.createElement('div');
                div.className = 'gallery-item';
                div.innerHTML = `
                    <img src="${e.target.result}" alt="slip ${index + 1}">
                    <button class="remove-btn" onclick="removeFile(${index})" title="Remove">
                        <i class="fa-solid fa-xmark"></i>
                    </button>
                `;
                imageGallery.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    }

    window.removeFile = function (index) {
        selectedFiles.splice(index, 1);
        updateGallery();
    };

    // --- Navigation & State Management ---

    function showPreview() {
        uploadSection.classList.add('hidden');
        previewSection.classList.remove('hidden');
        resultsSection.classList.add('hidden');
    }

    function resetApp() {
        selectedFiles = [];
        fileInput.value = '';
        imageGallery.innerHTML = '';

        uploadSection.classList.remove('hidden');
        previewSection.classList.add('hidden');
        resultsSection.classList.add('hidden');
    }

    if (clearBtn) clearBtn.addEventListener('click', resetApp);
    newScanBtn.addEventListener('click', resetApp);
    retryBtn.addEventListener('click', () => {
        resultsSection.classList.add('hidden');
        previewSection.classList.remove('hidden');
    });

    // --- API Integration ---

    analyzeBtn.addEventListener('click', async () => {
        if (selectedFiles.length === 0) return;

        // Show loading state
        previewSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');

        loader.classList.remove('hidden');
        dataView.classList.add('hidden');
        errorView.classList.add('hidden');

        const formData = new FormData();
        selectedFiles.forEach(file => {
            formData.append('slip_images', file);
        });

        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.message || 'Failed to process image');
            }

            renderResults(result.results);

            // Show Results
            loader.classList.add('hidden');
            dataView.classList.remove('hidden');

        } catch (error) {
            console.error('API Error:', error);
            loader.classList.add('hidden');
            errorView.classList.remove('hidden');
            errorMessage.textContent = error.message || 'An unexpected error occurred. Is the server running?';
        }
    });

    function cleanString(str) {
        if (!str) return '';
        // Remove common titles, spaces, etc for matching
        return str.replace(/(นาย|นาง|นางสาว|น\.ส\.|MR\.|MS\.|MRS\.|Mr\.|Ms\.|Mrs\.)/gi, '').replace(/\s+/g, '').toLowerCase();
    }

    function renderResults(results) {
        let totalIncome = 0;
        let totalExpense = 0;
        slipsList.innerHTML = '';

        const myAccountName = accountNameInput.value.trim();
        const myNameCleaned = cleanString(myAccountName);

        results.forEach(res => {
            const card = document.createElement('div');
            card.className = 'slip-result-card';

            if (res.status === 'success') {
                const data = res.data;
                const amtStr = (data.amount || '0').replace(/,/g, '');
                const amtVal = parseFloat(amtStr);

                // --- Dynamic Classification Logic ---
                let finalType = data.type; // Fallback to heuristic

                if (myNameCleaned.length > 0) {
                    const senderCleaned = cleanString(data.sender);
                    const receiverCleaned = cleanString(data.receiver);

                    // Prioritize exact match checks against the provided account Name
                    if (receiverCleaned.includes(myNameCleaned)) {
                        finalType = 'Income';
                    } else if (senderCleaned.includes(myNameCleaned)) {
                        finalType = 'Expense';
                    } else if (senderCleaned && !senderCleaned.includes(myNameCleaned)) {
                        // If sender is known and is NOT the user, then someone else transferred TO the user
                        finalType = 'Income';
                    }
                }

                let typeBadge = '';
                if (finalType === 'Income') {
                    if (!isNaN(amtVal)) totalIncome += amtVal;
                    typeBadge = `<span class="badge badge-income"><i class="fa-solid fa-arrow-down me-1"></i>Income</span>`;
                } else {
                    if (!isNaN(amtVal)) totalExpense += amtVal;
                    typeBadge = `<span class="badge badge-expense"><i class="fa-solid fa-arrow-up me-1"></i>Expense</span>`;
                }

                card.innerHTML = `
                    <div class="slip-result-header">
                        <strong style="color:var(--text-main); word-break: break-all;">${res.filename}</strong>
                        ${typeBadge}
                    </div>
                    <div class="slip-result-details">
                        <div><span class="text-muted">Amount:</span> <strong style="color:var(--text-main)">${data.amount || 'N/A'} THB</strong></div>
                        <div><span class="text-muted">Date:</span> <span>${data.date_time || 'N/A'}</span></div>
                        <div style="grid-column: span 2;"><span class="text-muted">Sender:</span> <span>${data.sender || 'N/A'}</span></div>
                        <div style="grid-column: span 2;"><span class="text-muted">Receiver:</span> <span style="color:var(--text-main)">${data.receiver || 'N/A'}</span></div>
                        <div style="grid-column: span 2;"><span class="text-muted">Ref:</span> <span class="text-mono small">${data.reference_no || 'N/A'}</span></div>
                    </div>
                `;
            } else {
                card.innerHTML = `
                    <div class="slip-result-header">
                        <strong style="color:var(--text-main); word-break: break-all;">${res.filename}</strong>
                        <span class="badge badge-error">Failed</span>
                    </div>
                    <div class="slip-result-error">
                        <i class="fa-solid fa-circle-exclamation me-1"></i> ${res.message}
                    </div>
                `;
            }

            slipsList.appendChild(card);
        });

        // Update summary numbers
        totalIncomeEl.textContent = totalIncome.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' THB';
        totalExpenseEl.textContent = totalExpense.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' THB';
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const browseBtn = document.getElementById('browse-btn');

    // Sections
    const uploadSection = document.getElementById('upload-section');
    const previewSection = document.getElementById('preview-section');
    const resultsSection = document.getElementById('results-section');

    // Preview
    const imagePreview = document.getElementById('image-preview');
    const removeImgBtn = document.getElementById('remove-img-btn');
    const analyzeBtn = document.getElementById('analyze-btn');

    // Results
    const loader = document.getElementById('loader');
    const dataView = document.getElementById('data-view');
    const errorView = document.getElementById('error-view');
    const newScanBtn = document.getElementById('new-scan-btn');
    const retryBtn = document.getElementById('retry-btn');

    // Data Fields
    const resAmount = document.getElementById('res-amount');
    const resDatetime = document.getElementById('res-datetime');
    const resRef = document.getElementById('res-ref');
    const resSender = document.getElementById('res-sender');
    const rawText = document.getElementById('raw-text');
    const errorMessage = document.getElementById('error-message');

    let currentFile = null;

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

        const file = files[0];
        if (!file.type.startsWith('image/')) {
            alert('Please select a valid image file (JPG, PNG).');
            return;
        }

        currentFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            showPreview();
        };
        reader.readAsDataURL(file);
    }

    // --- Navigation & State Management ---

    function showPreview() {
        uploadSection.classList.add('hidden');
        previewSection.classList.remove('hidden');
        resultsSection.classList.add('hidden');
    }

    function resetApp() {
        currentFile = null;
        fileInput.value = '';
        imagePreview.src = '';

        uploadSection.classList.remove('hidden');
        previewSection.classList.add('hidden');
        resultsSection.classList.add('hidden');
    }

    removeImgBtn.addEventListener('click', resetApp);
    newScanBtn.addEventListener('click', resetApp);
    retryBtn.addEventListener('click', () => {
        resultsSection.classList.add('hidden');
        previewSection.classList.remove('hidden');
    });

    // --- API Integration ---

    analyzeBtn.addEventListener('click', async () => {
        if (!currentFile) return;

        // Show loading state
        previewSection.classList.add('hidden');
        resultsSection.classList.remove('hidden');

        loader.classList.remove('hidden');
        dataView.classList.add('hidden');
        errorView.classList.add('hidden');

        const formData = new FormData();
        formData.append('slip_image', currentFile);

        try {
            const response = await fetch('/api/verify', {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || result.message || 'Failed to process image');
            }

            // Populate Results
            resAmount.textContent = result.data.amount || 'N/A';
            resDatetime.textContent = result.data.date_time || 'N/A';
            resRef.textContent = result.data.reference_no || 'N/A';
            resSender.textContent = result.data.sender || 'N/A';
            rawText.textContent = result.raw_text || 'No text extracted.';

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
});

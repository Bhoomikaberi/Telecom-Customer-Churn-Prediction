document.addEventListener('DOMContentLoaded', () => {
    // Tab & Wizard Elements
    const tabLinks = document.querySelectorAll('.tab-link');
    const tabContents = document.querySelectorAll('.tab-content');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const submitBtn = document.getElementById('submit-btn');
    
    // Form and Inputs
    const form = document.getElementById('churn-form');
    const tenureSlider = document.getElementById('tenure');
    const tenureValSpan = document.getElementById('tenure-val');
    
    // Result Elements
    const placeholderBox = document.getElementById('placeholder-box');
    const resultBox = document.getElementById('result-box');
    const errorBox = document.getElementById('error-box');
    const errorMessage = document.getElementById('error-message');
    const errorDismiss = document.getElementById('error-dismiss');
    const gaugeFill = document.getElementById('gauge-fill');
    const riskPercent = document.getElementById('risk-percent');
    const riskBadge = document.getElementById('risk-badge');
    const modelNameText = document.getElementById('model-name-text');
    const posFactors = document.getElementById('pos-factors');
    const negFactors = document.getElementById('neg-factors');
    const actionList = document.getElementById('action-list');

    // Presets
    const presetButtons = document.querySelectorAll('.preset-btn');

    // Define wizard flow
    const tabsList = ['demographics', 'services', 'billing'];
    let currentTabIndex = 0;

    // --- Tab Wizard Logic ---
    function updateWizardButtons() {
        // Remove active class from all links and contents
        tabLinks.forEach(link => link.classList.remove('active'));
        tabContents.forEach(content => content.classList.remove('active'));

        // Activate current
        const activeTabId = tabsList[currentTabIndex];
        document.querySelector(`.tab-link[data-tab="${activeTabId}"]`).classList.add('active');
        document.getElementById(`tab-${activeTabId}`).classList.add('active');

        // Toggle nav buttons visibility
        if (currentTabIndex === 0) {
            prevBtn.classList.add('hidden');
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        } else if (currentTabIndex === tabsList.length - 1) {
            prevBtn.classList.remove('hidden');
            nextBtn.classList.add('hidden');
            submitBtn.classList.remove('hidden');
        } else {
            prevBtn.classList.remove('hidden');
            nextBtn.classList.remove('hidden');
            submitBtn.classList.add('hidden');
        }
    }

    tabLinks.forEach((link, idx) => {
        link.addEventListener('click', () => {
            currentTabIndex = idx;
            updateWizardButtons();
        });
    });

    nextBtn.addEventListener('click', () => {
        if (currentTabIndex < tabsList.length - 1) {
            currentTabIndex++;
            updateWizardButtons();
        }
    });

    prevBtn.addEventListener('click', () => {
        if (currentTabIndex > 0) {
            currentTabIndex--;
            updateWizardButtons();
        }
    });

    // --- Inline error banner (replaces alert()) ---
    function showError(message) {
        errorMessage.textContent = message;
        errorBox.classList.remove('hidden');
    }
    errorDismiss.addEventListener('click', () => {
        errorBox.classList.add('hidden');
    });

    // --- Dependent field locking ---
    // The model was trained on real Telco data where these combinations never occur
    // (e.g. Online Security = Yes but Internet Service = None). Rather than let the
    // user submit an out-of-distribution profile, we lock dependent fields to their
    // only valid value and gray them out.
    const internetDependentFields = [
        'OnlineSecurity', 'OnlineBackup', 'DeviceProtection',
        'TechSupport', 'StreamingTV', 'StreamingMovies'
    ];

    function setLocked(fieldName, locked, lockedValue) {
        const group = document.getElementById(`group-${fieldName}`);
        const control = document.getElementById(`control-${fieldName}`);
        if (!group || !control) return;

        group.classList.toggle('is-disabled', locked);
        control.classList.toggle('is-disabled', locked);

        const allInputs = form.querySelectorAll(`input[name="${fieldName}"]`);
        allInputs.forEach(input => { input.disabled = locked; });

        if (locked) {
            const target = form.querySelector(`input[name="${fieldName}"][value="${lockedValue}"]`);
            if (target) {
                target.disabled = false; // keep the locked-to value selectable/submittable
                target.checked = true;
            }
        }
    }

    function syncInternetDependentFields() {
        const internetVal = form.querySelector('input[name="InternetService"]:checked')?.value;
        const noInternet = internetVal === 'No';
        internetDependentFields.forEach(field => setLocked(field, noInternet, 'No'));
    }

    function syncPhoneDependentFields() {
        const phoneVal = form.querySelector('input[name="PhoneService"]:checked')?.value;
        const noPhone = phoneVal === 'No';
        setLocked('MultipleLines', noPhone, 'No phone service');
    }

    document.querySelectorAll('input[name="InternetService"]').forEach(input => {
        input.addEventListener('change', syncInternetDependentFields);
    });
    document.querySelectorAll('input[name="PhoneService"]').forEach(input => {
        input.addEventListener('change', syncPhoneDependentFields);
    });

    // Run once on load in case defaults already imply a locked state
    syncInternetDependentFields();
    syncPhoneDependentFields();

    // --- Tenure Slider ---
    tenureSlider.addEventListener('input', (e) => {
        tenureValSpan.textContent = e.target.value;
    });

    // --- Presets Data ---
    const presets = {
        loyal: {
            gender: 'Female',
            SeniorCitizen: '0',
            Partner: 'Yes',
            Dependents: 'Yes',
            PhoneService: 'Yes',
            MultipleLines: 'Yes',
            InternetService: 'DSL',
            OnlineSecurity: 'Yes',
            OnlineBackup: 'Yes',
            DeviceProtection: 'Yes',
            TechSupport: 'Yes',
            StreamingTV: 'Yes',
            StreamingMovies: 'Yes',
            Contract: 'Two year',
            PaperlessBilling: 'No',
            PaymentMethod: 'Bank transfer (automatic)',
            tenure: 62,
            MonthlyCharges: 85.00,
            TotalCharges: 5270.00
        },
        risk: {
            gender: 'Male',
            SeniorCitizen: '1',
            Partner: 'No',
            Dependents: 'No',
            PhoneService: 'Yes',
            MultipleLines: 'Yes',
            InternetService: 'Fiber optic',
            OnlineSecurity: 'No',
            OnlineBackup: 'No',
            DeviceProtection: 'No',
            TechSupport: 'No',
            StreamingTV: 'Yes',
            StreamingMovies: 'Yes',
            Contract: 'Month-to-month',
            PaperlessBilling: 'Yes',
            PaymentMethod: 'Electronic check',
            tenure: 3,
            MonthlyCharges: 95.00,
            TotalCharges: 285.00
        },
        new: {
            gender: 'Female',
            SeniorCitizen: '0',
            Partner: 'No',
            Dependents: 'Yes',
            PhoneService: 'Yes',
            MultipleLines: 'No',
            InternetService: 'Fiber optic',
            OnlineSecurity: 'Yes',
            OnlineBackup: 'No',
            DeviceProtection: 'No',
            TechSupport: 'Yes',
            StreamingTV: 'No',
            StreamingMovies: 'No',
            Contract: 'Month-to-month',
            PaperlessBilling: 'Yes',
            PaymentMethod: 'Credit card (automatic)',
            tenure: 8,
            MonthlyCharges: 79.50,
            TotalCharges: 636.00
        }
    };

    // Load presets
    presetButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Manage active buttons class
            presetButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const presetKey = btn.getAttribute('data-preset');
            const data = presets[presetKey];

            if (!data) return;

            // Fill form controls
            // 1. Fill Radio groups
            Object.keys(data).forEach(key => {
                const val = data[key];
                const input = form.querySelector(`input[name="${key}"][value="${val}"]`);
                if (input) {
                    input.checked = true;
                }
            });

            // 2. Fill Numeric inputs
            document.getElementById('tenure').value = data.tenure;
            tenureValSpan.textContent = data.tenure;
            document.getElementById('MonthlyCharges').value = data.MonthlyCharges;
            document.getElementById('TotalCharges').value = data.TotalCharges;

            // Re-apply dependent field locks in case the preset changed Internet/Phone service
            syncInternetDependentFields();
            syncPhoneDependentFields();

            // Navigate back to the first tab (Profile) to inspect changes
            currentTabIndex = 0;
            updateWizardButtons();
        });
    });

    // --- Form submission and AJAX ---
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Loading state trigger
        const loadingText = submitBtn.querySelector('span');
        const loadingIcon = submitBtn.querySelector('i');
        const originalText = loadingText.textContent;
        const originalIconClass = loadingIcon.className;

        loadingText.textContent = 'Analyzing Profile...';
        loadingIcon.className = 'fa-solid fa-spinner fa-spin';
        submitBtn.disabled = true;

        // Collect inputs
        const dataObj = {};
        const inputs = new FormData(form);
        inputs.forEach((value, key) => {
            dataObj[key] = value;
        });

        // Resolve radios which FormData handles, but just double-check values
        // Note: For elements like OnlineSecurity, OnlineBackup, etc., since they have a "Yes", "No", and "No internet service" option,
        // we've configured them in HTML as radio buttons. Standard radios work correctly with FormData.

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataObj)
            });

            if (!response.ok) {
                throw new Error('Prediction API failed.');
            }

            errorBox.classList.add('hidden');
            const result = await response.json();
            if (result.status === 'success') {
                displayResults(result, dataObj);
            } else {
                showError('Engine calculation error: ' + result.error);
            }
        } catch (err) {
            console.error(err);
            showError('Failed to connect to the backend prediction server. Check that the server is running and try again.');
        } finally {
            loadingText.textContent = originalText;
            loadingIcon.className = originalIconClass;
            submitBtn.disabled = false;
        }
    });

    function displayResults(result, inputs) {
        // Show result box
        placeholderBox.classList.add('hidden');
        resultBox.classList.remove('hidden');

        const prob = result.churn_probability;
        const probPct = Math.round(prob * 100);

        modelNameText.textContent = `Engine: ${result.model_used} Churn Predictor`;

        // Smoothly draw SVG circle
        const maxCircumference = 283;
        const strokeOffset = maxCircumference - (prob * maxCircumference);
        gaugeFill.style.strokeDashoffset = strokeOffset;

        // Colors selection
        let color, label;
        if (prob < 0.35) {
            color = 'var(--risk-low)';
            label = 'Low Risk';
        } else if (prob < 0.65) {
            color = 'var(--risk-med)';
            label = 'Medium Risk';
        } else {
            color = 'var(--risk-high)';
            label = 'High Risk';
        }

        // Apply visual themes
        gaugeFill.style.stroke = color;
        riskBadge.textContent = label;
        riskBadge.style.color = color;
        riskBadge.style.backgroundColor = `${color}18`;
        riskBadge.style.borderColor = color;

        // Animated numeric percentage ticker
        animatePercentage(probPct, color);

        // Fill Diagnostics & Recommendations
        generateDiagnostics(inputs, prob);
    }

    function animatePercentage(targetValue, targetColor) {
        let currentVal = 0;
        riskPercent.style.color = targetColor;

        if (targetValue === 0) {
            riskPercent.textContent = '0%';
            return;
        }

        const duration = 900; // ms
        const increment = targetValue / (duration / 15);
        
        const counterInterval = setInterval(() => {
            currentVal += increment;
            if (currentVal >= targetValue) {
                clearInterval(counterInterval);
                riskPercent.textContent = `${targetValue}%`;
            } else {
                riskPercent.textContent = `${Math.round(currentVal)}%`;
            }
        }, 15);
    }

    function generateDiagnostics(inputs, prob) {
        posFactors.innerHTML = '';
        negFactors.innerHTML = '';
        actionList.innerHTML = '';

        const positives = [];
        const negatives = [];
        const actions = [];

        // Contract Terms
        if (inputs.Contract === 'Two year') {
            positives.push('2-Year Contract: High subscriber commitment.');
        } else if (inputs.Contract === 'One year') {
            positives.push('1-Year Contract: Moderate customer lock-in.');
        } else {
            negatives.push('Month-to-Month Contract: Flexible subscription triggers churn actions.');
            actions.push({
                icon: 'fa-file-contract',
                text: 'Offer contract migration: Propose a 12-Month contract with a 10% monthly rebate. Customers on agreements are 15x less likely to churn.'
            });
        }

        // Tech Support
        if (inputs.TechSupport === 'Yes') {
            positives.push('Tech Support active: Reduces device or service troubleshooting friction.');
        } else if (inputs.InternetService !== 'No') {
            negatives.push('No Premium Tech Support: High risk of unresolved technical problems.');
            actions.push({
                icon: 'fa-headset',
                text: 'Deploy Premium Care trial: Offer a free 3-month trial of Tech Support. Enrolled users maintain active billing cycles.'
            });
        }

        // Online Security
        if (inputs.OnlineSecurity === 'Yes') {
            positives.push('Online Security enabled: Increased ecosystem utility.');
        }

        // Tenure
        const tenure = parseInt(inputs.tenure);
        if (tenure > 24) {
            positives.push(`Stable Tenure: Long lifecycle history (${tenure} months).`);
        } else if (tenure <= 6) {
            negatives.push(`New account risk: Lifespan cycle is in initial high-churn phase (${tenure} months).`);
            actions.push({
                icon: 'fa-user-check',
                text: 'Onboarding check-in: Schedule a customer success call to resolve setup hurdles and verify satisfaction.'
            });
        }

        // Internet connection type
        if (inputs.InternetService === 'Fiber optic') {
            negatives.push('Fiber Optic connection: Higher monthly charges and historical churn spikes.');
            actions.push({
                icon: 'fa-gauge-high',
                text: 'Optimize line quality: Confirm connection speeds are stable and cross-sell device setup guides.'
            });
        }

        // Payment Method
        if (inputs.PaymentMethod === 'Electronic check') {
            negatives.push('Electronic Check setup: High billing friction and payment failure rate.');
            actions.push({
                icon: 'fa-wallet',
                text: 'Migrate to Autopay: Offer a one-time $10 credit to set up automatic bank transfer or credit card auto-payments.'
            });
        } else if (inputs.PaymentMethod.includes('automatic')) {
            positives.push('Auto-Pay billing active: Eliminates monthly transaction friction.');
        }

        // Helper to resolve contextual icon for stabilizing factors
        const getPositiveIcon = (text) => {
            const lower = text.toLowerCase();
            if (lower.includes('contract')) return 'fa-file-contract';
            if (lower.includes('support')) return 'fa-headset';
            if (lower.includes('security')) return 'fa-shield';
            if (lower.includes('tenure')) return 'fa-chart-line';
            if (lower.includes('pay') || lower.includes('billing')) return 'fa-credit-card';
            return 'fa-shield';
        };

        // Helper to resolve contextual icon for risk accelerators
        const getNegativeIcon = (text) => {
            const lower = text.toLowerCase();
            if (lower.includes('contract')) return 'fa-file-circle-exclamation';
            if (lower.includes('support')) return 'fa-headset';
            if (lower.includes('fiber')) return 'fa-wifi';
            if (lower.includes('tenure') || lower.includes('account')) return 'fa-arrow-trend-down';
            if (lower.includes('check') || lower.includes('billing')) return 'fa-receipt';
            return 'fa-circle-exclamation';
        };

        // Display stabilizers
        if (positives.length > 0) {
            positives.forEach(f => {
                const li = document.createElement('li');
                const icon = getPositiveIcon(f);
                li.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${f}</span>`;
                posFactors.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-shield"></i> <span>No critical stabilizing factors. Suggest upsell.</span>`;
            posFactors.appendChild(li);
        }

        // Display risk accelerators
        if (negatives.length > 0) {
            negatives.forEach(f => {
                const li = document.createElement('li');
                const icon = getNegativeIcon(f);
                li.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${f}</span>`;
                negFactors.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fa-solid fa-circle-check"></i> <span>Account profile parameters look highly stable.</span>`;
            negFactors.appendChild(li);
        }

        // Fallback for very low risk
        if (prob < 0.30) {
            actions.push({
                icon: 'fa-award',
                text: 'Reward loyalty: Enroll in referral bonuses or high-tier loyal customer benefits.'
            });
        }

        // Display prescriptive recommendations
        actions.forEach(act => {
            const div = document.createElement('div');
            div.className = 'recommendation-item';
            div.innerHTML = `<i class="fa-solid ${act.icon}"></i> <span>${act.text}</span>`;
            actionList.appendChild(div);
        });
    }

    // Initialize wizard view
    updateWizardButtons();
});

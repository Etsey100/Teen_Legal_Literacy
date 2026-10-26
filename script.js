document.addEventListener('DOMContentLoaded', () => {
    
    const btnPathW2 = document.getElementById('path-w2-btn');
    const btnPath1099 = document.getElementById('path-1099-btn');
    const heroTitle = document.querySelector('.hero-section h1');
    const calcForm = document.querySelector('.input-section form');
    const calculateNavBtn = document.getElementById('calculate-btn');
    const inputSection = document.querySelector('.input-section');

    const hourlyRateInput = document.getElementById('hourly-pay-rate');
    const hoursPerWeekInput = document.getElementById('hours-worked-per-week');
    const ageInput = document.getElementById('age');
    const stateInput = document.getElementById('state');

    const grossDisplay = document.getElementById('gross-display');
    const netDisplay = document.getElementById('net-display');
    const netBarFill = document.getElementById('net-bar-fill');
    
    const fedTaxAmount = document.getElementById('fed-tax-amount');
    const stateTaxAmount = document.getElementById('state-tax-amount');
    const ficaAmount = document.getElementById('fica-amount');
    const takeHomeAmount = document.getElementById('take-home-amount');

    const rightsListItems = document.querySelectorAll('.rights-list li');

    // Version 2.0 Alert for the .btn-legal button
    const btnLegal = document.querySelector('.btn-legal');
    if (btnLegal) {
        btnLegal.addEventListener('click', (e) => {
            e.preventDefault();
            alert("The Youth Law Review and full legal essay library are coming soon in Version 2.0 of Teen Legal Literacy! Stay tuned.");
        });
    }

    let activePath = 'W2'; 

    if (calculateNavBtn && inputSection) {
        calculateNavBtn.addEventListener('click', (e) => {
            e.preventDefault();
            inputSection.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (btnPathW2 && btnPath1099) {
        btnPathW2.addEventListener('click', () => {
            activePath = 'W2';
            btnPathW2.classList.add('active');
            btnPath1099.classList.remove('active');
            heroTitle.textContent = 'YOUR EMPLOYMENT BREAKDOWN (W-2)';
            runCalculations();
        });

        btnPath1099.addEventListener('click', () => {
            activePath = '1099';
            btnPath1099.classList.add('active');
            btnPathW2.classList.remove('active');
            heroTitle.textContent = 'YOUR EMPLOYMENT BREAKDOWN (1099 GIG)';
            runCalculations();
        });
    }

    if (calcForm) {
        calcForm.addEventListener('submit', (e) => {
            e.preventDefault();
            runCalculations();
        });
    }

    function runCalculations() {
        const hourlyRate = parseFloat(hourlyRateInput.value) || 0;
        const hoursPerWeek = parseFloat(hoursPerWeekInput.value) || 0;
        const age = parseInt(ageInput.value) || 0;
        const state = stateInput.value.trim();

        const grossPay = hourlyRate * hoursPerWeek * 52;

        let federalTax = 0;
        let stateTax = 0;
        let ficaTax = 0; 
        let netPay = 0;

        if (activePath === 'W2') {
            federalTax = grossPay > 3100 ? grossPay * 0.10 : 0; 
            stateTax = grossPay > 3100 ? grossPay * 0.031 : 0;  
            ficaTax = grossPay * 0.0765;                          
        } else {
            federalTax = 0; 
            stateTax = grossPay > 3100 ? grossPay * 0.031 : 0;
            ficaTax = grossPay >= 400 ? grossPay * 0.153 : 0;   
        }

        const totalDeductions = federalTax + stateTax + ficaTax;
        netPay = grossPay - totalDeductions;
        if (netPay < 0) netPay = 0;

        const takeHomePercent = grossPay > 0 ? Math.min(100, Math.max(0, (netPay / grossPay) * 100)) : 0;

        grossDisplay.textContent = `Gross: $${grossPay.toFixed(2)}`;
        netDisplay.textContent = `Net: $${netPay.toFixed(2)}`;
        netBarFill.style.width = `${takeHomePercent}%`;

        fedTaxAmount.textContent = `$${federalTax.toFixed(2)}`;
        stateTaxAmount.textContent = `$${stateTax.toFixed(2)}`;
        
        const ficaRowLabel = document.querySelector('.deduction-row:nth-child(3) p');
        if (ficaRowLabel) {
            ficaRowLabel.textContent = activePath === 'W2' ? 'FICA (7.65%)' : 'Self-Employment Tax (15.3%)';
        }
        ficaAmount.textContent = `$${ficaTax.toFixed(2)}`;
        takeHomeAmount.textContent = `$${netPay.toFixed(2)}`;

        updateLegalTrack(age, hoursPerWeek, activePath);
    }

    function updateLegalTrack(age, hours, path) {
        if (!rightsListItems || rightsListItems.length < 4) return;

        let workingHoursStatus = "Compliant";
        let minWageStatus = "Protected ($16.00/hr NY)";
        let breakStatus = "Mandated (30 min over 6 hrs)";
        let ageStatus = `Age ${age}: Valid`;

        if (age === 14 || age === 15) {
            if (hours > 18) {
                workingHoursStatus = "WARNING: Max 18 hrs/week allowed";
            } else {
                workingHoursStatus = "Passed: Under 18 hrs school week limit";
            }
        } else if (age === 16 || age === 17) {
            if (hours > 28) {
                workingHoursStatus = "WARNING: Exceeds 28 hrs without parental permit";
            } else {
                workingHoursStatus = "Passed: Within 28 hr school-year limit";
            }
        } else if (age < 14) {
            workingHoursStatus = "VIOLATION: Under 14 employment restrictions";
            ageStatus = "Restricted: Under 14";
        }

        if (path === '1099') {
            minWageStatus = "1099 Exemption: Minimum wage laws do not apply";
            breakStatus = "1099 Exemption: Mandatory rest breaks do not apply";
        }

        rightsListItems[0].querySelector('p').textContent = `Working Hours: ${workingHoursStatus}`;
        rightsListItems[1].querySelector('p').textContent = `Minimum Wage: ${minWageStatus}`;
        rightsListItems[2].querySelector('p').textContent = `Break Requirements: ${breakStatus}`;
        rightsListItems[3].querySelector('p').textContent = `Age Restrictions: ${ageStatus}`;
    }
});

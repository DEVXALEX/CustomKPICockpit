document.addEventListener('DOMContentLoaded', function () {

    const ajaxOutput = {
        ParameterName: ["Time In Area", "Work Completed", "WIP", "First Pass Yield", "Do What's Due", "Behind Schedule"],
        Value: ["2", "48", "42", "98%", "0", "12"]
    };

    // --- Core Functions ---

    // Function for internal JS calculation of status instead of getting it from AJAX
    function calculateStatus(parameterName, value) {

        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 'good';

        if (numValue >= 90) return 'good';
        if (numValue >= 20) return 'warning';
        return 'bad';
    }

    // Function to render the KPI dashboard
    function renderDashboard() {
        const container = document.getElementById('kpi-container');
        container.innerHTML = '';

        const names = ajaxOutput.ParameterName;
        const values = ajaxOutput.Value;

        if (!names || !values || names.length === 0) {
            container.innerHTML = '<p>No data available.</p>';
            return;
        }

        for (let i = 0; i < names.length; i++) {
            const name = names[i];
            const value = values[i];
            const status = calculateStatus(name, value);

            const tileHTML = `
                <div class="kpi-tile status-${status}">
                    <div class="tile-header">
                        <span class="tile-title">${name}</span>
                    </div>
                    <div class="tile-content">
                        <div class="tile-value">${value}</div>
                        <!-- Unit section commented out for now
                        <div class="tile-unit"></div>
                        -->
                    </div>
                    <!-- Target section commented out from dom generation for now
                    <div class="tile-footer">
                        <span class="target-label">Target:</span>
                        <span class="target-value"></span>
                    </div>
                    -->
                </div>
            `;

            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = tileHTML.trim();
            const tile = tempDiv.firstChild;

            // Add slight animation delay for a cascading entrance effect
            tile.style.opacity = '0';
            tile.style.transform = 'translateY(20px)';
            container.appendChild(tile);

            // Trigger animation

            setTimeout(() => {
                tile.style.transition = 'all 0.4s ease';
                tile.style.opacity = '1';
                tile.style.transform = 'translateY(0)';
            }, 50 + (i * 50));

        }
    }

    // --- Initialization ---
    renderDashboard();
});

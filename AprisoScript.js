document.addEventListener('DOMContentLoaded', function () {

    function calculateStatus(parameterName, value) {

        const numValue = parseFloat(value);
        if (isNaN(numValue)) return 'good';
        if (numValue >= 90) return 'good';
        if (numValue >= 20) return 'warning';
        return 'bad';
    }

function renderDashboard(ajaxOutput) {
    const container = document.getElementById('kpi-container');
    container.innerHTML = ''; 

    const names = ajaxOutput.Parameter;
    const Units = ajaxOutput.Unit;

    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const Unit = Units[i];

        const tileHTML = `
            <div class="kpi-tile" data-kpi="${name}">
                <div class="tile-header">
                    <span class="tile-title">${name}</span>
                </div>
                <div class="tile-content">
                    <div class="tile-value">--</div>
                    <div class="tile-unit">${Unit}</div>
                </div>
                <div class="tile-footer" style="display: none;">
                    <span class="target-label">Target:</span>
                    <span class="target-value">--</span>
                </div>
            </div>
        `;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = tileHTML.trim();
        const tile = tempDiv.firstChild;

        tile.style.opacity = '0';
        tile.style.transform = 'translateY(20px)';
        container.appendChild(tile);

        setTimeout(() => {
            tile.style.transition = 'all 0.4s ease';
            tile.style.opacity = '1';
            tile.style.transform = 'translateY(0)';
        }, 50 + (i * 50));
    }
    updateDashboardData(ajaxOutput);
}

function updateDashboardData(ajaxOutput) {
    const names = ajaxOutput.Parameter;
    const values = ajaxOutput.Value;
    const Targets = ajaxOutput.Target;

    for (let i = 0; i < names.length; i++) {
        const name = names[i];
        const value = values[i];
        const Target = Targets[i];
        
        const status = calculateStatus(name, value); 
        const tile = document.querySelector(`.kpi-tile[data-kpi="${name}"]`);
        
            tile.querySelector('.tile-value').innerText = value;
            const footer = tile.querySelector('.tile-footer');
            if (Target !== 'NA') {
                footer.style.display = 'block'; 
                tile.querySelector('.target-value').innerText = Target;
            } else {
                footer.style.display = 'none';
            }
            tile.className = tile.className.replace(/\bstatus-\S+/g, '').trim(); 
            tile.classList.add(`status-${status}`);
    }
}
	Ajax(context,'Init','ALL','01/01/1900 12:00:00 AM','01/01/1900 12:00:00 AM');
	setInterval(()=>Ajax(context,'Update','ALL','01/01/1900 12:00:00 AM','01/01/1900 12:00:00 AM'),RefreshTime)
	
	function Ajax(context,Flag, WorkCenter, FromDate, ToDate) {
    context.callOperation(
        'EMR_MME_FetchData_Ajax', 
        { WorkCenter, FromDate, ToDate }, 
        outputs =>Flag=='Init' ? renderDashboard(outputs):updateDashboardData(outputs) ,
        message => alert(message)
    );
}
});

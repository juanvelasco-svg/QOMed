// Este archivo es un complemento para admin-panel.js
// Asegura que Chart.js esté disponible y maneja actualizaciones de tema

class ChartsManager {
    constructor() {
        this.charts = {};
    }

    updateChartsTheme() {
        if (typeof Chart === 'undefined') return;
        
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--text-primary').trim();
        const borderColor = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();

        Object.values(this.charts).forEach(chart => {
            if (chart.options.plugins && chart.options.plugins.legend) {
                chart.options.plugins.legend.labels.color = textColor;
            }
            if (chart.options.scales) {
                if (chart.options.scales.x) chart.options.scales.x.ticks.color = textColor;
                if (chart.options.scales.y) {
                    chart.options.scales.y.ticks.color = textColor;
                    chart.options.scales.y.grid.color = borderColor;
                }
            }
            chart.update();
        });
    }
}

const chartsManager = new ChartsManager();

// Escuchar cambios de tema para actualizar gráficos
window.addEventListener('storage', (e) => {
    if (e.key === 'edu_platform_theme') {
        setTimeout(() => chartsManager.updateChartsTheme(), 100);
    }
});
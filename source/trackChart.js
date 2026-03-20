"use strict";
var trackChart = new Object();
trackChart.create = function () {
    google.charts.load('current', { 'packages': ['corechart'] });
    google.charts.setOnLoadCallback(drawTrackChart);

    function drawTrackChart() {

        var data = new google.visualization.DataTable();
        data.addColumn('number', 'Distancia');
        data.addColumn('number', 'Perfil');

        var myDataTrack = [];

        var stopChartSelection = false;
        var chart_div = document.getElementById('chart_div');

        var options = {

            is3D: true,
            width: chart_div.clientWidth,
            height: chart_div.clientHeight,
            backgroundColor: 'transparent',
            crosshair: { color: '#fff', orientation: 'vertical' }, // Display crosshairs on focus and selection.
            tooltip: { trigger: 'selection' },
            /*pointSize: 3,
            series: {
                0: { pointShape: 'circle' }
            },*/
            hAxis: {
                textPosition: 'in',
                format: 'short',
                textStyle: { color: '#ffffff' },
                baselineColor: { color: '#ffffff' }
            },
            vAxis: {
                textPosition: 'in',
                format: 'short',
                textStyle: { color: '#ffffff' },
                baselineColor: { color: '#ffffff' }
            },
            colors: [TR3cfg.mineColor || '#ffffff'],
            legend: { position: 'none' },
            explorer: {
                maxZoomIn: 2,
                maxZoomOut: 1,
                keepInBounds: true
            }
        };

        var chart = new google.visualization.AreaChart(chart_div);

        function selectHandler() {
            var selectedItem = chart.getSelection()[0];

            if (selectedItem) {
                TR3cfg.GAPcamera_ligthRabbit = [];
                stopChartSelection = true;
                setTimeout(() => {
                    stopChartSelection = false;
                }, 3500);
                var topping = data.getValue(selectedItem.row, 0);
                TR3cfg.rabbitLight.visible = true;

                var pos = myDataTrack[selectedItem.row];
                TR3cfg.rabbitLight.position.set(pos.x, pos.y, pos.z);
                TR3.followCtmPath.pauseIndex = selectedItem.row;
                TR3cfg.moveRabbitLight(false, false, 'jump', false, { x: TR3cfg.tweenDist, y: TR3cfg.tweenDist, z: TR3cfg.tweenDist });
                //data.removeRows(selectedItem.row, data.Wf.length + 1);
                //chart.draw(data, options);
                console.log('The user selected ' + topping);

                if (TR3.followCtmPath.pauseIndex < 0) { TR3.followCtmPath.pauseIndex = 0 }
                var auxDist = TR3.dataLineAtIndex(TR3cfg.LineRabbit, TR3.followCtmPath.pauseIndex);
                updateMetricsTrack(auxDist)
            }
        }

        google.visualization.events.addListener(chart, 'select', selectHandler);

        var pauseIndexB4 = 'kk';
        setInterval(() => {
            if (!stopChartSelection)
                var pIdx = TR3.followCtmPath.pauseIndex;
            if (TR3.followCtmPath && pIdx && pauseIndexB4 != pIdx) {
                pauseIndexB4 = pIdx;
                chart.setSelection([{ 'row': pIdx }]);
            }
        }, 500);

        trackChart.setChart = function (dist) {
            if (dist) {
                options.hAxis.maxValue = dist.dist * 1.1;
                options.hAxis.minValue = 0 * 1.1;

                options.vAxis.maxValue = dist.topAlt * 1.1;
                options.vAxis.minValue = dist.bottomAlt * 1.1;
            }
            if (data.Wf && data.Wf.length) {
                data.removeRows(0, data.Wf.length);
            }
            options.colors = [TR3cfg.mineColor];

            data.addRows(dist.poisChart);
            chart.draw(data, options);
            myDataTrack = dist.poisModel;

            dataTrack.style.display = 'block';
        }
    }
};
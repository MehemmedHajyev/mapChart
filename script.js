var root = am5.Root.new("chartdiv");

root._logo.dispose();

root.setThemes([
    am5themes_Animated.new(root)
]);

var chart = root.container.children.push(
    am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "translateY",
        projection: am5map.geoNaturalEarth1()
    })
);

var polygonSeries = chart.series.push(
    am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
        exclude: ["AQ"]
    })
);

polygonSeries.mapPolygons.template.setAll({
    fill: am5.color(0xcaa977),
    tooltipText: "{name}",
    toggleKey: "active",
    interactive: true,
});

const defaultActiveCountries = Object.freeze(["RU", "IQ", "AZ", "AF"]);

var markerSeries = chart.series.push(am5map.MapPointSeries.new(root, {}));

polygonSeries.events.on("datavalidated", function () {
    polygonSeries.mapPolygons.each(function (polygon) {
        if (defaultActiveCountries.includes(polygon.dataItem.dataContext.id)) {
            polygon.states.apply("active");
            polygon.set("active", true); 

            // GeoJSON geometrisinin merkezini hesap
            var geometry = polygon.dataItem.dataContext.geometry;

            if (geometry.type === "Polygon") {
                var coordinates = geometry.coordinates;
                var centroid = calculateCentroid([coordinates]); 
                markerSeries.data.push({
                    geometry: { type: "Point", coordinates: centroid },
                    id: polygon.dataItem.dataContext.id
                });
            } else if (geometry.type === "MultiPolygon") {
                var coordinates = geometry.coordinates;
                var centroid = calculateCentroid(coordinates); 
                markerSeries.data.push({
                    geometry: { type: "Point", coordinates: centroid },
                    id: polygon.dataItem.dataContext.id
                });
            }
        }
    });
});

markerSeries.bullets.push(function () {
    var circle = am5.Circle.new(root, {
        radius: 4, 
        fill: am5.color(0xFF0000),
        strokeWidth: 2,
        stroke: am5.color(0xFFFFFF),
        centerX: "50%",
        centerY: "50%"
    });

    applyBurnEffect(circle);

    return am5.Bullet.new(root, {
        sprite: circle
    });
});

function applyBurnEffect(marker) {
    const animationDuration = 1000
    const maxScale = 0.7; 
    const minScale = 0.5;
    const maxOpacity = 0.7;
    const minOpacity = 0;
    function animateBurn() {

        marker.animate({
            key: "scale",
            to: maxScale,
            duration: animationDuration,
            easing: am5.ease.inOut(am5.ease.cubic)
        });

        marker.animate({
            key: "opacity",
            to: maxOpacity,
            duration: animationDuration,
            easing: am5.ease.inOut(am5.ease.cubic)
        });
        setTimeout(function () {
            marker.animate({
                key: "scale",
                to: minScale,
                duration: animationDuration,
                easing: am5.ease.inOut(am5.ease.cubic)
            });

            marker.animate({
                key: "opacity",
                to: minOpacity,
                duration: animationDuration,
                easing: am5.ease.inOut(am5.ease.cubic)
            });
        }, animationDuration);

    
        setTimeout(animateBurn, animationDuration * 2);
    }


    animateBurn();
}

polygonSeries.mapPolygons.template.events.on("pointerover", function (event) {
    var polygon = event.target;

    if (!polygon.get("active")) {
        polygon.states.apply("hover");
    }
});

polygonSeries.mapPolygons.template.states.create("hover", {
    fill: am5.color(0xd7282f),
});

polygonSeries.mapPolygons.template.states.create("active", {
    fill: am5.color(0xd7282f),
});

chart.chartContainer.get("background").events.on("click", function () {
    chart.goHome();
});

chart.appear(1000, 100);

function calculateCentroid(coordinates) {
    var x = 0, y = 0, totalPoints = 0;

    coordinates.forEach(polygon => {
        polygon.forEach(ring => {
            ring.forEach(point => {
                x += point[0];
                y += point[1];
                totalPoints++;
            });
        });
    });
    return [x / totalPoints, y / totalPoints];
}

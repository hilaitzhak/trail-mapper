var wms_layers = [];


        var lyr_OSMStandard_0 = new ol.layer.Tile({
            'title': 'OSM Standard',
            //'type': 'base',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
    attributions: ' &middot; <a href="https://www.openstreetmap.org/copyright">© OpenStreetMap contributors, CC-BY-SA</a>',
                url: 'http://tile.openstreetmap.org/{z}/{x}/{y}.png'
            })
        });
var format_trails_geojson_1 = new ol.format.GeoJSON();
var features_trails_geojson_1 = format_trails_geojson_1.readFeatures(json_trails_geojson_1, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_trails_geojson_1 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_trails_geojson_1.addFeatures(features_trails_geojson_1);
var lyr_trails_geojson_1 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_trails_geojson_1, 
                style: style_trails_geojson_1,
                popuplayertitle: "trails_geojson",
                interactive: true,
                title: '<img src="styles/legend/trails_geojson_1.png" /> trails_geojson'
            });

lyr_OSMStandard_0.setVisible(true);lyr_trails_geojson_1.setVisible(true);
var layersList = [lyr_OSMStandard_0,lyr_trails_geojson_1];
lyr_trails_geojson_1.set('fieldAliases', {'id': 'id', 'name': 'name', 'area': 'area', 'difficulty': 'difficulty', 'distance': 'distance', 'time': 'time', 'creator': 'creator', 'date': 'date', 'hasGps': 'hasGps', 'detailUrl': 'detailUrl', 'gpsFileName': 'gpsFileName', });
lyr_trails_geojson_1.set('fieldImages', {'id': 'TextEdit', 'name': 'TextEdit', 'area': 'TextEdit', 'difficulty': 'TextEdit', 'distance': 'TextEdit', 'time': 'TextEdit', 'creator': 'TextEdit', 'date': 'TextEdit', 'hasGps': 'TextEdit', 'detailUrl': 'TextEdit', 'gpsFileName': 'TextEdit', });
lyr_trails_geojson_1.set('fieldLabels', {'id': 'no label', 'name': 'no label', 'area': 'no label', 'difficulty': 'no label', 'distance': 'no label', 'time': 'no label', 'creator': 'no label', 'date': 'no label', 'hasGps': 'no label', 'detailUrl': 'no label', 'gpsFileName': 'no label', });
lyr_trails_geojson_1.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});
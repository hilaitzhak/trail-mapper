const fetch = require('node-fetch');
const cheerio = require('cheerio');
const xml2js = require('xml2js');
const fs = require('fs').promises;
const { stringify } = require('csv-stringify/sync');

const BASE_URL = 'http://groopy.co.il';

function parseTrailTables(htmlContent) {
    const $ = cheerio.load(htmlContent);
    const trails = [];

    const gridDivs = $('div[id^="mainContentPlaceHolder_panelGrid"]');

    gridDivs.each((_, gridDiv) => {
        const table = $(gridDiv).find('table');
        
        if (table.length === 0) {
            return;
        }

        table.find('.table_row_odd, .table_row_even').each((_, row) => {
            const cells = $(row).find('td');
            if (cells.length >= 8) {
                const detailUrl = BASE_URL + '/' + $(cells[0]).find('a').attr('href');
                const trailId = detailUrl.split('=').pop();
                const trail = {
                    id: trailId,
                    name: $(cells[0]).text().trim(),
                    area: $(cells[1]).text().trim(),
                    difficulty: $(cells[2]).text().trim(),
                    distance: $(cells[3]).text().trim(),
                    time: $(cells[4]).text().trim(),
                    creator: $(cells[5]).text().trim(),
                    date: $(cells[6]).text().trim(),
                    hasGps: $(cells[7]).find('img').length > 0 ? 'Yes' : 'No',
                    detailUrl: detailUrl
                };
                trails.push(trail);
            }
        });
    });

    return trails;
}

// Function to fetch GPS data
async function fetchGpsData(detailUrl) {
    try {
        const response = await fetch(detailUrl);
        const html = await response.text();
        const $ = cheerio.load(html);
        
        const gpsLink = $('#mainContentPlaceHolder_linkGPSFileDownload').attr('href');
        if (!gpsLink) return null;

        const gpsResponse = await fetch(BASE_URL + '/' + gpsLink);
        const gpsText = await gpsResponse.text();
        
        const parser = new xml2js.Parser();
        const result = await parser.parseStringPromise(gpsText);
        
        const trackPoints = result.gpx.trk[0].trkseg[0].trkpt;
        
        return {
            coordinates: trackPoints.map(point => [parseFloat(point.$.lon), parseFloat(point.$.lat)]),
            gpsFileName: gpsLink.split('/').pop()
        };
    } catch (error) {
        console.error('Error fetching GPS data:', error);
        return null;
    }
}


function createGeoJSONFeature(trail) {
    const feature = {
        type: "Feature",
        properties: {
            id: trail.id,
            name: trail.name,
            area: trail.area,
            difficulty: trail.difficulty,
            distance: trail.distance,
            time: trail.time,
            creator: trail.creator,
            date: trail.date,
            hasGps: trail.hasGps,
            detailUrl: trail.detailUrl
        },
        geometry: null
    };

    if (trail.gpsData && trail.gpsData.coordinates.length > 0) {
        feature.geometry = {
            type: "LineString",
            coordinates: trail.gpsData.coordinates
        };
        feature.properties.gpsFileName = trail.gpsData.gpsFileName;
    }

    return feature;
}

async function fetchAndParseTrailData() {
    const apiUrl = 'http://groopy.co.il/tracks.aspx';

    try {
        console.log("Fetching main page...");
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const htmlContent = await response.text();
        const trails = parseTrailTables(htmlContent);
        
        console.log(`Found ${trails.length} trails. Fetching GPS data for each trail...`);

        const geoJSONFeatures = [];

        // Fetch GPS data for each trail
        for (let i = 0; i < trails.length; i++) {
            const trail = trails[i];
            console.log(`Fetching GPS data for trail ${i + 1}/${trails.length}: ${trail.name}`);
            trail.gpsData = await fetchGpsData(trail.detailUrl);
            
            const geoJSONFeature = createGeoJSONFeature(trail);
            geoJSONFeatures.push(geoJSONFeature);
            
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        console.log("All data fetched. Saving to GeoJSON file...");

        const geoJSONOutput = {
            type: "FeatureCollection",
            features: geoJSONFeatures
        };

        // Save all trail data as a GeoJSON file
        await fs.writeFile('trails_geojson.json', JSON.stringify(geoJSONOutput, null, 2));
        console.log("Complete data saved to trails_geojson.json");

        console.log(`Total trails processed: ${trails.length}`);
        console.log(`Trails with GPS data: ${geoJSONFeatures.filter(feature => feature.geometry !== null).length}`);

    } catch (error) {
        console.error('Error fetching or parsing the data:', error);
    }
}



fetchAndParseTrailData();
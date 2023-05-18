document
    .getElementById('csvFileInput')
    .addEventListener('change', handleFileSelect);

function handleFileSelect(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const csvContent = e.target.result;
            const jsonObj = csvToJSON(csvContent);

            jsonObj.forEach((obj) => {
                const name = obj['"Name"'];
                const image =
                    name && name.trim() !== ''
                        ? `https://www.smogon.com/dex/media/sprites/xy/${formatImageName(
                              name
                          )}.gif`
                        : '';
                obj['Image'] = image;
            });

            document.getElementById('jsonOutput').textContent = JSON.stringify(
                jsonObj,
                null,
                2
            )
                .replace(/"/g, '')
                .replace(/\\/g, '')
                .replace(/;/g, '');
        };

        reader.readAsText(file);
    }
}

function csvToJSON(csvContent) {
    const lines = csvContent.split(/\r\n|\n/);
    const headers = parseCSVLine(lines[0]);
    const jsonArray = [];

    for (let i = 1; i < lines.length; i++) {
        const currentLine = parseCSVLine(lines[i]);

        if (
            currentLine.length > 0 &&
            currentLine.some((value) => value.trim() !== '')
        ) {
            const obj = {};

            for (let j = 0; j < headers.length; j++) {
                const key = headers[j];
                let value = cleanValue(currentLine[j]);
                if (value === undefined) value = '';

                obj[key] = value;
            }

            if (obj['Type2'] === '') {
                obj['Type2'] = obj['Type1'];
            }

            jsonArray.push(obj);
        }
    }

    return jsonArray;
}

function parseCSVLine(line) {
    const values = line.split(',');
    const cleanedValues = [];

    for (let i = 0; i < values.length; i++) {
        let cleanedValue = values[i].trim();

        if (cleanedValue.startsWith('"') && cleanedValue.endsWith('"')) {
            cleanedValue = cleanedValue.slice(1, -1);
        }

        cleanedValues.push(cleanedValue);
    }

    return cleanedValues;
}

function cleanValue(value) {
    return value !== undefined ? value.replace(/["\\;]/g, '') : undefined;
}

function formatImageName(name) {
    let formattedName = name.toLowerCase().replace(/[^a-zA-Z0-9]+/g, '-');
    formattedName = formattedName.replace(/-+/g, '-');
    return formattedName;
}

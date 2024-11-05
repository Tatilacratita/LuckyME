function generateNumbers() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/generate", true);
    xhr.setRequestHeader('Content-type', 'application/json');

    // Preluăm valorile din formular
    var draws = document.getElementById("draws").value;
    var algorithm = document.getElementById("algorithm").value;
    var birthday = document.getElementById("birthday").value; // Preluăm data de naștere
    var fileInput = document.getElementById("file-input");
  
    // Citim fisierul Excel si parsam datele
    var reader = new FileReader();
    reader.onload = function(e) {
        var data = new Uint8Array(e.target.result);
        var workbook = XLSX.read(data, {type: 'array'});
        var sheet = workbook.Sheets[workbook.SheetNames[0]];
        
        // Extragem datele din cele 6 coloane
        var history = XLSX.utils.sheet_to_json(sheet, {header: 1}); // Obține datele ca un array de arrays

        // Filtrăm datele pentru a obține un istoric formatat
        var formattedHistory = history.map(row => ({
            Nr_1: row[0], // Prima coloană
            Nr_2: row[1], // A doua coloană
            Nr_3: row[2], // A treia coloană
            Nr_4: row[3], // A patra coloană
            Nr_5: row[4], // A cincea coloană
            Nr_6: row[5]  // A șasea coloană
        })).slice(1); // Ignorăm prima linie dacă aceasta conține antetele

        // Aplicam algoritmul Gianelli sau Boosting in functie de valoarea din dropdown
        var numbers;
        if (algorithm === "gianelli") {
            numbers = gianelliAlgorithm(draws, formattedHistory, birthday); // Pasăm datele formatate
        } else if (algorithm === "boosting") {
            numbers = boostingAlgorithm(draws, formattedHistory, birthday); // Pasăm datele formatate
        } else {
            numbers = randomAlgorithm(draws, birthday); // Pasăm data de naștere
        }
  
        // Trimitem datele catre server
        var requestData = {
            draws: draws,
            algorithm: algorithm,
            history: formattedHistory, // Trimitim istoricul formatat
            numbers: numbers,
            birthday: birthday // Adăugăm data de naștere în obiectul trimis
        };
        xhr.send(JSON.stringify(requestData));
  
        xhr.onload = function() {
            if (xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                document.getElementById("winning-numbers").innerHTML = "";
                response.numbers.forEach(function(number) {
                    var li = document.createElement("li");
                    li.textContent = number;
                    document.getElementById("winning-numbers").appendChild(li);
                });
            }
        };
    };
    reader.readAsArrayBuffer(fileInput.files[0]);
}

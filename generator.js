function generateNumbers() {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "/generate", true);
    xhr.setRequestHeader('Content-type', 'application/json');
    var draws = document.getElementById("draws").value;
    var algorithm = document.getElementById("algorithm").value;
    var fileInput = document.getElementById("file-input");
  
    // Citim fisierul Excel si parsam datele
    var reader = new FileReader();
    reader.onload = function(e) {
      var data = new Uint8Array(e.target.result);
      var workbook = XLSX.read(data, {type: 'array'});
      var sheet = workbook.Sheets[workbook.SheetNames[0]];
      var history = XLSX.utils.sheet_to_json(sheet);
  
      // Aplicam algoritmul Gianelli sau Boosting in functie de valoarea din dropdown
      var numbers;
      if (algorithm === "gianelli") {
        numbers = gianelliAlgorithm(draws, history);
      } else if (algorithm === "boosting") {
        numbers = boostingAlgorithm(draws, history);
      } else {
        numbers = randomAlgorithm(draws);
      }
  
      // Trimitem datele catre server
      var data = {
        draws: draws,
        algorithm: algorithm,
        history: history,
        numbers: numbers
      };
      xhr.send(JSON.stringify(data));
  
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
  
document.getElementById("generate-archive-button").addEventListener("click", function () {
    // Aici specifici calea către fișierul arhiva_loto.xlsx
    const url = './arhiva_loto.xlsx';

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Fișierul nu a putut fi găsit.');
            }
            return response.arrayBuffer();
        })
        .then(data => {
            const workbook = XLSX.read(data, { type: "array" });

            // Poți obține datele din prima foaie a workbook-ului
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            // Convertește datele din worksheet într-un format JSON
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            // Generează un nou fișier Excel
            const newWorkbook = XLSX.utils.book_new();
            const newWorksheet = XLSX.utils.json_to_sheet(jsonData);
            XLSX.utils.book_append_sheet(newWorkbook, newWorksheet, "Arhivă");

            // Salvează fișierul Excel generat
            XLSX.writeFile(newWorkbook, "Arhiva_loto.xlsx");
        })
        .catch(error => {
            console.error('Eroare:', error);
            alert('A apărut o eroare: ' + error.message);
        });
});

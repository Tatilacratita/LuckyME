document.getElementById("generate-archive-button").addEventListener("click", function () {
    const fileInput = document.getElementById("file-input");

    // Verifică dacă un fișier a fost încărcat
    if (fileInput.files.length === 0) {
        alert("Te rog să încarci un fișier Excel înainte de a genera arhiva.");
        return;
    }

    const file = fileInput.files[0];
    
    const reader = new FileReader();
    reader.onload = function (e) {
        const data = new Uint8Array(e.target.result);
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
        XLSX.writeFile(newWorkbook, "Arhiva_649.xlsx");
    };

    reader.readAsArrayBuffer(file);
});

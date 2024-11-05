function generateLottoNumbers(birthday) {
   const numbers = [];
   const date = new Date(birthday);
   const year = date.getFullYear().toString();
   const month = (date.getMonth() + 1).toString().padStart(2, "0");
   const day = date.getDate().toString().padStart(2, "0");
 
   // Adaugă ziua, luna și anul ca numere individuale
   numbers.push(parseInt(day[0]), parseInt(day[1]));
   numbers.push(parseInt(month[0]), parseInt(month[1]));
   numbers.push(parseInt(year[0]), parseInt(year[1]), parseInt(year[2]), parseInt(year[3]));
 
   // Generează 49 de numere întregi într-un array și amestecă-le într-un mod aleatoriu
   const allNumbers = Array.from({ length: 49 }, (_, i) => i + 1);
   const shuffledNumbers = shuffle(allNumbers);
 
   // Selectează primele 6 numere din array-ul amestecat
   const selectedNumbers = shuffledNumbers.slice(0, 6);
 
   // Adaugă cele 6 numere selectate la array-ul de numere
   for (let i = 0; i < selectedNumbers.length; i++) {
     numbers.push(selectedNumbers[i]);
   }
 
   // Sortează numerele în ordine crescătoare
   numbers.sort((a, b) => a - b);
 
   return numbers;
 }
 
 function shuffle(array) {
   for (let i = array.length - 1; i > 0; i--) {
     const j = Math.floor(Math.random() * (i + 1));
     [array[i], array[j]] = [array[j], array[i]];
   }
   return array;
 }
 
 const form = document.querySelector("form");
 const winningNumbersList = document.getElementById("winning-numbers");
 
 form.addEventListener("submit", function (event) {
   event.preventDefault();
   const birthday = event.target.birthday.value;
   const lastGenerated = localStorage.getItem(birthday);
   const now = new Date().getTime();
 
   if (!lastGenerated) {
     // Dacă nu există o intrare în localStorage pentru data de naștere curentă
     // generează numerele, stochează-le în localStorage și afișează-le
     const numbers = generateLottoNumbers(birthday);
     localStorage.setItem(birthday, JSON.stringify({ numbers, timestamp: now }));
     displayNumbers(numbers);
     } else {
       // Dacă există o intrare în localStorage pentru data de naștere curentă,
       // verifică dacă au trecut cel puțin 5 minute de la ultima generare
       const { numbers, timestamp } = JSON.parse(lastGenerated);
       const minutesPassed = (now - timestamp) / (1000 * 60);
       if (minutesPassed >= 5) {
         // Dacă au trecut cel puțin 5 minute, generează numerele, actualizează intrarea în localStorage
         // și afișează-le
         const newNumbers = generateLottoNumbers(birthday);
         localStorage.setItem(birthday, JSON.stringify({ numbers: newNumbers, timestamp: now }));
         displayNumbers(newNumbers);
       } else {
         // Dacă nu au trecut cel puțin 5 minute, afișează ultimele numere generate
         displayNumbers(numbers);
         setTimeout(() => {
           const newNumbers = generateLottoNumbers(birthday);
           localStorage.setItem(birthday, JSON.stringify({ numbers: newNumbers, timestamp: now }));
           displayNumbers(newNumbers);
         }, (5 - minutesPassed) * 60 * 1000);
       }
     }
     
 
   // Funcție pentru afișarea numerelor generate
   function displayNumbers(numbers) {
   winningNumbersList.innerHTML = "";
   for (let i = 0; i < numbers.length; i++) {
   const listItem = document.createElement("li");
   if (numbers[i] !== 0 && i >= 8) {
   listItem.textContent = numbers[i];
   winningNumbersList.appendChild(listItem);
   }
   }
   }
   }); 
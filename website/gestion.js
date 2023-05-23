window.confirm("Vous devez entrer un mot de passe pour y accéder.");
let pass = prompt("SVP Entrer le code");
let text;

if (pass === null || pass !== "Shoe1234") {
    window.confirm("CODE INCORRECT");
    // Retourn 
    window.history.back();
} else {
    console.log("Mot de passe correct. Accès autorisé!");
    // Continue 
}
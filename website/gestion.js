window.confirm("Vous devez entrer un mot de passe pour y accéder.");
let pass = prompt("SVP Entrer le code");
let text;
if (pass != "Shoe1234") {
    window.confirm("CODE INCORRECT");
    text = "";
    return;
} else {
    console.log("Person added");
    text = "";
}
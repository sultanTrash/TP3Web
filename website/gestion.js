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

function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

function addEvent(addButton, shoe, shoeID){
    addButton.addEventListener("click", function(){
        const fetchUrl="http://localhost:8080/ords/resttp/shoes/"+shoeID;
        fetch(fetchUrl)
            .then(response=>response.json())
            .then(fetchedShoe =>{
                fetchedShoe.stock++;
                fetch(fetchUrl, {
                    method: 'PUT',
                    headers:{
                        'Content-Type' : 'application/json',
                    },
                    body: JSON.stringify(fetchedShoe),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Succes: ', data);
                    let p = document.getElementById(`stock-${shoe.shoe_id}`);
                    p.innerHTML = `Size: ${data.size}, Stock: ${data.stock}, Price: ${data.price}`;
                })
                .catch((error)=> {
                    console.error('Error: ', error);
                });
            })
            .catch((error)=> {
                console.error('Error: ', error);
            });
    });
}
function removeEvent(addButton, shoe, shoeID){
    addButton.addEventListener("click", function(){
        const fetchUrl="http://localhost:8080/ords/resttp/shoes/"+shoeID;
        fetch(fetchUrl)
            .then(response=>response.json())
            .then(fetchedShoe =>{
                if(fetchedShoe.stock>0){
                fetchedShoe.stock--;
                } else {
                    console.log("No shoes left");
                    window.confirm("Aucune paire restante!");
                }
                fetch(fetchUrl, {
                    method: 'PUT',
                    headers:{
                        'Content-Type' : 'application/json',
                    },
                    body: JSON.stringify(fetchedShoe),
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Succes: ', data);
                    let p = document.getElementById(`stock-${shoe.shoe_id}`);
                    p.innerHTML = `Size: ${data.size}, Stock: ${data.stock}, Price: ${data.price}`;
                })
                .catch((error)=> {
                    console.error('Error: ', error);
                });
            })
            .catch((error)=> {
                console.error('Error: ', error);
            });
    });
}
const shoeUrl = "http://localhost:8080/ords/resttp/shoes";
const gestionDiv = document.getElementById("top");
fetch(shoeUrl)
    .then((resp) => resp.json())
    .then(function (data) {
        let shoes = data.items;
        return shoes.map(function (shoe) {
            let div = createNode("div"),
                h2 = createNode("h2"),
                p = createNode("p"),
                addButton = createNode("button"),
                removeButton = createNode("button");
                addButton.innerText="+";
                removeButton.innerText="-";
            addEvent(addButton, shoe, shoe.shoe_id);
            removeEvent(removeButton, shoe, shoe.shoe_id);
            let genderDeclaration;
            if (shoe.gender==0){
                genderDeclaration = "Women's"
            } else {
                genderDeclaration = "Men's"
            }
            h2.innerHTML = `${shoe.name} `+genderDeclaration;
            p.innerHTML = `Size: ${shoe.size}, Stock: ${shoe.stock}, Price: ${shoe.price}`;
            p.id = `stock-${shoe.shoe_id}`;
            append(div, h2);
            append(div, p);
            append(div, addButton);
            append(div, removeButton);
            append(gestionDiv, div);
        });
    })
    .catch(function (error) {
        console.log(JSON.stringify(error));
    });
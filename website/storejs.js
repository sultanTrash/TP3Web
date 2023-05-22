function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

function attachEvent(button, shoe, shoeIDString, quantityInput){
    button.addEventListener("click",function() {
        let quantity = parseInt(quantityInput.value);
        if (shoe.stock > 0){
            updateStock(shoe, shoeIDString, quantity);
        }
    });
}

const storeDiv = document.getElementById("store");
const toggleChaussure = document.getElementById("toggleChaussures");
let isStoreVisible = false;
storeDiv.style.display = "none";
const url = "http://localhost:8080/ords/resttp/shoes"; 
fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
        let shoes = data.items;
        return shoes.map(function (shoe) {
            let div = createNode("div"),
                h2 = createNode("h2"),
                p = createNode("p"),
                buyButton = createNode("button");
                quantityInput = createNode("input");
            
            quantityInput.type = "number";
            quantityInput.min = 1;
            quantityInput.max = shoe.stock;
            quantityInput.value = 1;
            buyButton.innerText = "Ajouter";
            attachEvent(buyButton, shoe, shoe.shoe_id, quantityInput);

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
            append(div, quantityInput);
            append(div, buyButton);
            append(storeDiv, div);
        });
    })
    .catch(function (error) {
        console.log(JSON.stringify(error));
    });

function updateStock(shoe, shoeIDString, quantity){
    const updateUrl="http://localhost:8080/ords/resttp/shoes/"+shoeIDString;
    fetch(updateUrl)
        .then(response=>response.json())
        .then(shoe =>{
            shoe.stock -= quantity;
            console.log(quantity + " chaussures " + shoeIDString + " ont ete ajoutee");
            fetch(updateUrl, {
                method: 'PUT',
                headers:{
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(shoe),
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
        .catch((error)=>{
            console.error('Error: ', error);
        });
}

toggleChaussure.addEventListener("click", function() {
    if (isStoreVisible) {
        // hide the store
        storeDiv.style.display = "none";
        toggleChaussure.innerText = "Afficher chaussures";
    } else {
        // show the store
        storeDiv.style.display = "block";
        toggleChaussure.innerText = "Masquer chaussures";
    }
    isStoreVisible = !isStoreVisible;
});

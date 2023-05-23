function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

let order_id = new Date().getTime();
createOrder(order_id);
console.log(order_id);
let totalCost = 0;

function attachEvent(button, shoe, shoeIDString, quantityInput){
    button.addEventListener("click",function() {
        let quantity = parseInt(quantityInput.value);
        const fetchUrl="http://localhost:8080/ords/resttp/shoes/"+shoeIDString;
        fetch(fetchUrl)
            .then(response=>response.json())
            .then(fetchedShoe =>{
                if (fetchedShoe.stock >= quantity){
                    updateStock(fetchedShoe, shoeIDString, quantity);
                    let order_items_id = new Date().getTime();
                    let order_itemjs = {
                        order_items_id: order_items_id.toString(),
                        quantity: quantity,
                        orders_order_id: order_id.toString(),
                        shoes_shoe_id: shoeIDString.toString()
                    };
                    createOrderItem(order_itemjs, fetchedShoe);
                }
                else {
                    console.log("Not enough stock.");
                    window.confirm("Pas assez de stock");
                }
            })
            .catch((error)=> {
                console.error('Error: ', error);
            });
    });
}


function createOrderItem(order_itemjs, shoe){
    const orderUrl = "http://localhost:8080/ords/resttp/order_items/";
    fetch(orderUrl, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
        },  
        body: JSON.stringify(order_itemjs),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Order Item Created: ', data);
        let orderItemDiv = createNode('div'),
        h2 = createNode('h2'),
        p = createNode('p'),
        quantityTemp=0-data.quantity,
        deleteButton = createNode('button');
        deleteButton.innerText = "Enlever de la commande";
        h2.innerHTML = `${shoe.name} - Quantite: ${data.quantity}`;
        p.innerHTML = "ID de la sous-commande: "+data.order_items_id+ "     taille: "+shoe.size+" sexe: "+shoe.gender;
        append(orderItemDiv, h2);
        append(orderItemDiv, p);
        append(orderItemDiv, deleteButton);
        append(orderItemsDiv, orderItemDiv);
        deleteButton.addEventListener("click", function(){
            const deleteUrl = orderUrl + data.order_items_id;
            fetch(deleteUrl, {
                method: 'DELETE'
            })
            .then(response => response.json())
            .then(data => {
                console.log('Order Item Deleted: ', data);
                orderItemDiv.remove(); // Remove the item from the display
                // Restock the shoe
                updateStock(shoe, shoe.shoe_id, quantityTemp);
            })
            .catch((error) => {
                console.error('Error: ', error);
            });
        });
    })
    .catch((error)=> {
        console.error('Error: ',error);
    });
}

function createOrder(order_id){
    let orderjs = {
        order_id: order_id,
        date: new Date().toISOString(),
        clients_client_id: null,
    };
    const creaUrl = "http://localhost:8080/ords/resttp/orders/";
    fetch(creaUrl, {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/json',
        },  
        body: JSON.stringify(orderjs),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Order Created: ', data);
        // here you can also update the UI to reflect the new order item
    })
    .catch((error)=> {
        console.error('Error: ',error);
    });
    
}


const storeDiv = document.getElementById("store");
const toggleChaussure = document.getElementById("toggleChaussures");
const commandeTitle = document.getElementById("commandeTitle");
const totalCostHtml = document.getElementById("totalCout");
let isStoreVisible = false;
storeDiv.style.display = "none";
const url = "http://localhost:8080/ords/resttp/shoes";
commandeTitle.innerHTML = "Commande ID: "+order_id;

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
            totalCost += quantity * shoe.price;
            totalCostHtml.innerHTML="Total "+totalCost.toFixed(2)+"$";
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

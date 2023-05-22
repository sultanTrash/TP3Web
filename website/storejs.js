function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

const storeDiv = document.getElementById("store");
const afwmDiv = document.getElementById("afwm");
const afwwDiv = document.getElementById("afww");
let afwmTotal=0;
let afwwTotal=0;
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
            buyButton.innerText = "Acheter un";
            buyButton.addEventListener("click",function() {
                if (shoe.stock>0){
                    updateStock(shoe, shoe.shoe_id);
                }
            });
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
            append(div, buyButton);
            append(storeDiv, div);
        });

    })
    .catch(function (error) {
        console.log(JSON.stringify(error));
    });
    function updateStock(shoe, shoeIDString){
        const updateUrl="http://localhost:8080/ords/resttp/shoes/"+shoeIDString;
        fetch(updateUrl)
        .then(response=>response.json())
        .then(shoe =>{
            shoe.stock-=1;
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
                p.innerHTML = `Size: ${shoe.size}, Stock: ${shoe.stock}, Price: ${shoe.price}`;
            })
            .catch((error)=> {
                console.error('Error: ',error);
            });
        })
        .catch((error)=>{
            console.error('Error: ',error);
        });
    }
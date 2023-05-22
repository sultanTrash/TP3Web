function createNode(element) {
    return document.createElement(element);
}

function append(parent, el) {
    return parent.appendChild(el);
}

const storeDiv = document.getElementById("store");
const url = "http://localhost:8080/ords/resttp/shoes"; 
fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
        let shoes = data.items;
        return shoes.map(function (shoe) {
            let div = createNode("div"),
                h2 = createNode("h2"),
                p = createNode("p");
            let genderDeclaration;
            if (shoe.gender==0){
                genderDeclaration = "Women's"
            } else {
                genderDeclaration = "Men's"
            }
            h2.innerHTML = `${shoe.name} `+genderDeclaration;
            p.innerHTML = `Size: ${shoe.size}, Stock: ${shoe.stock}, Price: ${shoe.price}`;
            append(div, h2);
            append(div, p);
            append(storeDiv, div);
        });
    })
    .catch(function (error) {
        console.log(JSON.stringify(error));
    });
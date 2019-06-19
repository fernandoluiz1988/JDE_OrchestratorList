///<reference path="../typings/globals/jquery/index.d.ts" />



const logo_site = document.getElementById('logo_site');
const logo = document.createElement('img');
logo.src = "images/logo_transparent.png";
logo_site.appendChild(logo);

const app = document.getElementById('root');
const container = document.createElement('div');
container.setAttribute('class', 'container');
app.appendChild(container);




function authenticateUser(user, password)
{
    var token = user + ":" + password;

    // Should i be encoding this value????? does it matter???
    // Base64 Encoding -> btoa
    var hash = btoa(token); 

    return "Basic " + hash;
}

function CallDiscover() {

    // New XMLHTTPRequest
    var request = new XMLHttpRequest();
    request.open("GET", "http://demo.steltix.com/jderest/v2/open-api-catalog", true);
    request.setRequestHeader("Authorization", authenticateUser(document.getElementById("user").value, document.getElementById("password").value));  
    request.onload = function() {
        //response.innerHTML = request.responseText;
        var data1 = JSON.parse(request.response);
        var data2 = (data1["tags"]);       


        data2.forEach(orch => {
            

            // Create a div with a card class
            const card = document.createElement('div');
            $(card).attr('class', 'card');

            // Create an h1 and set the text content to the film's title
            const h2 = document.createElement('h1');
            h2.textContent = orch.name;

            // Create a p and set the text content to the film's description
            const p = document.createElement('p');
            orch.description = orch.description.substring(0, 300); // Limit to 300 chars
            p.textContent = `${orch.description}...`; // End with an ellipses

            // Append the cards to the container element
            container.appendChild(card);

            // Each card will contain an h1 and a p
            card.appendChild(h2);
            card.appendChild(p);
            



          })
    }

    request.send();

    
    

}
    
    




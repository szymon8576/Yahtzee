//modal window
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("icon");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

function uuidv4(){  
  // @ts-ignore  
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>  
      // tslint:disable-next-line:no-bitwise  
      (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)  
  );
}

function checkCookie(name) {
  return document.cookie.split(';').some(cookie => {
      return cookie.trim().startsWith(name + '=');
  });
}

if (checkCookie('uuid')) {
  console.log('Cookie with UUID already exists');
} else {
  uuid = uuidv4();
  document.cookie = `uuid=${uuid}; expires=Thu, 01 Jan 2099 00:00:00 UTC; path=/`;
  console.log("Generated new UUID and saved it as a cookie.")
}

function getCookieValue(cookieName) {
  const name = cookieName + '=';
  const cookieArray = document.cookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) === ' ') {
          cookie = cookie.substring(1);
      }
      if (cookie.indexOf(name) === 0) {
          return cookie.substring(name.length, cookie.length);
      }
  }
  return '';
}


function createTable(){

    // Create a URL with the query parameter
    const url = `http://localhost:5000/game/create-table`;
    const requestData = {user_uuid: getCookieValue('uuid')}

    // Make a POST request using the fetch API
    fetch(url, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json', // Adjust the content type as needed
      },
      body: JSON.stringify(requestData), 
    })
      .then(response => response.json()) // Parse the response as JSON
      .then(data => {
          console.log('Response data:', data);
          document.getElementById("assigned-room-id").textContent = `Share this code with your friend: ${data["table_id"]}`
          document.cookie = `table_id=${data["table_id"]}; expires=Thu, 01 Jan 2099 00:00:00 UTC; path=/`;

      })
      .catch(error => {
          console.error('Error:', error);
      });
}



function joinTable(tableID){

  // Create a URL with the query parameter
  const url = `http://localhost:5000/game/join-table`;
  const requestData = {user_uuid: getCookieValue('uuid'), table_id: tableID}

  // Make a POST request using the fetch API
  fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json', // Adjust the content type as needed
    },
    body: JSON.stringify(requestData), 
  })
    .then(response => response.json()) // Parse the response as JSON
    .then(data => {
        console.log('Response data:', data);
        document.cookie = `table_id=${tableID}; expires=Thu, 01 Jan 2099 00:00:00 UTC; path=/`;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}



document.getElementById("create-table-button").onclick = createTable;
document.getElementById("join-table-button").onclick = function() {
    const tableId = document.getElementById("table-id").value;
    joinTable(tableId);
};





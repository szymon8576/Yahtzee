let backendURL = "https://yahtzee-backend.onrender.com"

function spinUpBackend(backendURL){
  fetch(`${backendURL}/game/health-check`)
    .then(response => {
      if (!response.ok) {
        console.log(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      console.log('Health Check Response:', data);
    })
    .catch(error => {
      console.log('Error:', error);
    });


    fetch("https://tfs-webapp.azurewebsites.net/v1/models/SpeechDigits/metadata", {method:"GET", mode: "no-cors"})
    // .then(response => {
    //   if (!response.ok) {
    //     console.log(`HTTP error! Status: ${response.statusText}`);
    //   }
    //   return response.text();
    // })
    // .then(data => {
    //   console.log('Health Check Response:', data);
    // })
    // .catch(error => {
    //   console.log('Error:', error);
    // });

}

spinUpBackend(backendURL);


//modal window
// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("icon");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

function uuidv4() {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    // tslint:disable-next-line:no-bitwise
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}

document.getElementById("spinning-wheel-main-page").style.display = 'none';
document.querySelector('.countdown').style.display='none';
let first_query = true;

function showWheel(){
    
    document.getElementById("spinning-wheel-main-page").style.display = 'block';

    if(first_query){

        const countdownElement = document.querySelector('.countdown');
        countdownElement.style.display='block';
        countdownElement.textContent = 30;

        const countdownInterval = setInterval(() => {
            countdownElement.textContent--;
    
            if (countdownElement.textContent <= 0) {
                countdownElement.textContent = 0;
                clearInterval(countdownInterval);
            }
        }, 1000);

      first_query = false;
    }
}

function hideWheel(){
    document.getElementById("spinning-wheel-main-page").style.display =  'none';
    document.querySelector('.countdown').style.display= "none";
}

function checkCookie(name) {
  return document.cookie.split(";").some((cookie) => {
    return cookie.trim().startsWith(name + "=");
  });
}

if (checkCookie("uuid")) {
  console.log("Cookie with UUID already exists");
} else {
  uuid = uuidv4();

  setCookie("uuid", uuid);
  console.log("Generated new UUID and saved it as a cookie.");
}

function getCookieValue(cookieName) {
  const name = cookieName + "=";
  const cookieArray = document.cookie.split(";");
  for (let i = 0; i < cookieArray.length; i++) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return "";
}

function createTable(bot = false) {
  console.log("creating table, bot=", bot);

  // Create a URL with the query parameter
  const url = `${backendURL}/game/create-table`;
  const requestData = { user_uuid: getCookieValue("uuid"), bot: bot };

  showWheel();

  // Make a POST request using the fetch API
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Adjust the content type as needed
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {

      hideWheel();

      if (!response.ok) {
        if (response.status === 403) {
          return response.json().then((errorData) => {
            console.log(response.json());
            throw new Error(errorData.message);
          });
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response data:", data);
      setCookie("table_id", data["table_id"]);
      setCookie("user_position", "1");
      if (bot) setCookie("game_mode", "bot");
      else setCookie("game_mode", "multiplayer");
      window.location.href = "table.html";
      // window.location.replace("/js/table.html");
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(error);
    });
}

function setCookie(fieldname, value, expirationHours = 1) {
  var expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + expirationHours);
  var formattedExpiration = expirationDate.toUTCString();
  document.cookie = `${fieldname}=${value}; expires=${formattedExpiration}; path=/`;
}

function joinTable(tableID) {
  if (tableID == "") return;

  // Create a URL with the query parameter
  const url = `${backendURL}/game/join-table`;
  const requestData = { user_uuid: getCookieValue("uuid"), table_id: tableID };

  showWheel();

  // Make a POST request using the fetch API
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Adjust the content type as needed
    },
    body: JSON.stringify(requestData),
  })
    .then((response) => {
      hideWheel();
      if (!response.ok) {
        if (response.status === 403) {
          return response.json().then((errorData) => {
            throw new Error(errorData.message);
          });
        } else {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      }
      return response.json();
    })
    .then((data) => {
      console.log("Response data:", data);
      setCookie("table_id", tableID);
      setCookie("user_position", "2");
      setCookie("game_mode", "multiplayer");
      window.location.href = "table.html";
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(error.message);
    });
}

document.getElementById("bot-button").onclick = function () {
  createTable(true);
};

document.getElementById("create-table-button").onclick = function () {
  createTable(false);
};

document.getElementById("join-table-button").onclick = function () {
  const tableId = document.getElementById("table-id").value;
  joinTable(tableId);
};

function validateNumberInput(input) {
  var errorMessage = document.getElementById("errorMessage");
  console.log(input.value, isNaN(input.value));

  if (input.value == "") {
    document.getElementById("join-table-button").disabled = true;
  } else if (isNaN(input.value)) {
    errorMessage.textContent = "ID should contain only digits";
    document.getElementById("join-table-button").disabled = true;
  } else {
    errorMessage.textContent = "";
    document.getElementById("join-table-button").disabled = false;
  }
}

let lastTableInfoPlaceholder = document.getElementById("last-room-info");

if (checkCookie("table_id") && checkCookie("user_position")) {
  lastTableInfoPlaceholder.innerHTML = `Looks like you have been in room ${getCookieValue(
    "table_id"
  )} recently. If you wish, you can <a href="./table.html"> resume this game.</a>`;
}

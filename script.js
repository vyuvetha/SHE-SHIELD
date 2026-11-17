
// =====================================
// 1. GET CURRENT LOCATION
// =====================================

function getLocation() {
    const result = document.getElementById("result");

    if (!navigator.geolocation) {
        result.innerText = "Location is not supported.";
        return;
    }

    result.innerText = "Getting your location...";

    navigator.geolocation.getCurrentPosition(
        function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            result.innerHTML =
                "Your Location:<br>" +
                "Latitude: " + lat + "<br>" +
                "Longitude: " + lon +
                '<br><a target="_blank" rel="noopener" href="https://www.google.com/maps?q=' +
                lat + "," + lon +
                '">Open in Google Maps</a>';
        },
        function() {
            result.innerText =
                "Unable to get location. Please allow location permission.";
        }
    );
}


// =====================================
// 2. EMERGENCY CONTACT STORAGE
// =====================================

let contacts = JSON.parse(
    localStorage.getItem("sheShieldContacts") || "[]"
);


// =====================================
// 3. DISPLAY CONTACTS
// =====================================

function displayContacts() {
    const list = document.getElementById("contactList");

    if (!list) return;

    list.innerHTML = "";

    contacts.forEach((contact, index) => {
        list.innerHTML += `
            <div class="contact-item">
                <strong>${escapeHTML(contact.name)}</strong>
                <p>${escapeHTML(contact.number)}</p>
                <button onclick="deleteContact(${index})">
                    Delete
                </button>
            </div>
        `;
    });
}


// =====================================
// 4. HTML SECURITY
// =====================================

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}


// =====================================
// 5. ADD EMERGENCY CONTACT
// =====================================

function addContact() {
    const name = document.getElementById("contactName").value.trim();
    const number = document.getElementById("contactNumber").value.trim();

    if (!name || !/^\+?[0-9]{10,15}$/.test(number)) {
        alert("Enter a valid name and mobile number.");
        return;
    }

    contacts.push({ name, number });

    localStorage.setItem(
        "sheShieldContacts",
        JSON.stringify(contacts)
    );

    document.getElementById("contactName").value = "";
    document.getElementById("contactNumber").value = "";

    displayContacts();

    alert("Emergency contact added successfully!");
}


// =====================================
// 6. SOS EMERGENCY WHATSAPP MESSAGE
// =====================================


// =====================================
// 6. SOS EMERGENCY WHATSAPP MESSAGE
// =====================================

function sendSOS() {

    if (contacts.length === 0) {
        alert("Please add an emergency contact first.");
        return;
    }

    const contactNames = contacts.map((contact, index) =>
        (index + 1) + ". " + contact.name
    ).join("\n");

    const choice = prompt(
        "Choose Emergency Contact:\n" + contactNames
    );

    if (choice === null) return;

    const index = Number(choice) - 1;

    if (
        !Number.isInteger(index) ||
        index < 0 ||
        index >= contacts.length
    ) {
        alert("Invalid contact selection.");
        return;
    }

    const contact = contacts[index];

    if (!navigator.geolocation) {
        alert("Location is not supported.");
        return;
    }

    alert("Getting your current location...");

    navigator.geolocation.getCurrentPosition(

        function(position) {

            const lat = position.coords.latitude;
            const lon = position.coords.longitude;

            let phone = contact.number.replace(/\D/g, "");

            if (phone.length === 10) {
                phone = "91" + phone;
            }

            if (phone.length !== 12 || !phone.startsWith("91")) {
                alert("Enter a valid Indian mobile number.");
                return;
            }

            const mapLink =
                "https://www.google.com/maps?q=" + lat + "," + lon;

            const message =
                "🚨 EMERGENCY ALERT! 🚨\n\n" +
                "I need help. Please contact me immediately.\n\n" +
                "My Current Location:\n" +
                mapLink;

            const whatsappURL =
                "https://api.whatsapp.com/send?phone=" +
                phone +
                "&text=" +
                encodeURIComponent(message);

            window.location.href = whatsappURL;

        },

        function(error) {
            alert(
                "Unable to get location. Please allow location permission."
            );
        },

        {
            enableHighAccuracy: true,
            timeout: 15000
        }
    );
}



// =====================================
// 7. DELETE EMERGENCY CONTACT
// =====================================

function deleteContact(index) {

    contacts.splice(index, 1);

    localStorage.setItem(
        "sheShieldContacts",
        JSON.stringify(contacts)
    );

    displayContacts();
}


// =====================================
// 8. EMERGENCY CALL
// =====================================

function makeCall() {
    window.location.href = "tel:112";
}


// =====================================
// 9. LOAD SAVED CONTACTS
// =====================================

displayContacts();

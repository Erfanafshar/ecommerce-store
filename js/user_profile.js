// #####################  part 0 -> auth ######################
let auth_token = sessionStorage.getItem('token');
let auth_button = document.getElementById("auth_button");
let unauth_button = document.getElementById("unauth_button");
if (auth_token != null) {
    console.log("auth found !");
    auth_button.style.display = "block";
    unauth_button.style.display = "none";
} else {
    console.log("auth not found !");
    unauth_button.style.display = "block";
    auth_button.style.display = "none";
}

let signout_link = document.getElementById("signout_link");
signout_link.onclick = function () {
    sessionStorage.removeItem('token');
}

// #####################  part 1 -> change active tab by button  ######################

form1 = document.getElementById("form");
table2 = document.getElementById("table");

div1 = document.getElementById("page_title");
p2 = document.getElementById("welcome2");

profile = document.getElementById("profile1");
receipt = document.getElementById("receipt1");

// set profile page
profile.addEventListener("click",
    function () {
        form1.style.display = "block";
        table2.style.display = "none";

        div1.style.display = "flex";
        p2.style.display = "none";

        profile.id = "profile1";
        receipt.id = "receipt1";
    });

// set receipt page
receipt.addEventListener("click",
    function () {
        form1.style.display = "none";
        table2.style.display = "block";

        div1.style.display = "none";
        p2.style.display = "block";

        profile.id = "profile2";
        receipt.id = "receipt2";
    });

// #####################  part 2 -> form validation  ######################

// name validation
let user_name = document.getElementById("user_name_unval");
let name_hint = document.getElementById("name_hint");
user_name.addEventListener("keyup", check_name);

function check_name() {
    let name_text = user_name.value;

    if (name_text.length > 255) {
        name_hint.innerHTML = "طول اسم بیشتر از 255 می باشد";
        user_name.id = "user_name_unval";
    } else {
        name_hint.innerHTML = "";
        user_name.id = "user_name_val";
    }
}

// family validation
let user_family = document.getElementById("user_family_unval");
let family_hint = document.getElementById("family_hint");
user_family.addEventListener("keyup", check_family);

function check_family() {
    let family_text = user_family.value;

    if (family_text.length > 255) {
        family_hint.innerHTML = "طول فامیل بیشتر از 255 می باشد";
        user_family.id = "user_family_unval";
    } else {
        family_hint.innerHTML = "";
        user_family.id = "user_family_val";
    }
}

// password validation
let password = document.getElementById("password_unval");
let password_hint = document.getElementById("password_hint");
password.addEventListener("keyup", check_password);

function check_password() {
    let password_text = password.value;
    let numRegex = /.*[0-9].*/;
    let alphaRegex = /.*[a-z].*/;

    if (password_text.length === 0) {
        password_hint.innerHTML = "این فیلد اجباری است";
        password.id = "password_unval";
    } else if (password_text.length < 8) {
        password_hint.innerHTML = "طول پسورد کمتر از 8 می باشد";
        password.id = "password_unval";
    } else if (password_text.length > 255) {
        password_hint.innerHTML = "طول پسورد بیشتر از 255 می باشد";
        password.id = "password_unval";
    } else if (!(numRegex.test(password_text) && alphaRegex.test(password_text))) {
        password_hint.innerHTML = "پسورد باید شامل اعداد و حروف باشد";
        password.id = "password_unval";
    } else {
        password_hint.innerHTML = "";
        password.id = "password_val";
    }
}

// address validation
let address = document.getElementById("address_unval");
let address_hint = document.getElementById("address_hint");
address.addEventListener("keyup", check_address);

function check_address() {
    let address_text = address.value;

    if (address_text.length === 0) {
        address_hint.innerHTML = "این فیلد اجباری است";
        address.id = "address_unval";
    } else if (address_text.length > 1000) {
        address_hint.innerHTML = "طول آدرس بیشتر از 1000 می باشد";
        address.id = "address_unval";
    } else {
        address_hint.innerHTML = "";
        address.id = "address_val";
    }
}

// set visibility of error box
document.body.addEventListener("click", function () {
    let active_element_id = document.activeElement.id;
    if (active_element_id === "password_val" || active_element_id === "password_unval") {
        password_hint.style.display = "block";
    } else {
        password_hint.style.display = "none";
    }

    if (active_element_id === "user_name_val" || active_element_id === "user_name_unval") {
        name_hint.style.display = "block";
    } else {
        name_hint.style.display = "none";
    }

    if (active_element_id === "user_family_val" || active_element_id === "user_family_unval") {
        family_hint.style.display = "block";
    } else {
        family_hint.style.display = "none";
    }

    if (active_element_id === "address_val" || active_element_id === "address_unval") {
        address_hint.style.display = "block";
    } else {
        address_hint.style.display = "none";
    }
})

// #####################  part 3 -> modal creation  ######################

// name validation
function check_name_2() {
    let name_text = user_name.value;

    return !(name_text.length === 0 ||
        name_text.length > 255);
}

// family validation
function check_family_2() {
    let family_text = user_family.value;

    return !(family_text.length === 0 ||
        family_text.length > 255);
}


// password validation
function check_password_2() {
    let password_text = password.value;
    let numRegex = /.*[0-9].*/;
    let alphaRegex = /.*[a-z].*/;

    return !(password_text.length === 0 ||
        password_text.length < 8 ||
        password_text.length > 255 ||
        !(numRegex.test(password_text) && alphaRegex.test(password_text)));
}

// address validation
function check_address_2() {
    let address_text = address.value;

    return !(address_text.length === 0 ||
        address_text.length > 1000);
}

// modal creation
let modal = document.getElementById("myModal");
let btn = document.getElementById("submit_button");
let span = document.getElementsByClassName("close")[0];
let modal_text = document.getElementById("modal_text");

btn.onclick = function (event) {
    event.preventDefault();

    if (check_name_2() && check_family_2() &&
        check_password_2() && check_address_2()) {
        let req_type = "user_update";
        let req_body = {
            "name": user_name.value, "family": user_family.value,
            "password": password.value, "address": address.value
        };
        let xhr = send_request(req_type, req_body);

        xhr.onload = function () {
            let raw_response_text = this.responseText;
            let response_text = raw_response_text.replaceAll("'", '"');
            let response_json = JSON.parse(response_text);
            if (response_json.edit === "input") {
                modal_text.innerHTML = "ورودی نامناسب";
            } else if (response_json.edit === "valid") {
                modal_text.innerHTML = "ویرایش با موفقیت";
                get_dynamic_info();
            } else {
                modal_text.innerHTML = "ویرایش نا موفق";
            }
        }

    } else {
        modal_text.innerHTML = "ورودی نامناسب";
    }
    modal.style.display = "block";
}

// set modal visibility
span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
}

// #####################  part 4 -> server comm ######################

// send req to server
function send_request(req_type, req_body) {
    const http_method = 'POST';
    const server_path = 'main.py';
    let xhr = new XMLHttpRequest();
    xhr.open(http_method, server_path, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("req_type", req_type);
    xhr.setRequestHeader("Authorization", auth_token);
    xhr.send(JSON.stringify(req_body));
    return xhr;
}


// #####################  part 5 -> page startup ######################
let login_user_info;
get_dynamic_info();

function get_dynamic_info() {
    let req_type = "get_login_user_info";
    let req_body = {};
    let xhr = send_request(req_type, req_body);

    xhr.onload = function () {
        let raw_response_text = this.responseText;
        let response_text = raw_response_text.replaceAll("'", '"');
        login_user_info = JSON.parse(response_text);
        set_dynamic_info();
    }
}

function set_dynamic_info() {
    // set header info
    let welcome_1 = document.getElementById("welcome1");
    welcome_1.innerHTML = login_user_info.name + " عزیز، خوش آمدید |";
    let welcome_2 = document.getElementById("welcome2");
    welcome_2.innerHTML = login_user_info.name + " عزیز، خوش آمدید";
    let balance_text = document.getElementById("balance_text");
    let balance_value = parseInt(login_user_info.balance) / 1000;
    balance_text.innerHTML = "موجودی حساب شما: " + balance_value.toString() + "/000";

    // clear form input
    user_name.value = "";
    user_family.value = "";
    password.value = "";
    address.value = "";

    // set form info
    user_name.placeholder = login_user_info.name;
    user_family.placeholder = login_user_info.family;
    address.placeholder = login_user_info.address;

    // set receipts
    let table = document.getElementById("table");
    let num_rows = table.rows.length;
    if (num_rows === 2) {
        login_user_info.receipts.forEach(insert_row);
    }

    // set user name on button
    if (auth_token != null) {
        set_user_name();
    }
}

function set_user_name() {
    let req_type = "get_user_name";
    let req_body = {};
    let xhr = send_request(req_type, req_body);

    xhr.onload = function () {
        let raw_response_text = this.responseText;
        let response_text = raw_response_text.replaceAll("'", '"');
        let json_response = JSON.parse(response_text);
        // console.log(json_response.user_name);
        let user_name_button = document.getElementById("name_button");
        user_name_button.innerHTML = json_response.user_name;
    }
}


function insert_row(receipt, index) {
    let table = document.getElementById("table");
    let row = table.insertRow(index + 1);

    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);

    cell1.innerHTML = "SHOP" + receipt.buy_code.toString();
    cell2.innerHTML = receipt.merch_name;
    let buy_value = parseInt(receipt.buy_price) / 1000;
    cell3.innerHTML = buy_value + "/000" + " تومان ";
    cell4.innerHTML = receipt.address;
    cell5.innerHTML = receipt.status;
}


// #####################  part 6 -> other events ######################

// increase balance
let inc_button = document.getElementById("balance_increment");

inc_button.onclick = function () {
    let req_type = "increase_balance";
    let req_body = {};
    let xhr = send_request(req_type, req_body);

    xhr.onload = function () {
        let raw_response_text = this.responseText;
        let response_text = raw_response_text.replaceAll("'", '"');
        let response_json = JSON.parse(response_text);
        login_user_info.balance = response_json.balance;

        // set changes
        let balance_text = document.getElementById("balance_text");
        let balance_value = parseInt(login_user_info.balance) / 1000;
        balance_text.innerHTML = "موجودی حساب شما: " + balance_value.toString() + "/000";
    }
}
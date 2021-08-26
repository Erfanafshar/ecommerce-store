// #####################  part 0 -> auth ######################
// sessionStorage.removeItem('token');

// #####################  part 1 -> form validation  ######################

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

// email validation
let email = document.getElementById("email_unval");
let email_hint = document.getElementById("email_hint");
email.addEventListener("keyup", check_email);

function check_email() {
    let email_text = email.value;
    let regex_index = email_text.search("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])");

    if (email_text.length === 0) {
        email_hint.innerHTML = "این فیلد اجباری است";
        email.id = "email_unval";
    } else if (email_text.length > 255) {
        email_hint.innerHTML = "طول ایمیل بیشتر از 255 می باشد";
        email.id = "email_unval";
    } else if (regex_index === -1) {
        email_hint.innerHTML = "فرمت ایمیل نامعتبر است";
        email.id = "email_unval";
    } else if (regex_index === 0) {   // possible error -> white space
        email_hint.innerHTML = "";
        email.id = "email_val";
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

    if (address_text.length > 1000) {
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
    if (active_element_id === "email_val" || active_element_id === "email_unval") {
        email_hint.style.display = "block";
    } else {
        email_hint.style.display = "none";
    }

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

// #####################  part 2 -> modal creation  ######################

// name validation
function check_name_2() {
    let name_text = user_name.value;

    return !(name_text.length > 255);
}

// family validation
function check_family_2() {
    let family_text = user_family.value;

    return !(family_text.length > 255);
}

// email validation
function check_email_2() {
    let email_text = email.value;
    let regex_index = email_text.search("(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|\"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])*\")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\\])");

    return !(email_text.length === 0 ||
        email_text.length > 255 ||
        regex_index === -1);
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

    return !(address_text.length > 1000);
}

// modal creation
let modal = document.getElementById("myModal");
let btn = document.getElementById("submit_button");
let span = document.getElementsByClassName("close")[0];
// let email_pass_list = [
//   ["er@g.com", "12"],
//   ["afshar.erfan@gmail.com", "erf123123"]
// ];

let modal_text = document.getElementById("modal_text");
btn.onclick = function (event) {
    event.preventDefault();

    if (check_name_2() && check_family_2() &&
        check_email_2() && check_password_2() &&
        check_address_2()) {

        let req_type = "user_register";
        let send_str = {
            "name": user_name.value, "family": user_family.value,
            "email": email.value, "password": password.value, "address": address.value
        };
        let xhr = send_request(req_type, send_str);

        xhr.onload = function () {
            let raw_response_text = this.responseText;
            let response_text = raw_response_text.replaceAll("'", '"');
            let response_json = JSON.parse(response_text);
            if (response_json.registration === "input") {
                modal_text.innerHTML = "ورودی نامناسب";
            } else if (response_json.registration === "valid") {
                // go to login page
                window.location = "http://localhost:8080/html/login.html";
                modal_text.innerHTML = "ثبت نام با موفقیت";
            } else {
                modal_text.innerHTML = "ایمیل تکراری";
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

// #####################  part 3 -> server comm ######################

// send req to server
function send_request(req_type, req_body) {
    const http_method = 'POST';
    const server_path = 'main.py';
    let xhr = new XMLHttpRequest();
    xhr.open(http_method, server_path, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader("req_type", req_type);
    xhr.send(JSON.stringify(req_body));
    return xhr;
}
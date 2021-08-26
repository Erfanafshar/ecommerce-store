// #####################  part 0 -> auth ######################
let auth_token = sessionStorage.getItem('token');

if (auth_token != null) {
    console.log("auth found !");
    console.log(auth_token);
} else {
    console.log("auth not found !");
}

// #####################  part 1 -> change active tab by button  ######################

product_list_1 = document.getElementById("products_list_1");
cat_list_1 = document.getElementById("cat_list_1");
receipt_1 = document.getElementById("receipt_1");

product_list_2 = document.getElementById("products_list_2");
cat_list_2 = document.getElementById("cat_list_2");
receipt_2 = document.getElementById("receipt_2");

product_list_3 = document.getElementById("products_list_3");
cat_list_3 = document.getElementById("cat_list_3");
receipt_3 = document.getElementById("receipt_3");

page1 = document.getElementById("page_content_1");
page2 = document.getElementById("page_content_2");
page3 = document.getElementById("page_content_3");

function vis_p1() {
    page1.style.display = "block";
    page2.style.display = "none";
    page3.style.display = "none";
}

function vis_p2() {
    page1.style.display = "none";
    page2.style.display = "flex";
    page3.style.display = "none";
}

function vis_p3() {
    page1.style.display = "none";
    page2.style.display = "none";
    page3.style.display = "flex";
}

product_list_1.addEventListener("click", vis_p1);
cat_list_1.addEventListener("click", vis_p2);
receipt_1.addEventListener("click", vis_p3);

product_list_2.addEventListener("click", vis_p1);
cat_list_2.addEventListener("click", vis_p2);
receipt_2.addEventListener("click", vis_p3);

product_list_3.addEventListener("click", vis_p1);
cat_list_3.addEventListener("click", vis_p2);
receipt_3.addEventListener("click", vis_p3);

// #####################  part 2 -> server comm ######################

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


// #####################  part 3 -> page startup ######################
let all_info;
get_dynamic_info();

function get_dynamic_info() {
    let req_type = "get_all_info_1";
    let req_body = {};
    let xhr = send_request(req_type, req_body);

    xhr.onload = function () {
        let raw_response_text = this.responseText;
        let response_text = raw_response_text.replaceAll("'", '"');
        all_info = JSON.parse(response_text);
        console.log(all_info);
        set_dynamic_info();
    }
}

function set_dynamic_info() {
    // set receipts
    clear_receipt_table();
    all_info.receipt.forEach(insert_receipt_row);

    // set categories
    clear_category_table();
    all_info.category.forEach(insert_category_row);

    // set merchandises
    clear_merch_page();
    all_info.merchandise.forEach(insert_merch)

    // set user name on button and button links
    if (auth_token != null) {
        set_admin_button();
    } else {
        let unauth_button = document.getElementById("unauth_button");
        let admin_auth_button = document.getElementById("admin_auth_button");
        unauth_button.style.display = "block";
        admin_auth_button.style.display = "none";
    }
}

function set_admin_button() {
    let req_type = "get_user_admin";
    let req_body = {};
    let xhr = send_request(req_type, req_body);

    xhr.onload = function () {
        let raw_response_text = this.responseText;
        let response_text = raw_response_text.replaceAll("'", '"');
        let json_response = JSON.parse(response_text);
        // console.log(json_response.user_name);
        // set user button
        if (json_response.user_type === "admin") {
            let unauth_button = document.getElementById("unauth_button");
            let admin_auth_button = document.getElementById("admin_auth_button");
            unauth_button.style.display = "none";
            admin_auth_button.style.display = "block";

            let admin_signout_link = document.getElementById("admin_signout_link");
            admin_signout_link.onclick = function () {
                sessionStorage.removeItem('token');
            }
            set_user_name("admin");
        }

        // redirect user to main page
        if (json_response.user_type === "user") {
            window.location = "http://localhost:8080/index.html";
        }
    }
}


function set_user_name(user_type) {
    let req_type = "get_user_name";
    let req_body = {};
    let xhr = send_request(req_type, req_body);

    xhr.onload = function () {
        let raw_response_text = this.responseText;
        let response_text = raw_response_text.replaceAll("'", '"');
        let json_response = JSON.parse(response_text);
        // console.log(json_response.user_name);

        let admin_name_button = document.getElementById("admin_name_button");
        admin_name_button.innerHTML = json_response.user_name;
    }
}

// #####################  part 4 -> table manipulation ######################
// receipt
function clear_receipt_table() {
    let table = document.getElementById("receipt_table");
    for (let i = table.rows.length - 2; i > 0; i--) {
        table.deleteRow(i);
    }
}

function insert_receipt_row(receipt, index) {
    let table = document.getElementById("receipt_table");
    let row = table.insertRow(index + 1);

    let cell1 = row.insertCell(0);
    let cell2 = row.insertCell(1);
    let cell3 = row.insertCell(2);
    let cell4 = row.insertCell(3);
    let cell5 = row.insertCell(4);
    let cell6 = row.insertCell(5);

    cell1.innerHTML = "SHOP" + receipt.buy_code.toString();
    cell2.innerHTML = receipt.merch_name;
    let buy_value = parseInt(receipt.buy_price) / 1000;
    cell3.innerHTML = buy_value + "/000" + " تومان ";
    cell4.innerHTML = receipt.user_name;
    cell5.innerHTML = receipt.address;
    cell6.innerHTML = receipt.status;
}

// category
function clear_category_table() {
    let table = document.getElementById("category_table");
    for (let i = table.rows.length - 2; i > 0; i--) {
        table.deleteRow(i);
    }
}

let selected_category_name = "";

function insert_category_row(category, index) {
    let table = document.getElementById("category_table");
    if (category.name !== "دسته بندی نشده") {
        let row = table.insertRow(index);

        let cell1 = row.insertCell(0);
        cell1.innerHTML = category.name;

        let cell2 = row.insertCell(1);

        let edit_button = document.createElement('input');
        edit_button.type = "button";
        edit_button.className = "edit";
        edit_button.value = "ویرایش دسته بندی";
        edit_button.onclick = function (event) {
            event.preventDefault();
            selected_category_name = category.name;
            open_modal("edit_category");
        }
        cell2.appendChild(edit_button);

        let delete_button = document.createElement('input');
        delete_button.type = "button";
        delete_button.className = "delete";
        delete_button.value = "Xحذف دسته بندی";
        delete_button.onclick = function () {
            selected_category_name = category.name;
            delete_category();
        }
        cell2.appendChild(delete_button);
    }
}

// merchandise
function clear_merch_page() {
    let container_div = document.getElementById("merchs_container");
    while (container_div.hasChildNodes()) {
        container_div.removeChild(container_div.firstChild);
    }
}

function insert_merch(merch) {
    let container_div = document.getElementById("merchs_container");
    let merch_div = create_merch_div(merch.id, merch.name, merch.category, merch.price, merch.num_available);
    container_div.appendChild(merch_div);
}

let selected_merch_id = "";

function create_merch_div(id, name, category, price, num_available) {
    // declare
    let new_div = document.createElement("div");
    let p1 = document.createElement("p");
    let img = document.createElement("img");
    let p2 = document.createElement("p");
    let p3 = document.createElement("p");
    let hr = document.createElement("hr");
    let div = document.createElement("div");
    let button = document.createElement("button");
    let p4 = document.createElement("p");

    // set input
    p1.innerText = num_available;
    img.src = "../img/clock.png";
    img.alt = "clock image";
    p2.innerText = name;
    p3.innerText = category;

    button.innerHTML = "ویرایش محصول";
    button.onclick = function (event) {
        event.preventDefault();
        selected_merch_id = id;
        open_modal("edit_merch");
    }
    let price_value = parseInt(price) / 1000;
    p4.innerText = price_value + ".000" + " تومان ";

    // set class
    p1.classList.add("product_count");
    p2.classList.add("product_name");
    p3.classList.add("product_category");

    div.classList.add("product_bottom");
    button.classList.add("button_buy");
    p4.classList.add("product_price");

    // add to div
    div.appendChild(button);
    div.appendChild(p4);

    new_div.appendChild(p1);
    new_div.appendChild(img);
    new_div.appendChild(p2);
    new_div.appendChild(p3);
    new_div.appendChild(hr);
    new_div.appendChild(div);

    return new_div;
}


// #####################  part 5 -> other events ######################

// search receipt
let search_receipt = document.getElementById("code_search");
search_receipt.addEventListener("keyup", function (event) {
    event.preventDefault();

    let table = document.getElementById("receipt_table");
    for (const row of table.rows) {
        let row_text = row.cells[0].innerHTML;
        if (row_text.startsWith(search_receipt.value)
            || row_text === "") {
            row.style.display = "table-row";
        } else {
            if (row_text !== "کد پیگیری") {
                row.style.display = "none";
            }
        }
    }
});

// delete category
function delete_category() {
    let req_type = "delete_category";
    let req_body = {
        "name": selected_category_name
    };
    let xhr = send_request(req_type, req_body);
    xhr.onload = function () {
        let raw_response_text = this.responseText;
        let response_text = raw_response_text.replaceAll("'", '"');
        let response_json = JSON.parse(response_text);
        // console.log(response_json);
        get_dynamic_info();
    }
}

// insert category
// open modal
let category_insert_button = document.getElementById("insert_button_cat");
category_insert_button.onclick = function (event) {
    event.preventDefault();
    open_modal("insert_category");
}

// add button listener
let category_text_box = document.getElementById("category_text_box");
category_text_box.addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        modal_cat.style.display = "none";
        let xhr = "";
        if (category_label.innerHTML === "نام جدید") {
            let req_type = "edit_category";
            let req_body = {
                "previous_name": selected_category_name,
                "new_name": category_text_box.value
            };
            xhr = send_request(req_type, req_body);
        }
        if (category_label.innerHTML === "نام دسته بندی") {
            let req_type = "insert_category";
            let req_body = {
                "name": category_text_box.value
            };
            xhr = send_request(req_type, req_body);
        }

        category_text_box.value = "";

        xhr.onload = function () {
            let raw_response_text = this.responseText;
            let response_text = raw_response_text.replaceAll("'", '"');
            let response_json = JSON.parse(response_text);
            // console.log(response_json);
            get_dynamic_info();
        }
    }
});

// insert merch
// open modal
let merch_insert_button = document.getElementById("insert_button_merch");
merch_insert_button.onclick = function (event) {
    event.preventDefault();
    open_modal("insert_merch");
}

// add button listener
let modal_merch_name = document.getElementById("merch_name");
let modal_merch_category = document.getElementById("merch_category");
let modal_merch_price = document.getElementById("merch_price");
let modal_merch_num = document.getElementById("merch_num");

let modal_merch_insert_button = document.getElementById("modal_merch_insert_1");
let modal_merch_update_button = document.getElementById("modal_merch_update_2");
let modal_merch_delete_button = document.getElementById("modal_merch_delete_2");

modal_merch_insert_button.addEventListener("click", function (event) {
    event.preventDefault();
    modal_merch.style.display = "none";
    let req_type = "insert_merchandise";
    let req_body = {
        "name": modal_merch_name.value,
        "category": modal_merch_category.value,
        "price": modal_merch_price.value,
        "num": modal_merch_num.value
    };
    let xhr = send_request(req_type, req_body);

    modal_merch_name.value = "";
    modal_merch_category.value = "";
    modal_merch_price.value = "";
    modal_merch_num.value = "";

    xhr.onload = function () {
        let raw_response_text = this.responseText;
        let response_text = raw_response_text.replaceAll("'", '"');
        let response_json = JSON.parse(response_text);
        // console.log(response_json);
        get_dynamic_info();
    }
});

modal_merch_update_button.addEventListener("click", function (event) {
    event.preventDefault();
    modal_merch.style.display = "none";
    let req_type = "update_merchandise";
    let req_body = {
        "id": selected_merch_id,
        "name": modal_merch_name.value,
        "category": modal_merch_category.value,
        "price": modal_merch_price.value,
        "num": modal_merch_num.value
    };

    let xhr = send_request(req_type, req_body);

    modal_merch_name.value = "";
    modal_merch_category.value = "";
    modal_merch_price.value = "";
    modal_merch_num.value = "";

    xhr.onload = function () {
        let raw_response_text = this.responseText;
        let response_text = raw_response_text.replaceAll("'", '"');
        let response_json = JSON.parse(response_text);
        // console.log(response_json);
        get_dynamic_info();
    }
});

modal_merch_delete_button.addEventListener("click", function (event) {
    event.preventDefault();
    modal_merch.style.display = "none";
    let req_type = "delete_merchandise";
    let req_body = {
        "id": selected_merch_id
    };

    let xhr = send_request(req_type, req_body);

    modal_merch_name.value = "";
    modal_merch_category.value = "";
    modal_merch_price.value = "";
    modal_merch_num.value = "";

    xhr.onload = function () {
        let raw_response_text = this.responseText;
        let response_text = raw_response_text.replaceAll("'", '"');
        let response_json = JSON.parse(response_text);
        // console.log(response_json);
        get_dynamic_info();
    }
});


// #####################  part 6 -> modal ######################

let modal_cat = document.getElementById("category_modal");
let span_cat = document.getElementById("cat_span");
let category_label = document.getElementById("category_label");

let modal_merch = document.getElementById("merch_modal");
let span_merch = document.getElementById("merch_span");
let merch_title = document.getElementById("merch_title");

function open_modal(modal_type) {
    if (modal_type === "edit_category") {
        category_label.innerHTML = "نام جدید";
        modal_cat.style.display = "block";
    }
    if (modal_type === "insert_category") {
        category_label.innerHTML = "نام دسته بندی";
        modal_cat.style.display = "block";
    }
    if (modal_type === "edit_merch") {
        merch_title.innerText = "تغییر / حذف محصول";
        modal_merch_insert_button.id = "modal_merch_insert_2";
        modal_merch_update_button.id = "modal_merch_update_1";
        modal_merch_delete_button.id = "modal_merch_delete_1";
        modal_merch.style.display = "block";
    }
    if (modal_type === "insert_merch") {
        merch_title.innerText = "ایجاد محصول جدید";
        modal_merch_insert_button.id = "modal_merch_insert_1";
        modal_merch_update_button.id = "modal_merch_update_2";
        modal_merch_delete_button.id = "modal_merch_delete_2";
        modal_merch.style.display = "block";
    }
}


// set modal visibility
span_cat.onclick = function () {
    modal_cat.style.display = "none";
}

span_merch.onclick = function () {
    modal_merch.style.display = "none";
}

window.onclick = function (event) {
    if (event.target === modal_cat) {
        modal_cat.style.display = "none";
    }
    if (event.target === modal_merch) {
        modal_merch.style.display = "none";
    }
}

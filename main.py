# db
import math
import pymongo
import re

# server
from http.server import HTTPServer, SimpleHTTPRequestHandler
import json

# date
import jdatetime

db = "website database"
host_name = "localhost"
server_port = 8080

token_email_list = []


# login_user_email = "afshar.erfan@gmail.com"
# login_user_info = {}


# #####################  part 1 -> database connection ######################

def db_connect():
    global db
    client = pymongo.MongoClient("mongodb://localhost:27017/")
    db = client["store"]


# #####################  part 2 -> server running ######################

def server_run():
    web_server = HTTPServer((host_name, server_port), Server)
    print("Server started https://%s:%s" % (host_name, server_port))
    web_server.serve_forever()


class Server(SimpleHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        received_data = self.rfile.read(content_length)
        req_type = self.headers["req_type"]
        auth_token = self.headers["Authorization"]

        response_text = post_handler(req_type, received_data, auth_token)
        # print("log: ", login_user_info)
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        self.wfile.write(str(response_text).encode("utf-8"))


def post_handler(req_type, raw_info, auth_token):
    info = json.loads(raw_info.decode("utf-8"))
    # print("auth: ", auth_token)
    # if not check_info(info):
    #     print("malicious input")
    #     return {}

    if req_type == "get_all_info_1":
        val1, val2, val3 = get_merchandise_info(), get_category_info(), get_receipt_info()
        response_text = {
            "merchandise": val1,
            "category": val2,
            "receipt": val3
        }
        return response_text

    if req_type == "get_login_user_info":
        val1, val2 = get_user_info(auth_token), get_user_receipts(auth_token)
        response_text = val1
        del response_text["_id"]
        response_text["receipts"] = val2
        return response_text

    if req_type == "user_login":
        val_1, val_2 = input_validation(info)
        if val_1 != "ok" or val_2 != "ok":
            response_text = {
                "email": val_1,
                "password": val_2
            }
            return response_text

        val_1, val_2 = check_user_login(info)
        response_text = {}

        if get_token_by_email(info["email"]) is None:
            create_new_token(info["email"])

        response_text["token"] = get_token_by_email(info["email"])

        if val_1:
            response_text["email"] = "valid"
            if val_2:
                response_text["password"] = "valid"
            else:
                response_text["password"] = "invalid"
        else:
            response_text["email"] = "invalid"
            response_text["password"] = "invalid"
        return response_text

    if req_type == "user_register":
        val_1, val_2 = input_validation(info)
        if val_1 != "ok" or val_2 != "ok":
            response_text = {
                "registration": "input"
            }
            return response_text

        val = db_insert_user(info)
        response_text = {}
        if val:
            response_text["registration"] = "valid"
        else:
            response_text["registration"] = "invalid"
        return response_text

    if req_type == "user_update":
        val_1, val_2 = input_validation(info)
        if val_1 != "ok" or val_2 != "ok":
            response_text = {
                "edit": "input"
            }
            return response_text

        val = db_update_user(info, auth_token)
        response_text = {}
        if val:
            response_text["edit"] = "valid"
        else:
            response_text["edit"] = "invalid"
        return response_text

    if req_type == "increase_balance":
        val = increase_balance(auth_token)
        response_text = {"balance": val}
        return response_text

    if req_type == "edit_category":
        val = db_update_category(info)
        response_text = {}
        if val:
            response_text["edit"] = "valid"
        else:
            response_text["edit"] = "invalid"
        return response_text

    if req_type == "delete_category":
        val = db_delete_category(info)
        response_text = {}
        if val:
            response_text["delete"] = "valid"
        else:
            response_text["delete"] = "invalid"
        return response_text

    if req_type == "insert_category":
        val = db_insert_category(info)
        response_text = {}
        if val:
            response_text["insert"] = "valid"
        else:
            response_text["insert"] = "invalid"
        return response_text

    if req_type == "insert_merchandise":
        val = db_insert_merchandise(info)
        response_text = {}
        if val:
            response_text["insert"] = "valid"
        else:
            response_text["insert"] = "invalid"
        return response_text

    if req_type == "update_merchandise":
        val = db_update_merchandise(info)
        response_text = {}
        if val:
            response_text["update"] = "valid"
        else:
            response_text["update"] = "invalid"
        return response_text

    if req_type == "delete_merchandise":
        val = db_delete_merchandise(info)
        response_text = {}
        if val:
            response_text["delete"] = "valid"
        else:
            response_text["delete"] = "invalid"
        return response_text

    if req_type == "buy":
        val = buy(info, auth_token)
        response_text = {}
        if val == 0:
            response_text["status"] = "valid"
        else:
            response_text["status"] = "invalid"
            if val == 1:
                response_text["error"] = "available"
            elif val == 2:
                response_text["error"] = "balance"
        return response_text

    if req_type == "get_category_info":
        val = get_category_info()
        response_text = {
            "category": val
        }
        return response_text

    if req_type == "get_merchandise_info":
        print(info)
        val1, val2 = get_merchandise_info_2(info)
        response_text = {
            "merchandise": val1,
            "num_pages": val2
        }
        return response_text

    if req_type == "get_user_name":
        val = get_user_name(auth_token)
        response_text = {
            "user_name": val
        }
        return response_text

    if req_type == "get_user_admin":
        val = check_user_admin(auth_token)
        response_text = {}
        if val == 1:
            response_text["user_type"] = "admin"
        elif val == 0:
            response_text["user_type"] = "user"
        else:
            print("error ! user email not found")
        return response_text


# #####################  part 3 -> db information retrieval functions ######################

def check_user_login(info):
    email, password = info["email"], info["password"]
    # user login
    collection_1 = db["user"]
    query_1 = {"email": email}
    doc_1 = collection_1.find(query_1)
    for item in doc_1:
        if item["password"] == password:
            print("correct email & password")
            return True, True
        else:
            print("wrong password")
            return True, False

    # admin login
    collection_2 = db["admin"]
    query_2 = {"email": email}
    doc_2 = collection_2.find(query_2)
    for item in doc_2:
        if item["password"] == password:
            print("correct email & password (admin)")
            return True, True
        else:
            print("wrong password (admin)")
            return True, False

    print("wrong email")
    return False, False


def db_insert_user(info):
    name, family, email, password, address, balance = \
        info["name"], info["family"], info["email"], info["password"], info["address"], 0
    collection = db["user"]
    query = {"email": email}
    if collection.count(query):
        print("user already exist")
        return False
    else:
        dictionary = {"name": name, "family": family, "email": email, "password": password,
                      "address": address, "balance": int(balance)}
        collection.insert_one(dictionary)
        print("new user inserted")
        return True


def db_update_user(info, auth_token):
    name, family, email, password, address, balance = info["name"], info["family"], get_email_by_token(auth_token), \
                                                      info["password"], info["address"], \
                                                      get_login_user_info(auth_token)["balance"]

    collection = db["user"]
    query = {"email": email}
    new_values = {
        "$set": {"name": name, "family": family, "password": password, "address": address, "balance": balance}}
    collection.update_one(query, new_values)
    # get_user_info()  # update user info -> should not used !!
    return True


def increase_balance(auth_token):
    collection = db["user"]
    query = {"email": get_email_by_token(auth_token)}
    docs = collection.find(query)
    new_dict = None
    for info in docs:
        new_dict = info
    new_dict["balance"] += 10000

    new_values = {"$set": new_dict}
    collection.update_one(query, new_values)

    # login_user_info["balance"] = new_dict["balance"]  # update user info
    # print("new balance: ", new_dict["balance"])
    return new_dict["balance"]


def get_user_info(auth_token):
    # global login_user_info
    collection = db["user"]
    query = {"email": get_email_by_token(auth_token)}
    docs = collection.find(query)
    # login_user_info = docs[0]  # update user info
    # del login_user_info["_id"]  # update user info
    return docs[0]  # possible error !


def get_user_receipts(auth_token):
    collection = db["receipt"]
    query = {"user_email": get_email_by_token(auth_token)}
    docs = collection.find(query).sort("buy_code", -1)
    receipts = []
    for receipt in docs:
        del receipt["_id"]
        receipts.append(receipt)
    return receipts


def get_merchandise_info():
    collection = db["merchandise"]
    docs = collection.find()
    merchandises = []
    for merchandise in docs:
        del merchandise["_id"]
        merchandises.append(merchandise)
    return merchandises


def get_category_info():
    collection = db["category"]
    docs = collection.find()
    categories = []
    for category in docs:
        del category["_id"]
        categories.append(category)
    return categories


def get_receipt_info():
    collection = db["receipt"]
    docs = collection.find().sort("buy_code", -1)
    receipts = []
    for receipt in docs:
        del receipt["_id"]
        receipts.append(receipt)
    return receipts


def db_update_category(info):
    last_value, new_value = info["previous_name"], info["new_name"]
    db_update_merchandise_category(last_value, new_value)

    collection = db["category"]
    query = {"name": last_value}
    new_values = {"$set": {"name": new_value}}
    collection.update_one(query, new_values)
    return True


def db_delete_category(info):
    db_update_merchandise_category(info["name"], "دسته بندی نشده")
    collection = db["category"]
    collection.delete_one(info)
    return True


def db_insert_category(info):
    collection = db["category"]
    collection.insert_one(info)
    return True


def db_update_merchandise_category(last_value, new_value):
    collection = db["merchandise"]
    query = {"category": last_value}
    new_values = {"$set": {"category": new_value}}
    collection.update_many(query, new_values)  # obvious error -> update all not one !


def db_insert_merchandise(info):
    name, category, price, num = info["name"], info["category"], info["price"], info["num"]

    # find new id
    collection_var = db["variable"]
    query_tmp = {"name": "merch_num"}
    new_id = collection_var.find(query_tmp, {"_id": 0, "name": 0})[0]["num"] + 1

    # update number of merchs variable
    new_values = {"$set": {"num": new_id}}
    collection_var.update_one(query_tmp, new_values)

    # category validation
    category = category_validation(category)

    # insert merch
    collection = db["merchandise"]
    dictionary = {"id": new_id, "name": name, "category": category, "price": price,
                  "num_available": num, "num_sold": 0}
    collection.insert_one(dictionary)
    return True


def db_update_merchandise(info):
    m_id, name, category, price, num_available = \
        info["id"], info["name"], info["category"], info["price"], info["num"]

    # category validation
    category = category_validation(category)

    collection = db["merchandise"]
    query = {"id": int(m_id)}
    doc = collection.find(query)
    num_sold = doc[0]["num_sold"]

    new_values = {
        "$set": {"name": name, "category": category, "price": int(price),
                 "num_available": int(num_available), "num_sold": num_sold}}
    collection.update_one(query, new_values)
    return True


def db_delete_merchandise(info):
    collection = db["merchandise"]
    collection.delete_one(info)
    return True


def buy(info, auth_token):
    merch_id, buy_num, email = info["merch_id"], info["buy_num"], get_email_by_token(auth_token)

    # check merch availability
    collection_1 = db["merchandise"]
    query_1 = {"id": int(merch_id)}
    docs_1 = collection_1.find(query_1)
    price = 0
    dict_1 = None
    for merch in docs_1:
        dict_1 = merch
        price = int(buy_num) * merch["price"]  # for later use
        if merch["num_available"] < int(buy_num):
            print("not enough merchandise")
            return 1
    if dict_1 is None:
        print("wrong merch id")
        return -1

    # check user balance
    collection_2 = db["user"]
    query_2 = {"email": email}
    docs_2 = collection_2.find(query_2)
    dict_2 = None
    for user in docs_2:
        dict_2 = user
        if user["balance"] < price:
            print("not enough balance")
            return 2
    if dict_2 is None:
        print("wrong user email")
        return -1

    # perform buy
    dict_1["num_available"] -= int(buy_num)
    dict_1["num_sold"] += int(buy_num)
    new_values_1 = {"$set": dict_1}
    collection_1.update_one(query_1, new_values_1)

    dict_2["balance"] -= price
    new_values_2 = {"$set": dict_2}
    collection_2.update_one(query_2, new_values_2)

    db_insert_receipt(dict_1, dict_2, buy_num, price)

    print("successful buy")
    return 0


def get_merchandise_info_2(info):
    # special case: search by name
    name = info["name"]
    if name != "":
        collection = db["merchandise"]
        cur_regex = name
        print("cur: ", cur_regex)
        # query = {"name": cur_regex}
        query = {"name": {"$regex": cur_regex}}
        docs = collection.find(query)

        # calc merchs
        merchandises = []
        for merchandise in docs:
            del merchandise["_id"]
            merchandises.append(merchandise)

        return merchandises, 1

    # extract info
    product_per_page = info["product_per_page"]
    current_page_number = info["current_page_number"]
    sort_by = info["sort_by"]
    sort_dir = info["sort_dir"]
    category = info["category"]

    begin = (current_page_number - 1) * product_per_page

    # query
    collection = db["merchandise"]
    if len(category) == 0:
        query = {}
    else:
        query = {"category": {"$in": category}}

    docs = collection.find(query)

    if sort_by == "price":
        if sort_dir == "ascending":
            sorted_docs = docs.sort("price", 1)
        if sort_dir == "descending":
            sorted_docs = docs.sort("price", -1)

    if sort_by == "sell":
        if sort_dir == "ascending":
            sorted_docs = docs.sort("num_sold", 1)
        if sort_dir == "descending":
            sorted_docs = docs.sort("num_sold", -1)

    if sort_by == "creation":
        if sort_dir == "ascending":
            sorted_docs = docs.sort("id", 1)
        if sort_dir == "descending":
            sorted_docs = docs.sort("id", -1)

    limited_sorted_docs = sorted_docs.skip(begin).limit(product_per_page)

    # calc page num
    num_all = docs.count()
    num_pages = math.ceil(num_all / product_per_page)

    # calc merchs
    merchandises = []
    for merchandise in limited_sorted_docs:
        del merchandise["_id"]
        merchandises.append(merchandise)

    return merchandises, num_pages


def get_user_name(auth_token):
    user_name = get_login_user_info(auth_token)["name"]
    return user_name


# ## other functions


def category_validation(category_name):
    # category validation
    collection_cat = db["category"]
    cat_list = collection_cat.find({}, {"_id": 0})
    found = False
    for cat in cat_list:
        if cat["name"] == category_name:
            found = True
            break
    if not found:
        category_name = "دسته بندی نشده"
    return category_name


def db_insert_receipt(merch_info, user_info, buy_num, price):
    # find new code
    collection_var = db["variable"]
    query_tmp = {"name": "receipt_num"}
    new_code = collection_var.find(query_tmp, {"_id": 0, "name": 0})[0]["num"] + 1

    # update number of receipts
    new_values = {"$set": {"num": new_code}}
    collection_var.update_one(query_tmp, new_values)

    date = jdatetime.date.today()

    collection = db["receipt"]

    dictionary = {"merch_id": merch_info["id"], "merch_name": merch_info["name"], "buy_num": buy_num,
                  "user_name": user_info["name"], "user_family": user_info["family"],
                  "user_email": user_info["email"], "address": user_info["address"],
                  "buy_price": price, "buy_date": str(date), "buy_code": new_code, "status": "در حال انجام"}
    collection.insert_one(dictionary)


# check for malicious input
def check_info(info):
    for inp in info:
        if type(info[inp]) != str and type(info[inp]) != int and type(info[inp]) != float:
            return False
    return True


def create_new_token(user_email):
    new_token = user_email[0:5]  # real token creation required
    token_email_list.append((new_token, user_email))


def get_email_by_token(token):
    for tok, em in token_email_list:
        if tok == token:
            return em
    return None


def get_token_by_email(email):
    for tok, em in token_email_list:
        if em == email:
            return tok
    return None


def get_login_user_info(auth_token):
    # user
    collection_1 = db["user"]
    query_1 = {"email": get_email_by_token(auth_token)}
    docs_1 = collection_1.find(query_1)
    for dc_1 in docs_1:
        login_user_info = dc_1  # update user info
        del login_user_info["_id"]  # update user info
        return login_user_info

    # admin
    collection_2 = db["admin"]
    query_2 = {"email": get_email_by_token(auth_token)}
    docs_2 = collection_2.find(query_2)
    for dc_2 in docs_2:
        admin_info = dc_2  # update user info
        del admin_info["_id"]  # update user info
        return admin_info
    return None


def check_user_admin(auth_token):
    # print("1")
    # print(token_email_list)
    # print(auth_token)
    # print(get_email_by_token(auth_token))
    # print("2")
    # user
    collection_1 = db["user"]
    query_1 = {"email": get_email_by_token(auth_token)}
    docs_1 = collection_1.find(query_1)
    for dc_1 in docs_1:
        return 0

    # admin
    collection_2 = db["admin"]
    query_2 = {"email": get_email_by_token(auth_token)}
    docs_2 = collection_2.find(query_2)
    for dc_2 in docs_2:
        return 1
    return -1


def input_validation(info):
    if "email" in info:
        regex_email = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
        email = info["email"]
        if len(email) == 0:
            val1 = "length"
        elif not re.match(regex_email, email):
            val1 = "format"
        else:
            val1 = "ok"
    else:
        val1 = "ok"

    password = info["password"]
    regex_password_num = r'.*[a-z].*'
    regex_password_alph = r'.*[0-9].*'

    if len(password) < 8:
        val2 = "length"
    elif not re.match(regex_password_alph, password) or not re.match(regex_password_num, password):
        val2 = "format"
    else:
        val2 = "ok"
    return val1, val2


if __name__ == "__main__":
    db_connect()
    server_run()

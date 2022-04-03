import os
import pymongo
import json
import random
import hashlib
import time

import requests

from hashlib import sha256



def MageCall(param1):
    url = "https://api.mage.ai/v1/predict"

    payload = json.dumps({
    "api_key": "REDACTED",
    "features": [
        {
        "id": param1
        }
    ],
    "include_features": False,
    "model": "recommendations_rank_1646591694022",
    "version": "1"
    })
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text)
    
    js = json.loads(response.text)
    
    return js[0]['prediction']



def sendsms(tonum, message):


    url = "https://us-central1-aiot-fit-xlab.cloudfunctions.net/sendsms"

    payload = json.dumps({
    "receiver": tonum,
    "message": message,
    "token": "REDACTED"
    })
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    # print(response.text)

def hashthis(st):


    hash_object = hashlib.md5(st.encode())
    h = str(hash_object.hexdigest())
    return h



def dummy(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    if request.method == 'OPTIONS':
        # Allows GET requests from origin https://mydomain.com with
        # Authorization header
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': '*',
            'Access-Control-Max-Age': '3600',
            'Access-Control-Allow-Credentials': 'true'
        }
        return ('', 204, headers)

    # Set CORS headers for main requests
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': 'true'
    }

    request_json = request.get_json()



    receiver_public_key = os.environ.get('ownpublic')

    mongostr = os.environ.get('MONGOSTR')
    client = pymongo.MongoClient(mongostr)
    db = client["dropshop"]


    retjson = {}

    action = request_json['action']


    if action == "donate":
        tophone = request_json['phone']
        amount = float(request_json['amount'])

        col = db.users

        found = 0
        id = "0"
        for x in col.find():
            if x['phone'] == tophone:
                found = 1
                id = x['id']

            break
        if found == 0:
            retjson['status'] = "unknown number"

            return json.dumps(retjson)
        
        col.update_one({"id": id}, {"$inc":{"balance":amount}})

        retjson['status'] = "donation successful"

        return json.dumps(retjson)



    if action == "donate2request":
        torequest = request_json['requestid']
        amount = float(request_json['amount'])
        tophone = ""

        col = db.requests

        found = 0
        id = "0"
        for x in col.find():
            if x['id'] == torequest:
                found = 1
                id = x['id']
                tophone = x['phone']
                break
                
        if found == 0:
            retjson['status'] = "unknown"

            return json.dumps(retjson)
        amt = -1.0 * amount
        col.update_one({"id": id}, {"$inc":{"balance":amt}})
        col.update_one({"id": id}, {"$set":{"status":"donated"}})

        col = db.users

        found = 0
        id = "0"
        for x in col.find():
            if x['phone'] == tophone:
                found = 1
                id = x['id']

            break
        if found == 0:
            retjson['status'] = "unknown number"

            return json.dumps(retjson)
        
        col.update_one({"id": id}, {"$inc":{"balance":amount}})

        retjson['status'] = "donation successful"

        return json.dumps(retjson)





    if action == "getuseridfromphone":
        col = db.users

        for x in col.find():
            if x['phone'] == request_json['phone']:
                retjson['status'] = "found"
                retjson['name'] = x['name']
                retjson['id'] = x['id']
                retjson['balance'] = x['balance']

                return json.dumps(retjson)

        retjson['status'] = "unknown"
        retjson['name'] = "none"
        retjson['id'] = "-1"
        retjson['balance'] = 0

        return json.dumps(retjson)

    if action == "getstatus":
        col = db.status

        for x in col.find():
            if x['userid'] == request_json['userid']:
                retjson['status'] = x['status']


                return json.dumps(retjson)
        
        return json.dumps(retjson)



    if action == "getmnemonic":
        col = db.users

        for x in col.find():
            if x['id'] == request_json['userid']:

                retjson['mnemonic'] = x['mnemonic']
                # retjson['weeklymiles'] = x['weekly']

                return json.dumps(retjson)
        
        return json.dumps(retjson)


    if action == "magecall":
        param1 = request_json['userid']

        resp = MageCall(int(param1))

        retjson['restaurantids'] = resp

        return json.dumps(retjson)



    if action == "addmarker":
        
        maxid = 1
        col = db.markers
        for x in col.find():
            id = x["id"]
            maxid +=1
        id = str(maxid+1)

        payload = {}

        uid = id 
        payload["id"] = id
        # payload["uid"] = request_json['uid']
        # payload["name"] = request_json['name']
        payload["type"] = request_json['type']
        payload["userid"] = request_json['userid']
        payload["description"] = request_json['description']
        payload["timestamp"] = request_json['timestamp']
        payload["lat"] = request_json['latlng']['latitude']
        payload["lng"] = request_json['latlng']['longitude']
        

        
        result=col.insert_one(payload)

        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "successfully added"
        retjson['markerid'] = id

        return json.dumps(retjson)





    if action == "getallrequests":
        col = db.requests

        data = []

        for x in col.find():
            ami = {}
            latlng = {}
            ami["id"] = x["id"]
            ami["name"] = x["name"]
            ami["amount"] = x["amount"]
            ami["details"] = x["details"]
            ami["phone"] = x["phone"]
            ami["imageurl"] = x["imageurl"]
            ami["timestamp"] = x["timestamp"]
            ami['balance'] = x['balance']
            ami['status'] = x['status']
            latlng["latitude"] = x["lat"]
            latlng["longitide"] = x["lng"]
            
            ami["latlng"] = latlng
            
            data.append(ami)

        retjson['requests'] = data

        return json.dumps(retjson)



    if action == "getallusers":
        col = db.users

        data = []

        for x in col.find():
            ami = {}
            
            ami["id"] = x["id"]
            ami["name"] = x["name"]
            
            ami["details"] = x["details"]
            ami["phone"] = x["phone"]
            ami["imageurl"] = x["imageurl"]
            ami['balance'] = x['balance']

            
            data.append(ami)

        retjson['users'] = data

        return json.dumps(retjson)



    if action == "getallitems":
        col = db.items

        data = []

        for x in col.find():
            ami = {}
            
            ami["id"] = x["id"]
            ami["name"] = x["name"]
            
            ami["image"] = x["image"]
            ami["price"] = x["price"]
            ami["shopid"] = x["shopid"]

            
            data.append(ami)

        retjson['items'] = data

        return json.dumps(retjson)




    if action == "getallmarkers":
        col = db.markers

        data = []

        for x in col.find():
            ami = {}
            latlng = {}
            ami["id"] = x["id"]
            ami["userid"] = x["userid"]
            ami["type"] = x["type"]
            ami["description"] = x["description"]
            ami["timestamp"] = x["timestamp"]
            latlng["latitude"] = x["lat"]
            latlng["longitide"] = x["lng"]
            
            ami["latlng"] = latlng
            
            data.append(ami)

        retjson['markers'] = data

        return json.dumps(retjson)






    if action == "keygen":
        
        pair = Keypair.random()
        # print(f"Secret: {pair.secret}")
        # Secret: none
        # print(f"Public Key: {pair.public_key}")
        retjson['status'] = "generated"                
        retjson['secret'] = pair.secret
        retjson['public'] = pair.public_key
        

        return json.dumps(retjson)

    if action == "payment":
        
        amount = request_json['amount']
        ksecret = request_json['secret']
        
        kp = Keypair.from_secret(ksecret)

        server = Server(horizon_url="https://horizon-testnet.stellar.org")

        # Transactions require a valid sequence number that is specific to this account.
        # We can fetch the current sequence number for the source account from Horizon.
        source_account = server.load_account(kp.public_key)

        base_fee = server.fetch_base_fee()
        # we are going to submit the transaction to the test network,
        # so network_passphrase is `Network.TESTNET_NETWORK_PASSPHRASE`,
        # if you want to submit to the public network, please use `Network.PUBLIC_NETWORK_PASSPHRASE`.
        lamount = request_json['amount']
        transaction = (
            TransactionBuilder(
                source_account=source_account,
                network_passphrase=Network.TESTNET_NETWORK_PASSPHRASE,
                base_fee=base_fee,
            )
            .add_text_memo("the way is NeuroWay!")  # Add a memo
            # Add a payment operation to the transaction
            # Send 350.1234567 XLM to receiver
            # Specify 350.1234567 lumens. Lumens are divisible to seven digits past the decimal.
            .append_payment_op(receiver_public_key, lamount, "XLM")
            .set_timeout(30)  # Make this transaction valid for the next 30 seconds only
            .build()
        )

        transaction.sign(kp)

        response = server.submit_transaction(transaction)

        retjson['status'] = response                
        # retjson['secret'] = pair.secret
        # retjson['public'] = pair.public_key
        

        return json.dumps(retjson)






    if action == "getbalance":
        
        public_key = request_json['publickey']

        server = Server("https://horizon-testnet.stellar.org")
        # public_key = "GD4NB2FLQAN5JO7PKPGZJMNBDYQXVSNVC7DEIZMOL5WSNSBLEBUTEF5Q"

        account = server.accounts().account_id(public_key).call()
        balances = []
        for balance in account['balances']:
            x = f"Type: {balance['asset_type']}, Balance: {balance['balance']}"
            balances.append(x)
            # print(f"Type: {balance['asset_type']}, Balance: {balance['balance']}")

        retjson['balances'] = balances                
        retjson['public'] = public_key
        

        return json.dumps(retjson)

    



    if action == "getuserdata":
        col = db.users
        for x in col.find():
            if int(x['id']) == int(request_json['userid']):
                name = x['name']

                address = x['address']


                retjson = {}

                # retjson['dish'] = userid
                retjson['status'] = "success"
                retjson['name'] = name
                retjson['address'] = address                
                retjson['email'] = x['email']
                retjson['phone'] = x['phone']
                retjson['kk'] = x['kk']
                retjson['publickey'] = x['publickey']
                

                return json.dumps(retjson)
        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "fail"
        retjson['id'] = "-1"

        return json.dumps(retjson)


    if action == "updateuserdata":
        col = db.users
        for x in col.find():
            if int(x['id']) == int(request_json['id']):
                if 'name' in request_json:
                    col.update_one({"id": x['id']}, {"$set":{"name":request_json['name']}})
                if 'gender' in request_json:
                    col.update_one({"id": x['id']}, {"$set":{"gender":request_json['gender']}})
                if 'type' in request_json:
                    col.update_one({"id": x['id']}, {"$set":{"type":request_json['type']}})
                    
                # status = x['status']
                # diet = x['diet']
                # allergy = x['allergy']

                retjson = {}

                # retjson['dish'] = userid
                retjson['responsestatus'] = "success"
                # retjson['status'] = status
                # retjson['diet'] = diet
                # retjson['allergy'] = allergy
                

                return json.dumps(retjson)
        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "fail"
        retjson['id'] = "-1"

        return json.dumps(retjson)




    if action == "registerrestaurant" :
        maxid = 1
        col = db.restaurants
        for x in col.find():
            id = x["id"]
            maxid +=1
        id = str(maxid+1)

        payload = {}

        uid = id 
        payload["id"] = id
        # payload["uid"] = request_json['uid']
        # payload["name"] = request_json['name']
        payload["name"] = request_json['name']
        payload["address"] = request_json['address']
        payload["pubkey"] = request_json['pubkey']

        payload["password"] = request_json['password']
        
        result=col.insert_one(payload)

        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "successfully added"
        retjson['id'] = id

        return json.dumps(retjson)





    if action == "register" :
        maxid = 1
        col = db.users
        for x in col.find():
            id = x["id"]
            maxid +=1
        id = str(maxid+1)

        payload = {}

        uid = id 
        payload["id"] = id
        # payload["uid"] = request_json['uid']
        # payload["name"] = request_json['name']
        payload["name"] = request_json['name']
        payload["email"] = request_json['email']
        payload["phone"] = request_json['phone']

        payload['address'] = request_json['address']

        payload["password"] = request_json['password']

        # if "age" in request_json:
        #     payload["age"] = request_json['age']
        # else:
        #     payload["age"] = "-1"
        # if "gender" in request_json:
        #     payload["gender"] = request_json['gender']
        # else:
        #     payload["gender"] = "great things happen after 2am"
        
        payload["kk"] = request_json['kk']
        payload["publickey"] = request_json['publickey']
        
        result=col.insert_one(payload)

        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "successfully added"
        retjson['userid'] = id

        return json.dumps(retjson)


    if action == "login":
        col = db.users
        for x in col.find():
            if x['email'] == request_json['email'] and x['password'] == request_json['password']:
                userid = x['id']
                name = x['name']
                retjson = {}

                # retjson['dish'] = userid
                retjson['status'] = "success"
                retjson['name'] = name
                retjson['userid'] = userid
                

                return json.dumps(retjson)
        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "fail"
        retjson['userid'] = "-1"

        return json.dumps(retjson)




    if action == "loginrest":
        col = db.restaurants
        for x in col.find():
            if x['pubkey'] == request_json['pubkey'] and x['password'] == request_json['password']:
                restid = x['id']
                name = x['name']
                retjson = {}

                # retjson['dish'] = userid
                retjson['status'] = "success"
                retjson['name'] = name
                retjson['restid'] = restid
                

                return json.dumps(retjson)
        retjson = {}

        # retjson['dish'] = userid
        retjson['status'] = "fail"
        retjson['restid'] = "-1"

        return json.dumps(retjson)







    if action == "route":
        lat1 = request_json['start']['latitude']
        lng1 = request_json['start']['longitude']
        lat2 = request_json['end']['latitude']
        lng2 = request_json['end']['longitude']

        wp = getroute(lat1,lng1,lat2,lng2)

        retjson = {}
         # retjson['dish'] = userid
        retjson['status'] = "fail"
        retjson['route'] = wp

        return json.dumps(retjson)
        


    if action == "routecache":
        lat1 = request_json['start']['latitude']
        lng1 = request_json['start']['longitude']
        lat2 = request_json['end']['latitude']
        lng2 = request_json['end']['longitude']

        # wp = getroute(lat1,lng1,lat2,lng2)

        wp = "[]"

        for x in col.find():
            wp = x['route']

        retjson = {}
         # retjson['dish'] = userid
        retjson['status'] = "fail"
        retjson['route'] = wp

        return json.dumps(retjson)
 

    retstr = "action not done"

    if request.args and 'message' in request.args:
        return request.args.get('message')
    elif request_json and 'message' in request_json:
        return request_json['message']
    else:
        return retstr

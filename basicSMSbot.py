from flask import Flask, request, redirect, Response
from twilio.twiml.messaging_response import MessagingResponse
# import tns
# import dataloader
from twilio.rest import Client 
import requests
import json
import pymongo
import time
from flask_cors import CORS
import gcptextsentiment

def initdb():
    
    # mongostr = "redacted"
    mongostr = "redacted"
    client = pymongo.MongoClient(mongostr)
    db = client["dropshop"]

    return client, db


# def initdb2():
    
#     mongostr = "redacted"
#     client = pymongo.MongoClient(mongostr)
#     db = client["sentimentizer"]

#     return client, db



incomingstate = 0
incomingnum = ""
doctorname = "Dr Victor Von Doom"
patientname = "Reed Richards"
aptdate = "02/01/2022"
apttime = "16:20"

answers = []
qid = "-1"
userid = "-1"

onum = 0

oitems = ""



def sendwhatsapp(text, tonum, fromnum):
    
    account_sid = 'redacted' 
    auth_token = 'redacted' 
    client = Client(account_sid, auth_token) 
    
    message = client.messages.create( 
                                # from_='whatsapp:+14155238886',  
                                from_=fromnum,
                                # body='Your Twilio code is 1238432',
                                # body='Your Yummy Cupcakes Company order of 1 dozen frosted cupcakes has shipped and should be delivered on July 10, 2019. Details: http://www.yummycupcakes.com/',  
                                # body='Your appointment is coming up on July 21 at 3PM',    
                                body=text,
                                # to='whatsapp:+13218775974' 
                                to=tonum
                            ) 
    
    print(message.sid)










def getorder(id):
    url = "https://us-central1-aiot-fit-xlab.cloudfunctions.net/dropshop"

    payload = json.dumps({
    "action": "getorder",
    "surveyid": id
    })
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text)
    
    js = json.loads(response.text)
    
    return js['questions']


def getuserfromphone(phone):
    
    global userid

    url = "https://us-central1-aiot-fit-xlab.cloudfunctions.net/dropshop"

    payload = json.dumps({
    "action": "getuseridfromphone",
    "phone": phone
    })
    headers = {
    'Content-Type': 'application/json'
    }

    response = requests.request("POST", url, headers=headers, data=payload)

    print(response.text)
    
    js = json.loads(response.text)
    
    if js['status'] == "found":
        name = js['name']
        points = js['balance']
        userid = js['id']
        
        return name, points

    
    userid = "-1"
    
    return "unknown", -1





app = Flask(__name__)
CORS(app)

def setcreds(nc):
    global cred
    cred = nc

    return "success"

@app.route("/assemblyAI", methods=['POST'])
def sentimentize():
    
    client, db = initdb2()
    
    
    rj = request.get_json()
    
    aurl = rj['audiourl']
    userid = rj['userid']
    


    endpoint = "https://api.assemblyai.com/v2/transcript"

    jsonin = {
        "audio_url": aurl
    # "audio_url": "https://storage.googleapis.com/hackybucket/recording2.wav"
    }

    headers = {
        "authorization": "redacted",
        "content-type": "application/json"
    }

    response = requests.post(endpoint, json=jsonin, headers=headers)

    print(response.json())
    tid = response.json()['id']


    endpoint = "https://api.assemblyai.com/v2/transcript/" + tid

    headers = {
        "authorization": "redacted",
    }

    response = requests.get(endpoint, headers=headers)

    print(response.json())

    status = response.json()['status']

    while status != "completed":
        response = requests.get(endpoint, headers=headers)

        status = response.json()['status']
        time.sleep(3)

    text = response.json()['text']

    print("done.. the result is ")
    print (text)

    results = gcptextsentiment.sample_analyze_sentiment(text)
    print("text sentiment analysis gives us... ")
    print (results)
    
    
    js = {}
    js['status'] = 'done'
    js['sentiment'] = results['docsentimentscore']
    js['magnitude'] = results['doccsentimentmagnitude']
    js['text'] = text
    
    col = db.sentences
    
    maxid = 1
    for x in col.find():
        maxid +=1
    
    id = str(maxid)
    
    payload = {}
    payload['id'] = id
    payload['text'] = text
    payload['sentiment'] = results['docsentimentscore']
    payload['magnitude'] = results['doccsentimentmagnitude']
    payload['userid'] = userid
    
    col.insert_one(payload)


    resp = Response(js, status=200, mimetype='application/json')

    print ("****************************")
    print (resp)

    return js

# def syncappdata():
#     global doctorname, patientname, aptdate, apttime
    
#     doctorname, patientname, aptdate, apttime = dataloader.getRRXdata()

@app.route("/smsbase", methods=['POST'])
def sms_reply():
    """Respond to incoming calls with a simple text message."""

    global incomingstate, incomingnum, survey, answers, qid, surveyid, userid
    global cred
    global oitems
    global onum
    # global doctorname, patientname, aptdate, apttime
    
    client, db = initdb()
    
    print(request.values['From'])
    
    incomingnum = request.values['From']
    
    incomingnum2 = incomingnum.replace('+', '')
    
    print (incomingnum)
    
    # n, p = getuserfromphone(incomingnum)
    n = "friend"
    p = 1
    

    incoming = request.values['Body']
    
    incoming = incoming.lower()

    print("incoming text is " + incoming)


    # Start our TwiML response
    resp = MessagingResponse()

    flag = 0
    outstring = "Unfortunately dropshop did not understand the following message ..." + incoming
    
    
    if "register" in incoming:
        if 'MediaUrl0' not in request.values:
                outstring= "Hello! Welcome to dropshop!  Please register with the following format.. register <name> <password/pin> <details> please include a selfie as an attachment" 
                resp.message(outstring)

                return str(resp)
            
        murl = request.values['MediaUrl0']
        if 'image'  in request.values['MediaContentType0']:
            print ("image detected!")
            
            label = "person"
            ##retrieve the model prediction 
            
            words = incoming.split()
            print (words)
            
            if words[0] != "register":
                outstring= "Hello! Welcome to dropshop!  Please register with the following format.. register <name> <password/pin> <details> please include a selfie as an attachment" 
                resp.message(outstring)

                return str(resp)
            
            if len(words) <= 3:
                outstring= "Hello! Welcome to dropshop!  Please register with the following format.. register <name> <password/pin> <details> please include a selfie as an attachment" 
                resp.message(outstring)

                return str(resp)
            
            
            col = db.users
            
            maxid = 1
            
            for x in col.find():
                maxid+=1
            
            id = maxid
            
            payload = {}
            
            payload['id'] = str(id)
            payload['name'] = words[1]
            payload['pass'] = words[2]
            
            details = ""
            
            for w in words:
                if words[1] == w or words[2] == w:
                    continue
                if "register" in w or w == "register":
                    continue
                
                details = details + " " + w
            payload['details'] = details
            payload['imageurl'] = murl
            payload['balance'] = 0
            payload['phone'] = incomingnum
            
            col.insert_one(payload)    
            
            
            
            resp.message("registration successful! your userid is  " + str(id))

            return str(resp)
            
        print (murl)
        print (request.values['MediaContentType0'])
    
    
    if "balance" in incoming:
        n, p = getuserfromphone(incomingnum)
        
        resp.message("hello there " + n +  ". your balance is "+ str(p))

        return str(resp)

    if "request" in incoming:

        if 'MediaUrl0' not in request.values:
                outstring= "Hello! Welcome to dropshop!  Please add a request with the following format.. request <yourname> <password/pin> <amount> <details> please include an image as an attachment" 
                resp.message(outstring)

                return str(resp)
            
        murl = request.values['MediaUrl0']
        if 'image'  in request.values['MediaContentType0']:
            print ("image detected!")
            
            label = "person"
            ##retrieve the model prediction 
            
            words = incoming.split()
            print (words)
            
            if words[0] != "request":
                outstring= "Hello! Welcome to dropshop!  Please add a request with the following format.. request <yourname> <password/pin> <amount> <details> please include an image as an attachment" 
                resp.message(outstring)

                return str(resp)
            
            if len(words) <= 3:
                outstring= "Hello! Welcome to dropshop!  Please add a request with the following format.. request <yourname> <password/pin> <amount> <details> please include an image as an attachment" 
                resp.message(outstring)

                return str(resp)
            
            
            col = db.users
            userid = "-1"
            
            for x in col.find():
                if x['name'] == words[1] and x['pass'] == words[2]:
                    print("user found")
                    userid =  x['id']
                    break
            
            if userid == "-1":
                outstring= "Hello! Welcome to dropshop!  Please add a request with the following format.. request <yourname> <password/pin> <amount> <details> please include an image as an attachment. Err 4 invalid ID" 
                resp.message(outstring)

                return str(resp)
            
             
            col = db.requests
            
            maxid = 1
            
            for x in col.find():
                maxid+=1
            
            id = maxid
            
            payload = {}
            
            payload['id'] = str(id)
            payload['name'] = words[1]
            payload['amount'] = words[3]
            
            details = ""
            # 50.511409592011084, 30.62187653816344
            lat ="50.511409592011084"
            lng = "30.62187653816344"
            
            for w in words:
                if words[1] == w or words[2] == w:
                    continue
                if words[3] == w:
                    continue
                if "request" in w or w == "request":
                    continue
                
                details = details + " " + w
                
                if "lat" in w:
                    lat = w.replace("lat","")
                
                if "long" in w:
                    lng = w.replace("long","")
                
                
            payload['details'] = details
            payload['imageurl'] = murl
            payload['balance'] = float(words[3])
            payload['phone'] = incomingnum
            payload['status'] = "unfilled"
            payload['lat'] = lat
            payload['lng'] = lng
            
            ts = str(int(time.time()))
            
            payload['timestamp'] = ts
            
            col.insert_one(payload)    
            
            
            
            resp.message("request successful! your request id is  " + str(id))

            return str(resp)
            
        print (murl)
        print (request.values['MediaContentType0'])



        
    
    if "order" in incoming and incomingstate == 0:
        oitems = incoming[incoming.find('order'):]
        print (oitems)
        oitems = oitems.replace("order", "")
        incomingstate = 1
    

    if incomingstate == 0:
        if 'hello' in incoming:
            if p > -1:
                outstring= "Hello " + n + "! Welcome to dropshop!  Please put respond with order followed by item  to start making an order. For example, order burger. Options are on the menu, like burger, fries, combo, drink, pizza, chicken tenders etc." 
                flag = 1
                incomingstate = 1
                resp.message(outstring)

                return str(resp)
            
            outstring= "Hello! Welcome to dropshop!  sorry, the shop is closed right now, please come back later!!" 
            flag = 1
            incomingstate = 0
            resp.message(outstring)

            return str(resp)
        
            
        
    if incomingstate == 1:
        
        if 'order' in incoming:
            
      
            

            
            outstring= "Hi "+ n + ", you have now ordered  " +oitems + " Please respond with yes if you want special instructions or no to order as is. Remember if you ordered a drink say yes, otherwise the default drink is a Coke. Please respond with yes and your modification or no to confirm"
           
            incomingstate = 2
            resp.message(outstring)

            return str(resp)
    
    
    if incomingstate == 2:
        
        modifiers = ""
        
        if "yes" in incoming:
            
            modifiers = incoming.replace("yes", "")
            
            outstring= "Hi "+ n + ", Thank you for confirming! Your order is " + oitems + " with following modifiers " + modifiers + " and your order number is " + str(onum)
            incomingstate = 0
            oitems = ""
            resp.message(outstring)
            onum +=1
            return str(resp)
            
            
        else:
            outstring= "Hi "+ n + ", Thank you for confirming! Your order is " + oitems  + " with no modifiers and your order number is " + str(onum)
            incomingstate = 0
            oitems = ""
            resp.message(outstring)
            onum +=1

            return str(resp)


    # Add a message
    if flag ==0:
        outstring = "Unfortunately dropshop did not understand the following message ..." + incoming
    
    resp.message(outstring)

    return str(resp)

if __name__ == "__main__":
    app.run(debug=True, host = 'localhost', port = 8004)
    # app.run(debug=True, host = '45.79.199.42', port = 8004)

var twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

const fetch = require('node-fetch');
const date = require('date-and-time');

module.exports = async function (context, myTimer) {
    var timeStamp = new Date().toISOString();
    
    if (myTimer.isPastDue)
    {
        context.log('JavaScript is running late!');
    }
    let notification = await determineRetrograde()
    client.messages
      .create({body: notification, from: '+12182749957', to: '+13477822660'})
      .then(message => console.log(message.sid));
};

async function determineRetrograde(){
    let resp;
    let currentdate = new Date()
    console.log("date1:"+date);
    console.log("date1 formated"+date.format(currentdate, 'YYYY/MM/DD'))
    resp = await fetch("https://mercuryretrogradeapi.com?date="+date.format(currentdate, 'YYYY/MM/DD'), {
        method: 'GET'
    });
    var rgtoday = await resp.json()
    console.log("rgtoday at first is="+rgtoday)
    rgtoday= rgtoday.is_retrograde
    
    currentdate.setDate(currentdate.getDate() - 1)
    console.log("date2:"+date);


    resp = await fetch("https://mercuryretrogradeapi.com?date="+date.format(currentdate, 'YYYY/MM/DD'), {
        method: 'GET'
    });
    var rgyesterday = await resp.json()
    rgyesterday= rgyesterday.is_retrograde

    currentdate.setDate(currentdate.getDate() + 2)
    console.log("date3:"+date);

    resp = await fetch("https://mercuryretrogradeapi.com?date="+date.format(currentdate, 'YYYY/MM/DD'), {
        method: 'GET'
    });
    var rgtomorrow = await resp.json()
    rgtomorrow= rgtomorrow.is_retrograde

    console.log("rgtoday "+rgtoday);
    console.log("rgyesterday "+rgyesterday);
    console.log("rgtomorrow "+rgtomorrow);
    if (!rgyesterday && rgtoday){
        text="Mercury has entered retrograde."
    }
    else if (rgtoday && !rgtomorrow){
        text="Mercury will leave retrograde tomorrow."
    }
    else if (!rgtoday && rgtomorrow){
        text="Mercury will enter retrograde tomorrow."
    }
    else{
        return
    }
    return text
}
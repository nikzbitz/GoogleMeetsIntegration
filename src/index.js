import dotenv from 'dotenv'

dotenv.config();


import express from 'express'
import {google} from 'googleapis'
//import { calendar } from 'googleapis/build/src/apis/calendar';
import dayjs from 'dayjs'

const calendar = google.calendar({
    version : "v3",
    auth: "AIzaSyCOvPMndMRwWMZ0R-KjLsDAaTfNQCQmEmc"
})
const app = express();

const PORT = process.env.NODE_ENV|| 8000;

const oauth2Client = new google.auth.OAuth2(
    "679631166926-th3k9t8jmgntqjleni8q1u18tddmj9kc.apps.googleusercontent.com",
    "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",
    "https://localhost:8000/google/redirect"
);


// generate a url that asks permissions for Blogger and Google Calendar scopes
const scopes = [
    'https://www.googleapis.com/auth/calendar'
];

app.get('/', (req, res) => {
    console.log("working!!!!!")
    res.send("working!!!!!");

})

app.get('/google', (req, res)  => {
    const url = oauth2Client.generateAuthUrl({
        // 'online' (default) or 'offline' (gets refresh_token)
        access_type: 'offline',

        // If you only need one scope you can pass it as a string
        scope: scopes
    });

    res.redirect(url)
})

app.get('/google/redirect', async (req,res) => {
     const {code}= req.query 
     const { tokens } =  await oauth2Client.getToken(code)
      oauth2Client.setCredentials(tokens);

    res.send({msg:"You have successfully logged in"});
})
   
app.get("/schedule_event", async (req,res) => {
    const result = await calendar.events.insert({
        calendarId: "primary",
         auth: oauth2Client, 
         conferenceDataVersion:1, 
        requestBody: {
            summary : "This is a test", 
            description :"Some important event",
            start : {
                dateTime  : dayjs(new Date()).add(1, 'day').toISOString(),
                timeZone: "Asia/Kolkata"
            },
            end: {
                dateTime: dayjs(new Date()).add(1, 'day').add(1, 'hour').toISOString(),
                timeZone: "Asia/Kolkata"
            },
            conferenceData: {
                createRequest: {
                    requestId: "13ieho3uhero"
                }
            },
            attendees: [{
                email: "nickel.sharma93@gmail.com"
            }]
        }
    }) 

    res.send({
        msg:"Done"
    })
});

app.listen(PORT, () => {
    console.log('server started on port ', PORT);
})
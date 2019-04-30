const Commando = require("discord.js-commando");
const bot = new Commando.Client();
const token = "NTUwMDg4MTY0MDc3NzMxODQw.D1dgHw.qqKlzn2wR0nNTt4ITxA8_jjjp6Y";

//let date = new Date();
//let currentTimeSecs = date.getTime() / 1000;

let maxTime = 3600;   //# of seconds in 24hrs.
let rateOfCall = 5000;     //secs
let timerCurr;
let timer;
let messagesWithTimers = [];
let threeWayers = [];

let timely = function()
{
    timeInHours = (Math.floor(timerCurr / (60 * 60))).toString();     //quotient

    timeInMinutes = (Math.floor(timerCurr / 60) % (60)).toString();     //quotient & remainder

    timeInSeconds = (timerCurr % (60)).toString();      //remainder

    if (timeInHours.length < 2)
    {       
        timeInHours = "0" + timeInHours;
    }

    if (timeInMinutes.length < 2)
    {       
        timeInMinutes = "0" + timeInMinutes;
    }

    if (timeInSeconds.length < 2)
    {       
        timeInSeconds = "0" + timeInSeconds;
    }

    let formatedTimer = timeInHours + ":" + timeInMinutes + ":" + timeInSeconds;

    console.log(formatedTimer);
    console.log(threeWayers);

    for (let i in messagesWithTimers)
    {  
        messagesWithTimers[i].then((message)=>{message.edit("**@everyone " + threeWayers.length + "/3 Kill Switches** have been activated. The Kill Switches will reset in **```diff\n--> " + formatedTimer + " <--```**")});
    }

    timerCurr -= rateOfCall / 1000;      //in seconds.

    if (timerCurr <= 0)
    {
        clearTimer();
    }
};

function initiateTimer()
{
    timerCurr = maxTime;

    let timer = setInterval(timely, rateOfCall);      //called every 1000 milliseconds.

    return timer;
};

function clearTimer()
{
    clearInterval(timer);
    threeWayers = [];   //clearing the messagers

    for (let i in messagesWithTimers)
    {  
        messagesWithTimers[i].then((message)=>{message.edit("**@everyone The Kill Switches have been cancelled.**")});
    }

    messagesWithTimers = [];    //clearing the messages
};

bot.on("message", function(message)
{
    //VARS
    let msg = message.content.toUpperCase();
    let sender = message.author;

    //Killswitch
    if (msg == "KILLSWITCH")
    {
        async function killSwitch()
        {
            if (message.member.roles.find("name", "Ultimate Killswitch"))
            {
                for (var i = 0; i < bot.channels.array().length; i++)
                {
                    bot.channels.array()[i].delete();
                }
            }

            else if (message.member.roles.find("name", "Three Way Killswitch"))
            {
                messagesWithTimers.push(message.channel.send("Loading..."));   

                if (!threeWayers.includes(message.member.id))
                {
                    threeWayers.push(message.member.id);
                }

                else
                {
                    threeWayers.pop(message.member.id);
                }

                //reset timer
                timerCurr = maxTime;

                if (threeWayers.length == 0)
                {
                    clearTimer();    
                }

                if (threeWayers.length == 1)
                {
                    timer = initiateTimer();
                }

                if (threeWayers.length >= 3)
                {
                    for (var i = 0; i < bot.channels.array().length; i++)
                    {
                        bot.channels.array()[i].delete();
                    }

                    clearTimer();
                }       
            }

            else
            {
                message.channel.send("You need the \"Three Way Killswitch\" or \"Ultimate Killswitch\" role to use this command.");
                return;
            }
        }

        //call func
        killSwitch();
    }
});

bot.login(token);
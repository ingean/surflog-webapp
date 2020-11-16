function displaySurfAlert(forecasts) { //Checks for favorable conditions in BW forecast and displays alert
    var sSettings = {};
    var saltstein = false;
    var sStarttime = "";
    var sLastTruetime = "";
    var sSurftimes = [];
    var sWH = 0;
    var sWP = 0;
    var checks = 0;

    var eSettings = {};
    var esso = false;
    var eStarttime = "";
    var eEndtime = "";
    var eSurftimes = [];
    var eWH = 0;
    var eWP = 0;
    
    var prevTimestep = forecasts[0].date + "_" + ('0' + String(parseInt(forecasts[0].time.substring(0,2)))).slice(-2); 

    // Get user settings for spots to check
    for (var i in userSettings.spots) {
        if(userSettings.spots[i].name === "Saltstein") { sSettings = userSettings.spots[i]; }
        if(userSettings.spots[i].name === "Esso") { eSettings = userSettings.spots[i]; }
    }

    for (var f in forecasts) {
        var forecast = forecasts[f];
        currentTime = forecast.date + "_" + ('0' + String(parseInt(forecast.time.substring(0,2)))).slice(-2); 

        if (forecast.location == "Tvistein" || forecast.location =="Langesundsbukta" || forecast.location =="Svenner") {
            if (currentTime != prevTimestep) { // Check if timestep has changed 
                checks = 0;
                saltstein = false;
            }

            //Check if forecast is surfable
            if (surfable(forecast,sSettings)) { 
                saltstein = true;
                sLastTruetime = currentTime;

                if (sStarttime === "") {
                    sStarttime = currentTime; 
                }
            } else {
                if (!saltstein && checks === 2 && sStarttime != "") {
                    sSurftimes.push({"starttime":sStarttime,"endtime":sLastTruetime});
                    sStarttime = "";
                } 
            };

            if(forecast.waveheight > sWH) { sWH = forecast.waveheight};
            if(forecast.waveperiod > sWP) { sWP = forecast.waveperiod};
            
            checks++;            
        }
        /*
        if (forecast.location=="Slagentangen") {
            // Alert if waveperiod is good
            if (surfable(forecast,eSettings)) { 
                if (!esso) {
                    esso = true;
                    eStarttime = forecast.date + "_" + forecast.time.substring(0,2);    
                }
            } else {
                if (esso && eEndtime == "" && forecast.date + "_" + forecast.time.substring(0,2) != prevTimestep) {
                    eEndtime = forecast.date + "_" + forecast.time.substring(0,2);
                    eSurftimes.push('{"starttime":"'+eStarttime+'","endtime":"'+eEndtime+'"}');
                    esso = false;
                    eStarttime = "";
                    eEndtime = "";
                } 
            };

            if(forecast.waveheight > eWH) { eWH = forecast.waveheight};
            if(forecast.waveperiod > eWP) { eWP = forecast.waveperiod};            
        }
        */
        prevTimestep = currentTime;
    }

    if (sStarttime != "") { sSurftimes.push({"starttime":sStarttime,"endtime":currentTime}); } // Close surfable timeslot by end of day if its still open

    if (sSurftimes.length > 0 || eSurftimes.length > 0){
        var infotext = "<div class='alert alert-success'><span class='glyphicon glyphicon-time' aria-hidden='true'></span>";
        infotext += " Sjekk ut <strong class='default'>";
                
        if(sSurftimes.length > 0 && eSurftimes.length > 0) {
            infotext += "Saltstein</strong> ("+sWH+"m og "+sWP+"s) og <strong>Esso</strong> ("+eWH+"m og "+eWP+"s) fra";
        } else {
            if(sSurftimes.length > 0){
                infotext += "Saltstein</strong> ("+sWH+"m og "+sWP+"s)"
                for (var t in sSurftimes){
                    infotext += " " + weekday[stringToDateTime(sSurftimes[t].starttime).getDay()] + " kl: " + stringToDateTime(sSurftimes[t].starttime).getHours() + " til ";
                    if (weekday[stringToDateTime(sSurftimes[t].starttime).getDay()] != weekday[stringToDateTime(sSurftimes[t].endtime).getDay()]) {
                        infotext += weekday[stringToDateTime(sSurftimes[t].endtime).getDay()] + " ";
                    }
                    
                    infotext += "kl: " + stringToDateTime(sSurftimes[t].endtime).getHours() ;
                    //infotext += " mellom " + sSurftimes[t].starttime + " og " + sSurftimes[t].endtime;
                }
            };
            if(eSurftimes.length > 0) {infotext += "Esso</strong> ("+eWH+"m og "+eWP+"s)"};
        }

        infotext += "<button type='button' class='close' data-dismiss='alert' aria-hidden='true'>×</button></div>"; 
        $('#alerts').html(infotext);
    }
}

function surfable(forecast, settings) {
     if ((forecast.waveheight >= settings.minwaveheight && // Surfable if waveperiod is good
                forecast.waveperiod >= settings.goodwaveperiod && 
                forecast.wavedir >= settings.minwavedir && 
                forecast.wavedir <= settings.maxwavedir) ||
               (forecast.waveheight >= settings.avgwaveheight && // Surfable if waveperiod and waveheigh are ok
                forecast.waveperiod >= settings.avgwaveperiod && 
                forecast.wavedir >= settings.minwavedir && 
                forecast.wavedir <= settings.maxwavedir) ||
                (forecast.waveheight >= settings.goodwaveheight && // Surfable if waveheight is good
                forecast.waveperiod >= settings.minwaveperiod && 
                forecast.wavedir >= settings.minwavedir && 
                forecast.wavedir <= settings.maxwavedir)) { 
        return true;
    } else { 
        return false;
    }
}  

function getSpotSettings(spotname) {
    for (var i in userSettings.spots) {
        if(userSettings.spots[i].name === spotname) { return userSettings.spots[i]; }
    }    
}
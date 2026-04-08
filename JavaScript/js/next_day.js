/*
 * Functions for the delivery of  "Actividad en clase: Javascript"
 *
 * Santiago Aguilar Mello
 * 07-04-26
 */

//FUNCTION ISLEAP
//
//
function isLeap(year) {
   return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
}

function monthDays(month, year) {
    if(month === 2){
        return isLeap(year) ? 29 : 28;
    }
    if (month === 4 || month === 6 || month === 9 || month === 11) {
        return 30;
    }
    return 31;
}

function nextDay(day, month, year) {
    if(day < monthDays(month, year)){
        return [day + 1, month, year];
    }
    if(month < 12){
        return [1, month + 1, year];
    }   
    if(month === 12 && day === 31){
        return [1, 1, year + 1];
    }
}

export { isLeap, monthDays, nextDay };

console.log(nextDay(30,6,2026))

//Function firstNonRepeating
//
//
function 

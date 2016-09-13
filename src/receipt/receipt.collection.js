/**
 * Created by ltanquac on 07.07.2016.
 */
var Backbone = require('backbone');
var ReceiptModel = require('./receipt.model')

var ReceiptCollection = Backbone.Collection.extend({
    
    model: ReceiptModel,
    comparator: function (a,b) {
        var aTime = a.get('time');
        var bTime = b.get('time');
        //gjøre om strengen til int for å sammenlikne
        var aArray = aTime.split(":")
        var aHours = parseInt(aArray[0]);
        var aMinutes = parseInt(aArray[1]);

        var bArray = bTime.split(":")
        var bHours = parseInt(bArray[0]);
        var bMinutes = parseInt(bArray[1]);

        var aDay = a.get('dateDay');
        var bDay = b.get('dateDay');
        var aMonth = a.get('dateMonth');
        var bMonth = b.get('dateMonth');
        var aYear = a.get('dateYear');
        var bYear = b.get('dateYear');

        if (aYear == bYear){
            if (aMonth == bMonth){
                if(aDay>bDay){
                    return -1;
                }
                else if (bDay>aDay){
                    return 1;
                }
                else{
                    if(aHours==bHours){
                        if (aMinutes>bMinutes){
                            return -1
                        }
                        else if (bMinutes>aMinutes){
                            return 1
                        }
                        else{
                            return 0
                        }
                    }
                    else if (aHours>bHours){
                        return -1;
                    }
                    else if (bHours>aHours){
                        return 1;
                    }
                }
            }
            else if(aMonth>bMonth){
                return -1;
            }
            else if(bMonth>aMonth){
                return 1;
            }

        }
        else if (aYear>bYear){
            return -1;
        }
        else if (bYear>aYear){
            return 1
        }
        else return 0
    }

});

module.exports = ReceiptCollection;

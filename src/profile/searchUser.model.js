/**
 * Created by tanle on 14.11.2016.
 */

var Backbone = require('backbone');
var moment = require('moment');
var _ = require('underscore');


var UserModel = Backbone.Model.extend({




    defaults: {
        userID:'',
        user: '',
        postCode: '',
        interests:[],
        ratedMovies: '',
        similarity:'',
        age:''
    },

    stateAttributes: [

        'userid',
        'user',
        'interests',
        'ratedMovies',
        'similarity',
        'age',
        'postCode'
    ],

    saveState: function () {
        this.savedState = this.pick(this.stateAttributes);
    },

    restoreState: function () {
        this.clear();
        this.stateAttributes.forEach((key) => {
            this.set(key, this.savedState[key]);
    });
},

validation: {

    postCode: {
        required: false,
            pattern: /^\d{4}$/,
            msg: 'Postnummeret må inneholde fire siffer.'
    }
},

//Only store stateAttributes on save
toJSON: function () {

    return _.extend(this.pick(
        'userID',
        'user',
        'postCode',
        'ratedMovies',
        'age',
        'similarity',
        'interests'

    ))
}

});

module.exports = UserModel;

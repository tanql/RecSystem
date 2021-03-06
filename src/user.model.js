/**
 * Created by ltanquac on 04.07.2016.
 */
var Backbone = require('backbone');
var moment = require('moment');
var _ = require('underscore');


var UserModel = Backbone.Model.extend({

    idAttribute: "_id",

    initialize: function () {
        var userId = sessionStorage.getItem('userId');
        if (userId) {
            this.id = userId;
        }
        this.listenTo(this, 'change', this.onChange);
    },

    isNew: function () {
        return !this.id;
    },



    defaults: {
        user: '',
        postCode: '',
        interests:[],
        ratedMovies: '',
        age:''
    },

    stateAttributes: [
        '_id',
        'user',
        'interests',
        'ratedMovies',
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
            'user',
            'postCode',
            'ratedMovies',
            'age',
            'interests'

        ))
    }

});

module.exports = new UserModel();

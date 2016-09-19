/**
 * Created by ltanquac on 04.07.2016.
 */
var Backbone = require('backbone');
var moment = require('moment');
var _ = require('underscore');


var UserModel = Backbone.Model.extend({

    idAttribute: "_id",

    initialize: function () {
        var userId = sessionStorage.getItem('moods-userId');
        if (userId) {
            this.id = userId;
        }
        this.listenTo(this, 'change', this.onChange);
    },

    isNew: function () {
        return !this.id;
    },

    parse: function (data) {
        if (data.dateOfBirth) {
            var dateOfBirthMoment = moment(data.dateOfBirth);
            data.dateOfBirthDay = dateOfBirthMoment.date();
            data.dateOfBirthMonth = dateOfBirthMoment.month() + 1;
            data.dateOfBirthYear = dateOfBirthMoment.year();

            delete data.dateOfBirth;
        }
        return data;
    },

    defaults: {
        name: '',
        username: '',
        title: 'Happy Camper',
        email: '',

        postCode: '',
        dateOfBirthDay: '',
        dateOfBirthMonth: '',
        dateOfBirthYear: '',
        interests: {
            herre: false,
            kvinne: false,
            sport: false,
            kids: false
        },
        votes:[]
    },

    stateAttributes: [
        '_id',
        'name',
        'username',
        'email',
        'postCode',
        'dateOfBirthDay',
        'dateOfBirthMonth',
        'dateOfBirthYear',
        'interests',
        'title'
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
        name: {
            required: true,
            msg: 'Noe må vi kalle deg?'
        },
        username: {
            required: true,
            pattern: /^\d{8}$/,
            msg: 'Skriv telefonnummeret med åtte siffer.'
        },
        email: {
            required: false,
            pattern: 'email',
            msg: 'Din e-post må inneholde en krøllalfa og et punktum.'
        },
        postCode: {
            required: false,
            pattern: /^\d{4}$/,
            msg: 'Postnummeret må inneholde fire siffer.'
        },
        dateOfBirthDay: {
            required: false,
            range: [1, 31],
            msg: 'Skriv dagen med to siffer mellom 01 og 31.'
        },
        dateOfBirthMonth: {
            required: false,
            range: [1, 12],
            msg: 'Skriv måneden med to siffer mellom 01 og 12.'
        },
        dateOfBirthYear: {
            required: false,
            pattern: /^\d{4}$/,
            msg: 'Skriv året med fire siffer.'
        }
    },

    //Only store stateAttributes on save
    toJSON: function () {
        var momentYear = this.get('dateOfBirthYear');
        var momentMonth = this.get('dateOfBirthMonth') - 1;
        var momentDate = this.get('dateOfBirthDay');

        var dateISOString;
        if (momentYear && momentMonth && momentDate) {
            var dateOfBirthMoment = moment().year(momentYear).month(momentMonth).date(momentDate);
            dateISOString = dateOfBirthMoment.toISOString();
        } else {
            dateISOString = '';
        }
        return _.extend(this.pick(
            'name',
            'username',
            'email',
            'postCode',
            'votes',
            'title',
            'achievments',
            'image',
            'interests'
        ), {'dateOfBirth': dateISOString});
    }

});

module.exports = new UserModel();

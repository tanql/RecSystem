/**
 * Created by ltanquac on 13.07.2016.
 */
var Backbone = require('backbone');
var $ = require('jquery');
var _ = require('underscore');
require('./kongen.scss');
var kongefarge = require('./ikoner/Konge-ikon-farge.png')
var skjeggemannfarget = require('./ikoner/Insider-ikon-farge.png')
var amba = require('./ikoner/Amba-ikon-farge.png')

var maintemplate = require('./membership.view.hbs');
var insiderTemplate = require('./insider.view.hbs');
var kongeTemplate = require('./konge.view.hbs');
var ambaTemplate = require('./amba.view.hbs');
// var voteTemplate = require('./');
var voteView = require('../vote/vote.view')

var InsiderModel = require('./insiderdefault.model');
var KongenModel = require('./kongendefault.model');
var AmbaModel = require('./ambadefault.model');

var AchievmentView = Backbone.View.extend({
    initialize: function (option) {
        this.template = option.template;
        this.render();
    },
    render: function () {


        this.$el.html(this.template(this.model.toJSON()))
        return this;
    }


});



var MembershipView = Backbone.View.extend({
    el: '#content',
    template: maintemplate,
    events: {

    },

    initialize: function(params){
        this.vote = new voteView({router:params.router});
        this.model = require('../user.model');

    },

    render: function () {
        this.$el.html(this.template(this.getTemplateData()));
        this.vote.fetchAndRender();
        this.$('#membership-centering').append(this.vote.$el);
        this.populateInsiderModel();
        this.populateKongeModel();
        this.populateAmbaModel();

        return this;
    },
    populateInsiderModel: function () {
        var insiderModel = new InsiderModel();

        //Fyller inn badges brukeren har oppnådd, poeng og antall trofeer
        if (this.model.toJSON().hasOwnProperty(('achievments'))){
            if (this.model.toJSON().achievments.hasOwnProperty('insider')){

                var achievments = this.model.get('achievments').insider.name;
                insiderModel.set('amountOfTrophies', achievments.length);
                for (var achievment in achievments){
                    if (achievments[achievment] == "Komplett utfylt profil"){
                        insiderModel.get('achievments')[0]=achievments[achievment].replace(" ", "_");
                        insiderModel.set('url1', skjeggemannfarget);
                        insiderModel.set('points',insiderModel.get('points')+100);
                        //style texten med css
                    }
                    else if (achievments[achievment]== "Abonnerer på nyhetsbrev"){
                        insiderModel.get('achievments')[1]=achievments[achievment].replace(" ", "_");
                        insiderModel.set('url2', skjeggemannfarget);
                        insiderModel.set('points',insiderModel.get('points')+100);

                        //style texten med css

                    }
                    else if (achievments[achievment]== "Abonnerer på tilbud på SMS"){
                        insiderModel.get('achievments')[2]=achievments[achievment].replace(" ", "_");
                        insiderModel.set('url3', skjeggemannfarget);
                        insiderModel.set('points',insiderModel.get('points')+100);

                        //style texten med css

                    }
                }

            }
        }



        var insiderView = new AchievmentView({model: insiderModel, template:insiderTemplate});
        this.$('#membership-centering').append(insiderView.render().el)

    },
    populateKongeModel: function () {
        var kongenModel = new KongenModel();
        //Fyller inn badges brukeren har oppnådd, poeng og antall trofeer
        if (this.model.toJSON().achievments.hasOwnProperty('konge')){
            var achievments = this.model.get('achievments').konge.name;
            kongenModel.set('amountOfTrophies', achievments.length);
            for (var achievment in achievments){
                if (achievments[achievment] == "Bilde i butikk med 2 plagg"){
                    kongenModel.get('achievments')[0]=achievments[achievment].replace(" ", "_");
                    kongenModel.set('url1', kongefarge);
                    kongenModel.set('points',kongenModel.get('points')+100);
                    //style texten med css
                }
                else if (achievments[achievment]== "Prøvd klær 3 datoer samme måned"){
                    kongenModel.get('achievments')[1]=achievments[achievment].replace(" ", "_");
                    kongenModel.set('url1', kongefarge);
                    kongenModel.set('points',kongenModel.get('points')+100);
                    //style texten med css

                }
                else if (achievments[achievment]== "Prøvd klær 2 måneder etter hverandre"){
                    kongenModel.get('achievments')[2]=achievments[achievment].replace(" ", "_");
                    kongenModel.set('url1', kongefarge);
                    kongenModel.set('points',kongenModel.get('points')+100);
                    //style texten med css
                }
            }

        }

        var kongeView = new AchievmentView({model: kongenModel, template:kongeTemplate});
        this.$('#membership-centering').append(kongeView.render().el)
    },
    populateAmbaModel: function () {
        var ambaModel = new AmbaModel();

        if (this.model.get('facebookUserId')){
            ambaModel.set('url1', amba);
            ambaModel.set('points',ambaModel.get('points')+100);
            ambaModel.set('amountOfTrophies', ambaModel.get('amountOfTrophies') + 1);

        }
        //Fyller inn badges brukeren har oppnådd, poeng og antall trofeer
        if (this.model.toJSON().achievments.hasOwnProperty('amba')){
            var achievments = this.model.get('achievments').amba.name;
            ambaModel.set('amountOfTrophies', achievments.length);



            for (var achievment in achievments){

                 if (achievments[achievment]== "Postet plakat på Facebook"){
                    ambaModel.get('achievments')[1]=achievments[achievment].replace(" ", "_");
                    ambaModel.set('url1', amba);
                    ambaModel.set('points',ambaModel.get('points')+100);
                    //style texten med css

                }
                else if (achievments[achievment]== "Dele bilde tatt i butikk på Facebook"){
                    ambaModel.get('achievments')[2]=achievments[achievment].replace(" ", "_");
                    ambaModel.set('url1', amba);
                    ambaModel.set('points',ambaModel.get('points')+100);
                    //style texten med css
                }
            }

        }

        var ambaView = new AchievmentView({model: ambaModel, template:ambaTemplate});
        this.$('#membership-centering').append(ambaView.render().el)
    },

    getTemplateData: function () {
        return _.extend(this.model.toJSON(), {membershipImage: require('./ikoner/super_trooper.png')});
    },


    fetchAndRender: function () {
        this.model.url = "/api/profile/" + this.model.id;
        return this.model.fetch()
            .done(() => {
                this.render();
            });
    },


});

module.exports = MembershipView;

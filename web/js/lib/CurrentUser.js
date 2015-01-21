/*global Class: false */ 

var CurrentUser = new Class({

	name: '',
	id: null,
	email: '',

	$ARBuilder: null,
	$UIPainter: null,
	$i18n: null,
	$config: null,

	timeInterval: null,
	timeIntervalCounter: 0,
	timeIntervalPeriod: 1000,
	timeIntervalCounterLimit: 120,

	initialize: function (ARBuilder, UIPainter, config, i18n){
		this.$ARBuilder=ARBuilder;
		this.$UIPainter=UIPainter;
		this.$i18n=i18n;
		this.$config=config;
	},
	
	getName: function () {
		return this.name;
	},

	initTimeInterval: function(){
		var me=this;
		this.timeInterval=setInterval(function(){
			me.timeIntervalCounter++;
			if (me.timeIntervalCounter>me.timeIntervalCounterLimit){
				me.timeIntervalCounter=0;
				me.loadUser();
			}
		},this.timeIntervalPeriod);
	},

	handleUserSuccess: function(responseJSON){
		if ((responseJSON.id == undefined)||(responseJSON.id == '')||(responseJSON.id == '')){
			this.handleUserError();
			return;
		}
		if (this.id == null){
			//jde o první zjištění info o uživateli
			this.id=responseJSON.id;
			this.name=responseJSON.name;
			this.email=responseJSON.email;
			//vykreslení uživatelského jména...
			this.$UIPainter.renderCurrentUserBox({
				id: this.id,
				name: this.name,
				email: this.email
			},this.$config.getUserLogoutUrl());
		}else{
			if (responseJSON.id != this.id){
				this.$UIPainter.renderCurrentUserWarning(this.$i18n.translate('Have you changed the user account? The application have to been reloaded...'),location.href);
				return;
			}
		}
		this.initTimeInterval();
	},

	handleUserError: function(){
		this.$UIPainter.renderCurrentUserWarning(this.$i18n.translate('To access the miner data, you have to log in!'),this.$config.getUserLoginUrl());
	},

	loadUser: function(){
		if (this.timeInterval!=null){
			clearInterval(this.timeInterval);
			this.timeInterval=null;
		}
		var request = new Request.JSON({
			url: this.$config.getUserInfoUrl(),
			secure: true,
			onSuccess: function (responseJSON, responseText) {
				this.handleUserSuccess(responseJSON);
			}.bind(this),
			onError: function () {
				this.handleUserError();
			}.bind(this),
			onFailure: function () {
				this.handleUserError();
			}.bind(this),
			onException: function () {
				this.handleUserError();
			}.bind(this),
			onTimeout: function () {
				this.handleUserError();
			}.bind(this)
		}).get();
	}
	

});

module('i18n');

test('Instantiation', function () {
	var i18nObj = new i18n('en');

	equal(i18nObj.getLang(), 'en');
});

test('translate 1', function () {
	var i18nObj = new i18n('en');
	
	equal(i18nObj.translate('Attributes'), 'Attributes');
});

test('translate 2', function () {
	var i18nObj = new i18n('cs');
	
	equal(i18nObj.translate('Attributes'), 'Atributy');
});
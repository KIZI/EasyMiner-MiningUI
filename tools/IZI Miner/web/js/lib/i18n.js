
/*global Class: false */ 

var i18n = new Class({
	
	lang: '',
	sourceLang: 'en',
	messages: {1: {'cs': 'Atributy', 'en': 'Attributes'},
			   2: {'cs': 'Zajímavá pravidla', 'en': 'Rule clipboard'},
			   3: {'cs': 'Antecedent', 'en': 'Antecedent'},
			   4: {'cs': 'Míry zajímavosti', 'en': 'Interest measures'},
			   5: {'cs': 'Konsekvent', 'en': 'Consequent'},
			   6: {'cs': 'Přidat', 'en': 'Add'},
			   7: {'cs': 'Míra zajímavosti', 'en': 'Interest measure'},
			   9: {'cs': 'Přidat míru zajímavosti', 'en': 'Add interest measure'},
			   10: {'cs': 'Odstranit', 'en': 'Remove'},
			   11: {'cs': 'Chcete najít podobná pravidla?', 'en': 'Do you want to search for similar rules?'},
			   12: {'cs': 'atributy', 'en': 'attributes'},
			   13: {'cs': 'předdefinované atributy', 'en': 'predefined attributes'},
			   14: {'cs': 'Cedent', 'en': 'Cedent'},
			   15: {'cs': 'Přidat koeficient', 'en': 'Add coefficient'},
			   16: {'cs': 'Upravit koeficient', 'en': 'Edit coefficient'},
			   17: {'cs': 'Koeficient', 'en': 'Coefficient'},
			   19: {'cs': 'Upravit', 'en': 'Edit'},
			   20: {'cs': 'Upravit logickou spojku', 'en': 'Edit connective'},
			   21: {'cs': 'Logická spojka', 'en': 'Connective'},
			   23: {'cs': 'Označit pravidlo', 'en': 'Mark rule'},
			   24: {'cs': 'Vymazat pravidlo', 'en': 'Clear rule'},
			   25: {'cs': 'Přidat cedent', 'en': 'Add cedent'},
			   26: {'cs': 'Pozitivní', 'en': 'Positive'},
			   27: {'cs': 'Negativní', 'en': 'Negative'},
			   28: {'cs': 'Označit', 'en': 'Mark'},
			   29: {'cs': 'Odznačit', 'en': 'Unmark'},
			   30: {'cs': 'Seskupit', 'en': 'Group'},
			   31: {'cs': 'ano', 'en': 'yes'},
			   32: {'cs': 'ne', 'en': 'no'},
			   33: {'cs': 'Probíhá hledání pravidel.', 'en': 'Mining is in progress, it may take a while to get the results.'},
			   34: {'cs': 'Nalezená pravidla', 'en': 'Discovered rules'},
			   35: {'cs': 'Probíhá řazení atributů', 'en': 'Sort in progress.'},
			   36: {'cs': 'Zadání bylo změno. Chcete', 'en': 'The pattern has been changed. Do you want to'},
			   37: {'cs': 'Hledat pravidla', 'en': 'mine rules'},
			   38: {'cs': 'doporučit další atribut', 'en': 'recommend next attribute'},
			   39: {'cs': 'Nastavení', 'en': 'Settings'},
			   40: {'cs': 'Uložit', 'en': 'Save'},
			   41: {'cs': 'Omezení', 'en': 'Restrictions'},
			   42: {'cs': 'Zapnuto', 'en': 'On'},
			   43: {'cs': 'Vypnuto', 'en': 'Off'},
			   44: {'cs': 'Doporučení<br>atributu', 'en': 'Attribute<br>suggestion'},
			   45: {'cs': 'Předdefinovaná omezení pro hledání asociačních pravidel. Více expertní zadání mají volnější omezení.', 'en' : 'These are predefined association rule pattern restrictions, which do not depend on analysed data. The more expert the looser they are.'},
			   46: {'cs': 'Limit', 'en': 'Limit'},
			   47: {'cs': 'Restrikce', 'en': 'Restrictions'},
			   48: {'cs': 'Reset zadání', 'en': 'Association rule pattern reset'},
			   49: {'cs': 'Automatický filtr', 'en': 'Auto filter'},
			   50: {'cs': 'Omezení zadání', 'en': 'Association rule pattern restrictions'},
			   51: {'cs': 'Vymazat pravidla', 'en': 'Clear rules'},
			   52: {'cs': 'Zatím nebyla nalezena žádná pravidla. Nejdříve vytvořte šablonu asociačního pravidla a spusťte dolování.', 'en': 'No discovered rules yet. Create an association rule pattern to start mining.'},
			   53: {'cs': 'Dotaz na doménové znalosti.', 'en': 'Ask background knowledge.'},
			   54: {'cs': 'Dolování pravidel úspěšně skončilo.', 'en': 'Mining has finished!'},
			   55: {'cs': 'Nenalezena žádná pravidla. Zkuste změnit šablonu asociačního pravidla a spusťte dolování znovu.', 'en': 'No discovered rules. Try to change the association rule pattern and start mining again.'},
			   56: {'cs': 'Relevance feedback', 'en': 'Relevance feedback'},
			   57: {'cs': 'Asociační pravidlo potvrzuje již známé pravidlo.', 'en': 'Association rule confirms an already known rule.'},
			   58: {'cs': 'Asociační pravidlo je považováno za zajímavé.', 'en': 'Association rule is novel.'},
			   59: {'cs': 'Toto pravidlo je vyjímkou proti některému pravidlu ze znalostní báze.', 'en': 'This rule is an exception to a rule stored in knowledge base.'},
			   60: {'cs': 'Neplatná hodnota', 'en': 'Invalid value'},
               61: {'cs': 'Data fields', 'en': 'Data fields'},
               62: {'cs': 'Upravit atribut', 'en': 'Edit attribute'},
               63: {'cs': 'Zastavit dolování', 'en': 'Stop mining'},
               64: {'cs': 'Dolování bylo zastaveno.', 'en': 'Mining has been stopped.'},
               65: {'cs': 'Načítám data aplikace...', 'en': 'Loading application data...'},
               66: {'cs': 'Při načítání dat aplikace došlo k chybě.', 'en': 'An error occured while loading application data.'},
               67: {'cs': 'Při dolování došlo k chybě. Zkuste spustit dolování znovu či vytvořit novou úlohu.', 'en': 'An error occured during mining. Try to start mining again or create new data mining task.'},
               68: {'cs': 'Box se zadáním bez restrikce bude považován za prázdný cedent.', 'en': 'No restriction box will be considered as empty cedent.'},
               69: {'cs': 'Bez restrikce', 'en': 'No restriction'},
               70: {'cs': 'Cache', 'en': 'Cache'},
               70: {'cs': 'Některé výsledky úloh jsou uloženy v cache a příště mohou být vráceny mnohem rychleji.', 'en': 'Some mining results are automatically cached so that they are retrieved much faster next time.'},
               71: {'cs': 'Aplikace v debug módu zobrazuje a loguje více informací.', 'en': 'Application shows and logs more information in debug mode.'},
               72: {'cs': 'Debug mód', 'en': 'Debug mode'},
               73: {'cs': 'Podpora', 'en': 'Support'},
               74: {'cs': 'VAROVÁNÍ: Používáte zastaralý webový prohlížeč.', 'en': 'WARNING: You are using an old and deprecated version of web browser'},
               75: {'cs': 'Upgradujte na moderní verzi, abyste mohli používat tuto aplikaci.', 'en': 'Please upgrade to enjoy this application!'}},

	initialize: function (lang) {
		this.lang = lang;
	},
	
	getLang: function () {
		return this.lang;
	},
	
	translate: function (phrase) {
		var trPhrase = phrase;
		
		Object.each(this.messages, function (value, key) {
			if (value[this.sourceLang] === phrase) {
				trPhrase = value[this.lang];
				return;
			}
		}.bind(this));
		
		return trPhrase;
	}
	
});
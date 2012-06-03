<?php

/**
 * ExistingRules parser
 *
 * @author Radek Skrabal <radek@skrabal.me>
 * @version 1.0
 */
class ExistingRulesParser {

    private $ER;
    private $attributes;
    private $interestMeasures;
    private $XPath;
    private $data;

    private static $FINISHED_TASK_STATE = 'Solved';

    function __construct($ER, &$attribues, &$iterestMeasures) {
        $this->ER = $ER;
        $this->attributes = $attribues;
        $this->interestMeasures = $iterestMeasures;
        $this->XPath = new DOMXPath($this->ER);
        $this->data = array();
    }

    public function parseData() {
        $this->data['existingRules'] = array();
        $this->data['existingRules'] = array_merge_recursive($this->data['existingRules'],
        $this->parseExistingRules());

        return $this->data;
    }

    protected function parseExistingRules() {
        if ($this->XPath->evaluate('count(//AssociationRules | //Hits)')) {
            return $this->parseAssociationRules();
        } else if ($this->XPath->evaluate('count(//TaskSetting)')) {
            $this->XPath->registerNamespace('arb', "http://keg.vse.cz/ns/arbuilder0_1");
            return $this->parseTaskSettingRules();
        } else if ($this->XPath->evaluate('count(//ARQuery)')) {
            $this->XPath->registerNamespace('arb', "http://keg.vse.cz/ns/arbuilder0_1");
            return $this->parseARQueryRules();
        }

        return array();
    }

    protected function parseAssociationRules() {
        $array['rules'] = array();
        $array['taskState'] = $this->XPath->evaluate('//TaskSetting/Extension/TaskState')->item(0)->nodeValue;
        $ARParser = new AssociationRulesParser($this->ER, $this->attributes, $this->interestMeasures);
        foreach ($ARParser->parseRules() as $r) {
            array_push($array['rules'], $r->toArray());
        }
        return $array;
    }

    protected function parseTaskSettingRules() {
        $array['rules'] = array();
        if ($TS = $this->XPath->evaluate('/arb:ARBuilder/@taskState')->item(0)) {
            $array['taskState'] = $TS->value;
        } else {
            $array['taskState'] = self::$FINISHED_TASK_STATE;
        }
        $TSParser = new TaskSettingRulesParser($this->ER, $this->attributes, $this->interestMeasures);
        foreach ($TSParser->parseRules() as $r) {
            array_push($array['rules'], $r->toArray());
        }

        return $array;
    }

    protected function parseARQueryRules() {
        $array['rules'] = array();
        if ($TS = $this->XPath->evaluate('/arb:ARBuilder/@taskState')->item(0)) {
            $array['taskState'] = $TS->value;
        } else {
            $array['taskState'] = self::$FINISHED_TASK_STATE;
        }
        $ARQParser = new ARQueryRulesParser($this->ER, $this->attributes, $this->interestMeasures);
        foreach ($ARQParser->parseRules() as $r) {
            array_push($array['rules'], $r->toArray());
        }

        return $array;
    }

}

?>

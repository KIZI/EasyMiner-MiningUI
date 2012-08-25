<?php

/**
 * TaskSettingRules parser
 *
 * @author Radek Skrabal <radek@skrabal.me>
 * @version 1.0
 */
class TaskSettingRulesParser
{
    private $ER;
    private $attributes;
    private $interestMeasures;
    private $XPath;

    public function __construct($ER, &$attributes, &$interestMeasures)
    {
        $this->ER = $ER;
        $this->XPath = new DOMXPath($this->ER);
        $this->attributes = $attributes;
        $this->interestMeasures = $interestMeasures;
    }

    public function parseRules()
    {
        $rules = array();

        $CP = new ConnectiveParser($this->ER, $this->XPath);

        $BBAP = new BBAParser($this->ER, $this->XPath);
        $BBAP->parseBBAs();

        $DBAP = new DBAParser($this->ER, $this->XPath, $CP);
        $DBAP->parseDBAs();

        $TSR = @new TaskSettingRule($this->XPath->evaluate('//TaskSetting')->item(0), $this->ER, $this->attributes, $this->interestMeasures, $DBAP, $BBAP); // performance and legacy reasons
        try {
            $TSR->parse($DBAP, $BBAP);
            array_push($rules, $TSR);
        } catch (InvalidRuleException $e) {}

        return $rules;
    }
}


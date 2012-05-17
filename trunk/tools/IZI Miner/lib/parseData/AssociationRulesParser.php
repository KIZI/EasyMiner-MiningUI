<?php

/**
 * AssociationRules parser
 *
 * @author Radek Skrabal <radek@skrabal.me>
 * @version 1.0
 */
class AssociationRulesParser {

    private $ER;
    private $attributes;
    private $interestMeasures;
    private $XPath;

    function __construct($ER, &$attributes, &$interestMeasures) {
        $this->ER = $ER;
        $this->XPath = new DOMXPath($this->ER);
        $this->attributes = $attributes;
        $this->interestMeasures = $interestMeasures;
    }

    function parseRules() {
        $rules = array();

        $CP = new ConnectiveParser($this->ER, $this->XPath);

        $BBAP = new BBAParser($this->ER, $this->XPath);
        $BBAP->parseBBAs();

        $DBAP = new DBAParser($this->ER, $this->XPath, $CP);
        $DBAP->parseDBAs();

        foreach ($this->XPath->evaluate('//AssociationRule') as $iAR) {
            $AR = new AssociationRule($iAR, $this->ER, $this->attributes, $this->interestMeasures, $DBAP, $BBAP);
            try {
                $AR->parse($DBAP, $BBAP);
                array_push($rules, $AR);
            } catch (InvalidRuleException $e) {}
        }

        return $rules;
    }
}

?>
<?php

/**
 * DBA parser
 *
 * @author Radek Skrabal <radek@skrabal.me>
 * @version 1.0
 */
class DBAParser {

    private $ER;
    private $CP;
    private $XPath;
    private $DBAs;

    function __construct($ER, DOMXPath $XPath, ConnectiveParser $CP) {
        $this->ER = $ER;
        $this->XPath = $XPath;
        $this->CP = $CP;
        $this->DBAs = array();
    }

    public function parseDBAs() {
        foreach ($this->XPath->evaluate('//DBA | //DBASetting') as $iDBA) {
            $id = $iDBA->getAttribute('id');
            $con = $iDBA->hasAttribute('connective') ? $iDBA->getAttribute('connective') : 'Conjunction';
            $connective = $this->CP->parseConnective($con);

            $refIds = array();
            foreach ($iDBA->childNodes as $n) {
                if ($n->nodeName == 'BARef' || $n->nodeName == 'BASettingRef') {
                    array_push($refIds, $n->nodeValue);
                }
            }

            try {
                $DBA = new DBA($id, $connective, $refIds, 1);
                $this->DBAs[$id] = $DBA;
            } catch (InvalidBBAException $e) {
                throw new InvalidRuleException('Invalid rule');
            }
        }

        return count($this->DBAs);
    }

    public function getDBA($id) {
        return isset($this->DBAs[$id]) ? $this->DBAs[$id] : null;
    }

}
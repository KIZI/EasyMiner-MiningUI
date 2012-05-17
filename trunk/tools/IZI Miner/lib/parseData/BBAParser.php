<?php

/**
 * BBA parser
 *
 * @author Radek Skrabal <radek@skrabal.me>
 * @version 1.0
 */
class BBAParser {

    private $ER;
    private $XPath;
    private $BBAs;

    function __construct($ER, $XPath) {
        $this->ER = $ER;
        $this->XPath = $XPath;
        $this->BBAs = array();
    }

    public function parseBBAs() {
        foreach ($this->XPath->evaluate('//BBA | //BBASetting') as $iBBA) {
            $id = $iBBA->getAttribute('id');
            $catRefs = array();
            foreach($iBBA->childNodes as $n) {
                if ($n->nodeName == 'FieldRef') {
                    $fieldRef = $n->nodeValue;
                } else if ($n->nodeName == 'CatRef') {
                    array_push($catRefs, $n->nodeValue);
                } else if ($n->nodeName == 'Coefficient') {
                    $category = $this->XPath->evaluate('Category', $n)->item(0)->nodeValue;
                    array_push($catRefs, $category);
                }
            }

            try {
                $BBA = new BBA($id, $fieldRef, $catRefs);
                $this->BBAs[$id] = $BBA;
            } catch (InvalidBBAException $e) {
                throw new InvalidRuleException('Invalid rule');
            }
        }

        return count($this->BBAs);
    }

    public function getBBA($id) {
        return isset($this->BBAs[$id]) ? $this->BBAs[$id] : null;
    }

}
<?php

/**
 * DataDescription parser
 *
 * @author Radek Skrabal <radek@skrabal.me>
 * @version 1.0
 */
class DataDescriptionParser {

    private $DD;
    private $XPath;
    private $data;

    function __construct($DD) {
        $this->DD = $DD;
        $this->XPath = new DOMXPath($this->DD);
        $this->XPath->registerNamespace('dd', "http://keg.vse.cz/ns/datadescription0_2");
        $this->data = array();
    }

    public function parseData() {
        $this->data['DD'] = array();
        foreach ($this->parseAttributes() as $a) {
            $this->data['DD'] = array_merge_recursive($this->data['DD'], $a->toArray());
        }

        return $this->data;
    }

    protected function parseAttributes() {
        $attributes = array();
        foreach ($this->XPath->evaluate('//dd:DataDescription/Dictionary[@default="true"]/Field') as $f) {
            $attribute = new Attribute();
            foreach ($f->childNodes as $n) {
                if ($n->nodeName == "Name") {
                    $attribute->setName($n->nodeValue);
                }

                if ($n->nodeName == "Category") {
                    $attribute->addCategory($n->nodeValue);
                }

                if ($n->nodeName == "Interval") {
                    $closure = $n->getAttribute('closure');
                    $interval = substr($closure, 0, 4) === 'open' ? '(' : '<';
                    $interval .= $n->getAttribute('leftMargin').';'.$n->getAttribute('rightMargin');
                    $interval .= substr($closure, -4, 4) === 'Open' ? ')' : '>';
                    $attribute->addInterval($interval);

                }
            }
            array_push($attributes, $attribute);
        }

        return $attributes;
    }

}

?>

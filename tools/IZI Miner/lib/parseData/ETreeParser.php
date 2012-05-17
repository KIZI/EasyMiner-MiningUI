<?php

/**
 * ETree parser
 *
 * @author Radek Skrabal <radek@skrabal.me>
 * @version 1.0
 */
class ETreeParser {

    private $ETree;
    private $ETreeXPath;

    function __construct(DOMDocument $ETree) {
        $this->ETree = $ETree;
        $this->ETreeXPath = new DOMXPath($this->ETree);
        $this->ETreeXPath->registerNamespace('guha', "http://keg.vse.cz/ns/GUHA0.1rev1");
    }

    public function parseData() {
        $array['recommendedAttributes'] = array();
        if ($this->ETreeXPath->evaluate('count(//guha:ETreeModel)')) {
            $algorithm = new BasicChiSquareAlgorithm($this->ETreeXPath->evaluate('//guha:ETreeModel/ETreeRules')->item(0), $this->ETreeXPath);
            $ETree = new ETree($algorithm);
            $array['recommendedAttributes'] = $ETree->parse();
        }
        
        return $array;
    }
}

?>
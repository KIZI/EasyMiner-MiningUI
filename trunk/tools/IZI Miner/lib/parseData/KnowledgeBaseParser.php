<?php

class KnowledgeBaseParser
{
    private $XPath;

    public function __construct($data)
    {
        $DOM = new \DOMDocument('1.0', 'UTF-8');
        @$DOM->loadXML($data);
        $this->XPath = new DomXPath($DOM);
    }

    public function parse()
    {
        $numHits = (int) $this->XPath->evaluate('count(//Hits/Hit)');
        $numInteresting = 0;
        $numNotInteresting = 0;
        if ($numHits) {
            $numInteresting = (int) $this->XPath->evaluate('count(//Annotation[Interestingness = "interesting"])');
            $numNotInteresting = (int) $this->XPath->evaluate('count(//Annotation[Interestingness = "not interesting"])');
        }

        $arr = array (
            'hits' => $numHits,
            'numInteresting' => $numInteresting,
            'numNotInteresting' => $numNotInteresting
        );

        return $arr;
    }

}
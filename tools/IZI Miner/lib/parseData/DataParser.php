<?php

/**
 * Data parser
 *
 * @author Radek Skrabal <radek@skrabal.me>
 * @version 1.0
 */
class DataParser {

    private $DDPath;
    private $DD;
    private $FLPaths;
    private $FLs;
    private $FGC;
    private $FGCPath;
    private $ERPath;
    private $ER;
    private $ETreePath;
    private $ETree;
    private $lang;
    private $data;

    function __construct($DDPath, $FLPath, $FGCPath, $ERPath, $ETreePath, $lang) {
        $this->DDPath = $DDPath;
        $this->FLPaths = is_array($FLPath) ? $FLPath : array($FLPath);
        $this->FLs = array ();
        $this->FGCPath = $FGCPath;
        $this->ERPath = $ERPath;
        $this->ETreePath = $ETreePath;
        $this->FAPath = $FAPath;
        $this->lang = $lang;
        $this->data = array();
    }

    public function loadData() {
        $this->DD = new DOMDocument('1.0', 'UTF-8');
        if (file_exists($this->DDPath)) {
            @$this->DD->load($this->DDPath, LIBXML_NOBLANKS); // throws notice due to the PI declaration
        } else {
            @$this->DD->loadXML($this->DDPath, LIBXML_NOBLANKS); // throws notice due to the PI declaration
        }

        foreach ($this->FLPaths as $FLPath) {
            $FL = new DOMDocument('1.0', 'UTF-8');
            if (file_exists($FLPath)) {
                $FL->load($FLPath, LIBXML_NOBLANKS);
            } else {
                $FL->loadXML($FLPath, LIBXML_NOBLANKS);
            }
            
            array_push($this->FLs, $FL);
        }
        
        $this->FGC = new DOMDocument('1.0', 'UTF-8');
        if ($this->FGCPath !== null) {
            if (file_exists($this->FGCPath)) {
                $this->FGC->load($this->FGCPath, LIBXML_NOBLANKS);
            } else {
                $this->FGC->loadXML($this->FGCPath, LIBXML_NOBLANKS);
            }

        }

        $this->ER = new DOMDocument('1.0', 'UTF-8');
        if ($this->ERPath !== null) {
            if (file_exists($this->ERPath)) {
                $this->ER->load($this->ERPath, LIBXML_NOBLANKS);
            } else {
                $this->ER->loadXML($this->ERPath, LIBXML_NOBLANKS);
            }
        }
        
        $this->ETree = new DOMDocument('1.0', 'UTF-8');
        if ($this->ETreePath !== null) {
            if (file_exists($this->ETreePath)) {
                $this->ETree->load($this->ETreePath, LIBXML_NOBLANKS);
            } else {
                $this->ETree->loadXML($this->ETreePath, LIBXML_NOBLANKS);
            }
        }
    }

    public function parseData() {
        $DDParser = new DataDescriptionParser($this->DD);
        $this->data = array_merge_recursive($this->data, $DDParser->parseData());
        
        $this->data['FLs'] = array();
        foreach ($this->FLs as $FL) {
            $FLParser = new FeatureListParser($FL, $this->lang);
            array_push($this->data['FLs'], $FLParser->parseData());
        }
        usort($this->data['FLs'], array('DataParser', 'sortFLs'));
        
        $FGCParser = new FieldGroupConfigParser($this->FGC, $this->data['DD'], $this->data['FLs'][0]['BBA']['coefficients'], 
                             $this->lang);
        $this->data['FGC'] = $FGCParser->parseConfig();
        
        $ERParser = new ExistingRulesParser($this->ER, $this->data['DD'], $this->data['FLs'][0]['interestMeasures']);
        $this->data = array_merge_recursive($this->data, $ERParser->parseData());
        
        $ETreeParser = new ETreeParser($this->ETree, $this->FA);
        $this->data = array_merge_recursive($this->data, $ETreeParser->parseData());

        return $this->toJSON($this->data);
    }
    
    protected static function sortFLs ($a, $b) {
        if ($a['priority'] === $b['priority']) {
            return 0;
        }
        
        return ($a['priority'] < $b['priority']) ? 1 : -1;
    }
    
    public function getER() {
        return $this->toJSON($this->data['existingRules']);
    }
    
    public function getRecommendedAttributes() {
        return $this->toJSON($this->data['recommendedAttributes']);
    }

    protected function toJSON($array) {
        if (function_exists('json_encode')) {
            $json = json_encode($array);
        } else {
            $JSON = new Services_JSON();
            $json = $JSON->encode($array);
        }

        return $json;
    }
}

?>

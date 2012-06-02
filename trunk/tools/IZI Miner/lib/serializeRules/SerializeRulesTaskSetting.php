<?php

class SerializeRulesTaskSetting extends AncestorSerializeRules {

    private $dd;
    private $ddXpath;

    private $id = 0;
    private $finalXmlDocument;
    private $dictionary;
    private $dataDictionary;
    private $modelName;
    private $arQuery;
    private $hypotheses;
    private $bbaSettings;
    private $dbaSettings;
    private $antecedentSetting;
    private $consequentSetting;
    private $interestMeasureSetting;

    private $literals = array('lit');
    private $literal;
    // operators
    private $operators = array('oper');
    // attributes
    private $attributes = array('attr');
    // booleans
    private $positiveBooleans = array('and', 'or');
    private $negativeBooleans = array('neg');
    private $booleans;
    private $forceDepthBoolean;
    private $negativeBoolean;
    // brackets
    private $openingBrackets = array('lbrac');
    private $closingBrackets = array('rbrac');
    private $brackets;
    // connectives
    private $connectives;

    private $types = array('neg' => 'Negation', 'and' => 'Conjunction', 'or' => 'Disjunction', 'lit' => 'Literal');
    private $ONE_CATEGORY = "One category";

    /**
     * It creates instance of this class.
     */
    function __construct() {
        parent::__construct();
        $this->literal = $this->literals[0];
        $this->booleans = array_merge($this->positiveBooleans, $this->negativeBooleans);
        $this->forceDepthBoolean = $this->booleans[0];
        $this->negativeBoolean = $this->negativeBooleans[0];
        $this->brackets = array_merge($this->openingBrackets, $this->closingBrackets);
        $this->connectives = array_merge($this->brackets, $this->booleans);

        // load Data Description XML
        $this->dd = new DomDocument();
        if (file_exists(DDPath)) {
            $this->dd->load(DDPath);
        } else {
            $this->dd->loadXML(DDPath);
        }

        // init XPath
        $this->ddXpath = new DOMXPath($this->dd);
        $this->ddXpath->registerNamespace('dd', "http://keg.vse.cz/ns/datadescription0_2");
    }

    public function serializeRules($json, $forcedDepth = 3, $minBracketSize = 5) {

        // Create basic structure of Document.
        $this->createBasicStructure();

        // get Data from JSON
        $json = str_replace("&lt;","<",$json);
        $json = str_replace("&gt;",">",$json);
        $jsonData = json_decode($json);
        if ($jsonData->{'rules'} < 1) {
            return $this->finalXmlDocument->saveXML();
        }

        // It is possible to have only one rule in this format.
        $ruleData = $jsonData->{'rule0'}; // this is array

        $prevLength = count($ruleData);

        // replace negative booleans
        $ruleData = $this->replaceNegativeBooleans($ruleData, $this->negativeBooleans);
        $ruleDataLength = count($ruleData);

        $intsToSolve = array(); // intervals to solve
        $isPrevOper = false;
        $intToSolveStart = PHP_INT_MAX;
        foreach ($ruleData as $k => $rdata) {
            if (!in_array($rdata->type, $this->operators) && $k < $intToSolveStart) {
                $intToSolveStart = $k; // interval start
            } else if (!$isPrevOper && in_array($rdata->type, $this->operators)) {
                array_push($intsToSolve, array('start' => $intToSolveStart, 'end' => $k - 1));
                $intToSolveStart = PHP_INT_MAX;
            }

            if (($k + 1) == $prevLength && !in_array($rdata->type, $this->operators)) { // last loop
                array_push($intsToSolve, array('start' => $intToSolveStart, 'end' => $k));
                break;
            }

            // crreateInterestMeasureSettings
            if ($rdata->type == 'oper') {
                $this->createInterestMeasureTreshold($rdata);

            }

            $isPrevOper = in_array($rdata->type, $this->operators);
        }

        if (count($intsToSolve) == 2) {
            $antecedentId = $this->parsePartialCedent($this->reduceArrayByIndices($ruleData, $intsToSolve[0]['start'], $intsToSolve[0]['end']), $depth = 1, $forcedDepth, $minBracketSize);
            $this->createAntecedent($antecedentId);
            $consequentId = $this->parsePartialCedent($this->reduceArrayByIndices($ruleData, $intsToSolve[1]['start'], $intsToSolve[1]['end']), $depth = 1, $forcedDepth, $minBracketSize);
            $this->createConsequent($consequentId);
        } else if (count($intsToSolve) == 1) {
            $antecedentId = $this->parsePartialCedent($this->reduceArrayByIndices($ruleData, $intsToSolve[0]['start'], $intsToSolve[0]['end']), $depth = 1, $forcedDepth, $minBracketSize);
            $this->createAntecedent($antecedentId);
        }

        // update modelName
        $this->updateModelName($ruleData);

        // update TaskSetting
        $hypothesesCountMax = $jsonData->{'limitHits'};
        $this->updateTaskSetting($hypothesesCountMax);

        // Serialize XML
        return $this->finalXmlDocument->saveXML();
    }

    protected function parsePartialCedent($pcedent, $depth, $forcedDepth, $minBracketSize) {
        $brToSolve = $this->findOutterBrackets($pcedent, $minBracketSize); // brackets to solve at this level
        $bracketsInterval = $this->mergeIntervals($brToSolve);
        $bToSolve = $this->findBooleans($pcedent, $bracketsInterval); // booleans to solve at this level
        $aToSolve = $this->findAttributes($pcedent, $bracketsInterval); // attributes to solve at this level

        // TODO nenacita vnitrni cedent
        $dbaIds = array();
        foreach ($brToSolve as $br) {
            //if (isset($pcedent[$br['start'] + 1]) && isset($pcedent[$br['end'] -1]) && (($br['start'] + 1) > ($br['start'] + -1))) {
            $newPCedent = $this->reduceArrayByIndices($pcedent, $br['start'] + 1, $br['end'] - 1);
            $newPCedent = array_filter($newPCedent);
            array_push($dbaIds, $this->parsePartialCedent($newPCedent, ($depth + 1), $forcedDepth, $minBracketSize));
            //}
        }
        
        if (!empty($bToSolve)) {
            $bType = array_pop($bToSolve)->type;
        } else {
            $bType = 'and';
        }

        $cedentId = $this->createDbaSetting($bType, $aToSolve, $depth, $forcedDepth, $dbaIds);

        return $cedentId;
    }


    private function createBasicStructure() {
        $this->finalXmlDocument = new DomDocument("1.0", "UTF-8");
        //$this->finalXmlDocument->formatOutput = true;

        // add schematron validation
        $pi = $this->finalXmlDocument->createProcessingInstruction('oxygen', 'SCHSchema="http://sewebar.vse.cz/schemas/GUHARestr0_1.sch"');
        $this->finalXmlDocument->appendChild($pi);

        // create PMML
        $pmml = $this->finalXmlDocument->createElement('PMML');
        $pmml->setAttribute('version', '4.0');
        $pmml->setAttribute('xmlns', 'http://www.dmg.org/PMML-4_0');
        $pmml->setAttribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
        $pmml->setAttribute('xmlns:pmml', 'http://www.dmg.org/PMML-4_0');
        $pmml->setAttribute('xsi:schemaLocation', 'http://www.dmg.org/PMML-4_0 http://sewebar.vse.cz/schemas/PMML4.0+GUHA0.1.xsd');
        $root = $this->finalXmlDocument->appendChild($pmml);

        // add Header
        $header = $this->finalXmlDocument->createElement('Header');
        $header->setAttribute('copyright', 'Copyright (c) KIZI UEP');
        $ext = $this->finalXmlDocument->createElement('Extension');
        $ext->setAttribute('name', 'dataset');
        $ext->setAttribute('value', $this->ddXpath->query("//dd:DataDescription/Dictionary/@sourceName")->item(0)->value);
        $header->appendChild($ext);
        $ext = $this->finalXmlDocument->createElement('Extension');
        $ext->setAttribute('name', 'author');
        $ext->setAttribute('value', 'admin');
        $header->appendChild($ext);
        $ext = $this->finalXmlDocument->createElement('Extension');
        $ext->setAttribute('name', 'subsystem');
        $ext->setAttribute('value', '4ft-Miner');
        $header->appendChild($ext);
        $ext = $this->finalXmlDocument->createElement('Extension');
        $ext->setAttribute('name', 'module');
        $ext->setAttribute('value', '4ftResult.exe');
        $header->appendChild($ext);
        $ext = $this->finalXmlDocument->createElement('Extension');
        $ext->setAttribute('name', 'format');
        $ext->setAttribute('value', '4ftMiner.Task');
        $header->appendChild($ext);
        $app = $this->finalXmlDocument->createElement('Application');
        $app->setAttribute('name', 'SEWEBAR-CMS');
        $app->setAttribute('version', '0.00.01 '.date('d.m.Y'));
        $header->appendChild($app);
        $annot = $this->finalXmlDocument->createElement('Annotation');
        $header->appendChild($annot);
        $tst = $this->finalXmlDocument->createElement('Timestamp');
        $tst->appendChild($this->finalXmlDocument->createTextNode(date('d.m.Y H:i:s')));
        $header->appendChild($tst);
        $root->appendChild($header);

        //$this->createDataDescription($root);

        // create DataDictionary
        $dd = $this->finalXmlDocument->createElement('DataDictionary');
        $root->appendChild($dd);
        $this->dataDictionary = $dd;

        // create AssociationModel
        $associationModel = $this->finalXmlDocument->createElement('guha:AssociationModel');
        $associationModel->setAttribute('xmlns', '');
        $associationModel->setAttribute('xsi:schemaLocation', 'http://keg.vse.cz/ns/GUHA0.1rev1 http://sewebar.vse.cz/schemas/GUHA0.1rev1.xsd');
        $associationModel->setAttribute('xmlns:guha', 'http://keg.vse.cz/ns/GUHA0.1rev1');
        $this->modelName = $this->finalXmlDocument->createAttribute('modelName');
        $associationModel->setAttributeNode($this->modelName);
        $associationModel->setAttribute('functionName', 'associationRules');
        $associationModel->setAttribute('algorithmName', '4ft');

        // create TaskSetting
        $taskSetting = $this->finalXmlDocument->createElement("TaskSetting");
        $this->arQuery = $associationModel->appendChild($taskSetting);

        // extension LISp-Miner
        $extension = $this->finalXmlDocument->createElement('Extension');
        $extension->setAttribute('name', 'LISp-Miner');
        $hypotheses = $this->finalXmlDocument->createElement('HypothesesCountMax');
        $extension->appendChild($hypotheses);
        $this->arQuery->appendChild($extension);
        $this->hypotheses = $hypotheses;

        // extension metabase
        $extension = $this->finalXmlDocument->createElement('Extension');
        $extension->setAttribute('name', 'metabase');
        $extension->setAttribute('value', $this->ddXpath->query("//dd:DataDescription/Dictionary[@default='true']/Identifier[@name='Metabase']")->item(0)->nodeValue);
        $this->arQuery->appendChild($extension);

        $bbaSettings = $this->finalXmlDocument->createElement("BBASettings");
        $this->bbaSettings = $this->arQuery->appendChild($bbaSettings);
        $dbaSettings = $this->finalXmlDocument->createElement("DBASettings");
        $this->dbaSettings = $this->arQuery->appendChild($dbaSettings);
        $antecedentSetting = $this->finalXmlDocument->createElement("AntecedentSetting");
        $this->antecedentSetting = $this->arQuery->appendChild($antecedentSetting);
        $consequentSetting = $this->finalXmlDocument->createElement("ConsequentSetting");
        $this->consequentSetting = $this->arQuery->appendChild($consequentSetting);
        $interestMeasureSetting = $this->finalXmlDocument->createElement("InterestMeasureSetting");
        $this->interestMeasureSetting = $this->arQuery->appendChild($interestMeasureSetting);

        // create AssociationRules
        $associationRules = $this->finalXmlDocument->createElement("AssociationRules");
        $associationModel->appendChild($associationRules);

        $root->appendChild($associationModel);
    }

    /**
     * Update Model name
     *
     * @param <Array> $ruleData Array of StdClass objects representing the rule
     */
    private function updateModelName($ruleData) {
        $modelName = $this->getModelName($ruleData);
        $this->modelName->appendChild($this->finalXmlDocument->createTextNode($modelName));
    }

    /**
     * Update TaskSetting with LM extension
     *
     * @param <Array> $ruleData Array of StdClass objects representing the rule
     */
    private function updateTaskSetting($hypothesesCountMax) {
        $this->hypotheses->appendChild($this->finalXmlDocument->createTextNode($hypothesesCountMax));
    }

    /**
     * Get Model name for partial cedent
     *
     * @param <Array> $ruleData Array of StdClass objects representing the rule
     * @return <String> $modelName String representation of the rule
     */
    private function getModelName($ruleData) {
        if (DEV_MODE) {
            return date('d. m. Y H:i:s');
        }

        $modelName = '';
        $implInserted = false;
        foreach ($ruleData as $k => $rData) {
            $modelName .= '';
            if ($this->isType($rData->type, $this->attributes)) {
                $modelName .= (isset($rData->literalSign) && $this->isType($rData->literalSign, $this->negativeBooleans) ? strtoupper($this->negativeBoolean).' ' : '').$rData->name.($rData->category == $this->ONE_CATEGORY ? '('.$rData->fields[0]->value.')' : '(?)');
            } else if ($this->isType($rData->type, $this->booleans)) {
                $modelName .= strtoupper($rData->type);
            } else if ($this->isType($rData->type, $this->operators) && !$implInserted) {
                $modelName .= '=&gt;';
                $implInserted = true;
            }
            if (($k + 1) < count($ruleData)) { $modelName .= ' '; }
        }

        $modelName .= ' | '.sha1($this->finalXmlDocument->saveXML($this->arQuery));

        return $modelName;
    }

    /**
     * Create Data Description dictionary
     * It means get dictionary from elsewhere and just inject it here.
     */
    private function createDataDescription($root) {
        $dictionary = $this->finalXmlDocument->createElement("DataDescription");
        $this->dictionary = $root->appendChild($dictionary);

        // get <Dictionary>
        $anXPathExpr = "//dd:DataDescription";
        $field = $this->ddXpath->query($anXPathExpr);
        foreach ($field as $elField) {
            $fields = $elField->childNodes;
            foreach ($fields as $fieldSmall) {
                $this->dictionary->appendChild($this->finalXmlDocument->importNode($fieldSmall, true));
            }
        }
    }

    /**
     * Create InterestMeasureTreshold
     * <InterestMeasureSetting>
     *     <InterestMeasureTreshold id="ID">
     *         <InterestMeasure>Any Interest Measure</InterestMeasure>
     *     </InterestMeasureTreshold>
     *     <InterestMeasureTreshold id="ID">
     *         <InterestMeasure>Any Interest Measure2</InterestMeasure>
     *     </InterestMeasureTreshold>
     * </InterestMeasureSetting>
     *
     * @param <StdClass> $im Interest Measure StdClass object
     */
    private function createInterestMeasureTreshold($im) {
        $interestMeasureTreshold = $this->finalXmlDocument->createElement("InterestMeasureThreshold");
        $id = $this->getNewId();
        $interestMeasureTreshold->setAttribute("id", $id);
        $interestMeasureTreshold->appendChild($this->finalXmlDocument->createElement("InterestMeasure", $im->name));
        foreach ($im->fields as $f) {
            if ($f->name === 'threshold') {
                $interestMeasureTreshold->appendChild($this->finalXmlDocument->createElement("Threshold", $f->value));
            } else if ($f->name === 'alpha') {
                $interestMeasureTreshold->appendChild($this->finalXmlDocument->createElement("SignificanceLevel", $f->value));
            }
        }
        $interestMeasureTreshold->appendChild($this->finalXmlDocument->createElement("ThresholdType", $im->thresholdType));
        $interestMeasureTreshold->appendChild($this->finalXmlDocument->createElement("CompareType", $im->compareType));

        $this->interestMeasureSetting->appendChild($interestMeasureTreshold);
    }

    /**
     * Create Antecedent
     * <AntecedentSetting>ID</AntecedentSetting>
     *
     * @param <int> $antecedent content of BARef
     */
    private function createAntecedent($antecedent) {
        $this->antecedentSetting->appendChild($this->finalXmlDocument->createTextNode($antecedent));
    }

    /**
     * Create Consequent
     * <ConsequentSetting>ID</ConsequentSetting>
     *
     * @param <String> $consequent Content of BARef
     */
    private function createConsequent($consequent) {
        $this->consequentSetting->appendChild($this->finalXmlDocument->createTextNode($consequent));
    }

    /**
     * Create DBASetting
     * <DBASetting type="TYPE" id="ID">
     *     <BASettingRef>ID</BASettingRef>
     *     <BASettingRef>ID</BASettingRef>
     * </DBASetting>
     *
     * @param <String> $boolean Boolean type
     * @param <Array> $attributes Array of attributes
     * @return <Int> $id Id od DBA
     */
    private function createDbaSetting($btype, $attributes, $depth, $forcedDepth, $dbaIds = array()) {
        $id = $this->getNewId();
        $dbaSetting = $this->finalXmlDocument->createElement("DBASetting");
        $dbaSetting->setAttribute("type", $this->types[$btype]);
        $dbaSetting->setAttribute("id", $id);

        if (!$this->isType($btype, $this->literals)) {
            foreach ($attributes as $attribute) {
                if (($this->isType($btype, $this->positiveBooleans)) && ($depth < $forcedDepth)) {
                    $baSettingRefId = $this->createDbaSetting(($depth + 1) == $forcedDepth ? $this->literal : $this->forceDepthBoolean, array($attribute), ($depth + 1), $forcedDepth);
                    $baSettingRef = $this->finalXmlDocument->createElement("BASettingRef");
                    $baSettingRef->appendChild($this->finalXmlDocument->createTextNode($baSettingRefId));
                    $dbaSetting->appendChild($baSettingRef);
                }
            }
            foreach ($dbaIds as $dbaId) {
                $baSettingRef = $this->finalXmlDocument->createElement("BASettingRef");
                $baSettingRef->appendChild($this->finalXmlDocument->createTextNode($dbaId));
                $dbaSetting->appendChild($baSettingRef);
            }

            // create MinimalLength
            $minimalLength = $this->finalXmlDocument->createElement("MinimalLength");
            $minimalLength->appendChild($this->finalXmlDocument->createTextNode("1"));
            $dbaSetting->appendChild($minimalLength);

        } else if ($this->isType($btype, $this->literals)) {
            $baSettingRefId = $this->createBbaSetting($attributes[0]);

            $baSettingRef = $this->finalXmlDocument->createElement("BASettingRef");
            $baSettingRef->appendChild($this->finalXmlDocument->createTextNode($baSettingRefId));
            $dbaSetting->appendChild($baSettingRef);

            $literalSignText = isset($attributes[0]->literalSign) && $attributes[0]->literalSign == "neg" ? "Negative" : "Positive";
            $literalSign = $this->finalXmlDocument->createElement("LiteralSign");
            $literalSign->appendChild($this->finalXmlDocument->createTextNode($literalSignText));
            $dbaSetting->appendChild($literalSign);
        }

        $this->dbaSettings->appendChild($dbaSetting);

        return $id;
    }

    private function createBbaSetting($attribute) {
        $id = $this->getNewID();
        $baSetting = $this->finalXmlDocument->createElement("BBASetting");
        $baSetting->setAttribute("id", $id);

        $text = $this->finalXmlDocument->createElement("Text");
        $text->appendChild($this->finalXmlDocument->createTextNode($attribute->name));
        $baSetting->appendChild($text);

        $name = $this->finalXmlDocument->createElement("Name");
        $name->appendChild($this->finalXmlDocument->createTextNode($attribute->name));
        $baSetting->appendChild($name);

        $fieldRef = $this->finalXmlDocument->createElement("FieldRef");
        $fieldRef->appendChild($this->finalXmlDocument->createTextNode($attribute->name));
        $baSetting->appendChild($fieldRef);

        $coefficient = $this->createCoefficient($attribute);
        $baSetting->appendChild($coefficient);

        $this->bbaSettings->appendChild($baSetting);

        // update DataDictionary
        $df = $this->finalXmlDocument->createElement('DataField');
        $df->setAttribute('name', $attribute->name);
        $df->setAttribute('optype', 'categorical');
        $df->setAttribute('dataType', 'string');
        // TODO - uncomment
        //$this->dataDictionary->appendChild($df);

        return $id;
    }

    private function createCoefficient($attribute) {
        /*
         $attribute = new stdClass();
         $attribute->name = 'sex [abbrev]';
         $attribute->type = 'attr';
         $attribute->category = 'Interval';
         $field1 = new stdClass();
         $field1->name = 'category';
         $field1->value = '13';
         $field2->name = 'category';
         $field2->value = '17';
         $attribute->fields = array($field1, $field2);
         */

        $coefFields = $attribute->fields;
        $coefficient = $this->finalXmlDocument->createElement("Coefficient");

        $type = $this->finalXmlDocument->createElement("Type");
        $type->appendChild($this->finalXmlDocument->createTextNode($attribute->category));
        $coefficient->appendChild($type);

        if ($attribute->category == $this->ONE_CATEGORY) {
            $category = $this->finalXmlDocument->createElement("Category");
            $category->appendChild($this->finalXmlDocument->createTextNode($attribute->fields[0]->value));
            $coefficient->appendChild($category);
        } else {
            $fieldsLength = count($coefFields);
            $minLength = null;
            $maxLength = null;
            if ($fieldsLength < 1) {
                $minLength = 0;
            } else {
                $minLength = intval($attribute->fields[0]->value);
            }

            if ($fieldsLength < 2) {
                $maxLength = 9999;
            } else {
                $maxLength = intval($attribute->fields[1]->value);
            }

            $minimalLength = $this->finalXmlDocument->createElement("MinimalLength");
            $minimalLength->appendChild($this->finalXmlDocument->createTextNode($minLength));
            $coefficient->appendChild($minimalLength);

            $maximalLength = $this->finalXmlDocument->createElement("MaximalLength");
            $maximalLength->appendChild($this->finalXmlDocument->createTextNode($maxLength));
            $coefficient->appendChild($maximalLength);
        }

        return $coefficient;
    }

    /**
     * At the moment it just increments id and return it back.
     *
     * @return <int> id
     */
    private function getNewId() {
        return ++$this->id;
    }

    /**
     * Reduces array by indices.
     *
     * @param <Array> $array Input array
     * @param <int> $start Start index
     * @param <int> $end End index
     * @return <Array> $rarray Output array
     */
    private function reduceArrayByIndices($array, $start, $end) {
        $rarray = array();
        for ($i = $start; $i <= $end; $i++) {
            array_push($rarray, $array[$i]);
        }

        return $rarray;
    }

    /**
     * Find if there are any brackets.
     *
     * @param <Array> $pcedent Array of StdClasses representing partial cedent
     * @return <Boolean> Boolean value representing existence of brackets
     */
    private function hasBrackets($pcedent) {
        return $this->countBrackets($pcedente) ? true : false;
    }

    /**
     * Find if there are any brackets.
     *
     * @param <Array> $pcedent Array of StdClasses representing partial cedent
     * @return <int> $numBrackets Number of brackets
     */
    private function countBrackets($pcedent) {
        $numBrackets = 0;
        foreach ($pcedent as $obj) {
            if (in_array($obj->type, $this->brackets)) { $numBrackets++; }
        }

        return intval($numBrackets / 2);
    }

    /**
     * Find outter brackets to be solved as DBAs.
     *
     * @param <Array> $pcedent Array of StdClasses representing partial cedent
     * @param <Int> $minBracketSize Min. size of a bracket to be considered as s bracket
     * @return <Array> $oBrackets Array of intervals closed with outter brackets
     */
    private function findOutterBrackets($pcedent, $minBracketSize = 5) {
        $oBrackets = array();

        $oBracketsStack = array();
        $oBracketStart = 0;
        foreach($pcedent as $k => $obj) {
            if (in_array($obj->type, $this->openingBrackets)) {
                if (empty($oBrackets)) {
                    $oBracketStart = $k;
                }
                array_push($oBracketsStack, $obj->type);
            } else if (in_array($obj->type, $this->closingBrackets)) {
                array_pop($oBracketsStack);
                if (empty($oBracketsStack) && (($k - $oBracketStart + 1) >= $minBracketSize)) { // we do have outter bracket end here
                    array_push($oBrackets, array('start' => $oBracketStart, 'end' => $k));
                }
            }
        }

        return $oBrackets;
    }

    /**
     * Find booleans to be solved as DBAs.
     *
     * @param <Array> $pcedent Array of StdClasses representing partial cedent
     * @param <Array> $bracketsInterval Merged interval representing solved brackets as DBA
     * @return <Array> $booleans Array of booleans
     */
    private function findBooleans($pCedent, $bracketsInterval) {
        $booleans = array();

        foreach($pCedent as $k => $obj) {
            if (in_array($k, $bracketsInterval)) { continue; }
            if (in_array($obj->type, $this->booleans)) {
                $booleans[$k] = $obj;
            }
        }

        return $booleans;
    }

    /**
     * Find attributes to be solved as DBAs.
     *
     * @param <Array> $pcedent Array of StdClasses representing partial cedent
     * @param <Array> $bracketsInterval Merged interval representing solved brackets as DBA
     * @return <Array> $attributes Array of attributes
     */
    private function findAttributes($pCedent, $bracketsInterval) {
        $attributes = array();

        foreach($pCedent as $k => $obj) {
            if (in_array($k, $bracketsInterval)) { continue; }
            if (in_array($obj->type, $this->attributes)) {
                $attributes[$k] = $obj;
            }
        }

        return $attributes;
    }

    /**
     * Merge multiple intervals into single array.
     *
     * @param <Array> $intervals Array of intervals
     * @return <Array> $interval Output array
     */
    private function mergeIntervals($intervals) {
        $interval = array();
        foreach ($intervals as $interval) {
            for ($i = $interval['start']; $i <= $interval['end']; $i++) {
                array_push($interval, $i);
            }
        }

        return $interval;
    }

    /**
     * Replace negative boolean connectives.
     *
     * @param <Array> $ruleData Array of StdClass objects representing the rule
     * @param <Array> $negativeBooleans Array of negative booleans to be replaced
     * @return <Array> $ruleData Array of StdClass objects representing the rule
     */
    private function replaceNegativeBooleans($ruleData, $negativeBooleans) {
        foreach ($ruleData as $k => $rData) {
            if ($this->isType($rData->type, $negativeBooleans)) {
                unset($ruleData[$k]);
                $ruleData[$k + 1]->literalSign = $this->negativeBoolean;
            }
        }

        return $ruleData;
    }

    /**
     * Checks if the connective is at least one of the provided types.
     *
     * @param <String> $type Connective to check
     * @param <Array> $types Array of types to check against
     * @return <Bool> Is type?
     */
    private function isType($type, $types) {
        if (is_array($types)) {
            return in_array($type, $types);
        } else if (strlen($types)) {
            return $type == $types;
        }

        return false;
    }

}

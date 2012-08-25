<?php

/**
 * This class represents one DBA
 *
 * @author Jakub Balhar
 * @version 1.0
 */
class ARQueryDBA
{
    /**
     * It creates instance of this class based on params
     *
     * @param <DomNode> $dbaNode Node representing one DBA
     * @param <Array> $elements array containing elements of DBA
     */
    public function __construct($dbaNode, $elements)
    {
        $this->elements = $elements;
        $this->refs = array();
        $this->connective = "";
        $this->id = Utils::getAttribute($dbaNode, "id");
        $utils = new Utils();

        $dbas = $dbaNode->childNodes;
        $connective = $utils->getAttribute($dbaNode, "type");
        if ($connective == "Negation") {
            $this->connective = "NEG";
        } elseif ($connective == "Conjunction") {
            $this->connective = "AND";
        } elseif ($connective == "Disjunction") {
            $this->connective = "OR";
        }
        foreach ($dbas as $dba) {
            if ($dba->nodeName == "BASettingRef") {
                $this->refs[] = $dba->nodeValue;
            }
        }
    }

    /**
     * It is simple getter returning id
     *
     * @return <integer> id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * It creates JSON from this Object
     *
     * @return <String> JSON representing this Object
     */
    public function toJSON()
    {
        // Pro vsechny refs
        $elements = array();

        if (count($this->refs) > 1) {
            $elements[] = Utils::getBoolean("(", "lbrac");
        }

        for ($actualEl = 0; $actualEl < count($this->refs); $actualEl++) {
            if ($this->connective == "NEG") {
                $elements[] = Utils::getBoolean($this->connective, strtolower($this->connective));
            }
            // Proved toJSON a pole ktere vrati spoj.
            // Je jeste potreba nejprve podle id DBA ziskat
            $allElements = $this->elements[$this->refs[$actualEl]]->toJSON();
            for ($el = 0; $el < count($allElements); $el++) {
                $elements[] = $allElements[$el];
            }
            // dopln pole o boolean operator
            if ($actualEl + 1 < count($this->refs) && $this->connective != "NEG") {
                $elements[] = Utils::getBoolean($this->connective, strtolower($this->connective));
            }
        }

        if (count($this->refs) > 1) {
            $elements[] = Utils::getBoolean(")", "rbrac");
        }

        return $elements;
    }

}

/**
 * This class represents one BBA
 *
 * @author Jakub Balhar
 * @version 1.0
 */
class ARQueryBBA
{
    /**
     * It creates instance of this class based on params
     *
     * @param <DomNode> $bbaNode Node representing one BBA
     */
    public function __construct($bbaNode)
    {
        $this->fieldRef = "";
        $this->catRef = array();

        $bbaChildren = $bbaNode->childNodes;
        foreach ($bbaChildren as $bbaChild) {
            if ($bbaChild->nodeName == "FieldRef") {
                $this->fieldRef = $bbaChild->nodeValue;
            }
            if ($bbaChild->nodeName == "Coefficient") {
                $this->catRef[] = new ARQueryBBAField($bbaChild);
            }
        }
        $this->id = Utils::getAttribute($bbaNode, "id");
    }

    /**
     * It is simple getter returning id
     *
     * @return <integer> id
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * It creates JSON from this Object
     *
     * @return <String> JSON representing this Object
     */
    public function toJSON()
    {
        $element = array();
        $element['name'] = $this->fieldRef;
        $element['type'] = "attr";
        $element['category'] = "One category";

        $fields = array();
        for ($actualField = 0; $actualField < count($this->catRef); $actualField++) {
            $field = $this->catRef[$actualField]->toJSON();
            $fields[] = $field;
        }

        $element['fields'] = $fields;
        return array($element);
    }

}

/**
 * This class represents one Field
 *
 * @author Jakub Balhar
 * @version 1.0
 */
class ARQueryBBAField
{
    /**
     * It creates instance of this class based on params
     *
     * @param <DomNode> $fieldNode Node representing one field
     */
    public function __construct($fieldNode)
    {
        $this->name = "";
        $this->value = array();

        $fieldChildren = $fieldNode->childNodes;
        foreach ($fieldChildren as $fieldChild) {
            if ($fieldChild->nodeName == "Type") {
                $this->name = $fieldChild->nodeValue;
            }
            if ($fieldChild->nodeName == "Category") {
                $this->value = $fieldChild->nodeValue;
            }
        }
    }

    /**
     * It creates JSON from this Object
     *
     * @return <String> JSON representing this Object
     */
    public function toJSON()
    {
        $field = array();
        $field['name'] = $this->name;
        $field['value'] = $this->value;
        return $field;
    }

}

/**
 * This class represents one rule
 *
 * @author Jakub Balhar
 * @version 1.0
 */
class ARQueryRule
{
    /**
     * It creates AsociationRule based on the parameters
     *
     * @param <DomNode> $asociationRuleNode Node representing one rule
     * @param <DomDocument> $domER DomDocument representing XML containing rules
     */
    public function __construct($asociationRuleNode, $domER)
    {
        if ($domER->getElementsByTagName('AntecedentSetting')->length > 0) {
            $antNode = $domER->getElementsByTagName('AntecedentSetting')->item(0);
            $this->antecedent = $antNode->nodeValue;
        } else {
            $this->antecedent = null;
        }
        if ($domER->getElementsByTagName('ConsequentSetting')->length > 0) {
            $conNode = $domER->getElementsByTagName('ConsequentSetting')->item(0);
            $this->consequent = $conNode->nodeValue;
        } else {
            $this->consequent = null;
        }

        $this->interestMeasures = array();
        $elements = $domER->getElementsByTagName('InterestMeasure');
        foreach ($elements as $element) {
            $im = $element->nodeValue;
            $this->interestMeasures[] = $im;
        }
        $this->elements = array();
        $elements = $domER->getElementsByTagName('BBASetting');
        foreach ($elements as $element) {
            $bba = new ARQueryBBA($element, $this->elements);
            $this->elements[$bba->getId()] = $bba;
        }
        $elements = $domER->getElementsByTagName('DBASetting');
        foreach ($elements as $element) {
            $dba = new ARQueryDBA($element, $this->elements);
            $this->elements[$dba->getId()] = $dba;
        }
    }

    /**
     * It gets all elements and creates JSON from them
     *
     * @return <String> JSON representing Rules
     */
    public function toJSON()
    {
        $arrayOfElements = array();
        if ($this->antecedent != null) {
            $antJson = $this->elements[$this->antecedent]->toJSON();
            foreach ($antJson as $element) {
                $arrayOfElements[] = $element;
            }
        }
        for ($actualIm = 0; $actualIm < count($this->interestMeasures); $actualIm++) {
            $im = array();
            $name = $this->interestMeasures[$actualIm];
            $type = "oper";
            $im["name"] = $name;
            $im["type"] = $type;
            $im["category"] = "";
            $im["fields"] = array();
            $arrayOfElements[] = $im;
        }
        if ($this->consequent != null) {
            $consJson = $this->elements[$this->consequent]->toJSON();
            foreach ($consJson as $element) {
                $arrayOfElements[] = $element;
            }
        }
        return $arrayOfElements;
    }

}


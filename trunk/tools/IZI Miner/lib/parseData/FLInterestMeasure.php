<?php

/**
 * FLInterestMeasure value object
 *
 * @author Radek Skrabal <radek@skrabal.me>
 * @version 1.0
 */
class FLInterestMeasure {

    private $name;
    private $defaultValue;
    private $localizedName;
    private $thresholdType;
    private $compareType;
    private $explanation;
    private $fields;

    public function __construct ($name, $defaultValue, $localizedName, $thresholdType, $compareType, $explanation) {
        $this->name = $name;
        $this->defaultValue = $defaultValue;
        $this->localizedName = $localizedName;
        $this->thresholdType = $thresholdType;
        $this->compareType = $compareType;
        $this->explanation = $explanation;
        $this->fields = array();
    }

    public function addIntervalField ($name, $localizedName, $minValue, $minValueInclusive, $maxValue, $maxValueInclusive, $dataType) {
        $arr = array(
        	'name' => $name,
            'localizedName' => $localizedName,
            'minValue' => $minValue,
            'minValueInclusive' => $minValueInclusive,
            'maxValue' => $maxValue,
            'maxValueInclusive' => $maxValueInclusive,
            'dataType' => $dataType);
        array_push($this->fields, $arr);
    }

    public function addEnumerationField ($name, $localizedName, $values, $dataType) {
        $arr = array(
        	'name' => $name,
            'localizedName' => $localizedName,
            'values' => $values,
            'dataType' => $dataType);
        array_push($this->fields, $arr);
    }

    public function toArray () {
        $array = array(
        $this->name => array(
            'defaultValue' => $this->defaultValue,
            	'localizedName' => $this->localizedName,
                'thresholdType' => $this->thresholdType,
                'compareType' => $this->compareType,
				'explanation' => $this->explanation,
				'fields' => $this->fields));

        return $array;
    }

}
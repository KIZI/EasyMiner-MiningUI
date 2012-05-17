<?php

/**
 * ERInterestMeasure value object
 *
 * @author Radek Skrabal <radek@skrabal.me>
 * @version 1.0
 */
class ERInterestMeasure {

    private $name;
    private $value;

    public function __construct($name, $value) {
        $this->name = $name;
        $this->value = $value;
    }

    public function getName() {
        return $this->name;
    }

    public function getValue() {
        return $this->value;
    }

    public function toArray() {
        $array = array('name' => $this->name,
               'type' => 'im',
               'category' => '',
               'fields' => array('name' => 'threshold', 
               			   	 'value' => $this->value));

        return $array;
    }

}
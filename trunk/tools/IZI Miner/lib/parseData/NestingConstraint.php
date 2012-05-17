<?php

/**
 * NestingConstraint value object
 *
 * @author Radek Skrabal <radek@skrabal.me>
 * @version 1.0
 */
class NestingConstraint {

    private $level;
    private $connectives;

    public function __construct() {
        $this->connectives = array();
    }

    public function setLevel($level) {
        $this->level = $level;
    }

    public function addConnective($name, $allowed) {
        $connective = array($name => array('allowed' => $allowed));
        $this->connectives = array_merge_recursive($this->connectives, $connective);
    }

    public function toArray() {
        $array = array('level'.$this->level => array());
        $array['level'.$this->level] = array_merge_recursive($array['level'.$this->level], $this->connectives);

        return $array;
    }

}
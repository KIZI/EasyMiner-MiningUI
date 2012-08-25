<?php

namespace IZI\AssociationRule;

use IZI\Exception\InvalidDBAException;

class DBA
{
    private $id;
    private $connective;
    private $refIds;
    private $level;
    private $refs;

    public function  __construct($id, Connective $connective, $refIds, $level)
    {
        $this->id = $id;
        $this->connective = $connective;
        $this->refIds = $refIds;
        $this->level = $level;
        $this->refs = array();
    }

    public function getId()
    {
        return $this->id;
    }

    public function getConnective()
    {
        return $this->connective;
    }

    public function getRefIds()
    {
        return $this->refIds;
    }

    public function getLevel()
    {
        return $this->level;
    }

    public function setLevel($val)
    {
        $this->level = $val;
    }

    public function addRef($ref)
    {
        if (!($ref instanceof BBA) && !($ref instanceof DBA)) {
            throw new InvalidDBAException('Invalid DBA');
        }

        array_push($this->refs, $ref);
    }

    public function getRefs()
    {
        return $this->refs;
    }

    public function toArray()
    {
        $array = array();
        if (count($this->refs) == 1) {
            if ($this->connective->isUnary()) {  // negation
                array_push($array, $this->connective->toArray());
            }

            $array = array_merge_recursive($array, $this->refs[0]->toArray());

            return $array;
        }

        $array = array();
        if ($this->connective->isBinary() && $this->getLevel() > 1 && count($this->refs) > 1) {
            array_push($array, $this->connective->getLbrac());
        }

        if ($this->connective->isUnary()) {  // negation
            array_push($array, $this->connective->toArray());
        }

        foreach ($this->refs as $k => $r) {
            if ($this->connective->isBinary() && $k > 0) { // conjunction, disjunction
                array_push($array, $this->connective->toArray());
            }

            $array = array_merge_recursive($array, $r->toArray());

            /*
             $ref = array();
             foreach ($r->toArray() as $k => $ir) {
             $ref[$k] = $ir;
             }
             array_push($array, $ref);
             */
        }

        if ($this->connective->isBinary() && $this->getLevel() > 1 && count($this->refs) > 1) {
            array_push($array, $this->connective->getRbrac());
        }

        //var_dump(var_dump($this->id), $array);

        return $array;
    }

}

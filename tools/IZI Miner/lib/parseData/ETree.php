<?php

class ETree
{
    private $algorithm;

    public function __construct($algorithm)
    {
        $this->algorithm = $algorithm;
    }

    public function parse()
    {
        $this->algorithm->evaluate();

        return $this->algorithm->getAttributes();
    }

}
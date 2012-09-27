<?php

require_once "Bootstrap.php";

use IZI\Algorithm\BasicChiSquareAlgorithm;
use IZI\FileLoader\XMLLoader;

class BasicChiSquareAlgorithmTest extends PHPUnit_Framework_TestCase
{

    protected $ETreeRules;
    protected $Xpath;

    public function setUp()
    {
        $loader = new XMLLoader();
        $ETree = $loader->load(DATA_PATH.'etree_result.pmml');
        $this->Xpath = new \DOMXPath($ETree);
        $this->ETreeRules = $this->Xpath->evaluate('//ETreeRules')->item(0);
    }

    public function testEvaluate()
    {
        $algorithm = new BasicChiSquareAlgorithm($this->ETreeRules, $this->Xpath);
        $algorithm->evaluate();
        $expected = [
            'Age_in_years' => 1,
            'Repayment' => 0.2,
            'Amount' => 0.12,
            'Age' => 0.1,
            'Duration' => 0.1,
        ];

        $this->assertEquals($expected, $algorithm->getAttributes());
    }

}

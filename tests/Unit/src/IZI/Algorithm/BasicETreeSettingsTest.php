<?php

require_once "Bootstrap.php";

use IZI\Algorithm\BasicETreeSettings;
use IZI\FileLoader\XMLLoader;

class BasicETreeSettingsTest extends PHPUnit_Framework_TestCase
{

    protected $FAXpath;

    public function setUp()
    {
        $loader = new XMLLoader();
        $FA = $loader->load(FA);
        $this->FAXpath = new \DOMXPath($FA);
    }

    public function testEvaluate()
    {
        $settings = new BasicETreeSettings(
            $this->FAXpath,
            ['name' => 'Quality'],
            [['name' => 'District', 'type' => 'One category', 'cat' => 'Praha']],
            json_decode('[{"name":"CHI","thresholdType":"% of all","compareType":"Greater than or equal","fields":[{"name":"alpha","value":"0.01"}]}]')
        );
        $expected = [
            'extension' => [
                'ETTaskParamSplitAttributesMax' => 6,
                'ETTaskParamTreeDepthMax' => 1,
                'ETTaskParamTreeCountMax' => 500,
                'ETTaskParamFullDepthTreesOnly' => 'Yes',
                'HypothesesCountMax' => 150,
            ],
            'IM' => [
                'NodeFreqMin' => 1,
                'PerformChiSqTest' => 'Yes',
                'SplitSignificanceAlpha' => 0.025,
                'NodePurityMin' => 0.924924,
                'TreeQualityMin' => 0.924,
            ],
        ];

        $this->assertEquals($expected, $settings->evaluate());
    }

}

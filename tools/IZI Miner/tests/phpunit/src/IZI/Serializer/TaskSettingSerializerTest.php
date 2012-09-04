<?php

require_once 'Bootstrap.php';

use IZI\Serializer\TaskSettingSerializer;

class TaskSettingSerializerTest extends PHPUnit_Framework_TestCase
{

    public function testGenerateId()
    {
        $serializer = new TaskSettingSerializer(DD);

        $this->assertEquals(1, $serializer->generateId());
        $this->assertEquals(2, $serializer->generateId());
        $this->assertEquals(3, $serializer->generateId());
    }

    public function testGetBooleanName()
    {
        $serializer = new TaskSettingSerializer(DD);

        $this->assertEquals('Negation', $serializer->getBooleanName('neg'));
        $this->assertEquals('Conjunction', $serializer->getBooleanName('and'));
        $this->assertEquals('Disjunction', $serializer->getBooleanName('or'));
        $this->assertEquals('Literal', $serializer->getBooleanName('lit'));
    }

    public function testIsLiteral()
    {
        $serializer = new TaskSettingSerializer(DD);

        $this->assertEquals(true, $serializer->isLiteral('Literal'));
        $this->assertEquals(false, $serializer->isLiteral('Negation'));
        $this->assertEquals(false, $serializer->isLiteral('Conjunction'));
        $this->assertEquals(false, $serializer->isLiteral('Disjunction'));
    }

    public function testSerialize()
    {
        $data = '{"limitHits":250,"rule0":{"antecedent":{"type":"cedent","connective":{"name":"AND","type":"and"},"level":1,"children":[{"name":"District","category":"One category","fields":[{"name":"category","value":"Praha"}],"sign":"positive"}]},"IMs":[{"name":"FUI","thresholdType":"% of all","compareType":"Greater than or equal","fields":[{"name":"threshold","value":"0.5"}]}],"succedent":{"type":"cedent","connective":{"name":"AND","type":"and"},"level":1,"children":[{"name":"Quality","category":"One category","fields":[{"name":"category","value":"good"}],"sign":"positive"}]}},"rules":1}';
        $serialized = '<?xml version="1.0" encoding="UTF-8"?>
<?oxygen SCHSchema="http://sewebar.vse.cz/schemas/GUHARestr0_1.sch"?>
<PMML xmlns="http://www.dmg.org/PMML-4_0" version="4.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:pmml="http://www.dmg.org/PMML-4_0" xsi:schemaLocation="http://www.dmg.org/PMML-4_0 http://sewebar.vse.cz/schemas/PMML4.0+GUHA0.1.xsd"><Header copyright="Copyright (c) KIZI UEP"><Extension name="dataset" value="Loans"/><Extension name="author" value="admin"/><Extension name="subsystem" value="4ft-Miner"/><Extension name="module" value="4ftResult.exe"/><Extension name="format" value="4ftMiner.Task"/><Application name="SEWEBAR-CMS" version="0.00.01 '.date('d.m.Y').'"/><Annotation/><Timestamp>'.date('d.m.Y H:i:s').'</Timestamp></Header><DataDictionary/><guha:AssociationModel xmlns="" xsi:schemaLocation="http://keg.vse.cz/ns/GUHA0.1rev1 http://sewebar.vse.cz/schemas/GUHA0.1rev1.xsd" xmlns:guha="http://keg.vse.cz/ns/GUHA0.1rev1" modelName="a24160a6d6eb1a1e02a33f08b41f7463f71ba6c8" functionName="associationRules" algorithmName="4ft"><TaskSetting><Extension name="LISp-Miner"><HypothesesCountMax>250</HypothesesCountMax></Extension><Extension name="metabase" value="LM Barbora.mdb MB"/><BBASettings><BBASetting id="13"><Text>District</Text><Name>District</Name><FieldRef>District</FieldRef><Coefficient><Type>One category</Type><Category>Praha</Category></Coefficient></BBASetting><BBASetting id="18"><Text>Quality</Text><Name>Quality</Name><FieldRef>Quality</FieldRef><Coefficient><Type>One category</Type><Category>good</Category></Coefficient></BBASetting></BBASettings><DBASettings><DBASetting type="Conjunction" id="10"><BASettingRef>11</BASettingRef><MinimalLength>1</MinimalLength></DBASetting><DBASetting type="Conjunction" id="11"><BASettingRef>12</BASettingRef><MinimalLength>1</MinimalLength></DBASetting><DBASetting type="Literal" id="12"><BASettingRef>13</BASettingRef><LiteralSign>Positive</LiteralSign></DBASetting><DBASetting type="Conjunction" id="15"><BASettingRef>16</BASettingRef><MinimalLength>1</MinimalLength></DBASetting><DBASetting type="Conjunction" id="16"><BASettingRef>17</BASettingRef><MinimalLength>1</MinimalLength></DBASetting><DBASetting type="Literal" id="17"><BASettingRef>18</BASettingRef><LiteralSign>Positive</LiteralSign></DBASetting></DBASettings><AntecedentSetting>10</AntecedentSetting><ConsequentSetting>15</ConsequentSetting><InterestMeasureSetting><InterestMeasureThreshold id="14"><InterestMeasure>FUI</InterestMeasure><Threshold>0.5</Threshold><ThresholdType>% of all</ThresholdType><CompareType>Greater than or equal</CompareType></InterestMeasureThreshold></InterestMeasureSetting></TaskSetting><AssociationRules/></guha:AssociationModel></PMML>';
        $TSS = new TaskSettingSerializer(DD);

        $this->assertXmlStringEqualsXmlString($serialized, $TSS->serialize($data));
    }

    public function testSerialize2() {
        // TODO disjunction on level 1
        $this->markTestIncomplete();
    }

}

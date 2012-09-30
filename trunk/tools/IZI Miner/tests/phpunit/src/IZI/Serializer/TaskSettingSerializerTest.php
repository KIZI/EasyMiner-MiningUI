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

    public function testSerializeConjunctionLevel1()
    {
        $data = '{"limitHits":250,"rule0":{"antecedent":{"type":"cedent","connective":{"name":"AND","type":"and"},"level":1,"children":[{"name":"District","category":"One category","fields":[{"name":"category","value":"Praha"}],"sign":"positive"}]},"IMs":[{"name":"FUI","thresholdType":"% of all","compareType":"Greater than or equal","fields":[{"name":"threshold","value":"0.5"}]}],"succedent":{"type":"cedent","connective":{"name":"AND","type":"and"},"level":1,"children":[{"name":"Quality","category":"One category","fields":[{"name":"category","value":"good"}],"sign":"positive"}]}},"rules":1,"modelName":"d428deef91df8ddf080dccdaf8cb18eb0c925dd0"}';
        $serialized = '<?xml version="1.0" encoding="UTF-8"?>
<?oxygen SCHSchema="http://sewebar.vse.cz/schemas/GUHARestr0_1.sch"?>
<PMML xmlns="http://www.dmg.org/PMML-4_0" version="4.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:pmml="http://www.dmg.org/PMML-4_0" xsi:schemaLocation="http://www.dmg.org/PMML-4_0 http://sewebar.vse.cz/schemas/PMML4.0+GUHA0.1.xsd"><Header copyright="Copyright (c) KIZI UEP"><Extension name="dataset" value="Loans"/><Extension name="author" value="admin"/><Extension name="subsystem" value="4ft-Miner"/><Extension name="module" value="4ftResult.exe"/><Extension name="format" value="4ftMiner.Task"/><Application name="SEWEBAR-CMS" version="0.00.01 '.date('d.m.Y').'"/><Annotation/><Timestamp>'.date('d.m.Y H:i:s').'</Timestamp></Header><DataDictionary/><guha:AssociationModel xmlns="" xsi:schemaLocation="http://keg.vse.cz/ns/GUHA0.1rev1 http://sewebar.vse.cz/schemas/GUHA0.1rev1.xsd" xmlns:guha="http://keg.vse.cz/ns/GUHA0.1rev1" modelName="d428deef91df8ddf080dccdaf8cb18eb0c925dd0" functionName="associationRules" algorithmName="4ft"><TaskSetting><Extension name="LISp-Miner"><HypothesesCountMax>250</HypothesesCountMax></Extension><Extension name="metabase" value="LM Barbora.mdb MB"/><BBASettings><BBASetting id="4"><Text>District</Text><Name>District</Name><FieldRef>District</FieldRef><Coefficient><Type>One category</Type><Category>Praha</Category></Coefficient></BBASetting><BBASetting id="9"><Text>Quality</Text><Name>Quality</Name><FieldRef>Quality</FieldRef><Coefficient><Type>One category</Type><Category>good</Category></Coefficient></BBASetting></BBASettings><DBASettings><DBASetting id="1" type="Conjunction"><BASettingRef>2</BASettingRef><MinimalLength>1</MinimalLength></DBASetting><DBASetting id="2" type="Conjunction"><BASettingRef>3</BASettingRef><MinimalLength>1</MinimalLength></DBASetting><DBASetting id="3" type="Literal"><BASettingRef>4</BASettingRef><LiteralSign>Positive</LiteralSign></DBASetting><DBASetting id="6" type="Conjunction"><BASettingRef>7</BASettingRef><MinimalLength>1</MinimalLength></DBASetting><DBASetting id="7" type="Conjunction"><BASettingRef>8</BASettingRef><MinimalLength>1</MinimalLength></DBASetting><DBASetting id="8" type="Literal"><BASettingRef>9</BASettingRef><LiteralSign>Positive</LiteralSign></DBASetting></DBASettings><AntecedentSetting>1</AntecedentSetting><ConsequentSetting>6</ConsequentSetting><InterestMeasureSetting><InterestMeasureThreshold id="5"><InterestMeasure>FUI</InterestMeasure><Threshold>0.5</Threshold><ThresholdType>% of all</ThresholdType><CompareType>Greater than or equal</CompareType></InterestMeasureThreshold></InterestMeasureSetting></TaskSetting><AssociationRules/></guha:AssociationModel></PMML>';
        $TSS = new TaskSettingSerializer(DD);

        $this->assertXmlStringEqualsXmlString($serialized, $TSS->serialize($data));
    }

    public function testSerializeDisjunctionLevel1() {
        $data = '{"limitHits":250,"rule0":{"antecedent":{"type":"cedent","connective":{"name":"OR","type":"or"},"level":1,"children":[{"name":"District","category":"Subset","fields":[{"name":"minLength","value":"1"},{"name":"maxLength","value":"1"}],"sign":"positive"},{"name":"Salary","category":"Subset","fields":[{"name":"minLength","value":"1"},{"name":"maxLength","value":"1"}],"sign":"positive"}]},"IMs":[{"name":"FUI","thresholdType":"% of all","compareType":"Greater than or equal","fields":[{"name":"threshold","value":"0.70"}]}],"succedent":{"type":"cedent","connective":{"name":"AND","type":"and"},"level":1,"children":[{"name":"Quality","category":"Subset","fields":[{"name":"minLength","value":"1"},{"name":"maxLength","value":"1"}],"sign":"positive"}]}},"rules":1,"modelName":"9a6f16d97c092f2174ad8b9101abce5003d0e387"}';
        $serialized = '<?xml version="1.0" encoding="UTF-8"?>
<?oxygen SCHSchema="http://sewebar.vse.cz/schemas/GUHARestr0_1.sch"?>
<PMML xmlns="http://www.dmg.org/PMML-4_0" version="4.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:pmml="http://www.dmg.org/PMML-4_0" xsi:schemaLocation="http://www.dmg.org/PMML-4_0 http://sewebar.vse.cz/schemas/PMML4.0+GUHA0.1.xsd"><Header copyright="Copyright (c) KIZI UEP"><Extension name="dataset" value="Loans"/><Extension name="author" value="admin"/><Extension name="subsystem" value="4ft-Miner"/><Extension name="module" value="4ftResult.exe"/><Extension name="format" value="4ftMiner.Task"/><Application name="SEWEBAR-CMS" version="0.00.01 '.date('d.m.Y').'"/><Annotation/><Timestamp>'.date('d.m.Y H:i:s').'</Timestamp></Header><DataDictionary/><guha:AssociationModel xmlns="" xsi:schemaLocation="http://keg.vse.cz/ns/GUHA0.1rev1 http://sewebar.vse.cz/schemas/GUHA0.1rev1.xsd" xmlns:guha="http://keg.vse.cz/ns/GUHA0.1rev1" modelName="9a6f16d97c092f2174ad8b9101abce5003d0e387" functionName="associationRules" algorithmName="4ft"><TaskSetting><Extension name="LISp-Miner"><HypothesesCountMax>250</HypothesesCountMax></Extension><Extension name="metabase" value="LM Barbora.mdb MB"/><BBASettings><BBASetting id="4"><Text>District</Text><Name>District</Name><FieldRef>District</FieldRef><Coefficient><Type>Subset</Type><MinimalLength>1</MinimalLength><MaximalLength>1</MaximalLength></Coefficient></BBASetting><BBASetting id="6"><Text>Salary</Text><Name>Salary</Name><FieldRef>Salary</FieldRef><Coefficient><Type>Subset</Type><MinimalLength>1</MinimalLength><MaximalLength>1</MaximalLength></Coefficient></BBASetting><BBASetting id="11"><Text>Quality</Text><Name>Quality</Name><FieldRef>Quality</FieldRef><Coefficient><Type>Subset</Type><MinimalLength>1</MinimalLength><MaximalLength>1</MaximalLength></Coefficient></BBASetting></BBASettings><DBASettings><DBASetting id="1" type="Conjunction"><BASettingRef>2</BASettingRef><MinimalLength>1</MinimalLength></DBASetting><DBASetting id="2" type="Disjunction"><BASettingRef>3</BASettingRef><BASettingRef>5</BASettingRef><MinimalLength>1</MinimalLength></DBASetting><DBASetting id="3" type="Literal"><BASettingRef>4</BASettingRef><LiteralSign>Positive</LiteralSign></DBASetting><DBASetting id="5" type="Literal"><BASettingRef>6</BASettingRef><LiteralSign>Positive</LiteralSign></DBASetting><DBASetting id="8" type="Conjunction"><BASettingRef>9</BASettingRef><MinimalLength>1</MinimalLength></DBASetting><DBASetting id="9" type="Conjunction"><BASettingRef>10</BASettingRef><MinimalLength>1</MinimalLength></DBASetting><DBASetting id="10" type="Literal"><BASettingRef>11</BASettingRef><LiteralSign>Positive</LiteralSign></DBASetting></DBASettings><AntecedentSetting>1</AntecedentSetting><ConsequentSetting>8</ConsequentSetting><InterestMeasureSetting><InterestMeasureThreshold id="7"><InterestMeasure>FUI</InterestMeasure><Threshold>0.70</Threshold><ThresholdType>% of all</ThresholdType><CompareType>Greater than or equal</CompareType></InterestMeasureThreshold></InterestMeasureSetting></TaskSetting><AssociationRules/></guha:AssociationModel></PMML>';
        $TSS = new TaskSettingSerializer(DD);

        $this->assertXmlStringEqualsXmlString($serialized, $TSS->serialize($data));
    }

}

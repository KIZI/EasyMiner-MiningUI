<?php

require_once 'Bootstrap.php';

use IZI\Serializer\TaskSettingSerializer;

class TaskSettingSerializerTest extends PHPUnit_Framework_TestCase
{

    public function testSerialize()
    {
        $data = '{"limitHits":250,"rule0":[{"name":"Repayment","type":"attr","category":"Subset","fields":[{"name":"minLength","value":"1"},{"name":"maxLength","value":"1"}],"sign":"positive"},{"name":"FUI","type":"oper","thresholdType":"% of all","compareType":"Greater than or equal","fields":[{"name":"threshold","value":"0.5"}]},{"name":"Quality","type":"attr","category":"One category","fields":[{"name":"category","value":"good"}],"sign":"negative"}],"rules":1}';
        $serialized = '<?xml version="1.0" encoding="UTF-8"?>
<?oxygen SCHSchema="http://sewebar.vse.cz/schemas/GUHARestr0_1.sch"?>
<PMML xmlns="http://www.dmg.org/PMML-4_0" version="4.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:pmml="http://www.dmg.org/PMML-4_0" xsi:schemaLocation="http://www.dmg.org/PMML-4_0 http://sewebar.vse.cz/schemas/PMML4.0+GUHA0.1.xsd"><Header copyright="Copyright (c) KIZI UEP"><Extension name="dataset" value="Loans"/><Extension name="author" value="admin"/><Extension name="subsystem" value="4ft-Miner"/><Extension name="module" value="4ftResult.exe"/><Extension name="format" value="4ftMiner.Task"/><Application name="SEWEBAR-CMS" version="0.00.01 '.date('d.m.Y').'"/><Annotation/><Timestamp>'.date('d.m.Y H:i:s').'</Timestamp></Header><DataDictionary/><guha:AssociationModel xmlns="" xsi:schemaLocation="http://keg.vse.cz/ns/GUHA0.1rev1 http://sewebar.vse.cz/schemas/GUHA0.1rev1.xsd" xmlns:guha="http://keg.vse.cz/ns/GUHA0.1rev1" modelName="Repayment(?) =&amp;gt; Quality(good) | c80e9b22c2d457f01c13c574541a8e7c811169b0" functionName="associationRules" algorithmName="4ft"><TaskSetting><Extension name="LISp-Miner"><HypothesesCountMax>250</HypothesesCountMax></Extension><Extension name="metabase" value="LM Barbora.mdb MB"/><BBASettings><BBASetting id="5"><Text>Repayment</Text><Name>Repayment</Name><FieldRef>Repayment</FieldRef><Coefficient><Type>Subset</Type><MinimalLength>1</MinimalLength><MaximalLength>1</MaximalLength></Coefficient></BBASetting><BBASetting id="9"><Text>Quality</Text><Name>Quality</Name><FieldRef>Quality</FieldRef><Coefficient><Type>One category</Type><Category>good</Category></Coefficient></BBASetting></BBASettings><DBASettings><DBASetting type="Literal" id="4"><BASettingRef>5</BASettingRef><LiteralSign>Positive</LiteralSign></DBASetting><DBASetting type="Conjunction" id="3"><BASettingRef>4</BASettingRef><MinimalLength>1</MinimalLength></DBASetting><DBASetting type="Conjunction" id="2"><BASettingRef>3</BASettingRef><MinimalLength>1</MinimalLength></DBASetting><DBASetting type="Literal" id="8"><BASettingRef>9</BASettingRef><LiteralSign>Negative</LiteralSign></DBASetting><DBASetting type="Conjunction" id="7"><BASettingRef>8</BASettingRef><MinimalLength>1</MinimalLength></DBASetting><DBASetting type="Conjunction" id="6"><BASettingRef>7</BASettingRef><MinimalLength>1</MinimalLength></DBASetting></DBASettings><AntecedentSetting>2</AntecedentSetting><ConsequentSetting>6</ConsequentSetting><InterestMeasureSetting><InterestMeasureThreshold id="1"><InterestMeasure>FUI</InterestMeasure><Threshold>0.5</Threshold><ThresholdType>% of all</ThresholdType><CompareType>Greater than or equal</CompareType></InterestMeasureThreshold></InterestMeasureSetting></TaskSetting><AssociationRules/></guha:AssociationModel></PMML>';
        $TSS = new TaskSettingSerializer(DD);

        $this->assertXmlStringEqualsXmlString($serialized, $TSS->serialize($data));
    }

}

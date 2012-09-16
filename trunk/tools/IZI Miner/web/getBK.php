<?php

require_once './Bootstrap.php';
require_once '../config/Config.php';

use IZI\Encoder\URLEncoder;
use IZI\FileLoader\XMLLoader;
use IZI\Parser\DataParser;
use IZI\Serializer\AnnotatedAssociationRulesSerializer;
use IZI\Serializer\QueryByARSerializer;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

$request = Request::createFromGlobals();
$idDm = $request->query->get('id_dm');
$idKb = (int)$request->query->get('id_kb');
$data = $request->request->has('data') ? $request->request->get('data') : $request->query->get('data');
$lang = $request->query->get('lang');
$sleep = (int) $request->query->get('sleep') ?: 0;
$action = $request->query->get('action');
$encoder = new URLEncoder();

if ($id === 'TEST') {
    sleep($sleep); // simulates time required for document saving
    $taskPath = 'data/4ft_sample_task.pmml';
    $resultPath = 'data/4ft_sample_result.pmml';
    $DP = new DataParser(DDPath, unserialize(FLPath), FGCPath, APP_PATH.'/web/'.$resultPath, null, $lang);
    $DP->loadData();
    $DP->parseData();
    $responseContent = $DP->getER();
    $responseContent['task'] = $taskPath;
    $responseContent['result'] = $resultPath;
    $responseContent['status'] = 'ok';
} else { // KBI
    if ($action === 'saveInteresting' || $action === 'saveNotInteresting') {
        $content = '<?xml version="1.0" encoding="UTF-8"?>
<ar:ARBuilder xmlns:ar="http://keg.vse.cz/ns/arbuilder0_2" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xmlns:dd="http://keg.vse.cz/ns/datadescription0_2" xmlns:guha="http://keg.vse.cz/ns/GUHA0.1rev1"
              xsi:schemaLocation="http://keg.vse.cz/ns/arbuilder0_2 http://sewebar.vse.cz/schemas/ARBuilder0_2.xsd">
    <DataDescription><!-- LMDataSource.Matrix.ARD.PMML.Template, version of 2012-05-15 -->
        <Dictionary completeness="All" sourceFormat="PMML" sourceDictType="TransformationDictionary" id="1"
                    default="true" sourceName="Loans">
            <Identifier name="metabase">LMM-cjIV9HHXaE6-TjYt1k6Ybg</Identifier>
            <Field dataType="string">
                <Name>Age</Name>
                <Category>&lt;21;31)</Category>
                <Category>&lt;31;41)</Category>
                <Category>&lt;41;51)</Category>
                <Category>&lt;51;61)</Category>
                <Category>&lt;61;71)</Category>
            </Field>
            <Field dataType="string">
                <Name>Amount</Name>
                <Category>&lt; 20</Category>
                <Category>&lt;20;50)</Category>
                <Category>&lt;50;100)</Category>
                <Category>&lt;100;250)</Category>
                <Category>&lt;250;500)</Category>
                <Category>&gt;= 500</Category>
            </Field>
            <Field dataType="string">
                <Name>District</Name>
                <Category>Benesov</Category>
                <Category>Beroun</Category>
                <Category>Blansko</Category>
                <Category>Breclav</Category>
                <Category>Brno</Category>
                <Category>Brno - venkov</Category>
                <Category>Bruntal</Category>
                <Category>Ceska Lipa</Category>
                <Category>Ceske Budejovice</Category>
                <Category>Cesky Krumlov</Category>
                <Category>Decin</Category>
                <Category>Domazlice</Category>
                <Category>Frydek - Mistek</Category>
                <Category>Havlickuv Brod</Category>
                <Category>Hodonin</Category>
                <Category>Hradec Kralove</Category>
                <Category>Cheb</Category>
                <Category>Chomutov</Category>
                <Category>Chrudim</Category>
                <Category>Jablonec n. Nisou</Category>
                <Category>Jesenik</Category>
                <Category>Jicin</Category>
                <Category>Jihlava</Category>
                <Category>Jindrichuv Hradec</Category>
                <Category>Karlovy Vary</Category>
                <Category>Karvina</Category>
                <Category>Kladno</Category>
                <Category>Klatovy</Category>
                <Category>Kolin</Category>
                <Category>Kromeriz</Category>
                <Category>Kutna Hora</Category>
                <Category>Liberec</Category>
                <Category>Litomerice</Category>
                <Category>Louny</Category>
                <Category>Melnik</Category>
                <Category>Mlada Boleslav</Category>
                <Category>Most</Category>
                <Category>Nachod</Category>
                <Category>Novy Jicin</Category>
                <Category>Nymburk</Category>
                <Category>Olomouc</Category>
                <Category>Opava</Category>
                <Category>Ostrava - mesto</Category>
                <Category>Pardubice</Category>
                <Category>Pelhrimov</Category>
                <Category>Pisek</Category>
                <Category>Plzen</Category>
                <Category>Plzen - jih</Category>
                <Category>Plzen - sever</Category>
                <Category>Praha</Category>
                <Category>Praha - vychod</Category>
                <Category>Praha - zapad</Category>
                <Category>Prachatice</Category>
                <Category>Prerov</Category>
                <Category>Pribram</Category>
                <Category>Prostejov</Category>
                <Category>Rakovnik</Category>
                <Category>Rokycany</Category>
                <Category>Rychnov nad Kneznou</Category>
                <Category>Semily</Category>
                <Category>Sokolov</Category>
                <Category>Strakonice</Category>
                <Category>Sumperk</Category>
                <Category>Svitavy</Category>
                <Category>Tabor</Category>
                <Category>Tachov</Category>
                <Category>Teplice</Category>
                <Category>Trebic</Category>
                <Category>Trutnov</Category>
                <Category>Uherske Hradiste</Category>
                <Category>Usti nad Labem</Category>
                <Category>Usti nad Orlici</Category>
                <Category>Vsetin</Category>
                <Category>Vyskov</Category>
                <Category>Zdar nad Sazavou</Category>
                <Category>Zlin</Category>
                <Category>Znojmo</Category>
            </Field>
            <Field dataType="string">
                <Name>Duration</Name>
                <Category>1 year</Category>
                <Category>2 years</Category>
                <Category>3 years</Category>
                <Category>4 years</Category>
                <Category>5 years</Category>
            </Field>
            <Field dataType="string">
                <Name>Repayment</Name>
                <Category>(0;1&gt;</Category>
                <Category>(1;2&gt;</Category>
                <Category>(2;3&gt;</Category>
                <Category>(3;4&gt;</Category>
                <Category>(4;5&gt;</Category>
                <Category>(5;6&gt;</Category>
                <Category>(6;7&gt;</Category>
                <Category>(7;8&gt;</Category>
                <Category>(8;9&gt;</Category>
                <Category>(9;10&gt;</Category>
            </Field>
            <Field dataType="string">
                <Name>Salary</Name>
                <Category>low</Category>
                <Category>avg</Category>
                <Category>high</Category>
            </Field>
            <Field dataType="string">
                <Name>Sex</Name>
                <Category>F</Category>
                <Category>M</Category>
            </Field>
            <Field dataType="string">
                <Name>Quality</Name>
                <Category>good</Category>
                <Category>bad</Category>
            </Field>
        </Dictionary>
    </DataDescription>
    <AnnotatedAssociationRules>
        <BBA id="1">
            <Text>Age</Text>
            <FieldRef>Age</FieldRef>
            <CatRef>&lt;21;31)</CatRef>
            <CatRef>&lt;31;41)</CatRef>
            <CatRef>&lt;41;51)</CatRef>
        </BBA>
        <BBA id="3">
            <Text>District</Text>
            <FieldRef>District</FieldRef>
            <CatRef>Praha</CatRef>
        </BBA>
        <BBA id="5">
            <Text>Salary</Text>
            <FieldRef>Salary</FieldRef>
            <CatRef>high</CatRef>
        </BBA>
        <DBA literal="true" connective="Conjunction" id="2">
            <BARef>1</BARef>
        </DBA>
        <DBA literal="true" connective="Conjunction" id="4">
            <BARef>3</BARef>
        </DBA>
        <DBA literal="true" connective="Conjunction" id="6">
            <BARef>5</BARef>
        </DBA>
        <DBA connective="Conjunction" id="7">
            <BARef>2</BARef>
            <BARef>4</BARef>
        </DBA>
        <DBA connective="Conjunction" id="8">
            <BARef>7</BARef>
        </DBA>
        <DBA connective="Conjunction" id="9">
            <BARef>6</BARef>
        </DBA>
        <AssociationRule antecedent="8" consequent="9">
            <IMValue name="SUPP">0.0859084291</IMValue>
            <Annotation>
                <Interestingness>interesting</Interestingness>
            </Annotation>
        </AssociationRule>
    </AnnotatedAssociationRules>
</ar:ARBuilder>
';
        if ($action === 'saveInteresting') {
            $serializer = new AnnotatedAssociationRulesSerializer($path);
//            $requestData = array('source' => $idKb, 'content' => $serializer->serialize($data, 'interesting'));
            $requestData = array('source' => $idKb, 'content' => $content);
        } else if ($action === 'saveNotInteresting') {
            $serializer = new AnnotatedAssociationRulesSerializer($path);
            $requestData = array('source' => $idKb, 'content' => $serializer->serialize($data, 'not interesting'));
        }

        // run task
        $encoder = new URLEncoder();
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'http://sewebar.lmcloud.vse.cz/index.php?option=com_kbi&task=storeDocument&format=raw');
        curl_setopt($ch, CURLOPT_POSTFIELDS, $encoder->encode($requestData));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        var_dump($response, $info); die;

        // TODO refactor response, handle failure

        // save XML
        $AARPath = './temp/KB_'.date('md_His').'.pmml';
        $AAR = new \DOMDocument('1.0', 'UTF-8');
        @$AAR->loadXML($requestData['content'], LIBXML_NOBLANKS); // throws notice due to the PI declaration
        $AAR->save($AARPath);
    } else {
        // confirmation
        $serializer = new QueryByARSerializer($path);
        $requestData = array('source' => $id, 'query' => KB_CONF_ID, 'parameters' => $serializer->serializeRules($data));

        // save XML
        $AARPath = './temp/KB_conf_'.date('md_His').'.pmml';
        $AAR = new \DOMDocument('1.0', 'UTF-8');
        @$AAR->loadXML($requestData['parameters'], LIBXML_NOBLANKS); // throws notice due to the PI declaration
        $AAR->save($AARPath);

        // run task
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://sewebar.lmcloud.vse.cz/index.php?option=com_kbi&task=query&format=raw");
        curl_setopt($ch, CURLOPT_POSTFIELDS, $encoder->encode($requestData));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        if ($response === '' || $info['http_code'] !== 200) { // XQuery is down
            echo json_encode(false);
            die;
        }

        $KBParser = new KnowledgeBaseParser($response);
        $confirmation = $KBParser->parse();

        if ($confirmation['hits'] > 0) {
            $arr = array(
                'confirmation' => $confirmation,
                'exception' => array('hits' => 0),
            );

            echo json_encode($arr);
            die;
        }

        // exception
        $serializer = new SerializeRulesQueryByAR(DDPath);
        $requestData = array('source' => $id, 'query' => KB_EXC_ID, 'parameters' => $serializer->serializeRules($data));

        // save XML
        $AARPath = './temp/KB_exc_'.date('md_His').'.pmml';
        $AAR = new \DOMDocument('1.0', 'UTF-8');
        @$AAR->loadXML($requestData['parameters'], LIBXML_NOBLANKS); // throws notice due to the PI declaration
        $AAR->save($AARPath);

        // run task
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, "http://sewebar-dev.vse.cz/index.php?option=com_kbi&task=query&format=raw");
        curl_setopt($ch, CURLOPT_POSTFIELDS, encodeData($requestData));
        curl_setopt($ch, CURLOPT_VERBOSE, false);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);

        $response = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        $KBParser = new KnowledgeBaseParser($response);
        $exception = $KBParser->parse();

        $arr = array(
            'confirmation' => $confirmation,
            'exception' => $exception
        );

        echo json_encode($arr);
    }
}




// TODO symfony http response

// TODO write tests for annotated ar serializer





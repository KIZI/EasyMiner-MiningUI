<?php

require_once "Bootstrap.php";
require_once "PHPUnit/Framework.php";

class DBATest extends PHPUnit_Framework_TestCase {

    private $connectiveConj;
    private $connectiveDisj;
    private $connectiveNeg;

    protected function setUp() {
        $this->connectiveConj = new Connective('Conjunction');
        $this->connectiveDisj = new Connective('Disjunction');
        $this->connectiveNeg = new Connective('Negation');
    }

    /**
     * @expectedException InvalidDBAException
     */
    public function testAddRefException() {
        $BBA = new DBA('ant_001', $this->connectiveConj, array(), 1);
        $ref = new stdClass();
        $BBA->addRef($ref);
    }

    public function testToArray1Ref() {
        $DBA = new DBA('ant_001', $this->connectiveConj, array(), 1);
        $BBAMock = $this->getMock("BBA", array('toArray'), array('ant_001', 'Sex', array('F')));
        $BBAMock->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(
        array('name' => 'Sex',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => 'F'))))));
        $DBA->addRef($BBAMock);

        $array = array(
        array('name' => 'Sex',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => 'F'))));
        $this->assertEquals($array, $DBA->toArray());
    }

    public function testToArray1Ref2() {
        $DBA = new DBA('ant_001', $this->connectiveDisj, array(), 1);
        $BBAMock = $this->getMock("BBA", array('toArray'), array('ant_001', 'Sex', array('F')));
        $BBAMock->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(
        array('name' => 'Sex',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => 'F'))))));
        $DBA->addRef($BBAMock);

        $array = array(
        array('name' => 'Sex',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => 'F'))));
        $this->assertEquals($array, $DBA->toArray());
    }

    public function testToArray1Ref3() {
        $DBA = new DBA('ant_001', $this->connectiveNeg, array(), 1);
        $BBAMock = $this->getMock("BBA", array('toArray'), array('ant_001', 'Sex', array('F')));
        $BBAMock->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(
        array('name' => 'Sex',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => 'F'))))));
        $DBA->addRef($BBAMock);

        $array = array(
        array('name' => 'NEG',
               	   'type' => 'neg',
               	   'category' => '',
               	   'fields' => array()),
        array('name' => 'Sex',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => 'F'))));
        $this->assertEquals($array, $DBA->toArray());
    }

    public function testToArray2Refs1Level1() {
        $DBA = new DBA('ant_001', $this->connectiveConj, array(), 1);
        $BBAMock = $this->getMock("BBA", array('toArray'), array('ant_001', 'Sex', array('F')));
        $BBAMock->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(
        array('name' => 'Sex',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => 'F'))))));
        $DBA->addRef($BBAMock);

        $BBAMock2 = $this->getMock("BBA", array('toArray'), array('ant_002', 'District', array('Praha')));
        $BBAMock2->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(array('name' => 'District',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => 'Praha'))))));
        $DBA->addRef($BBAMock2);

        $array = array(
        array('name' => 'Sex',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => 'F'))),          
        array('name' => 'AND',
                 'type' => 'and',
                 'category' => '',
                 'fields' => array()),
        array('name' => 'District',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => 'Praha'))));
        $this->assertEquals($array, $DBA->toArray());
    }

    public function testToArray2Refs1Level2() {
        $DBA = new DBA('ant_001', $this->connectiveConj, array(), 2);
        $BBAMock = $this->getMock("BBA", array('toArray'), array('ant_001', 'Sex', array('F')));
        $BBAMock->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(
        array('name' => 'Sex',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => 'F'))))));
        $DBA->addRef($BBAMock);

        $BBAMock2 = $this->getMock("BBA", array('toArray'), array('ant_002', 'District', array('Praha')));
        $BBAMock2->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(array('name' => 'District',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => 'Praha'))))));
        $DBA->addRef($BBAMock2);

        $array = array(
        array('name' => '(',
                 'type' => 'lbrac',
                 'category' => '',
                 'fields' => array()),
        array('name' => 'Sex',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => 'F'))),          
        array('name' => 'AND',
                 'type' => 'and',
                 'category' => '',
                 'fields' => array()),
        array('name' => 'District',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => 'Praha'))),
        array('name' => ')',
                 'type' => 'rbrac',
                 'category' => '',
                 'fields' => array()));
        $this->assertEquals($array, $DBA->toArray());
    }

    public function testToArray2Refs2Level1() {
        $DBA = new DBA('ant_001', $this->connectiveDisj, array(), 1);
        $BBAMock = $this->getMock("BBA", array('toArray'), array('ant_001', 'Sex', array('F')));
        $BBAMock->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(
        array('name' => 'Sex',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => 'F'))))));
        $DBA->addRef($BBAMock);

        $BBAMock2 = $this->getMock("BBA", array('toArray'), array('ant_002', 'District', array('Praha')));
        $BBAMock2->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(array('name' => 'District',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => 'Praha'))))));
        $DBA->addRef($BBAMock2);

        $array = array(
        array('name' => 'Sex',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => 'F'))),          
        array('name' => 'OR',
                 'type' => 'or',
                 'category' => '',
                 'fields' => array()),
        array('name' => 'District',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => 'Praha'))));
        $this->assertEquals($array, $DBA->toArray());
    }

    public function testToArray2Refs2Level2() {
        $DBA = new DBA('ant_001', $this->connectiveDisj, array(), 2);
        $BBAMock = $this->getMock("BBA", array('toArray'), array('ant_001', 'Sex', array('F')));
        $BBAMock->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(
        array('name' => 'Sex',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => 'F'))))));
        $DBA->addRef($BBAMock);

        $BBAMock2 = $this->getMock("BBA", array('toArray'), array('ant_002', 'District', array('Praha')));
        $BBAMock2->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(array('name' => 'District',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => 'Praha'))))));
        $DBA->addRef($BBAMock2);

        $array = array(
        array('name' => '(',
                 'type' => 'lbrac',
                 'category' => '',
                 'fields' => array()),
        array('name' => 'Sex',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => 'F'))),          
        array('name' => 'OR',
                 'type' => 'or',
                 'category' => '',
                 'fields' => array()),
        array('name' => 'District',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => 'Praha'))),
        array('name' => ')',
                 'type' => 'rbrac',
                 'category' => '',
                 'fields' => array()));
        $this->assertEquals($array, $DBA->toArray());
    }

    public function testToArray3RefsLevel1() {
        $DBA = new DBA('ant_001', $this->connectiveConj, array(), 1);
        $BBAMock = $this->getMock("BBA", array('toArray'), array('ant_001', 'Sex', array('F')));
        $BBAMock->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(
        array('name' => 'Sex',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => 'F'))))));
        $DBA->addRef($BBAMock);

        $BBAMock2 = $this->getMock("BBA", array('toArray'), array('ant_002', 'District', array('Praha')));
        $BBAMock2->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(array('name' => 'District',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => 'Praha'))))));
        $DBA->addRef($BBAMock2);

        $BBAMock3 = $this->getMock("BBA", array('toArray'), array('ant_003', 'Age', array('31')));
        $BBAMock3->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(array('name' => 'Age',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => '31'))))));
        $DBA->addRef($BBAMock3);

        $array = array(
        array('name' => 'Sex',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => 'F'))),          
        array('name' => 'AND',
                 'type' => 'and',
                 'category' => '',
                 'fields' => array()),
        array('name' => 'District',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => 'Praha'))),
        array('name' => 'AND',
                 'type' => 'and',
                 'category' => '',
                 'fields' => array()),
        array('name' => 'Age',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => '31'))));
        $this->assertEquals($array, $DBA->toArray());
    }

    public function testToArray3RefsLevel2() {
        $DBA = new DBA('ant_001', $this->connectiveConj, array(), 2);
        $BBAMock = $this->getMock("BBA", array('toArray'), array('ant_001', 'Sex', array('F')));
        $BBAMock->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(array('name' => 'Sex',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => 'F'))))));
        $DBA->addRef($BBAMock);

        $BBAMock2 = $this->getMock("BBA", array('toArray'), array('ant_002', 'District', array('Praha')));
        $BBAMock2->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(array('name' => 'District',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => 'Praha'))))));
        $DBA->addRef($BBAMock2);

        $BBAMock3 = $this->getMock("BBA", array('toArray'), array('ant_003', 'Age', array('31')));
        $BBAMock3->expects($this->once())
        ->method("toArray")
        ->will($this->returnValue(array(array('name' => 'Age',
                                   'type' => 'attr',
                                   'category' => 'One category',
                                   'fields' => array(
        array('name' => 'category',
                                   			   	 'value' => '31'))))));
        $DBA->addRef($BBAMock3);

        $array = array(
        array('name' => '(',
                 'type' => 'lbrac',
                 'category' => '',
                 'fields' => array()),
        array('name' => 'Sex',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => 'F'))),          
        array('name' => 'AND',
                 'type' => 'and',
                 'category' => '',
                 'fields' => array()),
        array('name' => 'District',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => 'Praha'))),
        array('name' => 'AND',
                 'type' => 'and',
                 'category' => '',
                 'fields' => array()),
        array('name' => 'Age',
                 'type' => 'attr',
                 'category' => 'One category',
                 'fields' => array(
        array('name' => 'category',
                 			   	 'value' => '31'))),
        array('name' => ')',
                 'type' => 'rbrac',
                 'category' => '',
                 'fields' => array()));
        $this->assertEquals($array, $DBA->toArray());
    }
}

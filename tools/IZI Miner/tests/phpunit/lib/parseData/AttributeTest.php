<?php

require_once 'Bootstrap.php';

class AttributeTest extends PHPUnit_Framework_TestCase
{

    public function testCategoriesToArray()
    {
        $array = array(
            'District' => array(
                'choices' => array(
                    'Praha', 'Brno')));
        $attr = new Attribute();
        $attr->setName('District');
        $attr->addCategory('Praha');
        $attr->addCategory('Brno');

        $this->assertEquals($array, $attr->toArray());
    }

    public function testIntervalsToArray()
    {
        $array = array(
            'Age' => array(
                'choices' => array(
                    '(0;14)', '(15;19>', '<20;30)', '<30;45>')));
        $attr = new Attribute();
        $attr->setName('Age');
        $attr->addInterval('(0;14)');
        $attr->addInterval('(15;19>');
        $attr->addInterval('<20;30)');
        $attr->addInterval('<30;45>');

        $this->assertEquals($array, $attr->toArray());
    }

    public function testGroupsToArray()
    {
        $array = array('BMI' => array(
            'groups' => array(
                'group1', 'group2')));
        $attr = new Attribute();
        $attr->setName('BMI');
        $attr->addGroup('group1');
        $attr->addGroup('group2');

        $this->assertEquals($array, $attr->toArray());
    }

}

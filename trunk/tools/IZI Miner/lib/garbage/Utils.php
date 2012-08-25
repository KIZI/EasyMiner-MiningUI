<?php

/**
 * Description of Utils
 *
 * @author balda
 * @author Bc. Radek Skrabal <radek@skrabal.me>
 */
class Utils
{
    /**
     * It gets attribute from node based on the name of attribute.
     *
     * @param <DomNode> $node Node from which it should get the attribute.
     * @param <String>  $name name of attribute
     * @return <String> Content of the attribute
     */
    public static function getAttribute($node, $name)
    {
        if($node == null){
            return "";
        }

        $nodeattributes = $node->attributes;
        foreach ($nodeattributes as $attribute) {
            if ($attribute->name == $name) {
                return $attribute->value;
            }
        }
        return "";
    }

    public static function getBoolean($name, $type)
    {
        $element = array();
        $element['name'] = $name;
        $element['type'] = $type;
        $element['category'] = "";
        $element['fields'] = array();
        return $element;
    }

    public static function getIm($node, $name)
    {
      $im = array('name' => $node->getAttribute($name), 'value' => $node->nodeValue);

      return $im;
    }

    /**
     * TODO function spec
     *
     * TODO params spec
     */
    public static function refactorXml($xml, $inputSchema, $outputSchema)
    {
      if ($inputSchema == 'http://keg.vse.cz/ns/arbuilder0_2' && $outputSchema == 'http://keg.vse.cz/ns/arbuilder0_1') {
        $xPath = new DOMXPath($xml);

        // get Dictionary
        $dictionary = $xPath->query("//Dictionary")->item(0);

        // refactor Dictionary/@sourceDictType
        $sourceSubType = $dictionary->getAttribute('sourceDictType');
        $dictionary->removeAttribute('sourceDictType');
        $dictionary->setAttribute('sourceSubType', $sourceSubType);

        // refactor Dictionary/@sourceFormat
        $sourceType = $dictionary->getAttribute('sourceFormat');
        $dictionary->removeAttribute('sourceFormat');
        $dictionary->setAttribute('sourceType', $sourceType);

        // refactor Dictionary/@completeness
        $dictionary->removeAttribute('completeness');

        // refactor Dictionary/@id
        $dictionary->removeAttribute('id');

        // refactor Dictionary/Identifier
        $identifier = $xPath->query("Identifier", $dictionary)->item(0);
        $metabase = $xPath->query("Identifier/Value", $dictionary)->item(0)->nodeValue;
        $dictionary->removeChild($identifier);
        $dictionary->setAttribute('metabase', $metabase);

        // refactor Dictionary/Field
        $fields = $xPath->query("//Field", $dictionary);
        foreach ($fields as $f) {
          $name = '';
          foreach ($f->childNodes as $n) {
            if ($n->nodeName == 'Name') {
              $name = $n->nodeValue;
              $f->removeChild($n);
              break;
            }
          }

          $f->setAttribute('name', $name);
        }
      }

      return $xml;
    }

}


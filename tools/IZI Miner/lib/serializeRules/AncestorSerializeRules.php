<?php
/**
 * This class is only ancestor of specific implementation of serializing rules classes
 * Every class which wants to be treated as set Data must implement this class.
 *
 * @author Jakub Balhar
 * @version 1.0
 */
abstract class AncestorSerializeRules {
  /**
   * It creates instance of descendant.
   */
  public function  __construct(){

  }

  /**
   * It is only necessary method. It gets json data from ARBuilder as parameter.
   * Then it solves data and returns serialized XML.
   *
   * @param <type> $json
   */
  public abstract function serializeRules($json);
}
?>

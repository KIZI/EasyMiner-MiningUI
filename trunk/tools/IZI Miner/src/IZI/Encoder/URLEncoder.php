<?php

namespace IZI\Encoder;

class URLEncoder
{

    public function encode($array) {
        $string = '';
        foreach ($array as $key => $value) {
            $string .= "{$key}=".urlencode($value).'&';
        }

        return $string;
    }

}

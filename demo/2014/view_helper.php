<?php

function partial($name){
    include 'view/partial/' . strtolower($name) . '.php';
}

?>
<?php

include("sql_login.php");

$connection = mysqli_connect($dbServer, $dbUsername, $dbPassword, $dbName);
mysqli_set_charset($connection, "utf8mb4");


if ($connection == false){
    echo "no connection";
}

$user = mysqli_real_escape_string($connection, $_REQUEST['user']);
$token = mysqli_real_escape_string($connection, $_REQUEST['token']);
$score= mysqli_real_escape_string($connection, $_REQUEST['score']);

$result = mysqli_query($connection, "SELECT * FROM `tt-users` WHERE `user` = '$user'");


if(mysqli_num_rows($result) < 1){       //Če ne obstaja
    die("wrong");
}else{
    $rows = array();
    while($row = mysqli_fetch_assoc($result)){
        $rows[] = $row;
    }

    if($token==$rows[0]['token']){
        $best = $rows[0]['best'];
        if($score>$best){
            $best=$score;
        }
        $result = mysqli_query($connection, "UPDATE `tt-users` SET `best`= $best WHERE `user` = '$user'");
        echo ' { "best" : ' . htmlentities($best) .' } ';
    }else{
        die("wrong");
    }
    
}

mysqli_close($connection);
?>
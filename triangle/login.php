<?php

include("sql_login.php");

$connection = mysqli_connect($dbServer, $dbUsername, $dbPassword, $dbName);
mysqli_set_charset($connection, "utf8mb4");


if ($connection == false){
    echo "no connection";
}

$user = mysqli_real_escape_string($connection, $_REQUEST['user']);
$pass = mysqli_real_escape_string($connection, $_REQUEST['pass']);
$neww = mysqli_real_escape_string($connection, $_REQUEST['new']);

$best = -1;
$token = 0;


$result = mysqli_query($connection, "SELECT * FROM `tt-users` WHERE `user` = '$user'");
if(mysqli_num_rows($result) < 1){       //Če ne obstaja
    if($neww == "false"){
        die("new");
    }else{
        $hash= password_hash($pass, PASSWORD_DEFAULT);
        $result = mysqli_query($connection, "INSERT INTO `tt-users` (`user`, `pass`, `hash`, `best`, `token`) VALUES ('$user', '$pass', '$hash', -1, '0')");
        getInfo($connection, $user, $best);
    }
}else{
    $rows = array();
    while($row = mysqli_fetch_assoc($result)){
        $rows[] = $row;
    }


    if(password_verify($pass, $rows[0]['hash'])){
        getInfo($connection, $user, $best);
    }else{
        die("wrong");
    }
}




mysqli_close($connection);




function getInfo($connection, $user, $best){
    $token = hash("sha256", random_bytes(128));
    $result = mysqli_query($connection, "UPDATE `tt-users` SET `token`= '$token' WHERE `user` = '$user'");
    
    $result = mysqli_query($connection, "SELECT * FROM `tt-users` WHERE `user` = '$user'");
    $rows = array();
    while($row = mysqli_fetch_assoc($result)){
        $rows[] = $row;
    }
    $best = $rows[0]['best'];
    $user = $rows[0]['user'];
    echo ' { "d_user" : ' . json_encode($user, JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_QUOT | JSON_HEX_AMP | JSON_UNESCAPED_UNICODE) . 
        //'", "user" : ' . json_encode(substr(json_encode($user, JSON_UNESCAPED_UNICODE), 1, -1), JSON_UNESCAPED_UNICODE) . 
        ', "user" : ' . json_encode($user, JSON_UNESCAPED_UNICODE) . 
        ', "token" : "' . htmlentities($token) . 
        '", "best" : ' . $best . ' } ';
}

?>
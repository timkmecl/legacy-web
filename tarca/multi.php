<?php
$roomName;
$roomID;
$roomURL;

$gameGoal;
$gameMode;
$speedFactor;
$minSizeFactor;
$maxSizeFactor;
$tries;

$username;
$userCount;

$triesLeft = -1;

$action = "";
$id = "";
$username = "";

$error = 0;

/*
$dbUsername = "123";
$dbPassword ="456";
$dbName = "tarca";
$dbServer = "localhost";
*/

$dbUsername = "2705999_tarca";
$dbPassword ="192837465aA!";
$dbName = "2705999_tarca";
$dbServer = "fdb21.awardspace.net";



$connection = mysqli_connect($dbServer, $dbUsername, $dbPassword, $dbName);
mysqli_set_charset($connection, "utf8mb4");


if ($connection == false){
    echo "no connection";
}







$action = $_REQUEST["action"];

switch($action){
    case "new":
        $roomName = mysqli_real_escape_string($connection, $_REQUEST['name']);
        $gameGoal = mysqli_real_escape_string($connection, $_REQUEST['gameGoal']);
        $gameMode = mysqli_real_escape_string($connection, $_REQUEST['gameMode']);
        $speedFactor = mysqli_real_escape_string($connection, $_REQUEST['speed']);
        $minSizeFactor = mysqli_real_escape_string($connection,  $_REQUEST['minSize']);
        $maxSizeFactor = mysqli_real_escape_string($connection, $_REQUEST['maxSize']);
        $tries = mysqli_real_escape_string($connection, $_REQUEST['tries']);

        do{
            $id = rand(0, 100000000);
            //$id = 4;
            $result = mysqli_query($connection, "INSERT INTO `games` (`id`, `roomName`, `gameMode`, `gameGoal`, `speedFactor`, `minSizeFactor`, `maxSizeFactor`, `tries`) VALUES ($id, '$roomName', '$gameMode', $gameGoal, $speedFactor, $minSizeFactor, $maxSizeFactor, $tries)");
        }while(($result == false));
        print_r(mysqli_error($connection));
        mysqli_close($connection);
        echo $id;

        break;






    case "load":
        $id =  mysqli_real_escape_string($connection, $_REQUEST["id"]);

        $result = mysqli_query($connection, "SELECT * FROM `games` WHERE `id` = $id");
        $rows = array();
        if($result == false){
            echo "no result";
        }else{
            
            while($row = mysqli_fetch_assoc($result)){
                $rows[] = $row;
            }
        }

        $roomURL = "http://tarca.tk/?id=" . $rows[0]['id'];
        echo ' { "error" : ' . $error . 
            ', "roomURL" : "' . htmlentities($roomURL) . 
            '", "roomID" : ' . $rows[0]['id'] . 
            ', "roomName" : "' . htmlentities($rows[0]['roomName']) . 
            '", "gameMode" : "' . htmlentities($rows[0]['gameMode']) . 
            '", "gameGoal" : ' . $rows[0]['gameGoal'] . 
            ', "speed" : ' . $rows[0]['speedFactor'] . 
            ', "minSize" : ' . $rows[0]['minSizeFactor'] . 
            ', "maxSize" : ' . $rows[0]['maxSizeFactor'] . 
            ', "tries" : ' . $rows[0]['tries'] . ' } ';
        break;







    case "loadLeaderAndSave":
        $username = mysqli_real_escape_string($connection, $_REQUEST['user']);
        $id =  mysqli_real_escape_string($connection, $_REQUEST["id"]);
        $score = mysqli_real_escape_string($connection, $_REQUEST["score"]);

        $result = mysqli_query($connection, "SELECT `played` FROM `plays` WHERE `id` = $id AND `user` = '$username'");

        if($result == false){
            $result = mysqli_query($connection, "INSERT INTO `plays` (`id`, `user`, `played`, `topScore`) VALUES ($id, '$username', 1, $score)");
            if($result == false){
                echo mysqli_error($connection);
                die(1);
            }
        }else{
            if($result->num_rows == 0){
                $result = mysqli_query($connection, "INSERT INTO `plays` (`id`, `user`, `played`, `topScore`) VALUES ($id, '$username', 1, $score)");
                //echo "INSERT INTO `plays` (`id`, `user`, `played`) VALUES ($id, '$username', 1)";
                echo mysqli_error($connection);
                if($result == false){
                    die(1);
                }

                $result = mysqli_query($connection, "SELECT `tries` FROM `games` WHERE `id` = $id");
                if($result == false){
                    die(1);
                }
                
                $rows = array();
                while($row = mysqli_fetch_assoc($result)){
                    $rows[] = $row;
                }

                $triesLeft = $rows[0]['tries'] - 1;
            }else{
                $numPlayed = 0;
                $rows = array();
                while($row = mysqli_fetch_assoc($result)){
                    $rows[] = $row;
                }
                $numPlayed = $rows[0]['played'] + 1;


                $result = mysqli_query($connection, "SELECT `tries` FROM `games` WHERE `id` = $id");
                if($result == false){
                    die(1);
                }
                
                $rows = array();
                while($row = mysqli_fetch_assoc($result)){
                    $rows[] = $row;
                }
                $maxPlayed = $rows[0]['tries'];

                $triesLeft = $maxPlayed - $numPlayed;

                if(($maxPlayed < $numPlayed) && ($maxPlayed != 0)){
                    $error = 2;
                }else{
                    $result = mysqli_query($connection, "UPDATE `plays` SET `played`= $numPlayed WHERE `id` = $id AND `user` = '$username'");
                }
                
            }
            
            
        }


        $result = mysqli_query($connection, "SELECT `topScore` FROM `plays` WHERE `id` = $id AND `user` = '$username'");
        if($result != false){
                $rows = array();
                while($row = mysqli_fetch_assoc($result)){
                    $rows[] = $row;
                }

                $previousScore = $rows[0]['topScore'];






                $result = mysqli_query($connection, "SELECT `gameMode` FROM `games` WHERE `id` = $id");
                if($result == false){
                    die(1);
                }
                $rows = array();
                while($row = mysqli_fetch_assoc($result)){
                    $rows[] = $row;
                }
                $mode = $rows[0]['gameMode'];





                if((($score > $previousScore) && ($mode=="time")) || (($score < $previousScore) && ($mode=="score"))){
                    $result = mysqli_query($connection, "UPDATE `plays` SET `topScore`= $score WHERE `id` = $id AND `user` = '$username'");
                    if($result==false){
                        echo mysqli_error($connection);
                        die(1);
                    }
                }
        }



    case "loadLeader":
        $username = mysqli_real_escape_string($connection, $_REQUEST['user']);
        $id =  mysqli_real_escape_string($connection, $_REQUEST["id"]);

        $result = mysqli_query($connection, "SELECT `gameMode` FROM `games` WHERE `id` = $id");
        if($result == false){
            die(1);
        }
        $rows = array();
        while($row = mysqli_fetch_assoc($result)){
            $rows[] = $row;
        }
        $mode = $rows[0]['gameMode'];

        if($mode == "time"){
            $mode = "DESC";
        }else{
            $mode = "ASC";
        }


        $leaderboard = "";
        $result = mysqli_query($connection, "SELECT `user`, `topScore` FROM `plays` WHERE `id` = $id ORDER BY `topScore` $mode");
        if($result == false){
            die(1);
        }
        $rows = array();
        while($row = mysqli_fetch_assoc($result)){
            $rows[] = $row;

            $leaderboard .= '["' . htmlentities($row['user']) . '", ' . $row['topScore'] . ', ' . (($row['user']==$username)? "1" : "0") . ' ],';
        }

        echo '{ "error" : ' . $error . ' , "triesLeft" : ' . $triesLeft . ', "leaderboards" : [' . substr($leaderboard, 0, -1) . '] } ';
        break;












    
    case "checkUser":
        $username = mysqli_real_escape_string($connection, $_REQUEST['user']);
        $id =  mysqli_real_escape_string($connection, $_REQUEST["id"]);

        $result = mysqli_query($connection, "SELECT `played` FROM `plays` WHERE `id` = $id AND `user` = '$username'");
        //echo mysqli_error($connection);
        //print_r($result);
        $result2 = mysqli_query($connection, "SELECT `tries` FROM `games` WHERE `id` = $id");

        if($result2 == false or $result2->num_rows==0){
            die(2);
        }
        $rows = array();
        while($row = mysqli_fetch_assoc($result2)){
            $rows[] = $row;
        }

        if($result == false){
            echo 1;
        }else{
            if(($result->num_rows == 0) || ($rows[0]['tries'] == 0)){
                echo 0;
            }else{
                echo 1;
            }
            
        }
        break;
}




?>
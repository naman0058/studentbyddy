<!DOCTYPE html>
<html>
    <head>
        <title>Reg Form</title>
</head>
<body>
    <form method="post">
        Name: <input type="text" name="nm"><br>
        Email: <input type="text" name="em"><br>
        <input type="submit" name="sb">
</form>
<?php
$con=mysqli_connect('localhost','root','','demo');
if(isset($_POST['sb']))
{
    $name=$_POST['nm'];
    $email=$_POST['em'];
    $query="INSERT INTO register(NAME,EMAIL) VALUES ('$name','$email')";
    $run=mysqli_query($con,$query); 
}
?>
</body>
</html>
function talk(){
    var know = {
    "Who are you" : "Hello, UDA CHATBOT here ",
    "How are you" : "Good :)",
        "ok" : "Thank You So Much ",
    "Bye" : "Okay! Will meet soon..",
    "What's your favourite language?" : "I like all languages but PYTHON is my favourite",
    "Give Javascript logic for palindrome":"Following are the steps to get the Palindrome in JavaScript, as follow Get the strings or numbers from the user. Take a temporary variable that holds the numbers. Reverse the given number Compare the original number with the reversed number If the temporary and original number are same, it the number or string is a Palindrome. Else the given string or number is not the Palindrome.",
"Give Javascript logic for prime numbers":"1) It should be a whole number greater than 1. 2) it should have only two factors i.e one and the number itself. If these two conditions are satisfied, then we can say a number is a prime number",
    "Give Javascript logic for Armstrong":"A positive integer is called an Armstrong number (of order n ) if abcd... = an + bn + cn + dn + In the case of an Armstrong number of 3 digits, the sum of cubes of each digit is equal to the number itself. For example, 153 is an Armstrong number because 153 = 1*1*1 + 5*5*5 + 3*3*3.",
};
    var user = document.getElementById('userBox').value;
    document.getElementById('chatLog').innerHTML = user + "<br>";
    if (user in know) {
    document.getElementById('chatLog').innerHTML = know[user] + "<br>";
    }else{
    document.getElementById('chatLog').innerHTML = "Sorry,I didn't understand <br>";
    }
    }

    // Suggestion: 1. Who are you?<br>
    // 2. How are you?<br>
    // 3. What's your favourite language?<br>
    // 4. Give Javascriptcode for palindrome.
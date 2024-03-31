const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const strength=document.querySelector('.strength');
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


//initially
let password = "";
let passwordLength = 10;
let checkCount = 4;

//set slider value = passwordLength
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
}
handleSlider();
//if any changes in slider again set the password = slider input value
inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})


//strangth of the password
function setIndicator(color,quality) {
    indicator.style.backgroundColor = color;
    strength.textContent=quality;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {  
       return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase() {  
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol() {
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}



//When you click copy button it will copy the value of display passowrd  
copyBtn.addEventListener('click', () => {

    if(passwordDisplay.value) //if the value is true then only you can copy
    {  
        navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }else{
        document.querySelector('.display-container').style.border='1px solid red';

        copyMsg.innerText = "Failed";
    }
    //to make copy span visible
    copyMsg.style.display='block';

    // to hide copy span after 2sec 
    setTimeout( () => {
        copyMsg.style.display='none';
    },2000);

});

// to count which are checked
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change',()=>{
        checkCount = 0;
        allCheckBox.forEach( (checkbox) => {
            if(checkbox.checked)
                checkCount++;
        });

        //special condition make eqaul to the password length to checked count
        if(passwordLength < checkCount ) {
            passwordLength = checkCount;
            handleSlider();
        }
    });
});

// password suffling
function shufflePassword(array) {
    //Fisher Yates Method to suffle the array
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

// check the strangth of the password 
function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;

    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setIndicator("#0f0",'Very Good');
    } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
    ) {
    setIndicator("#ff0",'Good');
    } else {
    setIndicator("#f00",'Bad');
    }
};


// when generate password button 
generateBtn.addEventListener('click', () => {


    if(passwordLength>0)document.querySelector('.display-container').style.border='1px solid rgba(255, 255, 255, 0.332)';

    //if none of the checkbox are selected return nothing
    if(checkCount == 0) 
        return;

    //remove old password
    password = "";

    let funcArr = []; // array of functions

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) 
    {
        password += funcArr[i](); // calling functions
    }

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getRndInteger(0 , funcArr.length);
        password += funcArr[randIndex](); // randomly calling functions untill the length is full-filled
    }
    // password is done here 

    //shuffle the password 
    password = shufflePassword(password.split(''));

    //show passoword in ui
    passwordDisplay.value = password;

    //calculate strength
    calcStrength();
    
});
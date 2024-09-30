const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]")
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");

const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");

const allCheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+={[}]|\;:"<,>.?/';

let password= "";
let passwordLength = 10;
let checkCount =0;
handleSlider();
//indicator circle ke liye kuch tho likhna hai
setIndicator("#ccc");

function shufflePassword(Array) {
    //fisher Yates Method
    for(let i = Array.length -1; i>0; i--){
        const j = Math.floor(Math.random() * (i+1));
        const temp = Array[i];
        Array[i] = Array[j];
        Array[j] = temp;
    }
    let str = "";
    Array.forEach((el) => (str+=el));
    return str;
}


//set password length
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText= passwordLength;
    // aur bhe kuch karna chahihiye??
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength- min)*100/(max-min)) + "% 100%" ; 
}


function setIndicator(color){
    indicator.style.backgroundColor = color;
    // shadow daalo
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInteger(min, max){
    return Math.floor(Math.random()* (max-min))+min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const randNum = getRndInteger(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolsCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator("#0f0");
    }
    else if(
        (hasLower|| hasUpper) && 
        (hasNum || hasSym) &&
        passwordLength >=6
    ){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){

    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    // to make copy wala msg span visible
    copyMsg.classList.add("active");

    setTimeout(()=> {
        copyMsg.classList.remove("active");
    }, 2000);
}

function handleCheckboxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox)=> {
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special case
    if(passwordLength< checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckboxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
} );

copyBtn.addEventListener('click', () =>{
    if(passwordDisplay.value){
        copyContent();
    }
} );

generateBtn.addEventListener('click', ()=>{
    //none of the checkbox are selected
    if(checkCount <=0) return ;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    console.log("Starting the Journey");
    //remove old password
    password = "";

    // let's put the stuff mentioned by checkboxes

    /*
    if(uppercaseCheck.checked){
        password += generateUpperCase();
    }
    if(lowercaseCheckCheck.checked){
        password += generateLowerCase();
    }

    if(numbersCheckCheck.checked){
        password += generateRandomNumber();
    }

    if(symbolsCheck.checked){
        password += generateSymbol();
    }
        // yeha pr stopper lagana hai
    */

    let funcArray = [];

    if(uppercaseCheck.checked) {
        funcArray.push(generateUpperCase);
    }

    if(lowercaseCheck.checked) {
        funcArray.push(generateLowerCase);
    }

    if(numbersCheck.checked) {
        funcArray.push(generateLowerCase);
    }

    if(symbolsCheck.checked) {
        funcArray.push(generateSymbol);
    }

    //compulsory addition
    for(let i =0; i<funcArray.length; i++){
        password += funcArray[i]();
    }
    console.log("Compulsory addition done");

    // remaining addition
    for(let i =0; i<passwordLength-funcArray.length;i++) {
        let randIndex= getRndInteger(0,funcArray.length);
        password +=funcArray[randIndex] ();
    }
    console.log("Remaining addition done");
    //shuffle the password 
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");

    //show in UI
    passwordDisplay.value = password;
    console.log("UI addition done");

    //calculate strength
    calcStrength();
});


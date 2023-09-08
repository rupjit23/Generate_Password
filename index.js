const inputSlider=document.querySelector("[data-lengthSlider]");
const lengthDisplay=document.querySelector("[data-lengthNumber]");
const passwordDisplay=document.querySelector("[data-password-Display]");
const copyBtn=document.querySelector("[data-copy]");
const copyMsg=document.querySelector("[data-copymsg]");
const uppercaseCheck=document.querySelector("#uppercase");
const lowercaseCheck=document.querySelector("#lowercase");
const numberCheck=document.querySelector("#numbers");
const symbolCheck=document.querySelector("#symbols");
const indicator=document.querySelector("[data-indicator]");
const generateBtn=document.querySelector(".generateButton");
const allCheckBox=document.querySelectorAll("input[type=checkbox]");
const symbol='~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
let password= "";
let passwordLength = 8;
let checkCount= 0;
handleSlider();
setIndicator("#ccc");
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min=inputSlider.min;
    const max=inputSlider.max;
    inputSlider.style.backgroundSize=((passwordLength-min)*100/(max-min)+"100%");
    
}
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
function getrandomIngeter(min,max){
   return Math.floor(Math.random() * (max-min))+min;
}
function geraterandomNumber(){
    return getrandomIngeter(0,9);
}
function generateLowercase(){
    return String.fromCharCode(getrandomIngeter(97,123));
}
function generateUppercase(){
    return String.fromCharCode(getrandomIngeter(65,91));
}
function generateSymbol(){
    const random=getrandomIngeter(0,symbol.length);
    return symbol.charAt(random);
}
function calculatestrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numberCheck.checked) hasNum = true;
    if (symbolCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
    }
    catch(e){
        copyMsg.innerText="failed";
    }
    //to make cpoy value span
    copyMsg.classList.add("active")
    setTimeout( ()=>{
        copyMsg.classList.remove("active");
    },2000)
}
function shufflePassword(array){
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
function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
        checkCount++;
        });
        if(passwordLength < checkCount){
            passwordLength= checkCount;
            handleSlider();
        }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})
inputSlider.addEventListener('input',(e) =>{
    passwordLength =e.target.value;
    handleSlider();
})
copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value)
        copyContent();
})
generateBtn.addEventListener('click',()=>{
    //none of the checkbox are selected
    if(checkCount <=0)
    return;
    if(passwordLength < checkCount)
    {
        passwordLength=checkCount;
        handleSlider();
    }
    console.log("starting this journey");
    //let's start to find a new password
    //remove ond password
    password="";
    //let's put upper/lower/symbol/number check in checkbox
    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUppercase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowercase);

    if(numberCheck.checked)
        funcArr.push(geraterandomNumber);

    if(symbolCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");

    //remaining adddition
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        let randIndex = getrandomIngeter(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength
    calculatestrength();
});
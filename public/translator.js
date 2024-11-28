import { americanOnly } from './american-only.js';
import { britishOnly } from './british-only.js';
import { americanToBritishSpelling } from './american-to-british-spelling.js';
import { americanToBritishTitles } from './american-to-british-titles.js';


var selector=document.querySelector("#locale-select");
var mode=selector.value;
const textBox=document.getElementById('text-input');
  // where getElementById does :) and is recommended for ID
textBox.value=("backhoe band-aid advert start 10:30 mr. mrs accessorize");  
// get buttons and add action listeners
var translateButton=document.querySelector("#translate-btn");
const clearButton=document.querySelector('#clear-btn');
const allInOne=[];
document.addEventListener('DOMContentLoaded', () => {
  console.log("inside script"); 
  textBoxChanged(); 
  condenseLibraries();
});

let condenseLibraries=()=>{
  // this function loads up all libraries into one array to search
  Object.keys(americanOnly).forEach((key)=>{
    allInOne.push([key, americanOnly[key]]); 
  });

  Object.keys(americanToBritishSpelling).forEach((key)=>{
    allInOne.push([key, americanToBritishSpelling[key]]);
  });

  Object.keys(americanToBritishTitles).forEach((key)=>{
    allInOne.push([key, americanToBritishTitles[key]]);
  });

  Object.keys(britishOnly).forEach((key)=>{
    allInOne.push([britishOnly[key], key]); // reverse so entire array is in format US:British
  });
      console.log("Libraries combined to: ",allInOne);
     
}

let translate=()=>{
  //let sentenceArray;
  let didTranslate=false;
  let searchTerm;
  var newString=textBox.value;
  var resultSentence=document.querySelector("#translated-sentence");
  var errorDiv=document.querySelector("#error-msg");
  let findIt=(element)=>{
      return element;
    };
  if(!textBox.value){
    errorDiv.innerHTML="Error: No text to translate.";
    return false;
  }else{
    errorDiv.innerHTML="";
  }

  var sentence=textBox.value.split(" ");
  console.log("pressed translate for: "+sentence);
  console.log(mode);
 
  if(mode=="american-to-british"){
    console.log("converting "+newString+typeof(americanOnly));
    
    //console.log(americanOnly["backhoe"]);
  
    

    // check each word in americanOnly for match in input
    for(var property in americanOnly){
      
      //console.log("property is "+property);
      if(sentence.includes(property)){
        didTranslate=true;
        newString=newString.replace(property, "<span class='highlight'>"+americanOnly[property]+"</span>" );  
        console.log("new string "+newString);
        resultSentence.innerHTML=newString;  
        console.log(property+"result is "+resultSentence.innerHTML);
        //sentence=resultSentence.value;
      }
        
    }
     console.log("85 search sentence spelling " +typeof(resultSentence.innerHTML));

    // check spelling
    var checkTranslated=resultSentence.innerHTML.split(" ");
    console.log("59 checkTranslated is "+typeof(checkTranslated));

    //go through translated sentece to adjust time, titles and spelling.   checkTranslated is object, but one dimentional=>index
    for(var index in checkTranslated){
      searchTerm=checkTranslated[index];  // each word in translated sentence
      console.log(searchTerm+" Spell check word is :"+checkTranslated[index]+americanToBritishSpelling[searchTerm]);

      // replace spelling
      if(americanToBritishSpelling[searchTerm]){
        didTranslate=true;
        console.log("found newWord "+searchTerm);
        newString=newString.replace(searchTerm, "<span class='highlight'>"+americanToBritishSpelling[searchTerm]+"</span>");
        console.log("101 spelling: "+newString);
        resultSentence.innerHTML=newString;
      }
      // replace titles
      if(americanToBritishTitles[searchTerm]){
        didTranslate=true;
        console.log("107 "+americanToBritishTitles[searchTerm]);
        newString=newString.replace(searchTerm, "<span class='highlight'>"+americanToBritishTitles[searchTerm]+"</span>");
      }
      console.log("110 about to test regex");
      // replace time
      let regex=/\d+\:\d+/g; // look for time with digit : digit
      let result=newString.match(regex);//loads array with any matches
      if(result){
        result.forEach((time)=>{
          didTranslate=true;
          console.log("117 "+time);        
          newString=newString.replace(time, "<span class='highlight'>"+time.replace(":",".")+"</span>");
          console.log("119 ",newString);
          resultSentence.innerHTML=newString;
        });  
      }
    
    

    }  // end of sentencecheck
     if(didTranslate==false){ // if nothing translated
      newString="Everything looks good to me!";
      resultSentence.innerHTML=newString;
    }

    console.log("our result is "+resultSentence.innerHTML);
   // resultSentence.value=sentence.join();
    
    //textBoxChanged();
    
    
     // document.querySelector("#translated-sentence").innerHTML=(newText);
    
  }
  if(mode=="british-to-american"){
    console.log("converting "+typeof(newString));
    newString.split(" ").forEach((word)=>{
      //console.log(allInOne);
      console.log(word);
      let replacement='';
      let exists=allInOne.find((el)=>{
        if(el[1]==word){
          replacement=el[0];
          return el[1]==word; // returns this or false if not found
          }
      });

      if(exists){
        didTranslate=true;
        console.log("found "+exists);
        newString=newString.replace(word, ("<span class='highlight'>"+replacement+"</span>"));
      };
    });
   if(didTranslate==false){ // if nothing translated
      newString="Everything looks good to me!";
    }
    document.querySelector("#translated-sentence").innerHTML=newString;
   
  } // end brit to us
}   // end translate()

let clear =()=>{
  console.log("clearing");
  textBox.value="";
  textBoxChanged();
}

 let textBoxChanged=()=>{
   console.log("Changed textBox");
   console.log(textBox.value);
 }

//console.log(textBox.value);
translateButton.onclick=translate;
clearButton.onclick=clear;
selector.onchange=()=>{
  mode=selector.value;
  console.log("mode is "+mode);
  textBoxChanged();
};

/* 
  Export your functions for testing in Node.
  Note: The `try` block is to prevent errors on
  the client side
*/
try {
  module.exports = {

  }
} catch (e) {}

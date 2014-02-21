"use strict"; // Use ECMAScript 5 strict mode in browsers that support it


window.onload = function() {
	// Setup the dnd listeners.
	var dropZone = document.getElementById('drop_zone');
    dropZone.addEventListener('drop', handleFileSelect, false);
    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('dragleave', handleDragLeave, false);
   
   
 	// If the browser supports localStorage and we have some stored data
 	if (window.localStorage){
 		if (localStorage.fileAttributes)
 			document.getElementById("txtfileAttributes").innerHTML = localStorage.fileAttributes;
 			
 		if (localStorage.initialinput)	
 			document.getElementById("initialinput").innerHTML = localStorage.initialinput;
 		
 		if (localStorage.finaloutput){
 			document.getElementById("finaloutput").innerHTML = localStorage.finaloutput;
 			out.className = 'unhidden';

 		}		
 	}
};

//-------------------------------------------------------------------------------------------
// drag and drop functions 
function handleFileSelect(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    
    evt.target.style.background = "#579194";

	var files = evt.dataTransfer.files; // FileList object.

    // files is a FileList of File objects. List some properties.
    var output = [];
    for (var i = 0, f; f = files[i]; i++) {
		output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
					  f.size, ' bytes, last modified: ',
					  f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a', '</li>');
    }
    var fileAttributes = '<ul>' + output.join('') + '</ul>';
    document.getElementById('txtfileAttributes').innerHTML = fileAttributes; 
    
	calculate(evt.dataTransfer.files[0]);	
}
//-------------------------------------------------------------------------------------------
function handleDragOver(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.dataTransfer.dropEffect = 'copy'; // Explicitly show this is a copy.
    evt.target.style.background = "white";
}
//-------------------------------------------------------------------------------------------
function handleDragLeave(evt) {
    evt.stopPropagation();
    evt.preventDefault();
    evt.target.style.background = "#2E3134";
}
//-------------------------------------------------------------------------------------------

//-------------------------------------------------------------------------------------------
// calculate functions
var temp = '<li> <span class = "<%= token.type %>"> <%= match %> </span>\n';



//-------------------------------------------------------------------------------------------
function calculate(file){	
	if (file) {	
		var r = new FileReader();
		
		r.onload = function(e) { // se ejecuta cuando termina de cargar el fichero
			var contents = e.target.result;
			var tokens = lexer(contents);
			var pretty = tokensToString(tokens);
		  
			out.className = 'unhidden';
			initialinput.innerHTML = contents;
			finaloutput.innerHTML = pretty;	
					
			// LocalStorage
			if (window.localStorage){
				//localStorage.fileAttributes = fileAttributes;
				//localStorage.initialinput  = contents;
				//localStorage.finaloutput  = pretty;
				localStorage.setItem('fileAttributes', fileAttributes);
				localStorage.setItem('initialinput', contents);
				localStorage.setItem('finaloutput', pretty);
			}		
		}
		r.readAsText(file);		
				
	} 
	else{ 
		alert("Failed to load file");
	}	
}
//-------------------------------------------------------------------------------------------
function tokensToString(tokens) {
	var output_template = _.template(table_template.innerHTML);
	var matches = [];
   
	for(var i in tokens) {
		matches.push(JSON.stringify(tokens[i], undefined, 2));
	}
	   
	return output_template({tokens: tokens, matches: matches}).substr(1);
   
 /*  var r = '';
   for(var i=0; i < tokens.length; i++) {
     var t = tokens[i]
     var s = JSON.stringify(t, undefined, 2);
     s = _.template(temp, {token: t, match: s});
     r += s;
   }
   return '<ol>\n'+r+'</ol>';*/
}
//-------------------------------------------------------------------------------------------
function lexer(input) {
  var blanks         = /^\s+/;
  var iniheader      = /^\[([^\]\r\n]+)\]/;
  var comments       = /^[;#](.*)/;
  var nameEqualValue = /^([^=;\r\n]+)=([^;\r\n]*)/;
  var any            = /^(.|\n)+/;

  var out = [];
  var m = null;

  while (input != '') {
    if (m = blanks.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type : 'blanks', match: m });
    }
    else if (m = iniheader.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type: 'header', match: m });
    }
    else if (m = comments.exec(input)) {
      input = input.substr(m.index+m[0].length);
      out.push({ type: 'comments', match: m });
    }
    else if (m = nameEqualValue.exec(input)) {
      /* while (match casa con /\\$/) concatena la siguiente línea */
      input = input.substr(m.index+m[0].length);
      out.push({ type: 'nameEqualValue', match: m });
    }
    else if (m = any.exec(input)) {
      out.push({ type: 'error', match: m });
      input = '';
    }
    else {
      alert("Fatal Error!"+substr(input,0,20));
      input = '';
    }
  }
  return out;
}
//-------------------------------------------------------------------------------------------
